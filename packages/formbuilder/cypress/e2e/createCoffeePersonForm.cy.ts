describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[aria-controls="radix-«r9»"] .pl-3').should('be.visible');
    cy.get('[aria-controls="radix-«r9»"] .pl-3').click();
    cy.get('[aria-controls="radix-«rd»"]').should('be.visible');
    cy.get('[aria-controls="radix-«r9»"] .pl-3').click();
    cy.get('body').click();
    cy.get('body').click();
    cy.get('#radix-«r4h»').should('be.visible');
    cy.get('#radix-«r9» > form > div:nth-child(1) > button').click({force: true});
    cy.get('body').click();
    cy.get('body').click();
    cy.get('[aria-labelledby="radix-«r6a»"]').should('be.visible');
    cy.get('body').click();
    cy.get('body').click();
    cy.get('[aria-labelledby="radix-«r7r»"]').should('be.visible');
    cy.get('body').click();
    cy.get('body').click();
    cy.get('[aria-labelledby="radix-«r9d»"]').should('be.visible');
    cy.get('form.space-y-4').click();
  })
})