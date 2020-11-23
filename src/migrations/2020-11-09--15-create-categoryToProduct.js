module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('categoryToProduct', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        categoryId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'category',
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
      await queryInterface.dropTable('categoryToProduct', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
