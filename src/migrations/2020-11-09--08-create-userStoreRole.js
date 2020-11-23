module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('userStoreRole', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'user',
            },
            key: 'id',
          },
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

        storeRoleCode: {
          type: DataTypes.STRING(320),
          allowNull: false,
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
      await queryInterface.dropTable('userStoreRole', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
