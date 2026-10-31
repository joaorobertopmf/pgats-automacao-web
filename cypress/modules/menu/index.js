const seletores = {
  slider: '#slider',
  linkHome: '.shop-menu a[href="/"]',
  linkProdutos: '.shop-menu a[href="/products"]',
  linkCarrinho: '.shop-menu a[href="/view_cart"]',
  linkLogin: '.shop-menu a[href="/login"]',
  linkLogout: '.shop-menu a[href="/logout"]',
  linkExcluirConta: '.shop-menu a[href="/delete_account"]',
  usuarioLogado: '.shop-menu li:has(.fa-user)'
}

export function acessarHome() {
  cy.visit('/')
}

export function verificarHomeVisivel() {
  cy.title().should('eq', 'Automation Exercise')
  cy.get(seletores.slider).should('be.visible')
  cy.get(seletores.linkHome).should('have.attr', 'style').and('include', 'orange')
}

export function navegarParaLogin() {
  cy.get(seletores.linkLogin).click()
}

export function navegarParaProdutos() {
  cy.get(seletores.linkProdutos).click()
}

export function navegarParaCarrinho() {
  cy.get(seletores.linkCarrinho).click()
}

export function efetuarLogout() {
  cy.get(seletores.linkLogout).should('be.visible').click()
}

export function excluirConta() {
  cy.get(seletores.linkExcluirConta).should('be.visible').click()
}

export function verificarUsuarioLogado(nome) {
  cy.get(seletores.usuarioLogado)
    .should('be.visible')
    .and('contain.text', `Logged in as ${nome}`)
}

export function verificarUsuarioDeslogado() {
  cy.get(seletores.linkLogout).should('not.exist')
  cy.get(seletores.linkLogin).should('contain.text', 'Signup / Login')
}
