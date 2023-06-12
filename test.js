const request = require('supertest')
const app = require('./app')

describe('Server', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
