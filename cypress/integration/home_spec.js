const faker = require('faker');
describe('home page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should have basic inputs for registering', () => {
    cy.get('#register-email-input')
      .type('andrew@varnerin.info')
      .should('have.value', 'andrew@varnerin.info')
      .and('have.attr', 'type', 'email');

    cy.get('#register-password-input')
      .type('asdf123')
      .should('have.value', 'asdf123')
      .and('have.attr', 'type', 'password');
  });

  it('should allow registering a new user', () => {
    const email = faker.internet.email();
    const password = faker.internet.password(12);

    cy.get('#register-email-input')
      .type(email);
    cy.get('#register-password-input')
      .type(password);

    cy.get('#registration-form button')
      .click();

    cy.get('#register-email-input')
      .should('have.value', email);

    cy.get('#message')
      .should('have.text', 'Registered')
      .and('have.class', 'alert-success');
  });

  it('should not allow registering with an invalid email or short password', () => {
    const email = faker.internet.email().replace('@', '');
    const password = faker.internet.password(4);

    cy.get('#register-email-input')
      .type(email);
    cy.get('#register-password-input')
      .type(password);

    cy.get('#registration-form button')
      .click();

    cy.get('#message')
      .should('contain', 'Failed')
      .and('contain', 'email')
      .and('contain', 'password')
      .and('have.class', 'alert-error');
  });

});
