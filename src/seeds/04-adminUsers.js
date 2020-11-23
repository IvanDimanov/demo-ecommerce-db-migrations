const users = require('../seed-data/adminUsers.json')
const roles = require('../seed-data/roles.json')

const adminRole = roles.find(({ code }) => code === 'admin')


module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('user', users, { transaction })
      await queryInterface.bulkInsert('userToRole', users.map(({ id }) => ({
        userId: id,
        roleId: adminRole.id,
      })), { transaction })

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
      await queryInterface.bulkDelete('userToRole', {
        userId: {
          [Sequelize.Op.in]: users.map(({ id }) => id),
        },
      }, { transaction })

      await queryInterface.bulkDelete('user', {
        id: {
          [Sequelize.Op.in]: users.map(({ id }) => id),
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
