import type { Product } from '../data/products'

export type ProductsQueryResult = {
  products: Product[]
}

export type CartLineItem = {
  product: Product
  quantity: number
}

export type LayoutProps = {
  children: React.ReactNode
  cartItems: CartLineItem[]
  cartCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingMessage: string
  isCartOpen: boolean
  toggleCart: () => void
  updateQuantity: (productId: string, updater: (current: number) => number) => void
}

