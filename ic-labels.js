// @ts-check
/**
 * IC Label Creator - Consolidated
 * (C) Klemens Ullmann-Marx / www.ull.at
 * License: GPLv3
 * 
 * Creates printable IC chip labels with pinouts using declarative web components.
 * Usage: <ic-labels paper="Letter|A4" margins="10 10 10 10"><ic-chip count="N">CHIPNAME</ic-chip></ic-labels>
 */

(function() {
  'use strict';

  // ============================================================================
  // TYPE DEFINITIONS
  // ============================================================================

  /** @typedef {{w:number, h:number, css:string}} PagePreset */
  /** @typedef {{top:number, right:number, bottom:number, left:number}} Margins */
  /** @typedef {{paper:'A4'|'Letter', margins:Margins, zoom:number}} UIState */

  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================

  const CONFIG = {
    LOCALSTORAGE_KEY: 'icLabelCreator:lastState',
    STYLE_ID: 'ic-labels-styles',
    PAGE_SIZE_STYLE_ID: 'ic-page-size-style',
    
    /** @type {Record<string, PagePreset>} */
    PAGE_PRESETS: {
      A4:     { w: 210.0,  h: 297.0, css: '210mm 297mm' },
      Letter: { w: 215.9,  h: 279.4, css: '215.9mm 279.4mm' },
    },

    DEFAULT_MARGINS: { top: 10, right: 10, bottom: 10, left: 10 },
    DEFAULT_ZOOM: 1,
  };

  const STYLES = {
    COMPONENT: `
      :root { --ic-paper-bg: repeating-linear-gradient(0deg,#f8f8f8 0px,#f8f8f8 9px,#f0f0f0 9px,#f0f0f0 10px); }
      html { background: var(--ic-paper-bg); background-repeat: repeat; }
      ic-labels { display: block; }
      ic-labels ic-chip { display: none; }
      .ic-paper-wrap { display: grid; place-items: start center; padding: 1.25rem; }
      .ic-paper-shadow { 
        position: relative; 
        filter: drop-shadow(0 6px 14px rgba(0,0,0,.12)) drop-shadow(0 2px 4px rgba(0,0,0,.08)); 
        transform-origin: top center; 
        transform: scale(var(--ic-zoom, 1)); 
        transition: transform .2s ease; 
      }
      .ic-paper { background: white; border: 1px solid #ddd; position: relative; overflow: hidden; margin: 0 auto 1em; }
      .ic-paper::after { 
        content: ""; position: absolute; pointer-events: none; 
        left: var(--margin-left-mm); right: var(--margin-right-mm); 
        top: var(--margin-top-mm); bottom: var(--margin-bottom-mm); 
        border: 1px dashed rgba(0,0,0,.15); 
      }
      .ic-paper svg { display: block; }
      @media print {
        @page { margin: 0; }
        html, body { background: white !important; }
        .ic-paper-wrap { padding: 0 !important; }
        .ic-paper-shadow { filter: none !important; transform: none !important; }
        .ic-paper { border: none !important; }
        .ic-paper::after { border: none; }
      }
    `,

    UI: `
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body { 
        margin: 0; padding: 0; 
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; 
        color: #111; background: transparent; 
         display: flex;
         flex-direction: column;
         min-height: 100vh;
      }
       header { position: sticky; top: 0; z-index: 10; background: white; border-bottom: 1px solid #e5e5e5; flex-shrink: 0; }
      .toolbar { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; padding: .75rem 1rem; }
      .toolbar label { font-size: .9rem; color: #333; }
      .toolbar input[type="number"]{ width: 6rem; }
      .toolbar .group { display: flex; gap: .5rem; align-items: center; }
      .toolbar .spacer { flex: 1; }
       ic-labels { flex: 1; overflow: auto; }
       footer { padding: 1rem; font-size: .85rem; color: #555; background: white; border-top: 1px solid #e5e5e5; flex-shrink: 0; }
      code.kbd { 
        padding: .15rem .35rem; border: 1px solid #ddd; border-radius: .35rem; background: #fff; 
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; 
        font-size: .9rem; 
      }
      @media print { header, footer { display: none !important; } }
    `,
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /** Convert number to CSS mm value */
  function mm(/** @type {number} */ n) { 
    return `${n}mm`; 
  }

  /** Create element from HTML string */
  function createElementFromHTML(/** @type {string} */ html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (template.content.firstElementChild);
  }

  /** Inject CSS into document head */
  function injectCSS(/** @type {string} */ id, /** @type {string} */ css) {
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  /**
   * Parse margins attribute. Supports 1-4 CSS-like values (mm).
   * Examples: "10" → all 10mm, "10 20" → vertical 10mm, horizontal 20mm
   */
  function parseMargins(/** @type {string|null} */ raw, /** @type {Margins} */ fallback) {
    if (!raw) return fallback;
    const parts = raw.trim().split(/\s+/).map(v => Number(v));
    if (parts.some(n => Number.isNaN(n))) return fallback;
    
    if (parts.length === 1) {
      const [v] = parts; 
      return { top: v, right: v, bottom: v, left: v };
    }
    if (parts.length === 2) {
      const [v, h] = parts; 
      return { top: v, right: h, bottom: v, left: h };
    }
    if (parts.length === 3) {
      const [t, h, b] = parts; 
      return { top: t, right: h, bottom: b, left: h };
    }
    const [t, r, b, l] = parts;
    return { 
      top: t ?? fallback.top, 
      right: r ?? fallback.right, 
      bottom: b ?? fallback.bottom, 
      left: l ?? fallback.left 
    };
  }

  // (Removed legacy window.globals initialization; configuration now lives on <ic-labels> attributes)

  // ============================================================================
  // CHIP RENDERING ENGINE (Legacy compatible)
  // ============================================================================

  /** Reset the SVG page and chip positioning */
  function clearPage() {
    const svg = document.getElementById('page');
    if (svg) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    }
  }

  /** Get pin font family (allows override) */
  function getPinFontFamily(/** @type {string|undefined|null} */ override) {
    if (override && String(override).trim().length > 0) return String(override);
    return '"Arial Narrow", "Helvetica Neue Condensed", "Roboto Condensed", Arial, "Liberation Sans Narrow", sans-serif';
  }

  /** Calculate font size based on pin name length */
  function calculatePinFontSize(/** @type {string} */ pinName, /** @type {number} */ chipHeightPins) {
    if (chipHeightPins > 3) return '1.6mm';
    
    // Count characters excluding overline multibyte markers
    const uriEncoded = encodeURIComponent(pinName);
    const overlineReplaced = uriEncoded.split('%CC%85').join('');
    const length = decodeURIComponent(overlineReplaced).length;
    
    if (length <= 2) return '1.6mm';
    if (length <= 3) return '1.3mm';
    return '1.1mm';
  }

  /** Determine chip label color based on type */
  function getChipColor(/** @type {string} */ chipType, /** @type {boolean} */ gimmeColor) {
    if (gimmeColor === false) return 'black';
    
    /** @type {Record<string, string>} */
    const colorMap = {
      ram: 'red', sram: 'red', eeprom: 'red', register: 'red', flipflop: 'red',
      gate: 'blue',
      mux: 'green', demux: 'green', via: 'green',
      counter: 'magenta',
      cpu: 'darkorange',
    };
    
    return colorMap[chipType] || 'black';
  }

  /** Adjust chip name with series and logic family */
  function adjustChipName(
    /** @type {string} */ chipName,
    /** @type {string|undefined} */ family,
    /** @type {string|undefined} */ series,
    /** @type {{defaultChipLogicFamily:string, defaultChipSeries:string}} */ defaults
  ) {
    if (family === undefined) {
      family = defaults.defaultChipLogicFamily || 'LS';
    }
    if (series === undefined) {
      series = defaults.defaultChipSeries || '74';
    }
    return chipName.replace(/^74LS/, series + family);
  }

  /** Draw a single pin on the chip SVG */
  function renderPin(/** @type {any} */ config) {
    // @ts-ignore - jQuery is loaded globally
    const { svgChip, pinName: rawPinName, side, x, chipHeight, chipHeightPins } = config;
    
    let pinName = rawPinName;
    let activeLow = false;
    
    if (pinName.startsWith('/')) {
      activeLow = true;
      pinName = pinName.substring(1);
    }
    
    // @ts-ignore - jQuery
    const pinText = $(document.createElementNS("http://www.w3.org/2000/svg", 'text'))
      .html(pinName)
      .attr({
        x: 0,
        y: 0,
        'text-decoration': activeLow ? 'overline' : '',
        'dominant-baseline': 'baseline',
        'text-anchor': side === 'bottom' ? 'start' : 'end',
        'font-family': getPinFontFamily(config.pinFontFamily),
        'font-size': calculatePinFontSize(pinName, chipHeightPins),
        style: side === 'bottom'
          ? `transform: rotate(270deg) translate(-${chipHeight - 0.2}mm, ${x + 0.6}mm);`
          : `transform: rotate(270deg) translate(-0.3mm, ${x + 0.7}mm);`,
      });
    
    svgChip.append(pinText);
  }

  /**
   * Draw a complete IC chip with pinouts
   * @param {string} chipName - Name of the chip (must exist in chips.js)
   * @param {string} [series] - Series (e.g., '74', '54')
   * @param {string} [type] - Logic family (e.g., 'LS', 'HC')
  * @param {any} [g] - Rendering configuration (dimensions, spacing, fonts)
   */
  function drawChip(chipName, series, type, /** @type {any} */ g = {}) {
    // @ts-ignore - jQuery and chips are loaded globally
    console.log('Drawing chip:', chipName, type, series);
    
  // @ts-ignore - chips defined in chips.js
    const chip = window.chips && window.chips[chipName];
    
    if (!chip) {
      alert(`Error: unknown chip "${chipName}". Please check spelling or add pinout to chips.js.`);
      return;
    }
    
    // Calculate chip dimensions
    const numPins = Object.keys(chip.pins).length;
    const chipWidth = numPins / 2 * g.pinDistance + 1;
    const chipHeightPins = chip.heightPins || 3;
    const chipHeight = chipHeightPins * g.chipHeightBase;
    
    // @ts-ignore - jQuery
    const svgChip = $(document.createElementNS("http://www.w3.org/2000/svg", 'svg')).attr({
      width: chipWidth + 'mm',
      height: chipHeight + 'mm',
      x: g.chipPositionX + 'mm',
      y: g.chipPositionY + 'mm',
    });
    
    // Draw chip body outline
    // @ts-ignore - jQuery
    svgChip.append($(document.createElementNS("http://www.w3.org/2000/svg", 'rect')).attr({
      x: g.svgStrokeOffset + 'mm',
      y: g.svgStrokeOffset + 'mm',
      width: chipWidth - g.svgStrokeOffset + 'mm',
      height: chipHeight - g.svgStrokeOffset + 'mm',
      stroke: 'silver',
      'stroke-width': g.svgStrokeWidth + 'mm',
      fill: 'white'
    }));
    
    // Draw pin 1 indicator (half-circle)
    // @ts-ignore - jQuery
    svgChip.append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle')).attr({
      cx: 0,
      cy: '50%',
      r: '1.2mm',
      fill: 'grey'
    }));
    
    // Draw chip label (model + description)
    const displayName = adjustChipName(chipName, series, type, {
      defaultChipLogicFamily: g.defaultChipLogicFamily,
      defaultChipSeries: g.defaultChipSeries,
    });
    const labelFontSize = chipHeight * 0.5;
    
    // @ts-ignore - jQuery
    svgChip.append($(document.createElementNS("http://www.w3.org/2000/svg", 'text'))
      .html(`&nbsp;&nbsp;${displayName} ${chip.description}`)
      .attr({
        x: '50%',
        y: chipHeight / 2 + 0.2 + 'mm',
        'dominant-baseline': 'middle',
        'text-anchor': 'middle',
        'font-family': 'Times New Roman, serif',
        'font-size': labelFontSize + 'mm',
        'font-weight': 'bold',
        fill: getChipColor(chip.type, g.gimmeColor),
        'fill-opacity': 0.3
      })
    );
    
    // Draw all pins
    let pinX = g.pinDistance / 2 + 0.5;
    // @ts-ignore - jQuery
    $.each(chip.pins, function(/** @type {any} */ pinNum, /** @type {any} */ pinName) {
      const pinNumber = parseInt(String(pinNum), 10);
      
      if (pinNumber <= numPins / 2) {
        // Bottom side pins
        renderPin({
          svgChip,
          pinName,
          side: 'bottom',
          x: pinX,
          chipHeight,
          chipHeightPins,
          pinFontFamily: g.pinFontFamily,
        });
        pinX += g.pinDistance;
      } else {
        // Top side pins
        pinX -= g.pinDistance;
        renderPin({
          svgChip,
          pinName,
          side: 'top',
          x: pinX,
          chipHeight,
          chipHeightPins,
          pinFontFamily: g.pinFontFamily,
        });
      }
    });
    
    // Add chip to page
    // @ts-ignore - jQuery
    $('#page').append(svgChip);
    
    // Update position for next chip (auto-flow into columns)
    g.chipPositionY += chipHeight + 4;
    
    if (g.chipPositionY + 10 > g.pageHeight) {
      g.chipPositionY = 0;
      g.chipPositionX += 50;
    }
  }

  // drawChip is used internally by the web component; no global export required

  // ============================================================================
  // WEB COMPONENTS
  // ============================================================================

  /** Update @page size for print media */
  function updatePrintPageSize(/** @type {'A4'|'Letter'} */ preset) {
    const pagePreset = CONFIG.PAGE_PRESETS[preset] || CONFIG.PAGE_PRESETS.Letter;
    let styleEl = document.getElementById(CONFIG.PAGE_SIZE_STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = CONFIG.PAGE_SIZE_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@media print { @page { size: ${pagePreset.css}; margin: 0; } }`;
  }

  /**
   * <ic-labels> Custom Element
   * Container for IC chip labels with paper size and margin configuration
   */
  class ICLabelsElement extends HTMLElement {
    /** @type {'A4'|'Letter'} */ _paper = 'Letter';
    /** @type {Margins} */ _margins = { ...CONFIG.DEFAULT_MARGINS };
    /** Rendering config (replaces window.globals) */
    /** @type {number} */ _pinDistance = 2.54;
    /** @type {number} */ _chipHeightBase = 2;
    /** @type {number} */ _svgStrokeWidth = 0.1;
    /** @type {number} */ _svgStrokeOffset = 0.1;
    /** @type {string} */ _defaultChipLogicFamily = 'LS';
    /** @type {string} */ _defaultChipSeries = '74';
    /** @type {boolean} */ _gimmeColor = true;
    /** @type {string|undefined} */ _pinFontFamily = undefined;
    /** @type {HTMLDivElement|null} */ _wrap = null;
    /** @type {HTMLDivElement|null} */ _shadowDiv = null;
    /** @type {HTMLDivElement|null} */ _paperDiv = null;
    /** @type {SVGSVGElement|null} */ _svg = null;
    /** @type {MutationObserver|null} */ _observer = null;
    /** @type {number|null} */ _renderTimer = null;

    static get observedAttributes() {
      return [
        'paper', 'margins',
        'pindistance', 'chipheightbase', 'svgstrokewidth', 'svgstrokeoffset',
        'defaultchiplogicfamily', 'defaultchipseries', 'gimmecolor', 'pinfontfamily',
      ];
    }

    attributeChangedCallback(/** @type {string} */ name, /** @type {string|null} */ _oldVal, /** @type {string|null} */ newVal) {
      if (name === 'paper') {
        this._paper = (newVal === 'A4' ? 'A4' : 'Letter');
        this._scheduleRender();
      } else if (name === 'margins') {
        this._margins = parseMargins(newVal, this._margins);
        this._scheduleRender();
      } else if (name === 'pindistance') {
        const v = parseFloat(String(newVal || ''));
        if (!Number.isNaN(v)) this._pinDistance = v;
        this._scheduleRender();
      } else if (name === 'chipheightbase') {
        const v = parseFloat(String(newVal || ''));
        if (!Number.isNaN(v)) this._chipHeightBase = v;
        this._scheduleRender();
      } else if (name === 'svgstrokewidth') {
        const v = parseFloat(String(newVal || ''));
        if (!Number.isNaN(v)) this._svgStrokeWidth = v;
        this._scheduleRender();
      } else if (name === 'svgstrokeoffset') {
        const v = parseFloat(String(newVal || ''));
        if (!Number.isNaN(v)) this._svgStrokeOffset = v;
        this._scheduleRender();
      } else if (name === 'defaultchiplogicfamily') {
        this._defaultChipLogicFamily = String(newVal || 'LS');
        this._scheduleRender();
      } else if (name === 'defaultchipseries') {
        this._defaultChipSeries = String(newVal || '74');
        this._scheduleRender();
      } else if (name === 'gimmecolor') {
        const s = (newVal ?? '').toLowerCase();
        // truthy unless explicitly false/0
        this._gimmeColor = !(s === 'false' || s === '0' || s === 'no');
        this._scheduleRender();
      } else if (name === 'pinfontfamily') {
        const v = newVal == null ? undefined : String(newVal);
        this._pinFontFamily = v && v.trim().length ? v : undefined;
        this._scheduleRender();
      }
    }

    connectedCallback() {
      injectCSS(CONFIG.STYLE_ID, STYLES.COMPONENT);
      
      // Read initial attributes
      const paperAttr = this.getAttribute('paper') || 'Letter';
      this._paper = (paperAttr === 'A4' ? 'A4' : 'Letter');
      this._margins = parseMargins(this.getAttribute('margins'), this._margins);
      // Read optional rendering attributes (support camelCase and lowercase)
  /** @type {(name: string) => (string|null)} */
  const readAttr = (name) => this.getAttribute(name) ?? this.getAttribute(name.toLowerCase());
  /** @type {(s: string|null|undefined, d: number) => number} */
  const n = (s, d) => { const v = parseFloat(String(s ?? '')); return Number.isNaN(v) ? d : v; };
  /** @type {(s: string|null|undefined, d: boolean) => boolean} */
  const b = (s, d) => {
        if (s == null) return d;
        const v = String(s).toLowerCase();
        if (v === '' ) return true; // presence-only boolean
        if (v === 'false' || v === '0' || v === 'no') return false;
        if (v === 'true' || v === '1' || v === 'yes') return true;
        return d;
      };
      this._pinDistance = n(readAttr('pinDistance'), this._pinDistance);
      this._chipHeightBase = n(readAttr('chipHeightBase'), this._chipHeightBase);
      this._svgStrokeWidth = n(readAttr('svgStrokeWidth'), this._svgStrokeWidth);
      this._svgStrokeOffset = n(readAttr('svgStrokeOffset'), this._svgStrokeOffset);
      this._defaultChipLogicFamily = String(readAttr('defaultChipLogicFamily') ?? this._defaultChipLogicFamily);
      this._defaultChipSeries = String(readAttr('defaultChipSeries') ?? this._defaultChipSeries);
      this._gimmeColor = b(readAttr('gimmeColor'), this._gimmeColor);
      const pff = readAttr('pinFontFamily');
      this._pinFontFamily = pff && String(pff).trim().length ? String(pff) : undefined;

      // Build DOM structure (light DOM for jQuery compatibility)
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
      this.prepend(this._wrap);

      // Watch for chip element changes
      this._observer = new MutationObserver(() => this._scheduleRender());
      this._observer.observe(this, { childList: true });

      this._scheduleRender();
    }

    disconnectedCallback() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      if (this._renderTimer !== null) {
        window.clearTimeout(this._renderTimer);
        this._renderTimer = null;
      }
    }

    _scheduleRender() {
      if (this._renderTimer !== null) window.clearTimeout(this._renderTimer);
      this._renderTimer = window.setTimeout(() => {
        this._renderTimer = null;
        this.render();
      }, 0);
    }

    render() {
      if (!this._paperDiv || !this._svg) return;
      
      const preset = CONFIG.PAGE_PRESETS[this._paper] || CONFIG.PAGE_PRESETS.Letter;
      
      // Set paper dimensions
      this._paperDiv.style.width = mm(preset.w);
      this._paperDiv.style.height = mm(preset.h);
      
      // Set margin indicators
      this._paperDiv.style.setProperty('--margin-top-mm', mm(this._margins.top));
      this._paperDiv.style.setProperty('--margin-right-mm', mm(this._margins.right));
      this._paperDiv.style.setProperty('--margin-bottom-mm', mm(this._margins.bottom));
      this._paperDiv.style.setProperty('--margin-left-mm', mm(this._margins.left));

      // Calculate printable area
      const contentW = preset.w - this._margins.left - this._margins.right;
      const contentH = preset.h - this._margins.top - this._margins.bottom;
      
      this._svg.setAttribute('width', mm(contentW));
      this._svg.setAttribute('height', mm(contentH));
      this._svg.style.position = 'absolute';
      this._svg.style.left = mm(this._margins.left);
      this._svg.style.top = mm(this._margins.top);

      // Build rendering configuration (replaces window.globals)
      const g = {
        pageWidth: contentW,
        pageHeight: contentH,
        pinDistance: this._pinDistance,
        chipHeightBase: this._chipHeightBase,
        chipPositionX: 0,
        chipPositionY: 0,
        svgStrokeWidth: this._svgStrokeWidth,
        svgStrokeOffset: this._svgStrokeOffset,
        defaultChipLogicFamily: this._defaultChipLogicFamily,
        defaultChipSeries: this._defaultChipSeries,
        gimmeColor: this._gimmeColor,
        pinFontFamily: this._pinFontFamily,
      };
      
      updatePrintPageSize(this._paper);

      // Render chips
      clearPage();
      const chipElements = this.querySelectorAll('ic-chip');
      chipElements.forEach(chip => {
        const chipName = (chip.textContent || '').trim();
        if (!chipName) return;
        
        const count = Math.max(1, Math.floor(Number(chip.getAttribute('count')) || 1));
        for (let i = 0; i < count; i++) {
          drawChip(chipName, undefined, undefined, g);
        }
      });
    }
  }

  /**
   * <ic-chip> Custom Element
   * Represents a single chip (or multiple via count attribute)
   */
  class ICChipElement extends HTMLElement {
    // Marker element only - content parsed by parent
  }

  // Register custom elements
  customElements.define('ic-labels', ICLabelsElement);
  customElements.define('ic-chip', ICChipElement);

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  function createToolbar() {
    return createElementFromHTML(`
      <header>
        <div class="toolbar" role="region" aria-label="Layout controls">
          <div class="group">
            <label for="paperSelect"><strong>Paper</strong></label>
            <select id="paperSelect">
              <option value="A4">A4 — 210 × 297 mm</option>
              <option value="Letter">Letter — 215.9 × 279.4 mm</option>
            </select>
          </div>

          <div class="group">
            <label><strong>Margins (mm)</strong></label>
            <label>Top <input id="marginTop" type="number" min="0" step="0.1" value="10"></label>
            <label>Right <input id="marginRight" type="number" min="0" step="0.1" value="10"></label>
            <label>Bottom <input id="marginBottom" type="number" min="0" step="0.1" value="10"></label>
            <label>Left <input id="marginLeft" type="number" min="0" step="0.1" value="10"></label>
          </div>

          <div class="group">
            <label for="zoomRange"><strong>Zoom</strong></label>
            <input id="zoomRange" type="range" min="0.5" max="2" step="0.05" value="1" />
            <button id="zoomOut" type="button" title="Zoom out">−</button>
            <span id="zoomVal" aria-live="polite">100%</span>
            <button id="zoomIn" type="button" title="Zoom in">+</button>
          </div>

          <div class="spacer"></div>

          <div class="group">
            <button id="resetLayout" type="button">Reset Layout</button>
            <button id="printBtn" type="button">Print</button>
          </div>
        </div>
      </header>
    `);
  }

  function createFooter() {
    return createElementFromHTML(`
      <footer>
        IC-Label Set "Ben Eater 6502 Breadboard Computer" • Declarative config, preview with zoom, selectable A4/Letter, auto-saved layout, and print fix.<br/>
        Renders into <code class="kbd">#page</code> using <code class="kbd">drawChip</code>.
      </footer>
    `);
  }

  /** Setup interactive UI controls */
  function initializeUI(/** @type {Element} */ labelsElement) {
    const toolbar = /** @type {HTMLElement} */ (createToolbar());
    const footer = /** @type {HTMLElement} */ (createFooter());
    
    document.body.prepend(toolbar);
    document.body.appendChild(footer);

    // Get control elements
    const controls = {
      paper: /** @type {HTMLSelectElement} */ (toolbar.querySelector('#paperSelect')),
      marginTop: /** @type {HTMLInputElement} */ (toolbar.querySelector('#marginTop')),
      marginRight: /** @type {HTMLInputElement} */ (toolbar.querySelector('#marginRight')),
      marginBottom: /** @type {HTMLInputElement} */ (toolbar.querySelector('#marginBottom')),
      marginLeft: /** @type {HTMLInputElement} */ (toolbar.querySelector('#marginLeft')),
      zoom: /** @type {HTMLInputElement} */ (toolbar.querySelector('#zoomRange')),
      zoomIn: /** @type {HTMLButtonElement} */ (toolbar.querySelector('#zoomIn')),
      zoomOut: /** @type {HTMLButtonElement} */ (toolbar.querySelector('#zoomOut')),
      zoomDisplay: /** @type {HTMLSpanElement} */ (toolbar.querySelector('#zoomVal')),
      reset: /** @type {HTMLButtonElement} */ (toolbar.querySelector('#resetLayout')),
      print: /** @type {HTMLButtonElement} */ (toolbar.querySelector('#printBtn')),
    };

    // State management
    function readState() /** @type {UIState} */ {
      return {
        paper: (controls.paper.value === 'A4' ? 'A4' : 'Letter'),
        margins: {
          top: parseFloat(controls.marginTop.value) || 0,
          right: parseFloat(controls.marginRight.value) || 0,
          bottom: parseFloat(controls.marginBottom.value) || 0,
          left: parseFloat(controls.marginLeft.value) || 0,
        },
        zoom: parseFloat(controls.zoom.value) || 1,
      };
    }

    function writeState(/** @type {UIState} */ state) {
      controls.paper.value = state.paper;
      controls.marginTop.value = String(state.margins.top);
      controls.marginRight.value = String(state.margins.right);
      controls.marginBottom.value = String(state.margins.bottom);
      controls.marginLeft.value = String(state.margins.left);
      controls.zoom.value = String(state.zoom);
      controls.zoomDisplay.textContent = Math.round(state.zoom * 100) + '%';
    }

    function applyState(/** @type {UIState} */ state) {
      labelsElement.setAttribute('paper', state.paper);
      labelsElement.setAttribute('margins', 
        `${state.margins.top} ${state.margins.right} ${state.margins.bottom} ${state.margins.left}`);
      /** @type {HTMLElement} */ (labelsElement).style.setProperty('--ic-zoom', String(state.zoom));
    }

    function saveState(/** @type {UIState} */ state) {
      localStorage.setItem(CONFIG.LOCALSTORAGE_KEY, JSON.stringify(state));
    }

    function loadState() /** @type {UIState|null} */ {
      try {
        const raw = localStorage.getItem(CONFIG.LOCALSTORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }

    // Initialize from saved state or component attributes
    const initialState = (function() /** @type {UIState} */ {
      const saved = loadState();
      if (saved && (saved.paper || saved.margins || saved.zoom)) {
        return saved;
      }
      
      // Fall back to component attributes
      const paperAttr = labelsElement.getAttribute('paper') === 'A4' ? 'A4' : 'Letter';
      const margins = parseMargins(labelsElement.getAttribute('margins'), CONFIG.DEFAULT_MARGINS);
      
      return {
        paper: paperAttr,
        margins,
        zoom: CONFIG.DEFAULT_ZOOM,
      };
    })();

    writeState(initialState);
    applyState(initialState);

    // Event handlers
    function handleChange() {
      const state = readState();
      applyState(/** @type {UIState} */ (state));
      saveState(/** @type {UIState} */ (state));
    }

    controls.paper.addEventListener('change', handleChange);
    controls.marginTop.addEventListener('input', handleChange);
    controls.marginRight.addEventListener('input', handleChange);
    controls.marginBottom.addEventListener('input', handleChange);
    controls.marginLeft.addEventListener('input', handleChange);
    
    controls.zoom.addEventListener('input', () => {
      const state = readState();
      controls.zoomDisplay.textContent = Math.round(state.zoom * 100) + '%';
      applyState(/** @type {UIState} */ (state));
      saveState(/** @type {UIState} */ (state));
    });

    controls.zoomIn.addEventListener('click', () => {
      const newZoom = Math.min(2, Math.round((parseFloat(controls.zoom.value || '1') + 0.1) * 100) / 100);
      controls.zoom.value = String(newZoom);
      controls.zoom.dispatchEvent(new Event('input'));
    });

    controls.zoomOut.addEventListener('click', () => {
      const newZoom = Math.max(0.5, Math.round((parseFloat(controls.zoom.value || '1') - 0.1) * 100) / 100);
      controls.zoom.value = String(newZoom);
      controls.zoom.dispatchEvent(new Event('input'));
    });

    controls.reset.addEventListener('click', () => {
      const defaultState /** @type {UIState} */ = {
        paper: /** @type {'Letter'} */ ('Letter'),
        margins: { ...CONFIG.DEFAULT_MARGINS },
        zoom: CONFIG.DEFAULT_ZOOM,
      };
      writeState(defaultState);
      applyState(defaultState);
      saveState(defaultState);
    });

    controls.print.addEventListener('click', () => window.print());
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function initialize() {
    injectCSS('ic-ui-styles', STYLES.UI);
    
    const labelsElement = document.querySelector('ic-labels');
    if (labelsElement) {
      initializeUI(labelsElement);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
