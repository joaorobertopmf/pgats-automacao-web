import { faker } from '@faker-js/faker'

export function gerarUsuario() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    title: 'Mr',
    name: `${firstName} ${lastName}`,
    email: `qa-${Date.now()}-${faker.string.alphanumeric(6).toLowerCase()}@pgats.test`,
    password: faker.internet.password({ length: 10 }),
    birthDay: '20',
    birthMonth: 'September',
    birthMonthNumber: '9',
    birthYear: '1992',
    firstName,
    lastName,
    company: `PGATS ${faker.company.name()}`,
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'Canada',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode('#####'),
    mobileNumber: faker.string.numeric(11)
  }
}

export function gerarCartao(nomeNoCartao) {
  return {
    nameOnCard: nomeNoCartao,
    number: faker.finance.creditCardNumber({ issuer: '4###-####-####-####' }).replace(/-/g, ''),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: '12',
    expiryYear: String(new Date().getFullYear() + 3)
  }
}
