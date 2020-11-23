module.exports = {
  up: async (queryInterface, DataTypes) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('user', {
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

        email: {
          type: DataTypes.STRING(320),
          allowNull: false,
        },

        hashedPassword: {
          type: DataTypes.STRING,
          defaultValue: null,
        },

        status: {
          allowNull: false,
          type: DataTypes.ENUM(
            'pendingValidation',
            'active',
            'blocked',
          ),
          defaultValue: 'pendingValidation',
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
      await queryInterface.dropTable('user', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
