const faker = require('faker')

const orders = require('../seed-data/orders.json')
const {
  applePhones,
  samsungPhones,
  nikeShoes,
  adidasShoes,
  crossBikes,
  yamahaBikes,
} = require('../seed-data/products.json')

const getRandomNumber = require('../utils/getRandomNumber')

const products = [
  ...applePhones,
  ...samsungPhones,
  ...nikeShoes,
  ...adidasShoes,
  ...crossBikes,
  ...yamahaBikes,
]

const getRandomProduct = () => {
  const index = getRandomNumber(0, products.length - 1)
  return products[index]
}


const createOrder = async (order, isDeleted, totalOrderItems, queryInterface, transaction) => {
  const [address] = await queryInterface.bulkInsert('address', [{
    addressLine1: faker.address.streetAddress(),
    addressLine2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    postalCode: faker.address.zipCode(),
  }], { transaction, returning: true })

  const [dbOrder] = await queryInterface.bulkInsert('order', [
    {
      ...order,
      shippingAddressId: address.id,
      customerName: faker.name.findName(),
      customerEmail: faker.internet.email(),
      customerPhone: faker.phone.phoneNumberFormat(),
      price: faker.commerce.price(),
      deletedAt: isDeleted ? new Date() : null,
    },
  ], { transaction, returning: true })

  if (!totalOrderItems) {
    return
  }

  return queryInterface.bulkInsert('orderItem', Array.from({ length: totalOrderItems }).map(() => ({
    orderId: dbOrder.id,
    productId: getRandomProduct().id,
    quantity: getRandomNumber(1, 7),
    price: faker.commerce.price(),
    deletedAt: isDeleted ? new Date() : (getRandomNumber(0, 1) ? new Date() : null),
  })), { transaction })
}


module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const deletedOrders = orders.deletedOrders
      await Promise.all(deletedOrders.map((order, index) => createOrder(order, true, index, queryInterface, transaction)))

      const nonDeletedOrders = orders.nonDeletedOrders
      await Promise.all(nonDeletedOrders.map((order, index) => createOrder(order, false, index + 1, queryInterface, transaction)))

      await transaction.commit()
    } catch (error) {
      console.error(error)
      await transaction.rollback()
      throw error
    }
  },


  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const shippingAddresses = await queryInterface.sequelize.query(
        `SELECT * FROM "order" WHERE "id" IN ('${
          [
            ...orders.deletedOrders,
            ...orders.nonDeletedOrders,
          ]
            .map(({ id }) => id)
            .join(`', '`)
        }')`)


      await queryInterface.bulkDelete('address', {
        id: {
          [Sequelize.Op.in]: shippingAddresses.map(({ id }) => id),
        },
      }, { transaction })


      await queryInterface.bulkDelete('orderItem', {
        orderId: {
          [Sequelize.Op.in]: [
            ...orders.deletedOrders,
            ...orders.nonDeletedOrders,
          ].map(({ id }) => id),
        },
      }, { transaction })


      await queryInterface.bulkDelete('order', {
        id: {
          [Sequelize.Op.in]: [
            ...orders.deletedOrders,
            ...orders.nonDeletedOrders,
          ].map(({ id }) => id),
        },
      }, { transaction })

      await transaction.commit()
    } catch (error) {
      console.error(error)
      await transaction.rollback()
      throw error
    }
  },
}
