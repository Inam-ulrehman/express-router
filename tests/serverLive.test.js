const request = require('supertest')
const { app, startServer } = require('../app')

let server

beforeAll(async () => {
  server = await startServer()
})

afterAll((done) => {
  server.close(done)
})

describe('Server', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
  })
})
