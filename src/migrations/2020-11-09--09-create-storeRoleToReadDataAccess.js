module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('storeRoleToReadDataAccess', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        storeRoleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'storeRole',
            },
            key: 'id',
          },
        },

        readDataAccessId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'readDataAccess',
            },
            key: 'id',
          },
        },
      }, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },


  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.dropTable('storeRoleToReadDataAccess', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
