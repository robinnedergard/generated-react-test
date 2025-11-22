import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'

export async function createServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  console.log(`🚀 GraphQL Server ready at: ${url}`)
  return server
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createServer().catch((error) => {
    console.error('Error starting server:', error)
    process.exit(1)
  })
}

