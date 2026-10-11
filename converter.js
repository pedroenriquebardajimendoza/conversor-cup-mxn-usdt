/* Lógica matemática pura (sin DOM). */
(function (root) {
  var DEFAULTS = { cup: 730, mxn: 18.96, pCupIn: 730, usdt: 18.96, amountMxn: 2000 };

  function isValidNumber(n) { return typeof n === 'number' && isFinite(n) && n >= 0; }
  function isValidRate(n) { return typeof n === 'number' && isFinite(n) && n > 0; }

  // pmxn = CUP ÷ MXN
  function pmxn(cup, mxn) {
    if (!isValidNumber(cup) || !isValidRate(mxn)) throw new Error('Valores inválidos');
    return cup / mxn;
  }
  // pCUP = precio CUP ÷ precio USDT
  function pCup(pCupIn, usdt) {
    if (!isValidNumber(pCupIn) || !isValidRate(usdt)) throw new Error('Valores inválidos');
    return pCupIn / usdt;
  }
  // pUSDT = cantidad MXN ÷ precio USDT
  function pUsdt(amountMxn, usdt) {
    if (!isValidNumber(amountMxn) || !isValidRate(usdt)) throw new Error('Valores inválidos');
    return amountMxn / usdt;
  }

  var api = { DEFAULTS: DEFAULTS, pmxn: pmxn, pCup: pCup, pUsdt: pUsdt, isValidNumber: isValidNumber, isValidRate: isValidRate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Converter = api;
})(this);
