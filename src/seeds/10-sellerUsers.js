const {
  phoneStoreSellers,
  electronicsStoreSellers,
  outdoorStoreSellers,
} = require('../seed-data/sellerUsers.json')

const [
  phoneStore,
  electronicsStore,
  outdoorStore,
] = require('../seed-data/stores.json')

const [
  sellerOwner,
  sellerManager,
  sellerAdvertiser,
] = require('../seed-data/storeRoles.json')

const roles = require('../seed-data/roles.json')
const sellerRole = roles.find(({ code }) => code === 'seller')


module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('user', [
        ...phoneStoreSellers,
        ...electronicsStoreSellers,
        ...outdoorStoreSellers,
      ], { transaction })

      await queryInterface.bulkInsert('userToRole', [
        ...phoneStoreSellers,
        ...electronicsStoreSellers,
        ...outdoorStoreSellers,
      ].map(({ id }) => ({
        userId: id,
        roleId: sellerRole.id,
      })), { transaction })


      await queryInterface.bulkInsert('userStoreRole', [
        {
          userId: phoneStoreSellers[0].id,
          storeId: phoneStore.id,
          storeRoleId: sellerOwner.id,
          storeRoleCode: sellerOwner.code,
        },
        {
          userId: phoneStoreSellers[1].id,
          storeId: phoneStore.id,
          storeRoleId: sellerManager.id,
          storeRoleCode: sellerManager.code,
        },
        {
          userId: phoneStoreSellers[2].id,
          storeId: phoneStore.id,
          storeRoleId: sellerAdvertiser.id,
          storeRoleCode: sellerAdvertiser.code,
        },


        {
          userId: electronicsStoreSellers[0].id,
          storeId: electronicsStore.id,
          storeRoleId: sellerOwner.id,
          storeRoleCode: sellerOwner.code,
        },
        {
          userId: electronicsStoreSellers[1].id,
          storeId: electronicsStore.id,
          storeRoleId: sellerManager.id,
          storeRoleCode: sellerManager.code,
        },
        {
          userId: electronicsStoreSellers[2].id,
          storeId: electronicsStore.id,
          storeRoleId: sellerAdvertiser.id,
          storeRoleCode: sellerAdvertiser.code,
        },


        {
          userId: outdoorStoreSellers[0].id,
          storeId: outdoorStore.id,
          storeRoleId: sellerOwner.id,
          storeRoleCode: sellerOwner.code,
        },
        {
          userId: outdoorStoreSellers[1].id,
          storeId: outdoorStore.id,
          storeRoleId: sellerManager.id,
          storeRoleCode: sellerManager.code,
        },
        {
          userId: outdoorStoreSellers[2].id,
          storeId: outdoorStore.id,
          storeRoleId: sellerAdvertiser.id,
          storeRoleCode: sellerAdvertiser.code,
        },
      ], { transaction })

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
      await queryInterface.bulkDelete('userStoreRole', {
        userId: {
          [Sequelize.Op.in]: [
            ...phoneStoreSellers,
            ...electronicsStoreSellers,
            ...outdoorStoreSellers,
          ].map(({ id }) => id),
        },
      }, { transaction })

      await queryInterface.bulkDelete('userToRole', {
        userId: {
          [Sequelize.Op.in]: [
            ...phoneStoreSellers,
            ...electronicsStoreSellers,
            ...outdoorStoreSellers,
          ].map(({ id }) => id),
        },
      }, { transaction })

      await queryInterface.bulkDelete('user', {
        id: {
          [Sequelize.Op.in]: [
            ...phoneStoreSellers,
            ...electronicsStoreSellers,
            ...outdoorStoreSellers,
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
