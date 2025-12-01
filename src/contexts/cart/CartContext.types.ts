import type { CartLineItem } from '../../types'

export interface CartContextType {
  cartItems: CartLineItem[]
  cartCount: number
  subtotal: number
  shipping: number
  total: number
  freeShippingMessage: string
  isCartOpen: boolean
  toggleCart: () => void
  updateQuantity: (productId: string, updater: (current: number) => number) => void
  addToCart: (productId: string) => void
  clearCart: () => void
  isHighlighted: (productId: string) => boolean
}

