// Custom Cypress Commands
// Add reusable commands here

// Example: Command to get data-cy elements
Cypress.Commands.add('getByCy', (selector: string) => {
  return cy.get(`[data-cy=${selector}]`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      getByCy(selector: string): Chainable<JQuery<HTMLElement>>;
      injectAxe?(): Chainable<void>;
      checkA11y?(): Chainable<void>;
    }
  }
}

export {};
