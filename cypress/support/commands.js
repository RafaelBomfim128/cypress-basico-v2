Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Rafael')
    cy.get('#lastName').type('Bomfim')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})