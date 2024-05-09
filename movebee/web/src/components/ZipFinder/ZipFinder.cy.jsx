import React from 'react'
import ZipFinder from './ZipFinder'

describe('<ZipFinder />', () => {

  beforeEach(() => {
    cy.mount(<ZipFinder />)

    cy.viewport(1280, 768 )

    cy.get('[data-cy=inputCep]').as('inputCep')
    cy.get('[data-cy=submitCep]').as('submitCep')

  });


  it('Deve buscar um Ceo na area de cobertura', () => {

    const address = {
      street: 'Rua Joaquim Floriano',
      district: 'Itaim Bibi',
      city: 'São Paulo/SP',
      Zip: '04534-011'
    }

    cy.intercept('GET', '/zip/*', {
       statusCode: 200,
       body: {
        cep: address.Zip,
        logradouro:address.street,
        cidade_uf: address.city,
        bairro:address.district
       }
    })

    cy.mount(<ZipFinder />)

    cy.get('[data-cy=inputCep]').type(address.Zip)
    cy.get('[data-cy=submitCep]').click()


    cy.get('[data-cy=street]')
      .should('have.text', address.street)

    cy.get('[data-cy=district]')
      .should('have.text', address.district)


    cy.get('[data-cy=city]')
      .should('have.text', address.city)


    cy.get('[data-cy=Zip]')
      .should('have.text', address.Zip)



  })


  it('CEP deve ser obrgatório', () => {
      

     cy.get('@submitCep').click()
    

    cy.get('#swal2-title')
      .should('have.text','Preencha algum CEP')


  });

  it('Cep Inválido', () => {
     
      const zipcode = '000000'
      
      cy.get('@inputCep').type(zipcode)
      cy.get('@submitCep').click()

      cy.get('[data-cy="notice"]')
        .should('be.visible')
        .should('have.text','CEP no formato inválido.')

  });


  it('Cep Fora da área de cobertura', () => {
     
    const zipcode = '75083460'
    
    cy.get('@inputCep').type(zipcode)
    cy.get('@submitCep').click()

    cy.get('[data-cy="notice"]')
      .should('be.visible')
      .should('have.text','No momento não atendemos essa região.')

});

})




