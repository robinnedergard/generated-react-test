import { createServer } from './graphql/server'

createServer().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})

