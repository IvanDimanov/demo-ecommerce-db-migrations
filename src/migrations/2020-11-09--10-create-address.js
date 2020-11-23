module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('address', {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        addressLine1: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
        },

        addressLine2: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
        },

        city: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
        },

        state: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
        },

        country: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
        },

        postalCode: {
          type: DataTypes.STRING(320),
          allowNull: false,
          defaultValue: '',
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
      await queryInterface.dropTable('address', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
