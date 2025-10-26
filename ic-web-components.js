// @ts-check
/**
 * IC Label Creator Web Components
 * - <ic-labels paper="Letter|A4" margins="top right bottom left"> ... <ic-chip count="N">NAME</ic-chip> ... </ic-labels>
 * - Pure JS, no build step. Renders into an SVG with id="#page" so the legacy drawChip() continues to work.
 */

(() => {
  /** @typedef {{w:number,h:number,css:string}} PagePreset */
  /** @typedef {{top:number,right:number,bottom:number,left:number}} Margins */

  /** @type {Record<string, PagePreset>} */
  const PagePresets = {
    A4:     { w: 210.0,  h: 297.0, css: '210mm 297mm' },
    Letter: { w: 215.9,  h: 279.4, css: '215.9mm 279.4mm' },
  };

  const STYLE_ID = 'ic-labels-styles';
  const PAGE_SIZE_STYLE_ID = 'ic-page-size-style';

  const BASE_CSS = `
    :root { --ic-paper-bg: repeating-linear-gradient(0deg,#f8f8f8 0px,#f8f8f8 9px,#f0f0f0 9px,#f0f0f0 10px); }
    html { background: var(--ic-paper-bg); background-repeat: repeat; }
    ic-labels { display: block; }
    ic-labels ic-chip { display: none; }
    .ic-paper-wrap { display: grid; place-items: start center; padding: 1.25rem; }
    .ic-paper-shadow { position: relative; filter: drop-shadow(0 6px 14px rgba(0,0,0,.12)) drop-shadow(0 2px 4px rgba(0,0,0,.08)); transform-origin: top center; transform: scale(var(--ic-zoom, 1)); transition: transform .2s ease; }
    .ic-paper { background: white; border: 1px solid #ddd; position: relative; overflow: hidden; margin: 0 auto; }
    .ic-paper::after { content: ""; position: absolute; pointer-events: none; left: var(--margin-left-mm); right: var(--margin-right-mm); top: var(--margin-top-mm); bottom: var(--margin-bottom-mm); border: 1px dashed rgba(0,0,0,.15); }
    .ic-paper svg { display: block; }
    @media print {
      @page { margin: 0; }
      html, body { background: white !important; }
      .ic-paper-wrap { padding: 0 !important; }
      .ic-paper-shadow { filter: none !important; }
      .ic-paper { border: none !important; }
      .ic-paper::after { border: none; }
    }
  `;

  function ensureBaseStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = BASE_CSS;
      document.head.appendChild(s);
    }
  }

  /** @param {number} n */
  function mm(n) { return `${n}mm`; }

  /**
   * Parse margins attribute. Supports 1-4 CSS-like values (mm numbers).
   * @param {string | null} raw
   * @param {Margins} fallback
   * @returns {Margins}
   */
  function parseMargins(raw, fallback) {
    if (!raw) return fallback;
    const parts = raw.trim().split(/\s+/).map(v => Number(v));
    if (parts.some(n => Number.isNaN(n))) return fallback;
    if (parts.length === 1) {
      const [v] = parts; return { top: v, right: v, bottom: v, left: v };
    }
    if (parts.length === 2) {
      const [v, h] = parts; return { top: v, right: h, bottom: v, left: h };
    }
    if (parts.length === 3) {
      const [t, h, b] = parts; return { top: t, right: h, bottom: b, left: h };
    }
    const [t, r, b, l] = parts;
    return { top: t ?? fallback.top, right: r ?? fallback.right, bottom: b ?? fallback.bottom, left: l ?? fallback.left };
  }

  /** Ensure legacy globals are present with defaults. */
  function initLegacyGlobals() {
    // Create window.globals if missing (typed loosely as any for legacy interop)
    // @ts-ignore - dynamic injection of legacy global bag
    if (!window.globals) window.globals = /** @type {any} */({});
    /** @type {any} */
    const g = window.globals;
    if (typeof g.gimmeColor === 'undefined') g.gimmeColor = true;
    if (typeof g.pinDistance === 'undefined') g.pinDistance = 2.54;
    if (typeof g.chipHeightBase === 'undefined') g.chipHeightBase = 2;
    if (typeof g.chipPositionX === 'undefined') g.chipPositionX = 0;
    if (typeof g.chipPositionY === 'undefined') g.chipPositionY = 0;
    if (typeof g.svgStrokeWidth === 'undefined') g.svgStrokeWidth = 0.1;
    if (typeof g.svgStrokeOffset === 'undefined') g.svgStrokeOffset = 0.1;
    if (typeof g.defaultChipLogicFamily === 'undefined') g.defaultChipLogicFamily = 'LS';
    if (typeof g.defaultChipSeries === 'undefined') g.defaultChipSeries = '74';
  }

  /** Clear the current #page SVG contents and reset chip cursor. */
  function resetPage() {
    const svg = document.getElementById('page');
    if (svg) while (svg.firstChild) svg.removeChild(svg.firstChild);
    // @ts-ignore legacy global bag
    if (window.globals) {
      window.globals.chipPositionX = 0;
      window.globals.chipPositionY = 0;
    }
  }

  /** Update print @page size CSS */
  function setPrintPageSize(/** @type {'A4'|'Letter'} */ presetKey) {
    const preset = PagePresets[presetKey] || PagePresets.Letter;
    let s = document.getElementById(PAGE_SIZE_STYLE_ID);
    if (!s) { s = document.createElement('style'); s.id = PAGE_SIZE_STYLE_ID; document.head.appendChild(s); }
    s.textContent = `@media print { @page { size: ${preset.css}; margin: 0; } }`;
  }

  class ICLabels extends HTMLElement {
    /** @type {'A4'|'Letter'} */ _paper = 'Letter';
    /** @type {Margins} */ _margins = { top: 10, right: 10, bottom: 10, left: 10 };
  /** @type {HTMLDivElement|null} */ _wrap = null;
  /** @type {HTMLDivElement|null} */ _shadowDiv = null;
  /** @type {HTMLDivElement|null} */ _paperDiv = null;
  /** @type {SVGSVGElement|null} */ _svg = null;
  /** @type {MutationObserver|null} */ _observer = null;
  /** @type {number|null} */ _renderTimer = null;

    static get observedAttributes() { return ['paper','margins']; }

    attributeChangedCallback(/** @type {string} */ name, /** @type {string|null} */ _oldVal, /** @type {string|null} */ newVal) {
      if (name === 'paper') {
        this._paper = (newVal === 'A4' ? 'A4' : 'Letter');
        this.render();
      } else if (name === 'margins') {
        this._margins = parseMargins(newVal, this._margins);
        this.render();
      }
    }

    connectedCallback() {
      ensureBaseStyle();
      initLegacyGlobals();
      // read initial attrs
      const paperAttr = (this.getAttribute('paper') || 'Letter');
      this._paper = (paperAttr === 'A4' ? 'A4' : 'Letter');
      this._margins = parseMargins(this.getAttribute('margins'), this._margins);

      // build structure (in light DOM to work with legacy jQuery drawChip)
      this._wrap = document.createElement('div');
      this._wrap.className = 'ic-paper-wrap';
      this._shadowDiv = document.createElement('div');
      this._shadowDiv.className = 'ic-paper-shadow';
      this._paperDiv = document.createElement('div');
      this._paperDiv.className = 'ic-paper';
      this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this._svg.id = 'page';

  this._paperDiv.appendChild(this._svg);
  this._shadowDiv.appendChild(this._paperDiv);
  this._wrap.appendChild(this._shadowDiv);
      // place the rendering container as the first child so user-provided <ic-chip> remain accessible
      this.prepend(this._wrap);

      // Observe children so we render when <ic-chip> nodes are parsed/changed
      this._observer = new MutationObserver(() => this._scheduleRender());
      this._observer.observe(this, { childList: true });

      // Defer initial render to ensure child <ic-chip> elements are present
      this._scheduleRender();
    }

    disconnectedCallback() {
      if (this._observer) { this._observer.disconnect(); this._observer = null; }
      if (this._renderTimer !== null) { window.clearTimeout(this._renderTimer); this._renderTimer = null; }
    }

    _scheduleRender() {
      if (this._renderTimer !== null) window.clearTimeout(this._renderTimer);
      this._renderTimer = window.setTimeout(() => { this._renderTimer = null; this.render(); }, 0);
    }

    render() {
      // apply paper size & margins
  const preset = PagePresets[this._paper] || PagePresets.Letter;
  if (!this._paperDiv || !this._svg) return;
  this._paperDiv.style.width = mm(preset.w);
  this._paperDiv.style.height = mm(preset.h);
  this._paperDiv.style.setProperty('--margin-top-mm', mm(this._margins.top));
  this._paperDiv.style.setProperty('--margin-right-mm', mm(this._margins.right));
  this._paperDiv.style.setProperty('--margin-bottom-mm', mm(this._margins.bottom));
  this._paperDiv.style.setProperty('--margin-left-mm', mm(this._margins.left));

      const contentW = preset.w - this._margins.left - this._margins.right;
      const contentH = preset.h - this._margins.top - this._margins.bottom;
  this._svg.setAttribute('width', mm(contentW));
  this._svg.setAttribute('height', mm(contentH));
      // position svg inside the margins
      this._svg.style.position = 'absolute';
      this._svg.style.left = mm(this._margins.left);
      this._svg.style.top = mm(this._margins.top);

      // update legacy globals and print CSS
  // @ts-ignore legacy global bag
  window.globals.pageWidth = contentW;
  // @ts-ignore legacy global bag
  window.globals.pageHeight = contentH;
      setPrintPageSize(this._paper);

      // draw chips from light-DOM children
      resetPage();
      const chipNodes = this.querySelectorAll('ic-chip');
      chipNodes.forEach(node => {
        const name = (node.textContent || '').trim();
        if (!name) return;
        const countAttr = node.getAttribute('count');
        const count = Math.max(1, Math.floor(Number(countAttr) || 1));
        for (let i = 0; i < count; i++) {
          if (typeof window.drawChip === 'function') {
            // @ts-ignore legacy global
            window.drawChip(name);
          } else {
            // fail-soft: mark missing renderer
            if (this._svg) {
              const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
              txt.textContent = `Missing drawChip for ${name}`;
              txt.setAttribute('x','0');
              txt.setAttribute('y', `${(i+1)*10}`);
              this._svg.appendChild(txt);
            }
          }
        }
      });
    }
  }

  class ICChip extends HTMLElement {}

  customElements.define('ic-labels', ICLabels);
  customElements.define('ic-chip', ICChip);
})();
