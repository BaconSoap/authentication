const faker = require('faker');
describe('registration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should allow registering a new user', () => {
    fillRegisterEmailPassword();

    clickRegister();
    verifyRegistered();

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
    const { email, password } = fillRegisterEmailPassword();
    clickRegister();

    verifyRegistered();

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

describe('logging in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('doesn\'t allow logging in with an incorrect password', () => {
    const { email, password } = fillRegisterEmailPassword();
    clickRegister();
    verifyRegistered();

    fillLoginEmailPassword(email, password + '2');
    clickLogin();

    verifyNotLoggedIn();
  });

  it('allows logging in with correct info', () => {
    const { email, password } = fillRegisterEmailPassword();
    clickRegister();
    verifyRegistered();

    fillLoginEmailPassword(email, password);
    clickLogin();

    verifyLoggedIn();
  });
});

function verifyRegistered() {
  cy.get('#message')
    .should('have.text', 'Registered')
    .and('have.class', 'alert-success');
}

function clickRegister() {
  cy.get('#registration-form button')
    .click();
}

function clickLogin() {
  cy.get('#login-form button')
    .click();
}

function fillRegisterEmailPassword() {
  const email = faker.internet.email();
  const password = faker.internet.password(12);
  cy.get('#register-email-input')
    .type(email);
  cy.get('#register-password-input')
    .type(password);

  return { email, password };
}


function fillLoginEmailPassword(email, password) {
  cy.get('#login-email-input')
    .type(email);
  cy.get('#login-password-input')
    .type(password);
}

function verifyLoggedIn() {
  cy.get('#login-message')
    .should('contain', 'Logged in')
    .and('have.class', 'alert-success');
}

function verifyNotLoggedIn() {
  cy.get('#login-message')
    .should('contain', 'email')
    .and('contain', 'password')
    .and('have.class', 'alert-error');
}
