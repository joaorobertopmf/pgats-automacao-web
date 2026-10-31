import 'cypress-mochawesome-reporter/register'
import './commands'

// ignora só os erros dos scripts de anúncio, o resto continua quebrando o teste
Cypress.on('uncaught:exception', (err) => {
  const erroDeTerceiros = /adsbygoogle|googletag|Script error|ResizeObserver/i.test(err.message)
  if (erroDeTerceiros) {
    return false
  }
})
