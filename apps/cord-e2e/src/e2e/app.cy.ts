import { getGreeting } from '../support/app.po';

describe('cord', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Cord');
  });
});
