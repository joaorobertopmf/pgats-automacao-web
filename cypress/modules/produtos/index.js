const seletores = {
  tituloLista: '.features_items h2.title',
  cardProduto: '.features_items .product-image-wrapper',
  nomeProduto: '.productinfo p',
  linkVerProduto: '.choose a[href^="/product_details/"]',
  campoPesquisa: '#search_product',
  botaoPesquisa: '#submit_search',
  detalhesProduto: '.product-information',
  adicionarAoCarrinho: (idProduto) => `.features_items .productinfo [data-product-id="${idProduto}"]`,
  modalCarrinho: '#cartModal',
  botaoContinuarComprando: '#cartModal .close-modal'
}

export function verificarPaginaTodosProdutos() {
  cy.location('pathname').should('eq', '/products')
  cy.title().should('eq', 'Automation Exercise - All Products')
  cy.get(seletores.tituloLista)
    .should('be.visible')
    .and('have.text', 'All Products')
}

export function verificarListaDeProdutosVisivel() {
  cy.get(seletores.cardProduto)
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
}

export function acessarPrimeiroProduto() {
  cy.get(seletores.linkVerProduto).first().click()
}

export function verificarDetalhesDoProduto() {
  cy.location('pathname').should('match', /^\/product_details\/\d+$/)

  cy.get(seletores.detalhesProduto).should('be.visible').within(() => {
    cy.get('h2').should('be.visible').and('not.be.empty')
    cy.contains('p', 'Category:').should('be.visible')
    cy.contains('span', /Rs\. \d+/).should('be.visible')
    cy.contains('p', 'Availability:').should('be.visible')
    cy.contains('p', 'Condition:').should('be.visible')
    cy.contains('p', 'Brand:').should('be.visible')
  })
}

export function pesquisarProduto(termo) {
  cy.get(seletores.campoPesquisa).type(termo)
  cy.get(seletores.botaoPesquisa).click()
}

export function verificarResultadoDaPesquisa(termo) {
  cy.location('search').should('eq', `?search=${termo}`)
  cy.get(seletores.tituloLista)
    .should('be.visible')
    .and('have.text', 'Searched Products')

  cy.get(seletores.cardProduto).should('have.length.greaterThan', 0)
  cy.get(seletores.nomeProduto).each(($nome) => {
    cy.wrap($nome)
      .should('be.visible')
      .invoke('text')
      .should('match', new RegExp(termo, 'i'))
  })
}

export function adicionarProdutosAoCarrinho(idsProdutos) {
  idsProdutos.forEach((idProduto) => {
    cy.get(seletores.adicionarAoCarrinho(idProduto)).click()
    cy.get(seletores.modalCarrinho).should('be.visible')
    cy.get(seletores.botaoContinuarComprando).click()
    cy.get(seletores.modalCarrinho).should('not.be.visible')
  })
}
