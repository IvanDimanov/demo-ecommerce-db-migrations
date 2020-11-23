const storeRoles = require('../seed-data/storeRoles.json')


module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('storeRole', storeRoles, { transaction })
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
      await queryInterface.bulkDelete('storeRole', {
        id: {
          [Sequelize.Op.in]: storeRoles.map(({ id }) => id),
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
