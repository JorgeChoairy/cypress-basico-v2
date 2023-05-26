Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() { 
    cy.get('#firstName').type('Jorge')
    cy.get('#lastName').type('Choairy')
    cy.get('#email').type('choairy@gmail.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

})