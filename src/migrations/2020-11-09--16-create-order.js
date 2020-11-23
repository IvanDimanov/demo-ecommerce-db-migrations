module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('order', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        customerName: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        customerEmail: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        customerPhone: {
          allowNull: false,
          type: DataTypes.STRING(320),
          defaultValue: '',
        },

        status: {
          allowNull: false,
          type: DataTypes.ENUM(
            'draft',
            'submitted',
            'processing',
            'shipped',
            'received',
            'rejected',
          ),
          defaultValue: 'draft',
        },

        price: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },

        shippingAddressId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'address',
            },
            key: 'id',
          },
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
      await queryInterface.dropTable('order', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
