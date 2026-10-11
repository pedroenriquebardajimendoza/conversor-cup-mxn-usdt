/* Lógica matemática pura (sin DOM). USDT es la moneda puente. */
(function (root) {
  var CURRENCIES = ['CUP', 'MXN', 'USDT'];
  var DEFAULT_RATES = { pPc: 730, pmxn: 18.96 }; // pPc = CUP por 1 USDT, pmxn = MXN por 1 USDT

  function isValidNumber(n) { return typeof n === 'number' && isFinite(n) && n >= 0; }
  function isValidRate(n) { return typeof n === 'number' && isFinite(n) && n > 0; }

  function unitsPerUsdt(currency, rates) {
    if (currency === 'USDT') return 1;
    if (currency === 'CUP') return rates.pPc;
    if (currency === 'MXN') return rates.pmxn;
    throw new Error('Moneda desconocida: ' + currency);
  }

  function convert(amount, from, to, rates) {
    if (!isValidNumber(amount)) throw new Error('Cantidad inválida');
    if (!isValidRate(rates.pPc) || !isValidRate(rates.pmxn)) throw new Error('Tasa inválida');
    var usdt = amount / unitsPerUsdt(from, rates);
    return usdt * unitsPerUsdt(to, rates);
  }

  function convertAll(amount, from, rates) {
    var out = {};
    CURRENCIES.forEach(function (c) { if (c !== from) out[c] = convert(amount, from, c, rates); });
    return out;
  }

  function cupPerMxn(rates) { return rates.pPc / rates.pmxn; }

  function decimalsFor(currency, value) {
    if (currency === 'USDT') return value !== 0 && Math.abs(value) < 1 ? 6 : 3;
    return value !== 0 && Math.abs(value) < 1 ? 4 : 2;
  }

  var api = { CURRENCIES: CURRENCIES, DEFAULT_RATES: DEFAULT_RATES, convert: convert,
    convertAll: convertAll, cupPerMxn: cupPerMxn, isValidNumber: isValidNumber,
    isValidRate: isValidRate, decimalsFor: decimalsFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Converter = api;
})(this);
