const stores = require('../seed-data/stores.json')
const vendors = require('../seed-data/vendors.json')
const addresses = require('../seed-data/addresses.json')
const categories = require('../seed-data/categories.json')

const {
  applePhones,
  samsungPhones,
  nikeShoes,
  adidasShoes,
  crossBikes,
  yamahaBikes,
} = require('../seed-data/products.json')

const getRandomNumber = require('../utils/getRandomNumber')

const createProduct = async (
  product,
  vendor,
  address,
  stores,
  category,
  queryInterface,
  transaction,
) => {
  const [dbAddress] = await queryInterface.bulkInsert('address', [address], { transaction, returning: true })

  await queryInterface.bulkInsert('product', [{
    ...product,
    vendorId: vendor.id,
    originAddressId: dbAddress.id,
  }], { transaction })

  await Promise.all(stores.map((store) => queryInterface.bulkInsert('storeToProduct', [{
    storeId: store.id,
    productId: product.id,
  }], { transaction })))

  await queryInterface.bulkInsert('categoryToProduct', [{
    categoryId: category.id,
    productId: product.id,
  }], { transaction })
}


module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const vendorApple = vendors[0]
      const vendorSamsung = vendors[1]
      const vendorNike = vendors[2]
      const vendorAdidas = vendors[3]
      const vendorCross = vendors[4]
      const vendorYamaha = vendors[5]

      const bulAddresses = addresses.BUL
      const korAddresses = addresses.KOR
      const usaAddresses = addresses.USA
      const chnAddresses = addresses.CHN

      const phoneStore = stores[0]
      const electronicsStore = stores[1]
      const outdoorStore = stores[2]

      const categoryPhones = categories[0]
      const categoryShoes = categories[1]
      const categoryBikes = categories[2]


      const applePhoneAddresses = [
        ...usaAddresses,
        ...chnAddresses,
      ]
      await Promise.all(applePhones.map((product) => {
        const index = getRandomNumber(0, applePhoneAddresses.length - 1)
        const address = applePhoneAddresses[index]

        return createProduct(
          product,
          vendorApple,
          address,
          [phoneStore, electronicsStore],
          categoryPhones,
          queryInterface,
          transaction,
        )
      }))


      const samsungPhoneAddresses = [
        ...korAddresses,
        ...chnAddresses,
      ]
      await Promise.all(samsungPhones.map((product) => {
        const index = getRandomNumber(0, samsungPhoneAddresses.length - 1)
        const address = samsungPhoneAddresses[index]

        return createProduct(
          product,
          vendorSamsung,
          address,
          [phoneStore, electronicsStore],
          categoryPhones,
          queryInterface,
          transaction,
        )
      }))


      const nikeShoeAddresses = [
        ...usaAddresses,
        ...chnAddresses,
      ]
      await Promise.all(nikeShoes.map((product) => {
        const index = getRandomNumber(0, nikeShoeAddresses.length - 1)
        const address = nikeShoeAddresses[index]

        return createProduct(
          product,
          vendorNike,
          address,
          [outdoorStore],
          categoryShoes,
          queryInterface,
          transaction,
        )
      }))


      const adidasShoeAddresses = [
        ...bulAddresses,
        ...chnAddresses,
      ]
      await Promise.all(adidasShoes.map((product) => {
        const index = getRandomNumber(0, adidasShoeAddresses.length - 1)
        const address = adidasShoeAddresses[index]

        return createProduct(
          product,
          vendorAdidas,
          address,
          [outdoorStore],
          categoryShoes,
          queryInterface,
          transaction,
        )
      }))


      const crossBikeAddresses = [
        ...bulAddresses,
      ]
      await Promise.all(crossBikes.map((product) => {
        const index = getRandomNumber(0, crossBikeAddresses.length - 1)
        const address = crossBikeAddresses[index]

        return createProduct(
          product,
          vendorCross,
          address,
          [outdoorStore],
          categoryBikes,
          queryInterface,
          transaction,
        )
      }))


      const yamahaBikeAddresses = [
        ...korAddresses,
        ...usaAddresses,
      ]
      await Promise.all(yamahaBikes.map((product) => {
        const index = getRandomNumber(0, yamahaBikeAddresses.length - 1)
        const address = yamahaBikeAddresses[index]

        return createProduct(
          product,
          vendorYamaha,
          address,
          [outdoorStore, electronicsStore],
          categoryBikes,
          queryInterface,
          transaction,
        )
      }))


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
      await queryInterface.bulkDelete('categoryToProduct', {
        productId: {
          [Sequelize.Op.in]: [
            ...applePhones.map(({ id }) => id),
            ...samsungPhones.map(({ id }) => id),
            ...nikeShoes.map(({ id }) => id),
            ...adidasShoes.map(({ id }) => id),
            ...crossBikes.map(({ id }) => id),
            ...yamahaBikes.map(({ id }) => id),
          ],
        },
      }, { transaction })


      await queryInterface.bulkDelete('storeToProduct', {
        productId: {
          [Sequelize.Op.in]: [
            ...applePhones.map(({ id }) => id),
            ...samsungPhones.map(({ id }) => id),
            ...nikeShoes.map(({ id }) => id),
            ...adidasShoes.map(({ id }) => id),
            ...crossBikes.map(({ id }) => id),
            ...yamahaBikes.map(({ id }) => id),
          ],
        },
      }, { transaction })


      await queryInterface.bulkDelete('product', {
        id: {
          [Sequelize.Op.in]: [
            ...applePhones.map(({ id }) => id),
            ...samsungPhones.map(({ id }) => id),
            ...nikeShoes.map(({ id }) => id),
            ...adidasShoes.map(({ id }) => id),
            ...crossBikes.map(({ id }) => id),
            ...yamahaBikes.map(({ id }) => id),
          ],
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
