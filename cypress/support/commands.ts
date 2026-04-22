declare global {
  namespace Cypress {
    interface Chainable {
      getBurgerConstructor(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getBurgerConstructor', () =>
  cy.get('[data-cy="burger-constructor"]')
);

export {};
