import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Product } from '../../data/products'
import type { CartLineItem } from '../../types'
import { currency, freeShippingThreshold, flatShippingRate } from '../../utils/constants'
import { CartContext } from './CartContext.context'
import type { CartContextType } from './CartContext.types'

export function CartProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [highlightedProduct, setHighlightedProduct] = useState<{
    id: string
    token: number
  } | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const highlightSequenceRef = useRef(0)

  const productDictionary = useMemo(
    () =>
      products.reduce<Record<string, Product>>((acc, product) => {
        acc[product.id] = product
        return acc
      }, {}),
    [products],
  )

  const cartItems = useMemo<CartLineItem[]>(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = productDictionary[productId]
        if (!product) return null
        return { product, quantity }
      })
      .filter(Boolean) as CartLineItem[]
  }, [cart, productDictionary])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartItems],
  )

  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : flatShippingRate
  const total = subtotal + shipping

  const freeShippingMessage =
    subtotal === 0
      ? 'Start building your bag to unlock complimentary delivery.'
      : shipping === 0
        ? 'Shipping is on us today.'
        : `Add ${currency.format(freeShippingThreshold - subtotal)} more for free express delivery.`

  const updateQuantity = (productId: string, updater: (current: number) => number) => {
    setCart((current) => {
      const nextQuantity = updater(current[productId] ?? 0)
      if (nextQuantity <= 0) {
        const rest = { ...current }
        delete rest[productId]
        return rest
      }
      return { ...current, [productId]: nextQuantity }
    })
  }

  const addToCart = (productId: string) => {
    updateQuantity(productId, (current) => current + 1)

    // Clear any existing timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
      highlightTimeoutRef.current = null
    }

    // If this product is already highlighted, briefly remove the highlight to restart the animation
    if (highlightedProduct?.id === productId) {
      setHighlightedProduct(null)
      // Use setTimeout with 0ms to ensure the state update is processed before re-adding
      setTimeout(() => {
        const token = ++highlightSequenceRef.current
        setHighlightedProduct({ id: productId, token })
        highlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedProduct((currentHighlight) =>
            currentHighlight?.token === token ? null : currentHighlight,
          )
        }, 1200)
      }, 0)
    } else {
      // First time highlighting this product
      const token = ++highlightSequenceRef.current
      setHighlightedProduct({ id: productId, token })
      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedProduct((currentHighlight) =>
          currentHighlight?.token === token ? null : currentHighlight,
        )
      }, 1200)
    }
  }

  const toggleCart = () => setIsCartOpen((open) => !open)

  const clearCart = () => {
    setCart({})
  }

  const isHighlighted = (productId: string) => highlightedProduct?.id === productId

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  const value: CartContextType = {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    freeShippingMessage,
    isCartOpen,
    toggleCart,
    updateQuantity,
    addToCart,
    clearCart,
    isHighlighted,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

