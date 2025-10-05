describe('Star Wars Vehicles E-commerce', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page', () => {
    cy.contains('Vehículos de Star Wars');
    cy.contains('Explora la galaxia');
  });

  it('should navigate to vehicles page', () => {
    cy.get('[data-cy=vehicles-link]').click();
    cy.url().should('include', '/vehicles');
    cy.contains('Vehículos de Star Wars');
  });

  it('should be able to add items to cart', () => {
    cy.visit('/vehicles');
    cy.get('[data-cy=add-to-cart-btn]').first().click();
    cy.get('[data-cy=cart-count]').should('contain', '1');
  });

  it('should display cart page', () => {
    cy.get('[data-cy=cart-link]').click();
    cy.url().should('include', '/cart');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
});
