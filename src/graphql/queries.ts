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

export const MY_ORDERS = gql`
  query MyOrders {
    myOrders {
      id
      status
      total
      items {
        productId
        name
        quantity
        price
      }
      paymentMethod
      createdAt
    }
  }
`

export const GET_REVIEWS = gql`
  query GetReviews($productId: ID!) {
    reviews(productId: $productId) {
      id
      productId
      text
      rating
      userName
      createdAt
    }
  }
`

export const GET_REVIEWS_BY_PRODUCT_IDS = gql`
  query GetReviewsByProductIds($productIds: [ID!]!) {
    reviewsByProductIds(productIds: $productIds) {
      id
      productId
      text
      rating
      userName
      createdAt
    }
  }
`

export const CREATE_REVIEW = gql`
  mutation CreateReview($createReviewInput: CreateReviewInput!) {
    createReview(createReviewInput: $createReviewInput) {
      id
      productId
      text
      rating
      userName
      createdAt
    }
  }
`

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`

export const GET_ADMIN_PRODUCTS = gql`
  query AdminProducts($category: String) {
    adminProducts(category: $category) {
      id
      name
      category
      price
      image
      description
      badge
      featured
      colors
      createdAt
      updatedAt
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      category
      price
      image
      description
      badge
      featured
      colors
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $updateProductInput: CreateProductInput!) {
    updateProduct(id: $id, updateProductInput: $updateProductInput) {
      id
      name
      category
      price
      image
      description
      badge
      featured
      colors
      createdAt
      updatedAt
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    removeProduct(id: $id)
  }
`

export const GET_ADMIN_CHECKOUTS = gql`
  query AdminCheckouts($status: CheckoutStatus) {
    adminCheckouts(status: $status) {
      id
      status
      total
      subtotal
      tax
      shipping
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
      updatedAt
    }
  }
`

export const UPDATE_CHECKOUT_STATUS = gql`
  mutation UpdateCheckoutStatus($id: ID!, $status: CheckoutStatus!) {
    updateCheckoutStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`
