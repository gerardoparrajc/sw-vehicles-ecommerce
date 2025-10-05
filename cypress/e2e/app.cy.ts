describe('Star Wars Vehicles E-commerce', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page', () => {
    cy.contains('Vehículos de Star Wars');
    cy.contains('Explora la galaxia');
  });

  it('should navigate to vehicles page', () => {
    cy.getByCy('vehicles-link').click();
    cy.url().should('include', '/vehicles');
    cy.contains('Vehículos de Star Wars');
  });

  it('should be able to add items to cart', () => {
    cy.visit('/vehicles');
    cy.getByCy('add-to-cart-btn').first().click();
    cy.getByCy('cart-count').should('contain', '1');
  });

  it('should display cart page', () => {
    cy.getByCy('cart-link').click();
    cy.url().should('include', '/cart');
  });

  it('should be accessible (critical/serious)', () => {
    cy.ensureAxe();
    cy.checkA11yCritical();
  });
});
