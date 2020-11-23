module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('orderItem', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'order',
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

        props: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },

        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        price: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },

        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.literal('NOW()'),
        },

        deletedAt: {
          type: DataTypes.DATE,
          defaultValue: null,
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
      await queryInterface.dropTable('orderItem', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
