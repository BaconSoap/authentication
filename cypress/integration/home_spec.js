const faker = require('faker');
describe('home page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should allow registering a new user', () => {
    fillEmailPassword();

    clickRegister();

    cy.get('#message')
      .should('have.text', 'Registered')
      .and('have.class', 'alert-success');

    cy.get('#register-email-input')
      .should('have.value', '');
    cy.get('#register-password-input')
      .should('have.value', '');
  });

  it('should not allow registering with an invalid email or short password', () => {
    const email = faker.internet.email().replace('@', '');
    const password = faker.internet.password(4);

    cy.get('#register-email-input')
      .type(email);
    cy.get('#register-password-input')
      .type(password);

    clickRegister();

    cy.get('#message')
      .should('contain', 'Failed')
      .and('contain', 'email')
      .and('contain', 'password')
      .and('have.class', 'alert-error');

    cy.get('#register-email-input')
      .should('have.value', email);
    cy.get('#register-password-input')
      .should('have.value', password);

  });

  it('should not allow registering the same email twice', () => {
    const { email, password } = fillEmailPassword();
    clickRegister();

    cy.get('#message')
      .should('have.text', 'Registered')
      .and('have.class', 'alert-success');

    cy.get('#register-email-input')
      .type(email);
    cy.get('#register-password-input')
      .type(password);

    clickRegister();

    cy.get('#message')
      .should('contain', 'Failed')
      .and('contain', 'email')
      .and('contain', 'already');
  });

});

function clickRegister() {
  cy.get('#registration-form button')
    .click();
}

function fillEmailPassword() {
  const email = faker.internet.email();
  const password = faker.internet.password(12);
  cy.get('#register-email-input')
    .type(email);
  cy.get('#register-password-input')
    .type(password);

  return { email, password };
}
