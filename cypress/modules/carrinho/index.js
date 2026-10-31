const seletores = {
  tabelaCarrinho: '#cart_info_table',
  itemCarrinho: (idProduto) => `#cart_info_table tr#product-${idProduto}`,
  botaoFinalizarCompra: '.check_out'
}

export function verificarCarrinhoComProdutos(idsProdutos) {
  cy.location('pathname').should('eq', '/view_cart')
  cy.get(seletores.tabelaCarrinho).should('be.visible')
  idsProdutos.forEach((idProduto) => {
    cy.get(seletores.itemCarrinho(idProduto)).should('be.visible')
  })
}

export function prosseguirParaCheckout() {
  cy.get(seletores.botaoFinalizarCompra)
    .should('be.visible')
    .and('contain.text', 'Proceed To Checkout')
    .click()
}
