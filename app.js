/* Interfaz: lee los campos, llama a Converter y pinta resultados al instante. */
(function () {
  var C = window.Converter, KEY = 'conversor-tasas-v3';
  var $ = function (id) { return document.getElementById(id); };
  var FIELDS = ['cup', 'mxn', 'pCupIn', 'usdt', 'amountMxn']; var SAVED = ['cup', 'mxn', 'pCupIn', 'usdt'];
  var ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var outputs = {};

  function parse(str) {
    var s = String(str).trim().replace(/[\s,]/g, '');
    if (s === '') return null;
    if (!/^\d*\.?\d*$/.test(s) || s === '.') return NaN;
    return parseFloat(s);
  }
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function fmtRaw(n) { var d = String(n).split('.')[1]; return fmt(n, d ? d.length : 0); }
  function fmtInput(input) {
    var raw = input.value.replace(/,/g, ''), m = raw.match(/^(\d*)(\.\d*)?$/);
    if (!m) return;
    var pos = input.selectionStart, before = input.value.length;
    input.value = (m[1] ? Number(m[1]).toLocaleString('en-US') : '') + (m[2] || '');
    var p = Math.max(0, pos + input.value.length - before);
    try { input.setSelectionRange(p, p); } catch (e) {}
  }
  function check(id, mustBePositive) {
    var v = parse($(id).value), msg = '';
    if (v === null) msg = id === 'amountMxn' ? '' : 'Campo requerido';
    else if (mustBePositive ? !C.isValidRate(v) : !C.isValidNumber(v)) msg = mustBePositive ? 'Introduce un número mayor que 0' : 'Solo números positivos';
    $('err-' + id).textContent = msg; $(id).classList.toggle('invalid', !!msg);
    return msg || v === null ? null : v;
  }
  function show(key, val, dec) {
    outputs[key] = val === null ? null : fmt(val, dec);
    $('out-' + key).textContent = outputs[key] === null ? '—' : outputs[key];
  }
  function render() {
    var cup = check('cup', false), mxn = check('mxn', true), pCupIn = check('pCupIn', false), usdt = check('usdt', true), amt = check('amountMxn', false);
    show('pmxn', cup !== null && mxn !== null ? C.pmxn(cup, mxn) : null, 4);
    show('pCup', pCupIn !== null && usdt !== null ? C.pCup(pCupIn, usdt) : null, 4);
    show('pUsdt', amt !== null && usdt !== null ? C.pUsdt(amt, usdt) : null, 3);
    var save = {};
    SAVED.forEach(function (k) { save[k] = $(k).value; });
    try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {}
  }
  function setDefaults(keys) { keys.forEach(function (k) { $(k).value = fmtRaw(C.DEFAULTS[k]); }); }
  function copy(text) {
    var done = function () { $('toast').classList.add('show'); setTimeout(function () { $('toast').classList.remove('show'); }, 1200); };
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(t); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  FIELDS.forEach(function (k) { $(k).addEventListener('input', function () { fmtInput($(k)); render(); }); });
  Array.prototype.forEach.call(document.querySelectorAll('.copy'), function (b) {
    b.innerHTML = ICON;
    b.onclick = function () { var v = outputs[b.dataset.copy]; if (v) copy(v.replace(/,/g, '')); };
  });
  $('clear').onclick = function () { $('amountMxn').value = ''; render(); $('amountMxn').focus(); };
  $('reset').onclick = function () { setDefaults(SAVED); render(); };

  setDefaults(FIELDS);
  try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) SAVED.forEach(function (k) { if (s[k]) $(k).value = s[k]; }); } catch (e) {}
  render();
})();
