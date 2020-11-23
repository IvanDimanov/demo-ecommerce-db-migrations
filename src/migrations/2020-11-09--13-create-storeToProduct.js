module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('storeToProduct', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        storeId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'store',
            },
            key: 'id',
          },
        },

        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'product',
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
      await queryInterface.dropTable('storeToProduct', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
