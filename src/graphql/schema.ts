export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    image: String!
    description: String!
    badge: String
    featured: Boolean
    colors: [String!]!
  }

  type CheckoutItem {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type ShippingAddress {
    name: String!
    street: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  type Checkout {
    id: ID!
    status: String!
    total: Float!
    items: [CheckoutItem!]!
    shippingAddress: ShippingAddress!
    paymentMethod: String!
    createdAt: String!
  }

  type Review {
    id: ID!
    productId: ID!
    name: String
    text: String!
    rating: Int!
    userName: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateReviewInput {
    productId: ID!
    text: String!
    rating: Int!
    name: String
  }

  input CheckoutItemInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }

  input ShippingAddressInput {
    name: String!
    street: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  input CheckoutInput {
    items: [CheckoutItemInput!]!
    shippingAddress: ShippingAddressInput!
    paymentMethod: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    checkout(id: ID!): Checkout
    checkouts(status: String): [Checkout!]!
    reviews(productId: ID!): [Review!]!
  }

  type Mutation {
    createCheckout(input: CheckoutInput!): Checkout!
    cancelCheckout(id: ID!): Checkout!
    createReview(input: CreateReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`
