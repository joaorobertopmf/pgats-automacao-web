# Automação Web: Automation Exercise com Cypress

Trabalho de conclusão da disciplina **Automação de Testes na Camada de Interface (Web)** da Pós-Graduação em Automação de Testes de Software (PGATS).

O projeto automatiza, com **Cypress**, os casos de teste **1, 2, 3, 4, 5, 8, 9, 10, 15 e 16** da página [Test Cases](https://automationexercise.com/test_cases) da aplicação fictícia [Automation Exercise](https://automationexercise.com).

[![Web E2E Tests](../../actions/workflows/e2e.yml/badge.svg)](../../actions/workflows/e2e.yml)

## Casos de teste automatizados

| TC | Cenário | Suíte |
|----|---------|-------|
| 1  | Register User | Cadastro e autenticação de usuário |
| 2  | Login User with correct email and password | Cadastro e autenticação de usuário |
| 3  | Login User with incorrect email and password | Cadastro e autenticação de usuário |
| 4  | Logout User | Cadastro e autenticação de usuário |
| 5  | Register User with existing email | Cadastro e autenticação de usuário |
| 8  | Verify All Products and product detail page | Produtos |
| 9  | Search Product | Produtos |
| 10 | Verify Subscription in home page | Inscrição na newsletter |
| 15 | Place Order: Register before Checkout | Finalização de pedido |
| 16 | Place Order: Login before Checkout | Finalização de pedido |

## Tecnologias

- [Cypress](https://www.cypress.io/) 16
- [@faker-js/faker](https://fakerjs.dev/) para gerar massa de dados
- [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) para os relatórios em HTML
- GitHub Actions para integração contínua

## Estrutura do projeto

```
.github/workflows/e2e.yml       # Pipeline: executa os testes e publica o relatório
cypress/
├── e2e/
│   └── automation-exercise.cy.js   # Spec com os 10 casos de teste
├── fixtures/
│   └── produtos.json               # Massa de dados estática (busca, carrinho, comentário)
├── modules/                        # Modularização por funcionalidade (ações de negócio)
│   ├── menu/                       # Component Object do header (navegação, logout, excluir conta)
│   ├── rodape/                     # Component Object do footer (newsletter)
│   ├── login/
│   ├── cadastro/
│   ├── produtos/
│   ├── carrinho/
│   └── checkout/                   # Checkout e pagamento
└── support/
    ├── commands.js                 # Comandos customizados (criar/excluir usuário via API)
    ├── e2e.js                      # Registro do reporter e configurações globais
    └── helpers/dados.js            # Geração de dados dinâmicos (usuário, cartão)
cypress.config.js
```

## Padrões e boas práticas adotados

- **Modularização:** cada funcionalidade tem um módulo em `cypress/modules/<funcionalidade>/index.js`. Os seletores ficam centralizados num objeto `seletores` dentro do módulo, e as funções têm nome de ação de negócio (`efetuarLogin`, `preencherCadastro`, `confirmarPagamento`...). Menu e rodapé seguem a ideia de *Component Object*, porque aparecem em todas as páginas.
- **Seletores:** a prioridade é `data-qa`, depois `id` e depois classes semânticas com escopo. Não há XPath, `nth-child` nem seletores gerados.
- **Padrão AAA:** todos os testes seguem *Arrange / Act / Assert*, e cada etapa do caso de teste tem uma asserção explícita.
- **Testes independentes:** cada teste gera seu próprio usuário com o Faker, com e-mail único. Quando o cenário precisa de um usuário já existente (TC 2, 4, 5 e 16), ele é criado pela **API** da aplicação (`cy.criarUsuarioViaApi`). Assim a pré-condição fica rápida e não depende da UI de cadastro.
- **Limpeza de dados:** os cenários que não excluem a conta pela interface removem o usuário via API no `afterEach`.
- **Estabilidade:**
  - os hosts de anúncios do Google (vinhetas e iframes) são bloqueados com `blockHosts`;
  - exceções de scripts de terceiros são ignoradas;
  - `retries` está configurado apenas no modo `run` (CI).
- **Mensagem de pedido (TC 15/16):** a mensagem *"Your order has been placed successfully!"* aparece no submit e some logo em seguida, com o redirecionamento. Para validar sem depender de timing, o primeiro submit é segurado, a mensagem é verificada e o pagamento é confirmado em seguida (ver `modules/checkout`).
- **Dados sensíveis:** senha e número do cartão são digitados com `{ log: false }`.

## Como executar localmente

Pré-requisito: Node.js 20 ou superior.

```bash
npm install

# modo interativo
npm run cy:open

# modo headless (gera o relatório)
npm test
```

> **Observação (VS Code):** se o Cypress falhar com `bad option: --smoke-test` ao rodar pelo terminal integrado do VS Code, remova a variável `ELECTRON_RUN_AS_NODE` da sessão antes de executar (`Remove-Item Env:ELECTRON_RUN_AS_NODE` no PowerShell ou `unset ELECTRON_RUN_AS_NODE` no bash).

## Relatórios

Ao final da execução, o relatório HTML do Mochawesome é gerado em `cypress/reports/index.html`, com gráficos e screenshots das falhas embutidas.

Na pipeline (GitHub Actions), o relatório é disponibilizado de duas formas:

1. **Artefato** `relatorio-mochawesome`, disponível para download na página de cada execução, em *Actions › execução › Artifacts*.
2. **GitHub Pages:** o relatório da última execução na branch `main` é publicado no link exibido no job *Publicar relatório no GitHub Pages*.

## Integração contínua

O workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) roda nos seguintes casos:

- a cada `push` ou `pull request` na branch `main`;
- manualmente, por *workflow_dispatch*.

Ele executa os passos abaixo:

1. Instala as dependências com `npm ci`.
2. Executa a spec do trabalho em modo headless.
3. Publica o relatório como artefato e no GitHub Pages.
