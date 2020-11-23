const Table = require('cli-table3')

const { getInstance } = require('../sequelize-pool')
const instance = getInstance();

/**
 * This function gets all executed DB Seeds and
 * prints them in a nice-to-look-at table
 */
(async () => {
  try {
    const seeds = await instance.query(`SELECT * FROM "${instance.config.seederStorageTableName}"`, {
      type: instance.QueryTypes.SELECT,
    })

    const table = new Table({
      head: ['#', 'Name'],
    })

    seeds.forEach(({ name }, index) => table.push([index + 1, name]))

    console.log('\n')
    console.log(table.toString())
    console.log('\n')
  } catch (error) {
    const errorMessage = error?.original?.message ?? ''
    if (errorMessage.includes('does not exist')) {
      console.log(errorMessage)
    } else {
      throw error
    }
  } finally {
    await instance.close()
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})

