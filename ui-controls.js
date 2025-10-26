// @ts-check
(function(){
  const LS_KEY = 'icLabelCreator:lastState';
  /** @typedef {{paper:'A4'|'Letter', margins:{top:number,right:number,bottom:number,left:number}, zoom:number}} State */

  /** @param {string} html */
  function el(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (t.content.firstElementChild);
  }

  function injectStyles(){
    const css = `
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body { margin: 0; padding: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: #111; background: transparent; }
      header { position: sticky; top: 0; z-index: 10; background: white; border-bottom: 1px solid #e5e5e5; }
      .toolbar { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; padding: .75rem 1rem; }
      .toolbar label { font-size: .9rem; color: #333; }
      .toolbar input[type="number"]{ width: 6rem; }
      .toolbar .group { display: flex; gap: .5rem; align-items: center; }
      .toolbar .spacer { flex: 1; }
      footer { padding: 1rem; font-size: .85rem; color: #555; background: white; border-top: 1px solid #e5e5e5; }
      code.kbd { padding: .15rem .35rem; border: 1px solid #ddd; border-radius: .35rem; background: #fff; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: .9rem; }
      @media print { header, footer { display: none !important; } }
    `;
    const s = document.createElement('style');
    s.textContent = css; document.head.appendChild(s);
  }

  function createHeader(){
    return el(`
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

  function createFooter(){
    return el(`
      <footer>
        IC-Label Set "Ben Eater 6502 Breadboard Computer" • Declarative config, preview with zoom, selectable A4/Letter, auto-saved layout, and print fix.<br/>
        Renders into <code class="kbd">#page</code> using legacy <code class="kbd">drawChip</code>.
      </footer>
    `);
  }

  /** @param {Element} labels */
  function setupUI(labels){
    const header = /** @type {HTMLElement} */ (createHeader());
    const footer = /** @type {HTMLElement} */ (createFooter());
    document.body.prepend(header);
    document.body.appendChild(footer);

    const $paper = /** @type {HTMLSelectElement} */ (header.querySelector('#paperSelect'));
    const $mt = /** @type {HTMLInputElement} */ (header.querySelector('#marginTop'));
    const $mr = /** @type {HTMLInputElement} */ (header.querySelector('#marginRight'));
    const $mb = /** @type {HTMLInputElement} */ (header.querySelector('#marginBottom'));
    const $ml = /** @type {HTMLInputElement} */ (header.querySelector('#marginLeft'));
    const $zoom = /** @type {HTMLInputElement} */ (header.querySelector('#zoomRange'));
    const $zoomIn = /** @type {HTMLButtonElement} */ (header.querySelector('#zoomIn'));
    const $zoomOut = /** @type {HTMLButtonElement} */ (header.querySelector('#zoomOut'));
    const $zoomVal = /** @type {HTMLSpanElement} */ (header.querySelector('#zoomVal'));
    const $reset = /** @type {HTMLButtonElement} */ (header.querySelector('#resetLayout'));
    const $print = /** @type {HTMLButtonElement} */ (header.querySelector('#printBtn'));

    /** @returns {State} */
    function readUI(){
      return {
        paper: ($paper.value === 'A4' ? 'A4':'Letter'),
        margins: {
          top: parseFloat($mt.value) || 0,
          right: parseFloat($mr.value) || 0,
          bottom: parseFloat($mb.value) || 0,
          left: parseFloat($ml.value) || 0,
        },
        zoom: parseFloat($zoom.value) || 1,
      };
    }

    /** @param {State} s */
    function writeUI(s){
      $paper.value = s.paper;
      $mt.value = String(s.margins.top);
      $mr.value = String(s.margins.right);
      $mb.value = String(s.margins.bottom);
      $ml.value = String(s.margins.left);
      $zoom.value = String(s.zoom);
      $zoomVal.textContent = Math.round(s.zoom * 100) + '%';
    }

    /** @param {State} s */
    function applyToComponent(s){
      labels.setAttribute('paper', s.paper);
      labels.setAttribute('margins', `${s.margins.top} ${s.margins.right} ${s.margins.bottom} ${s.margins.left}`);
      /** @type {HTMLElement} */(labels).style.setProperty('--ic-zoom', String(s.zoom));
    }

    function save(/** @type {State} */ s){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }
    function load(){ try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }

    const initial = (function(){
      const ls = load();
      if (ls && (ls.paper || ls.margins || ls.zoom)) return ls;
      const paperAttr = labels.getAttribute('paper') === 'A4' ? 'A4' : 'Letter';
      const marginsAttr = (labels.getAttribute('margins') || '').trim().split(/\s+/).map(Number);
      const m = { top: 10, right: 10, bottom: 10, left: 10 };
      if (marginsAttr.length === 1){ m.top=m.right=m.bottom=m.left=marginsAttr[0]||10; }
      else if (marginsAttr.length === 2){ m.top=m.bottom=marginsAttr[0]||10; m.right=m.left=marginsAttr[1]||10; }
      else if (marginsAttr.length === 3){ m.top=marginsAttr[0]||10; m.right=m.left=marginsAttr[1]||10; m.bottom=marginsAttr[2]||10; }
      else if (marginsAttr.length >= 4){ m.top=marginsAttr[0]||10; m.right=marginsAttr[1]||10; m.bottom=marginsAttr[2]||10; m.left=marginsAttr[3]||10; }
      return { paper: paperAttr, margins: m, zoom: 1 };
    })();

    writeUI(initial);
    applyToComponent(initial);

    $paper.addEventListener('change', () => { const s = readUI(); applyToComponent(s); save(s); });
    [$mt,$mr,$mb,$ml].forEach(input => input.addEventListener('input', () => { const s = readUI(); applyToComponent(s); save(s); }));
    $zoom.addEventListener('input', () => { const s = readUI(); $zoomVal.textContent = Math.round(s.zoom*100)+'%'; applyToComponent(s); save(s); });
    $zoomIn.addEventListener('click', () => { const z = Math.min(2, Math.round((parseFloat($zoom.value||'1')+0.1)*100)/100); $zoom.value=String(z); $zoom.dispatchEvent(new Event('input')); });
    $zoomOut.addEventListener('click', () => { const z = Math.max(0.5, Math.round((parseFloat($zoom.value||'1')-0.1)*100)/100); $zoom.value=String(z); $zoom.dispatchEvent(new Event('input')); });
    $reset.addEventListener('click', () => {
      const s = /** @type {State} */ ({ paper: 'Letter', margins: { top:10, right:10, bottom:10, left:10 }, zoom: 1 });
      writeUI(s); applyToComponent(s); save(s);
    });
    $print.addEventListener('click', () => window.print());
  }

  function main(){
    injectStyles();
    const labels = document.querySelector('ic-labels');
    if (!labels) return;
    setupUI(labels);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
