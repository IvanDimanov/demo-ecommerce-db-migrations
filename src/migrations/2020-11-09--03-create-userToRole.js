module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('userToRole', {
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

        roleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'role',
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
      await queryInterface.dropTable('userToRole', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
