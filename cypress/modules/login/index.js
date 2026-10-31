const seletores = {
  tituloFormulario: '.login-form h2',
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoLogin: '[data-qa="login-button"]',
  mensagemErro: '.login-form form p'
}

export function verificarFormularioLoginVisivel() {
  cy.get(seletores.tituloFormulario)
    .should('be.visible')
    .and('have.text', 'Login to your account')
}

export function efetuarLogin(email, senha) {
  cy.get(seletores.email).type(email)
  cy.get(seletores.senha).type(senha, { log: false })
  cy.get(seletores.botaoLogin).click()
}

export function verificarErroCredenciaisInvalidas() {
  cy.get(seletores.mensagemErro)
    .should('be.visible')
    .and('have.text', 'Your email or password is incorrect!')
}

export function verificarPaginaLogin() {
  cy.location('pathname').should('eq', '/login')
  verificarFormularioLoginVisivel()
}
