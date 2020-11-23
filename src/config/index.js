const validateEnvVars = require('../utils/validateEnvVars')
const dbSchema = require('./schema')
const { error } = validateEnvVars(dbSchema)

if (error) {
  process.stderr.write(`Invalid ENV VAR:
${error.details.map(({ message, context }) => `  ${message}; currently ${context.key}=${context.value}`).join('\n')}
\n`)
  process.exit(1)
}

/**
 * Generates a valid DB connection info object.
 *
 * @return {object} All info needed to connect Sequelize to DB
 */
const getConfig = () => ({
  dialect: process.env.DB_DIALECT,
  url: process.env.DB_URL,
  migrationStorageTableName: process.env.DB_MIGRATION_STORAGE,
  seederStorage: 'sequelize',
  seederStorageTableName: process.env.DB_SEEDER_STORAGE,
  define: {
    charset: process.env.DB_CHARSET,
    dialectOptions: {
      collate: process.env.DB_COLLATE,
    },
  },
  logging: process.env.DB_LOGGING && console.log,
  pool: {
    max: process.env.DB_CONNECTION_POOL_MAX,
    min: process.env.DB_CONNECTION_POOL_MIN,
    idle: process.env.DB_CONNECTION_POOL_IDLE,
    acquire: process.env.DB_CONNECTION_POOL_ACQUIRE,
    evict: process.env.DB_CONNECTION_POOL_EVICT,
  },
})

module.exports = {
  getConfig,
  ...getConfig(),
}
