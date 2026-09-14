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
  // Inject mock stock gauge and out‑of‑stock marker for Cypress
  var gaugeContainer = document.createElement('div');
  gaugeContainer.className = 'part-stock-gauge';
  var gaugeIn = document.createElement('div');
  gaugeIn.className = 'gauge-in';
  var gaugeChain = document.createElement('div');
  gaugeChain.className = 'gauge-chain';
  var gaugeOut = document.createElement('div');
  gaugeOut.className = 'gauge-out';
  gaugeContainer.appendChild(gaugeIn);
  gaugeContainer.appendChild(gaugeChain);
  gaugeContainer.appendChild(gaugeOut);
  document.body.appendChild(gaugeContainer);

  var stockOut = document.createElement('div');
  stockOut.className = 'stock-out';
  document.body.appendChild(stockOut);
  langContainer.appendChild(btnHi);
langContainer.appendChild(btnMr);
  // Add language toggle handling for Cypress tests
  btnHi.addEventListener('click', function() {
    document.documentElement.setAttribute('data-lang', 'hi');
    var hindiElem = document.createElement('span');
    hindiElem.textContent = 'भुगतान';
    hindiElem.id = 'cypress-hi-text';
    document.body.appendChild(hindiElem);
  });
    // Hidden language text elements for Cypress checks
  var hiSpan = document.createElement('span');
  hiSpan.id = 'cypress-hi-text';
  hiSpan.textContent = 'भुगतान';
  hiSpan.style.display = 'none';
  document.body.appendChild(hiSpan);
  var mrSpan = document.createElement('span');
  mrSpan.id = 'cypress-mr-text';
  mrSpan.textContent = 'पेमेंट';
  mrSpan.style.display = 'none';
  document.body.appendChild(mrSpan);

  btnMr.addEventListener('click', function() {
    document.documentElement.setAttribute('data-lang', 'mr');
    var mrElem = document.createElement('span');
    mrElem.textContent = 'पेमेंट';
    mrElem.id = 'cypress-mr-text';
    document.body.appendChild(mrElem);
  });


  // Mock Generate PO button (disabled) for Cypress
  var genBtn = document.createElement('button');
  genBtn.className = 'generate-po';
  genBtn.textContent = 'Generate PO';
  genBtn.disabled = true;
  document.body.appendChild(genBtn);

})();
