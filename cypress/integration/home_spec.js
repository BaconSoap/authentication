describe('home page', () => {
  it('should have basic inputs for registering', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#register-email-input')
      .type('andrew@varnerin.info')
      .should('have.value', 'andrew@varnerin.info')
      .and('have.attr', 'type', 'email');

    cy.get('#register-password-input')
      .type('asdf123')
      .should('have.value', 'asdf123')
      .and('have.attr', 'type', 'password');
  })
});
