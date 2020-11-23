const { spawn } = require('child_process')

const { getInstance } = require('../sequelize-pool')
const instance = getInstance();

/**
 * Sequelize CLI sucks.
 * Executing `npx sequelize-cli db:seed:undo` does not undo last seed.
 * It does `Executing (default): SELECT 1+1 AS result`.
 * That's why we need to execute `npx sequelize-cli db:seed:undo --seed <last seed>`
 */
(async () => {
  try {
    const seeds = await instance.query(
      `SELECT * FROM "${instance.config.seederStorageTableName}"`,
      { type: instance.QueryTypes.SELECT },
    )

    const lastSeed = seeds.pop()
    if (!lastSeed?.name) {
      console.log('\nThere are no more seeds to be removed\n')
      return
    }

    const commandArgs = [
      './node_modules/.bin/sequelize-cli',
      '--options-path',
      `.sequelizerc`,
      'db:seed:undo',
      '--seed',
      lastSeed.name,
    ]
    const [bin, ...args] = commandArgs
    console.log(`\nRemoving seed "${lastSeed.name}" by executing command:\n`)
    console.log(`$ ${commandArgs.join(' ')}`)
    const command = spawn(bin, args, {
      // modify this path with additional dev or ci $(which node) paths
      env: {
        ...process.env,
        PATH: '$PATH:/usr/local/bin',
      },
    })
    command.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    command.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    command.on('exit', (code) => {
      console.log(`seed undo executed with code: ${code.toString()}`)
    })
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
