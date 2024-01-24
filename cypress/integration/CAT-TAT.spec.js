/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', () => {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(3, () => {
        it('preenche os campos obrigatórios e envia o formulário', () => {
            cy.get('#firstName').type('Rafael')
            cy.get('#lastName').type('Bomfim')
            cy.get('#email').type('teste@teste.com')
            cy.get('#open-text-area').type('Esse é um teste de texto para o campo ajuda, com bastante caracteres para testar o delay zerado, sabendo que o default do Cypress é 10 e eu estou mudando para 0', {delay: 0})
            cy.clock()
            cy.contains('button', 'Enviar').click()
            cy.get('.success').should('be.visible')
            cy.tick(3000)
            cy.get('.success').should('not.be.visible')
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Rafael')
        cy.get('#lastName').type('Bomfim')
        cy.get('#email').type('teste.teste.com')
        cy.get('#open-text-area').type('teste')
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('validar valor não-numérico no telefone', () => {
        cy.get('#phone').type('abc').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Rafael')
        cy.get('#lastName').type('Bomfim')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Rafael').should('have.value', 'Rafael').clear().should('have.value', '')
        cy.get('#lastName').type('Bomfim').should('have.value', 'Bomfim').clear().should('have.value', '')
        cy.get('#email').type('teste@teste.com').should('have.value', 'teste@teste.com').clear().should('have.value', '')
        cy.get('#phone').type('12345678').should('have.value', '12345678').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type=radio][value=feedback]').check().should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]').each(radio => {
            cy.wrap(radio).check().should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#check input[type=checkbox]').check().should('be.checked').last().uncheck().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload').should('not.have.value').selectFile('cypress/fixtures/example.json').then(input => {
            expect(input[0].files[0].name).to.eq('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload').should('not.have.value').selectFile('cypress/fixtures/example.json', { action: "drag-drop" }).then(input => {
            expect(input[0].files[0].name).to.eq('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('exampleFile')
        cy.get('#file-upload').selectFile('@exampleFile').then(input => {
            expect(input[0].files[0].name).to.eq('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a:contains(Política de Privacidade)').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('a:contains(Política de Privacidade)').invoke('removeAttr', 'target').click()
        cy.get('#title').should('contain.text', 'CAC TAT - Política de privacidade')
    })
})