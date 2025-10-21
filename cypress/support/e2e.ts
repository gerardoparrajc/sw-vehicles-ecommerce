// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// You can use this space to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

import './commands';
import 'cypress-axe';

// Comando wrapper para inyectar axe solo una vez de forma segura
let axeInjected = false;
Cypress.Commands.add('ensureAxe', () => {
  if (!axeInjected) {
    cy.injectAxe();
    axeInjected = true;
  }
});

// Comando para chequear solo impactos críticos/serios por defecto
Cypress.Commands.add('checkA11yCritical', (context?: any, options?: any) => {
  const defaultOptions = {
    includedImpacts: ['critical', 'serious']
  };
  cy.checkA11y(context, { ...defaultOptions, ...options });
});

declare global {
  namespace Cypress {
    interface Chainable {
      ensureAxe(): Chainable<void>;
      checkA11yCritical(context?: any, options?: any): Chainable<void>;
    }
  }
}
