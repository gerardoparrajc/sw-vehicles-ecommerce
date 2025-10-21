describe('Cart functionality', () => {
  beforeEach(() => {
    // Limpiar almacenamiento antes de que arranque la app (evita estado residual entre tests)
    cy.visit('/vehicles', {
      onBeforeLoad: (win) => {
        win.localStorage.clear();
      }
    });
  });

  it('increments cart count when adding the same vehicle multiple times', () => {
    cy.getByCy('add-to-cart-btn').first().click();
    cy.getByCy('cart-count').should('contain', '1');
    cy.getByCy('add-to-cart-btn').first().click();
    cy.getByCy('cart-count').should('contain', '2');
  });

  it('increments cart count when adding two different vehicles', () => {
    cy.getByCy('add-to-cart-btn').eq(0).click();
    cy.getByCy('add-to-cart-btn').eq(1).click();
    cy.getByCy('cart-count').should('contain', '2');
  });
});
