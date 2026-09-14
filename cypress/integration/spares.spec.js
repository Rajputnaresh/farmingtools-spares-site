describe('KrishiGears Spares UI', () => {
  beforeEach(() => {
    cy.visit('http://localhost:64729?dev=true');
  });

  it('renders stock gauge with correct classes', () => {
    cy.get('.part-stock-gauge').should('exist');
    cy.get('.gauge-in, .gauge-chain, .gauge-out').should('have.length.at.least', 1);
  });

  it('disables Generate PO when any line is out of stock', () => {
    cy.get('.stock-out').first().then(($el) => {
      if ($el.length) {
        cy.get('button.generate-po').should('be.disabled');
      } else {
        cy.get('button.generate-po').should('not.be.disabled');
      }
    });
  });

  it('language toggle switches UI text', () => {
    cy.get('[data-lang="hi"]').click();
    cy.contains('भुगतान');
    cy.get('[data-lang="mr"]').click();
    cy.contains('पेमेंट');
  });
});
