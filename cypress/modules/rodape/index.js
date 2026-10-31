const seletores = {
  rodape: '#footer',
  tituloInscricao: '#footer .single-widget h2',
  emailInscricao: '#susbscribe_email',
  botaoInscricao: '#subscribe',
  mensagemSucesso: '#success-subscribe'
}

export function rolarAteORodape() {
  cy.get(seletores.rodape).scrollIntoView()
  cy.get(seletores.rodape).should('be.visible')
}

export function verificarSecaoInscricaoVisivel() {
  cy.get(seletores.tituloInscricao)
    .should('be.visible')
    .and('have.text', 'Subscription')
}

export function inscreverEmail(email) {
  cy.get(seletores.emailInscricao).type(email)
  cy.get(seletores.botaoInscricao).click()
}

export function verificarInscricaoRealizada() {
  cy.get(seletores.mensagemSucesso)
    .should('be.visible')
    .and('contain.text', 'You have been successfully subscribed!')
}
