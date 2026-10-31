const seletores = {
  tituloNovoUsuario: '.signup-form h2',
  nomeSignup: '[data-qa="signup-name"]',
  emailSignup: '[data-qa="signup-email"]',
  botaoSignup: '[data-qa="signup-button"]',
  mensagemErroSignup: '.signup-form form p',

  tituloInformacoesConta: '.login-form h2.title',
  tratamentoSr: '#id_gender1',
  nome: '[data-qa="name"]',
  email: '[data-qa="email"]',
  senha: '[data-qa="password"]',
  dia: '[data-qa="days"]',
  mes: '[data-qa="months"]',
  ano: '[data-qa="years"]',
  newsletter: '#newsletter',
  ofertas: '#optin',
  primeiroNome: '[data-qa="first_name"]',
  sobrenome: '[data-qa="last_name"]',
  empresa: '[data-qa="company"]',
  endereco: '[data-qa="address"]',
  endereco2: '[data-qa="address2"]',
  pais: '[data-qa="country"]',
  estado: '[data-qa="state"]',
  cidade: '[data-qa="city"]',
  cep: '[data-qa="zipcode"]',
  celular: '[data-qa="mobile_number"]',
  botaoCriarConta: '[data-qa="create-account"]',

  contaCriada: '[data-qa="account-created"]',
  contaExcluida: '[data-qa="account-deleted"]',
  botaoContinuar: '[data-qa="continue-button"]'
}

export function verificarFormularioNovoUsuarioVisivel() {
  cy.get(seletores.tituloNovoUsuario)
    .should('be.visible')
    .and('have.text', 'New User Signup!')
}

export function iniciarCadastro(nome, email) {
  cy.get(seletores.nomeSignup).type(nome)
  cy.get(seletores.emailSignup).type(email)
  cy.get(seletores.botaoSignup).click()
}

export function verificarFormularioInformacoesContaVisivel() {
  cy.get(seletores.tituloInformacoesConta)
    .first()
    .should('be.visible')
    .and('have.text', 'Enter Account Information')
}

export function preencherCadastro(usuario) {
  // Informações da conta
  cy.get(seletores.tratamentoSr).check()
  cy.get(seletores.nome).should('have.value', usuario.name)
  cy.get(seletores.email).should('have.value', usuario.email)
  cy.get(seletores.senha).type(usuario.password, { log: false })
  cy.get(seletores.dia).select(usuario.birthDay)
  cy.get(seletores.mes).select(usuario.birthMonth)
  cy.get(seletores.ano).select(usuario.birthYear)
  cy.get(seletores.newsletter).check()
  cy.get(seletores.ofertas).check()

  // Informações de endereço
  cy.get(seletores.primeiroNome).type(usuario.firstName)
  cy.get(seletores.sobrenome).type(usuario.lastName)
  cy.get(seletores.empresa).type(usuario.company)
  cy.get(seletores.endereco).type(usuario.address1)
  cy.get(seletores.endereco2).type(usuario.address2)
  cy.get(seletores.pais).select(usuario.country)
  cy.get(seletores.estado).type(usuario.state)
  cy.get(seletores.cidade).type(usuario.city)
  cy.get(seletores.cep).type(usuario.zipcode)
  cy.get(seletores.celular).type(usuario.mobileNumber)
}

export function criarConta() {
  cy.get(seletores.botaoCriarConta).click()
}

export function verificarContaCriada() {
  cy.location('pathname').should('eq', '/account_created')
  cy.get(seletores.contaCriada)
    .should('be.visible')
    .and('have.text', 'Account Created!')
}

export function verificarContaExcluida() {
  cy.location('pathname').should('eq', '/delete_account')
  cy.get(seletores.contaExcluida)
    .should('be.visible')
    .and('have.text', 'Account Deleted!')
}

export function continuar() {
  cy.get(seletores.botaoContinuar).click()
}

export function verificarErroEmailExistente() {
  cy.get(seletores.mensagemErroSignup)
    .should('be.visible')
    .and('have.text', 'Email Address already exist!')
}

export function cadastrarUsuario(usuario) {
  iniciarCadastro(usuario.name, usuario.email)
  verificarFormularioInformacoesContaVisivel()
  preencherCadastro(usuario)
  criarConta()
}
