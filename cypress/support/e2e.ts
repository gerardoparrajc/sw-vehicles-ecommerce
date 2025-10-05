// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// You can use this space to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

import './commands';

// Axe for accessibility (if installed)
// You can install with: npm install --save-dev cypress-axe axe-core
try {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { injectAxe } = require('cypress-axe');
  // Provide helper commands only if available
  Cypress.Commands.add('injectAxe', () => injectAxe());
} catch (_) {
  // cypress-axe not installed; skip
}
