const { spawn } = require('child_process')

const { getInstance } = require('../sequelize-pool')
const instance = getInstance();

/**
 * Sequelize CLI sucks.
 * Executing `npx sequelize-cli db:migration:undo` does not undo last migration
 * but sorts all migrations by name and then executes the last one.
 * It is fair to say that we need to undo the last migration added.
 */
(async () => {
  try {
    const migrations = await instance.query(
      `SELECT * FROM "${instance.config.migrationStorageTableName}"`,
      { type: instance.QueryTypes.SELECT },
    )

    const lastMigration = migrations
      .sort((migration1, migration2) => new Date(migration1?.createdAt).getTime() - new Date(migration2?.createdAt).getTime())
      .pop()
    if (!lastMigration?.name) {
      console.log('\nThere are no more migrations to be removed\n')
      return
    }

    const commandArgs = [
      './node_modules/.bin/sequelize-cli',
      '--options-path',
      `.sequelizerc`,
      'db:migrate:undo',
      '--name',
      lastMigration.name,
    ]
    const [bin, ...args] = commandArgs
    console.log(`\nRemoving migration "${lastMigration.name}" by executing command:\n`)
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
      console.log(`migration undo executed with code: ${code.toString()}`)
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
