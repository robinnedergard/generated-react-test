import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
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
    <li className="rounded-3xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between font-semibold">
        <p className="m-0">{item.product.name}</p>
        <span>{currency.format(item.product.price)}</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center border border-slate-200 rounded-full overflow-hidden"
            aria-label={`Quantity controls for ${item.product.name}`}
          >
            <button
              type="button"
              className="border-none bg-transparent px-3.5 py-1.5 text-xl cursor-pointer"
              aria-label={`Decrease quantity for ${item.product.name}`}
              onClick={onDecrement}
            >
              –
            </button>
            <span
              className="min-w-8 text-center font-semibold"
              data-testid={`cart-qty-${item.product.id}`}
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              className="border-none bg-transparent px-3.5 py-1.5 text-xl cursor-pointer"
              aria-label={`Increase quantity for ${item.product.name}`}
              onClick={onIncrement}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="border-none bg-transparent text-slate-600 cursor-pointer p-2 inline-flex items-center justify-center rounded-lg transition-all hover:text-orange-500 hover:bg-orange-50 hover:scale-110 active:scale-95"
            aria-label={`Remove all ${item.product.name} from cart`}
            onClick={onRemove}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-currentColor"
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
        <span className="font-semibold">{currency.format(item.product.price * item.quantity)}</span>
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
    <div className="max-w-[1200px] mx-auto px-5 lg:px-12 py-12 pb-16 flex flex-col gap-12">
      <div className="flex justify-between items-center bg-white rounded-3xl px-8 py-6 border border-slate-200">
        <div>
          <p className="text-xs tracking-widest uppercase text-slate-400">Your bag</p>
          <p className="m-0">
            {cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'No items yet'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/account/orders" className="text-inherit no-underline text-sm mr-2">
                {user?.email}
              </Link>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-inherit no-underline text-sm mr-2"
              onClick={() => {
                if (isCartOpen) {
                  toggleCart()
                }
              }}
            >
              Login
            </Link>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-2.5 bg-slate-900 text-white border-none rounded-full px-5 py-3 font-semibold cursor-pointer"
            onClick={toggleCart}
            data-testid="cart-toggle"
          >
            Bag
            <span
              className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-white/15"
              data-testid="cart-count"
              aria-live="polite"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {isCartOpen && (
        <section
          className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 grid gap-6 shadow-xl shadow-slate-900/10"
          aria-live="polite"
        >
          <header className="flex justify-between items-center">
            <div>
              <p className="text-xs tracking-widest uppercase text-slate-400">Shopping bag</p>
              <h2 className="m-0">Ready to ship</h2>
            </div>
            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
              onClick={toggleCart}
            >
              Hide
            </button>
          </header>
          <p className="text-slate-600 m-0">{freeShippingMessage}</p>
          {cartItems.length === 0 ? (
            <p className="p-6 rounded-3xl bg-slate-50 text-center m-0">
              Your basket is empty – add your favorite finds.
            </p>
          ) : (
            <ul className="list-none m-0 p-0 flex flex-col gap-4">
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
          <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{currency.format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Complimentary' : currency.format(shipping)}</span>
            </div>
            <div className="flex justify-between text-xl text-slate-900 font-semibold pt-3 border-t border-slate-200">
              <span>Total</span>
              <span>{currency.format(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 text-center block no-underline"
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
      <header className="bg-gradient-to-br from-white/80 to-white/10 rounded-3xl grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] overflow-hidden shadow-2xl shadow-slate-900/10">
        <div className="p-8 lg:p-16 flex flex-col gap-6">
          <p className="text-xs tracking-widest uppercase text-slate-400">New season edit</p>
          <h1 className="m-0">Meet the modern home shop</h1>
          <p className="text-lg text-slate-600 max-w-[32ch] m-0">
            Curated furniture, lighting, and objects crafted in small batches and ready to ship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 no-underline"
            >
              Shop the collection
            </Link>
            <button
              type="button"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
              onClick={() =>
                document.querySelector('#editorial')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Studio story
            </button>
          </div>
          <div className="flex gap-4 font-semibold">
            <span>{currency.format(heroProduct.price)}</span>
            <span>{heroProduct.name}</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <img
            src={heroProduct.image}
            alt={heroProduct.name}
            loading="lazy"
            className="w-full h-full object-cover min-h-80 saturate-105"
          />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        {perks.map((perk) => (
          <article
            key={perk.title}
            className="bg-white p-6 rounded-3xl border border-slate-200 min-h-[150px]"
          >
            <h3 className="mb-1.5 m-0">{perk.title}</h3>
            <p className="m-0">{perk.detail}</p>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-3xl p-8 lg:p-14 flex flex-col gap-8 border border-slate-200">
        <div className="max-w-[520px]">
          <p className="text-xs tracking-widest uppercase text-slate-400">Shop by room</p>
          <h2 className="m-0">Spaces with intention</h2>
          <p className="m-0">
            Refresh a single corner or rethink your whole home with designer-backed palettes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
          {categorySummaries.map((category) => (
            <article
              key={category.category}
              className="bg-slate-50 rounded-3xl p-5 min-h-[130px] flex flex-col justify-between"
            >
              <h3 className="m-0">{category.category}</h3>
              <p className="m-0">{category.count} curated pieces</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8 items-center bg-white rounded-3xl p-8 lg:p-14 border border-slate-200"
        id="editorial"
      >
        <div className="overflow-hidden">
          <img
            src={editorialHighlight.image}
            alt={editorialHighlight.name}
            loading="lazy"
            className="w-full rounded-3xl object-cover min-h-80"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-slate-400">From the studio</p>
          <h2 className="m-0">Layered neutrals, elevated silhouettes</h2>
          <p className="m-0">
            We partner with small-batch workshops to produce timeless staples. Every stitch, weave,
            and finishing touch is considered so you can style once and enjoy for years.
          </p>
          <ul className="pl-5 text-slate-600 leading-relaxed list-disc">
            <li>Responsibly sourced materials and certified woods</li>
            <li>Color stories developed with interior stylists</li>
            <li>Transparent pricing and limited runs per season</li>
          </ul>
          <button
            type="button"
            className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 mt-4"
          >
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
