import * as backend from './backend'

// TODO: Replace with database queries for products
// Example: import { db } from './database'
// products: async () => await db.query('SELECT * FROM products')
// product: async (_: unknown, { id }: { id: string }) => await db.query('SELECT * FROM products WHERE id = $1', [id])

export const resolvers = {
  Query: {
    products: () => {
      // TODO: Fetch from database
      return []
    },
    product: (_parent: unknown, { id }: { id: string }) => {
      // TODO: Fetch from database by ID
      // Example: return await db.query('SELECT * FROM products WHERE id = $1', [id])
      void id // Mark id as intentionally used (will be used when implementing database query)
      return null
    },
    checkout: async (_parent: unknown, { id }: { id: string }) => {
      return await backend.getCheckout(id)
    },
    checkouts: async (_parent: unknown, { status }: { status?: string }) => {
      return await backend.getCheckouts(status)
    },
  },
  Mutation: {
    createCheckout: async (_parent: unknown, { input }: { input: unknown }) => {
      return await backend.createCheckout(input as Parameters<typeof backend.createCheckout>[0])
    },
    cancelCheckout: async (_parent: unknown, { id }: { id: string }) => {
      return await backend.cancelCheckout(id)
    },
  },
}
