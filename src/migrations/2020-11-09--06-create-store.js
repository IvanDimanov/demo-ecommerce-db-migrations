module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('store', {
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
      await queryInterface.dropTable('store', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
