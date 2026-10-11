/* Interfaz: lee el DOM, llama a Converter y pinta resultados. */
(function () {
  var C = window.Converter, KEY = 'conversor-tasas-v1';
  var $ = function (id) { return document.getElementById(id); };
  var el = { ppc: $('ratePpc'), pmxn: $('ratePmxn'), amount: $('amount'), results: $('results'),
    derived: $('derived'), fromTag: $('fromTag'), seg: $('fromSeg'), toast: $('toast') };
  var from = 'CUP';

  function parse(str) {
    var s = String(str).trim().replace(/[\s,]/g, '');
    if (s === '') return null;
    if (!/^\d*\.?\d*$/.test(s) || s === '.') return NaN;
    return parseFloat(s);
  }
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function fmtInput(input) {
    var raw = input.value.replace(/,/g, ''), m = raw.match(/^(\d*)(\.\d*)?$/);
    if (!m) return;
    var pos = input.selectionStart, before = input.value.length;
    var intPart = m[1] ? Number(m[1]).toLocaleString('en-US') : '';
    input.value = intPart + (m[2] || '');
    var p = Math.max(0, pos + input.value.length - before);
    try { input.setSelectionRange(p, p); } catch (e) {}
  }
  function setErr(id, input, msg) { $(id).textContent = msg || ''; input.classList.toggle('invalid', !!msg); }

  function readRates() {
    var a = parse(el.ppc.value), b = parse(el.pmxn.value), ok = true;
    if (!C.isValidRate(a)) { setErr('errPpc', el.ppc, 'Introduce un número mayor que 0'); ok = false; } else setErr('errPpc', el.ppc);
    if (!C.isValidRate(b)) { setErr('errPmxn', el.pmxn, 'Introduce un número mayor que 0'); ok = false; } else setErr('errPmxn', el.pmxn);
    return ok ? { pPc: a, pmxn: b } : null;
  }
  function saveRates(r) { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {} }
  function loadRates() {
    try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && C.isValidRate(r.pPc) && C.isValidRate(r.pmxn)) return r; } catch (e) {}
    return C.DEFAULT_RATES;
  }
  function setRateInputs(r) { el.ppc.value = fmt(r.pPc, decOf(r.pPc)); el.pmxn.value = fmt(r.pmxn, decOf(r.pmxn)); }
  function decOf(n) { var s = String(n).split('.')[1]; return s ? s.length : 0; }

  var lastResults = {};
  function render() {
    var rates = readRates();
    if (rates) { saveRates(rates); el.derived.textContent = '1 MXN = ' + fmt(C.cupPerMxn(rates), 4) + ' CUP'; }
    else el.derived.textContent = '';
    var amt = parse(el.amount.value);
    if (amt !== null && !C.isValidNumber(amt)) setErr('errAmount', el.amount, 'Cantidad no válida (solo números positivos)');
    else setErr('errAmount', el.amount);
    var valid = rates && amt !== null && C.isValidNumber(amt);
    var res = valid ? C.convertAll(amt, from, rates) : {};
    lastResults = res;
    el.results.innerHTML = '';
    C.CURRENCIES.forEach(function (c) {
      if (c === from) return;
      var v = res[c], txt = valid ? fmt(v, C.decimalsFor(c, v)) : '—';
      var d = document.createElement('div'); d.className = 'res';
      d.innerHTML = '<div><div class="lab">' + c + '</div><div class="val">' + txt + '</div></div>' +
        '<button class="copy" type="button" aria-label="Copiar ' + c + '"' + (valid ? '' : ' disabled') + '><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>';
      d.querySelector('.copy').onclick = function () { copy(txt.replace(/,/g, '')); };
      el.results.appendChild(d);
    });
  }
  function copy(text) {
    var done = function () { el.toast.classList.add('show'); setTimeout(function () { el.toast.classList.remove('show'); }, 1200); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(t); }
  }
  function setFrom(c, keepValue) {
    from = c; el.fromTag.textContent = c;
    Array.prototype.forEach.call(el.seg.children, function (b) { var on = b.dataset.cur === c; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    render();
  }

  [el.ppc, el.pmxn, el.amount].forEach(function (i) {
    i.addEventListener('input', function () { fmtInput(i); render(); });
  });
  el.seg.addEventListener('click', function (e) { var c = e.target.dataset && e.target.dataset.cur; if (c) setFrom(c); });
  $('swap').onclick = function () {
    var order = C.CURRENCIES, next = order[(order.indexOf(from) + 1) % order.length];
    var v = lastResults[next];
    if (v !== undefined) el.amount.value = fmt(v, 6).replace(/\.?0+$/, '');
    setFrom(next);
  };
  $('clear').onclick = function () { el.amount.value = ''; render(); el.amount.focus(); };
  $('resetRates').onclick = function () { setRateInputs(C.DEFAULT_RATES); render(); };

  setRateInputs(loadRates());
  setFrom('CUP');
})();
