const Joi = require('@hapi/joi')
const validateEnvVars = require('../validateEnvVars')

const schema = {
  NODE_ENV: Joi.string().required(),
}


describe('/utils/validateEnvVars()', () => {
  beforeEach(() => {
    process.env = {
      NODE_ENV: 'test',
    }
  })


  it('should resolve with error on invalid "NODE_ENV" in `process.env`', () => {
    process.env.NODE_ENV = undefined

    const { error } = validateEnvVars(schema)

    expect(typeof error).toBe('object')
    expect(Array.isArray(error.details)).toBe(true)

    const matchedError = error.details.find(({ message }) => message.includes('NODE_ENV'))
    expect(typeof matchedError).toBe('object')
  })


  it('should resolve with no errors on valid `process.env`', () => {
    const { error } = validateEnvVars(schema)

    expect(error).toBe(undefined)
  })
})
