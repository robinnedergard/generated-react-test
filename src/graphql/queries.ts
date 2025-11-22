import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      category
      price
      image
      description
      badge
      featured
      colors
    }
  }
`

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      category
      price
      image
      description
      badge
      featured
      colors
    }
  }
`

export const CREATE_CHECKOUT = gql`
  mutation CreateCheckout($createCheckoutInput: CreateCheckoutInput!) {
    createCheckout(createCheckoutInput: $createCheckoutInput) {
      id
      status
      total
      items {
        productId
        quantity
        price
      }
      shippingAddress {
        address
        city
        state
        zipCode
        country
      }
      paymentMethod
      createdAt
    }
  }
`

export const GET_CHECKOUT = gql`
  query GetCheckout($id: ID!) {
    checkout(id: $id) {
      id
      status
      total
      items {
        productId
        name
        quantity
        price
      }
      shippingAddress {
        firstName
        lastName
        address
        city
        state
        zipCode
        country
      }
      paymentMethod
      createdAt
    }
  }
`
