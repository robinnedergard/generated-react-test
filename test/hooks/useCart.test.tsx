import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider } from '#src/contexts/cart/CartContext'
import { useCart } from '#src/hooks/useCart'
import type { Product } from '#src/data/products'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product',
    category: 'Test',
    price: 100,
    image: 'test.jpg',
    description: 'Test description',
    badge: undefined,
    featured: false,
    colors: ['Red'],
  },
]

describe('useCart', () => {
  it('throws error when used outside CartProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useCart())
    }).toThrow('useCart must be used within a CartProvider')

    consoleSpy.mockRestore()
  })

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    expect(result.current.cartItems).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.isCartOpen).toBe(false)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    act(() => {
      result.current.addToCart('1')
    })

    expect(result.current.cartCount).toBe(1)
    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].product.id).toBe('1')
    expect(result.current.cartItems[0].quantity).toBe(1)
  })

  it('updates quantity when adding same item multiple times', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    act(() => {
      result.current.addToCart('1')
      result.current.addToCart('1')
    })

    expect(result.current.cartCount).toBe(2)
    expect(result.current.cartItems[0].quantity).toBe(2)
  })

  it('removes item when quantity reaches zero', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    act(() => {
      result.current.addToCart('1')
      result.current.updateQuantity('1', () => 0)
    })

    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartItems).toHaveLength(0)
  })

  it('toggles cart open state', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    expect(result.current.isCartOpen).toBe(false)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isCartOpen).toBe(true)

    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isCartOpen).toBe(false)
  })

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    act(() => {
      result.current.addToCart('1')
      result.current.clearCart()
    })

    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartItems).toHaveLength(0)
  })

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider products={mockProducts}>{children}</CartProvider>,
    })

    act(() => {
      result.current.addToCart('1')
      result.current.addToCart('1')
    })

    expect(result.current.subtotal).toBe(200) // 2 * 100
  })
})
