module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('product', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        name: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        description: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        imageUrl: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        price: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },

        basePrice: {
          type: DataTypes.DECIMAL(15, 4),
          allowNull: false,
        },

        props: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },

        totalInStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        originAddressId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'address',
            },
            key: 'id',
          },
        },

        vendorId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'vendor',
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
      await queryInterface.dropTable('product', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
