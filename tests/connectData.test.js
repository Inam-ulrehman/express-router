const connectDB = require('../db/connect')

describe('Database', () => {
  it('should connect to the database', async () => {
    try {
      await connectDB()
      expect(true).toBe(true) // Expect the connection to be successful
    } catch (error) {
      console.error('Failed to connect to the database:', error)
      expect(error).toBeNull() // Fail the test if the connection fails
    }
  })
})
