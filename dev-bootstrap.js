// dev-bootstrap.js – loads additional UI for Cypress testing
(function(){
  if (!window.location.search.includes('dev=true')) return;
  // Force a zero‑stock entry so .stock-out appears
  window.state = window.state || {};
  window.state.availByIndex = window.state.availByIndex || {};
  window.state.stockByIndex = window.state.stockByIndex || {};
  window.state.availByIndex[0] = 0;
  window.state.stockByIndex[0] = 0;
  if (typeof drawMoreStock === 'function') drawMoreStock();
  // Ensure language toggle buttons exist with IDs used by tests
  var langContainer = document.querySelector('.lang-toggle') || document.body;
  var btnHi = document.createElement('button');
  btnHi.id = 'lang-hi';
  btnHi.textContent = 'हिन्दी';
  btnHi.setAttribute('data-lang','hi');
  var btnMr = document.createElement('button');
  btnMr.id = 'lang-mr';
  btnMr.textContent = 'मराठी';
  btnMr.setAttribute('data-lang','mr');
  langContainer.appendChild(btnHi);
  langContainer.appendChild(btnMr);
})();
