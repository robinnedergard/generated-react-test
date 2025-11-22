import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import './App.css'
import { type Product } from './data/products'
import ProductPage from './ProductPage'
import ProductsPage from './ProductsPage'
import CheckoutPage from './CheckoutPage'
import CheckoutSuccessPage from './CheckoutSuccessPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import UserOrdersPage from './UserOrdersPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GET_PRODUCTS } from './graphql/queries'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const perks = [
  { title: 'Express shipping', detail: 'Complimentary on orders over $150' },
  { title: '30-day trial', detail: 'Live with every piece before you decide' },
  { title: 'Design support', detail: 'Chat with stylists for pairing advice' },
]

const freeShippingThreshold = 150
const flatShippingRate = 15

type ProductsQueryResult = {
  products: Product[]
}

type CartLineItem = {
  product: Product
  quantity: number
}

function CartLine({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartLineItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}) {
  return (
    <li className="cart-line">
      <div className="cart-line__info">
        <p>{item.product.name}</p>
        <span>{currency.format(item.product.price)}</span>
      </div>
      <div className="cart-line__controls">
        <div className="cart-line__quantity-group">
          <div className="quantity" aria-label={`Quantity controls for ${item.product.name}`}>
            <button
              type="button"
              aria-label={`Decrease quantity for ${item.product.name}`}
              onClick={onDecrement}
            >
              –
            </button>
            <span data-testid={`cart-qty-${item.product.id}`} aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity for ${item.product.name}`}
              onClick={onIncrement}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="cart-line__remove"
            aria-label={`Remove all ${item.product.name} from cart`}
            onClick={onRemove}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334ZM6.667 7.333v4M9.333 7.333v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <span className="cart-line__total">
          {currency.format(item.product.price * item.quantity)}
        </span>
      </div>
    </li>
  )
}

type LayoutProps = {
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

function Layout({
  children,
  cartItems,
  cartCount,
  subtotal,
  shipping,
  total,
  freeShippingMessage,
  isCartOpen,
  toggleCart,
  updateQuantity,
}: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="shop">
      <div className="cart-bar">
        <div>
          <p className="eyebrow">Your bag</p>
          <p>{cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'No items yet'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/account/orders"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  marginRight: '0.5rem',
                }}
              >
                {user?.email}
              </Link>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={logout}
                style={{ fontSize: '0.875rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginRight: '0.5rem',
              }}
            >
              Login
            </Link>
          )}
          <button
            type="button"
            className="cart-toggle"
            onClick={toggleCart}
            data-testid="cart-toggle"
          >
            Bag
            <span className="cart-pill" data-testid="cart-count" aria-live="polite">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {isCartOpen && (
        <section className="cart-panel cart-panel--open" aria-live="polite">
          <header className="cart-panel__header">
            <div>
              <p className="eyebrow">Shopping bag</p>
              <h2>Ready to ship</h2>
            </div>
            <button type="button" className="btn btn--ghost btn--small" onClick={toggleCart}>
              Hide
            </button>
          </header>
          <p className="cart-panel__note">{freeShippingMessage}</p>
          {cartItems.length === 0 ? (
            <p className="cart-panel__empty">Your basket is empty – add your favorite finds.</p>
          ) : (
            <ul className="cart-panel__lines">
              {cartItems.map((item) => (
                <CartLine
                  key={item.product.id}
                  item={item}
                  onIncrement={() => updateQuantity(item.product.id, (qty) => qty + 1)}
                  onDecrement={() => updateQuantity(item.product.id, (qty) => qty - 1)}
                  onRemove={() => updateQuantity(item.product.id, () => 0)}
                />
              ))}
            </ul>
          )}
          <div className="cart-panel__summary">
            <div className="cart-panel__summary-row">
              <span>Subtotal</span>
              <span>{currency.format(subtotal)}</span>
            </div>
            <div className="cart-panel__summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Complimentary' : currency.format(shipping)}</span>
            </div>
            <div className="cart-panel__summary-row cart-panel__summary-row--total">
              <span>Total</span>
              <span>{currency.format(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn btn--primary btn--full"
              style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
              onClick={toggleCart}
            >
              Proceed to checkout
            </Link>
          </div>
        </section>
      )}

      {children}
    </div>
  )
}

function HomePage() {
  const { loading, data } = useQuery<ProductsQueryResult>(GET_PRODUCTS)
  const products = data?.products || []

  const categorySummaries = Object.entries(
    products.reduce<Record<string, number>>((acc: Record<string, number>, product: Product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1
      return acc
    }, {}),
  )
    .map(([category, count]) => ({ category, count: count as number }))
    .sort((a, b) => b.count - a.count)

  const heroProduct = products[0]
  const editorialHighlight = products.find((product) => product.badge === 'Limited') ?? heroProduct

  if (loading || !heroProduct) {
    return <div>Loading...</div>
  }

  return (
    <>
      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New season edit</p>
          <h1>Meet the modern home shop</h1>
          <p className="hero__lead">
            Curated furniture, lighting, and objects crafted in small batches and ready to ship.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn btn--primary">
              Shop the collection
            </Link>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() =>
                document.querySelector('#editorial')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Studio story
            </button>
          </div>
          <div className="hero__meta">
            <span>{currency.format(heroProduct.price)}</span>
            <span>{heroProduct.name}</span>
          </div>
        </div>
        <div className="hero__media">
          <img src={heroProduct.image} alt={heroProduct.name} loading="lazy" />
        </div>
      </header>

      <section className="perks">
        {perks.map((perk) => (
          <article key={perk.title}>
            <h3>{perk.title}</h3>
            <p>{perk.detail}</p>
          </article>
        ))}
      </section>

      <section className="categories">
        <div className="section-heading">
          <p className="eyebrow">Shop by room</p>
          <h2>Spaces with intention</h2>
          <p>Refresh a single corner or rethink your whole home with designer-backed palettes.</p>
        </div>
        <div className="categories__grid">
          {categorySummaries.map((category) => (
            <article key={category.category}>
              <h3>{category.category}</h3>
              <p>{category.count} curated pieces</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial" id="editorial">
        <div className="editorial__media">
          <img src={editorialHighlight.image} alt={editorialHighlight.name} loading="lazy" />
        </div>
        <div className="editorial__content">
          <p className="eyebrow">From the studio</p>
          <h2>Layered neutrals, elevated silhouettes</h2>
          <p>
            We partner with small-batch workshops to produce timeless staples. Every stitch, weave,
            and finishing touch is considered so you can style once and enjoy for years.
          </p>
          <ul>
            <li>Responsibly sourced materials and certified woods</li>
            <li>Color stories developed with interior stylists</li>
            <li>Transparent pricing and limited runs per season</li>
          </ul>
          <button type="button" className="btn btn--primary">
            Book a design consult
          </button>
        </div>
      </section>
    </>
  )
}

function App() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [highlightedProduct, setHighlightedProduct] = useState<{
    id: string
    token: number
  } | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const highlightSequenceRef = useRef(0)

  const { data: productsData } = useQuery<ProductsQueryResult>(GET_PRODUCTS)
  const products = useMemo(() => productsData?.products || [], [productsData?.products])

  const productDictionary = useMemo(
    () =>
      products.reduce<Record<string, Product>>((acc: Record<string, Product>, product: Product) => {
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

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  const toggleCart = () => setIsCartOpen((open) => !open)

  const clearCart = () => {
    setCart({})
  }

  const isHighlighted = (productId: string) => highlightedProduct?.id === productId

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/products"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProductsPage addToCart={addToCart} isHighlighted={isHighlighted} />
          </Layout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProductPage onAddToCart={addToCart} isHighlighted={isHighlighted} />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <CheckoutPage
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </Layout>
        }
      />
      <Route
        path="/checkout/:id/success"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <CheckoutSuccessPage onClearCart={clearCart} />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/account/orders"
        element={
          <Layout
            cartItems={cartItems}
            cartCount={cartCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            freeShippingMessage={freeShippingMessage}
            isCartOpen={isCartOpen}
            toggleCart={toggleCart}
            updateQuantity={updateQuantity}
          >
            <ProtectedRoute>
              <UserOrdersPage />
            </ProtectedRoute>
          </Layout>
        }
      />
    </Routes>
  )
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
