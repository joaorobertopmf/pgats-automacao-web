const seletores = {
  enderecoEntrega: '#address_delivery',
  enderecoCobranca: '#address_invoice',
  revisaoPedido: '#cart_info',
  itemPedido: (idProduto) => `#cart_info tr#product-${idProduto}`,
  comentario: 'textarea[name="message"]',
  botaoFazerPedido: 'a[href="/payment"]',

  formularioPagamento: '#payment-form',
  nomeNoCartao: '[data-qa="name-on-card"]',
  numeroCartao: '[data-qa="card-number"]',
  cvc: '[data-qa="cvc"]',
  mesValidade: '[data-qa="expiry-month"]',
  anoValidade: '[data-qa="expiry-year"]',
  botaoPagar: '[data-qa="pay-button"]',
  mensagemSucesso: '#success_message',
  pedidoConfirmado: '[data-qa="order-placed"]'
}

function verificarEndereco(seletor, usuario) {
  cy.get(seletor).should('be.visible').within(() => {
    cy.get('.address_firstname').should('contain.text', `${usuario.firstName} ${usuario.lastName}`)
    cy.get('.address_address1').should('contain.text', usuario.company)
    cy.get('.address_address1').should('contain.text', usuario.address1)
    cy.get('.address_address2').should('contain.text', usuario.address2)
    cy.get('.address_city').should('contain.text', usuario.city)
    cy.get('.address_city').should('contain.text', usuario.state)
    cy.get('.address_city').should('contain.text', usuario.zipcode)
    cy.get('.address_country_name').should('have.text', usuario.country)
    cy.get('.address_phone').should('have.text', usuario.mobileNumber)
  })
}

export function verificarEnderecoERevisaoDoPedido(usuario, idsProdutos) {
  cy.location('pathname').should('eq', '/checkout')
  verificarEndereco(seletores.enderecoEntrega, usuario)
  verificarEndereco(seletores.enderecoCobranca, usuario)

  cy.get(seletores.revisaoPedido).should('be.visible')
  idsProdutos.forEach((idProduto) => {
    cy.get(seletores.itemPedido(idProduto)).should('be.visible')
  })
}

export function fazerPedido(comentario) {
  cy.get(seletores.comentario).type(comentario)
  cy.get(seletores.botaoFazerPedido).click()
}

export function preencherPagamento(cartao) {
  cy.location('pathname').should('eq', '/payment')
  cy.get(seletores.nomeNoCartao).type(cartao.nameOnCard)
  cy.get(seletores.numeroCartao).type(cartao.number, { log: false })
  cy.get(seletores.cvc).type(cartao.cvc, { log: false })
  cy.get(seletores.mesValidade).type(cartao.expiryMonth)
  cy.get(seletores.anoValidade).type(cartao.expiryYear)
}

// a mensagem de sucesso aparece e a página já redireciona, então seguro o
// primeiro submit pra conseguir validar e depois clico de novo pra finalizar
export function confirmarPagamento() {
  const segurarEnvio = (evento) => evento.preventDefault()

  cy.get(seletores.formularioPagamento).then(($form) => {
    $form[0].addEventListener('submit', segurarEnvio)
  })
  cy.get(seletores.botaoPagar).click()

  cy.get(seletores.mensagemSucesso)
    .should('be.visible')
    .and('contain.text', 'Your order has been placed successfully!')

  cy.get(seletores.formularioPagamento).then(($form) => {
    $form[0].removeEventListener('submit', segurarEnvio)
  })
  cy.get(seletores.botaoPagar).click()
}

export function verificarPedidoConfirmado() {
  cy.location('pathname').should('match', /^\/payment_done/)
  cy.get(seletores.pedidoConfirmado)
    .should('be.visible')
    .and('have.text', 'Order Placed!')
  cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible')
}
