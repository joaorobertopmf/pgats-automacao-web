// cria o usuário pela API pra não depender da tela de cadastro nos testes de login
Cypress.Commands.add('criarUsuarioViaApi', (usuario) => {
  cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    body: {
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      title: usuario.title,
      birth_date: usuario.birthDay,
      birth_month: usuario.birthMonthNumber,
      birth_year: usuario.birthYear,
      firstname: usuario.firstName,
      lastname: usuario.lastName,
      company: usuario.company,
      address1: usuario.address1,
      address2: usuario.address2,
      country: usuario.country,
      zipcode: usuario.zipcode,
      state: usuario.state,
      city: usuario.city,
      mobile_number: usuario.mobileNumber
    }
  }).then((response) => {
    const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
    expect(body.responseCode, 'usuário criado via API').to.eq(201)
  })
})

Cypress.Commands.add('deletarUsuarioViaApi', (usuario) => {
  cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email: usuario.email, password: usuario.password },
    failOnStatusCode: false
  })
})
