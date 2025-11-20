import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import products, { type Product } from './data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const perks = [
  { title: 'Express shipping', detail: 'Complimentary on orders over $150' },
  { title: '30-day trial', detail: 'Live with every piece before you decide' },
  { title: 'Design support', detail: 'Chat with stylists for pairing advice' },
]

const categorySummaries = Object.entries(
  products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1
    return acc
  }, {}),
)
  .map(([category, count]) => ({ category, count }))
  .sort((a, b) => b.count - a.count)

const heroProduct = products[0]
const editorialHighlight = products.find((product) => product.badge === 'Limited') ?? heroProduct
const freeShippingThreshold = 150
const flatShippingRate = 15
const productDictionary = products.reduce<Record<string, Product>>((acc, product) => {
  acc[product.id] = product
  return acc
}, {})

type CartLineItem = {
  product: Product
  quantity: number
}

function ProductCard({
  product,
  onAdd,
  isHighlighted,
}: {
  product: Product
  onAdd: () => void
  isHighlighted: boolean
}) {
  return (
    <article
      className={`product-card ${isHighlighted ? 'product-card--highlight' : ''}`}
      data-testid="product-card"
    >
      <div className="product-card__media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__meta">
          <span className="product-card__price">{currency.format(product.price)}</span>
          <span className="product-card__rating">★ {product.rating.toFixed(1)}</span>
        </div>
        <div className="product-card__colors">
          {product.colors.map((color) => (
            <span key={color}>{color}</span>
          ))}
        </div>
        <button
          type="button"
          className={`product-card__cta ${isHighlighted ? 'product-card__cta--pulse' : ''}`}
          onClick={onAdd}
        >
          Add to bag
        </button>
      </div>
    </article>
  )
}

function CartLine({
  item,
  onIncrement,
  onDecrement,
}: {
  item: CartLineItem
  onIncrement: () => void
  onDecrement: () => void
}) {
  return (
    <li className="cart-line">
      <div className="cart-line__info">
        <p>{item.product.name}</p>
        <span>{currency.format(item.product.price)}</span>
      </div>
      <div className="cart-line__controls">
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
        <span className="cart-line__total">
          {currency.format(item.product.price * item.quantity)}
        </span>
      </div>
    </li>
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

  const cartItems = useMemo<CartLineItem[]>(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = productDictionary[productId]
        if (!product) return null
        return { product, quantity }
      })
      .filter(Boolean) as CartLineItem[]
  }, [cart])

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
    const token = ++highlightSequenceRef.current
    setHighlightedProduct({ id: productId, token })
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
    }
    highlightTimeoutRef.current = window.setTimeout(() => {
      setHighlightedProduct((currentHighlight) =>
        currentHighlight?.token === token ? null : currentHighlight,
      )
    }, 900)
  }

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  const toggleCart = () => setIsCartOpen((open) => !open)

  return (
    <div className="shop">
      <div className="cart-bar">
        <div>
          <p className="eyebrow">Your bag</p>
          <p>{cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'No items yet'}</p>
        </div>
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
            <button type="button" className="btn btn--primary btn--full">
              Proceed to checkout
            </button>
          </div>
        </section>
      )}

      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New season edit</p>
          <h1>Meet the modern home shop</h1>
          <p className="hero__lead">
            Curated furniture, lighting, and objects crafted in small batches and ready to ship.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#collection">
              Shop the collection
            </a>
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

      <section className="product-grid" id="collection">
        <div className="section-heading">
          <p className="eyebrow">Featured pieces</p>
          <h2>Crafted to layer beautifully</h2>
          <p>
            Mix tactile fabrics, natural woods, and sculptural silhouettes for your signature look.
          </p>
        </div>
        <div className="product-grid__items">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addToCart(product.id)}
              isHighlighted={highlightedProduct?.id === product.id}
            />
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
    </div>
  )
}

export default App
