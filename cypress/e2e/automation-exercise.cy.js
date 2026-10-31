/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

import { gerarUsuario, gerarCartao } from '../support/helpers/dados'
import * as menu from '../modules/menu'
import * as login from '../modules/login'
import * as cadastro from '../modules/cadastro'
import * as produtos from '../modules/produtos'
import * as carrinho from '../modules/carrinho'
import * as checkout from '../modules/checkout'
import * as rodape from '../modules/rodape'

describe('Automation Exercise', () => {
  let dadosProdutos

  before(() => {
    cy.fixture('produtos').then((dados) => {
      dadosProdutos = dados
    })
  })

  beforeEach(() => {
    menu.acessarHome()
    menu.verificarHomeVisivel()
  })

  describe('Cadastro e autenticação de usuário', () => {
    it('Test Case 1: Register User', () => {
      // Arrange
      const usuario = gerarUsuario()
      menu.navegarParaLogin()
      cadastro.verificarFormularioNovoUsuarioVisivel()

      // Act
      cadastro.iniciarCadastro(usuario.name, usuario.email)
      cadastro.verificarFormularioInformacoesContaVisivel()
      cadastro.preencherCadastro(usuario)
      cadastro.criarConta()

      // Assert
      cadastro.verificarContaCriada()
      cadastro.continuar()
      menu.verificarUsuarioLogado(usuario.name)

      menu.excluirConta()
      cadastro.verificarContaExcluida()
      cadastro.continuar()
      menu.verificarUsuarioDeslogado()
    })

    it('Test Case 2: Login User with correct email and password', () => {
      // Arrange
      const usuario = gerarUsuario()
      cy.criarUsuarioViaApi(usuario)
      menu.navegarParaLogin()
      login.verificarFormularioLoginVisivel()

      // Act
      login.efetuarLogin(usuario.email, usuario.password)

      // Assert
      menu.verificarUsuarioLogado(usuario.name)

      menu.excluirConta()
      cadastro.verificarContaExcluida()
    })

    it('Test Case 3: Login User with incorrect email and password', () => {
      // Arrange
      const emailInexistente = `inexistente-${Date.now()}@pgats.test`
      menu.navegarParaLogin()
      login.verificarFormularioLoginVisivel()

      // Act
      login.efetuarLogin(emailInexistente, faker.internet.password())

      // Assert
      login.verificarErroCredenciaisInvalidas()
      menu.verificarUsuarioDeslogado()
    })

    context('Com usuário previamente cadastrado via API', () => {
      let usuario

      beforeEach(() => {
        usuario = gerarUsuario()
        cy.criarUsuarioViaApi(usuario)
      })

      afterEach(() => {
        cy.deletarUsuarioViaApi(usuario)
      })

      it('Test Case 4: Logout User', () => {
        // Arrange
        menu.navegarParaLogin()
        login.verificarFormularioLoginVisivel()
        login.efetuarLogin(usuario.email, usuario.password)
        menu.verificarUsuarioLogado(usuario.name)

        // Act
        menu.efetuarLogout()

        // Assert
        login.verificarPaginaLogin()
        menu.verificarUsuarioDeslogado()
      })

      it('Test Case 5: Register User with existing email', () => {
        // Arrange
        menu.navegarParaLogin()
        cadastro.verificarFormularioNovoUsuarioVisivel()

        // Act
        cadastro.iniciarCadastro(usuario.name, usuario.email)

        // Assert
        cadastro.verificarErroEmailExistente()
      })
    })
  })

  describe('Produtos', () => {
    it('Test Case 8: Verify All Products and product detail page', () => {
      // Arrange
      menu.navegarParaProdutos()
      produtos.verificarPaginaTodosProdutos()
      produtos.verificarListaDeProdutosVisivel()

      // Act
      produtos.acessarPrimeiroProduto()

      // Assert
      produtos.verificarDetalhesDoProduto()
    })

    it('Test Case 9: Search Product', () => {
      // Arrange
      menu.navegarParaProdutos()
      produtos.verificarPaginaTodosProdutos()

      // Act
      produtos.pesquisarProduto(dadosProdutos.termoPesquisa)

      // Assert
      produtos.verificarResultadoDaPesquisa(dadosProdutos.termoPesquisa)
    })
  })

  describe('Inscrição na newsletter', () => {
    it('Test Case 10: Verify Subscription in home page', () => {
      // Arrange
      rodape.rolarAteORodape()
      rodape.verificarSecaoInscricaoVisivel()

      // Act
      rodape.inscreverEmail(faker.internet.email({ provider: 'pgats.test' }))

      // Assert
      rodape.verificarInscricaoRealizada()
    })
  })

  describe('Finalização de pedido', () => {
    it('Test Case 15: Place Order: Register before Checkout', () => {
      // Arrange
      const usuario = gerarUsuario()
      const cartao = gerarCartao(usuario.name)

      menu.navegarParaLogin()
      cadastro.cadastrarUsuario(usuario)
      cadastro.verificarContaCriada()
      cadastro.continuar()
      menu.verificarUsuarioLogado(usuario.name)

      produtos.adicionarProdutosAoCarrinho(dadosProdutos.idsParaCarrinho)
      menu.navegarParaCarrinho()
      carrinho.verificarCarrinhoComProdutos(dadosProdutos.idsParaCarrinho)

      // Act
      carrinho.prosseguirParaCheckout()
      checkout.verificarEnderecoERevisaoDoPedido(usuario, dadosProdutos.idsParaCarrinho)
      checkout.fazerPedido(dadosProdutos.comentarioPedido)
      checkout.preencherPagamento(cartao)
      checkout.confirmarPagamento()

      // Assert
      checkout.verificarPedidoConfirmado()

      menu.excluirConta()
      cadastro.verificarContaExcluida()
      cadastro.continuar()
      menu.verificarUsuarioDeslogado()
    })

    it('Test Case 16: Place Order: Login before Checkout', () => {
      // Arrange
      const usuario = gerarUsuario()
      const cartao = gerarCartao(usuario.name)
      cy.criarUsuarioViaApi(usuario)

      menu.navegarParaLogin()
      login.efetuarLogin(usuario.email, usuario.password)
      menu.verificarUsuarioLogado(usuario.name)

      produtos.adicionarProdutosAoCarrinho(dadosProdutos.idsParaCarrinho)
      menu.navegarParaCarrinho()
      carrinho.verificarCarrinhoComProdutos(dadosProdutos.idsParaCarrinho)

      // Act
      carrinho.prosseguirParaCheckout()
      checkout.verificarEnderecoERevisaoDoPedido(usuario, dadosProdutos.idsParaCarrinho)
      checkout.fazerPedido(dadosProdutos.comentarioPedido)
      checkout.preencherPagamento(cartao)
      checkout.confirmarPagamento()

      // Assert
      checkout.verificarPedidoConfirmado()

      menu.excluirConta()
      cadastro.verificarContaExcluida()
      cadastro.continuar()
      menu.verificarUsuarioDeslogado()
    })
  })
})
