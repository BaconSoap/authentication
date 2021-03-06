import { internet } from 'faker';

let jwt = '';

before(() => {
  const email = internet.email();
  const password = internet.password(24);

  cy.request('POST', 'http://localhost:3001/api/users', { email, password });
  cy.request('POST', 'http://localhost:3001/api/users/login', { email, password }).then(res => {
    jwt = res.body.jwt;
  });
});

describe('registration', () => {

  beforeEach(() => {
    console.log(jwt);
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
    const email = internet.email().replace('@', '');
    const password = internet.password(4);

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
    verifyLoginFailedMessage();
  });

  it('allows logging in with correct info', () => {
    const { email, password } = fillRegisterEmailPassword();
    clickRegister();
    verifyRegistered();

    fillLoginEmailPassword(email, password);
    clickLogin();

    verifyLoginMessage();
    verifyLoggedIn(email);
  });
});

describe('logging out', () => {
  it('works', () => {
    cy.visit('http://localhost:3000/');

    const { email, password } = fillRegisterEmailPassword();

    clickRegister();
    verifyRegistered();

    fillLoginEmailPassword(email, password);
    clickLogin();

    verifyLoginMessage();
    verifyLoggedIn(email);

    clickLogOut();
    verifyNotLoggedIn();
  })
});

describe('loading from stored jwt', () => {
  it('works', () => {
    const { email } = preloadUser();

    cy.visit('http://localhost:3000/');

    verifyLoggedIn(email);
  });
});

describe('authenticated requests', () => {
  it('works', () => {
    const { email, sub } = preloadUser();

    cy.visit('http://localhost:3000/');
    cy.get('#load-user-info')
      .click();

    cy.get('#user-info')
      .should('contain', email)
      .and('contain', sub);
  });
});

function preloadUser() {
  localStorage.setItem('login_jwt', jwt);
  const { email, sub } = JSON.parse(atob(jwt.split('.')[1]));
  return { email, sub };
}

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

function clickLogOut() {
  cy.get('#logout')
    .click();
}

function fillRegisterEmailPassword() {
  const email = internet.email();
  const password = internet.password(12);
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

function verifyLoginMessage() {
  cy.get('#login-message')
    .should('contain', 'Logged in')
    .and('have.class', 'alert-success');
}

function verifyLoggedIn(email) {
  cy.get('.user-info-bar-text')
    .should('contain', email);
}

function verifyLoginFailedMessage() {
  cy.get('#login-message')
    .should('contain', 'email')
    .and('contain', 'password')
    .and('have.class', 'alert-error');
}

function verifyNotLoggedIn() {
  cy.get('.user-info-bar-text')
    .should('contain', 'Not logged in');
}
