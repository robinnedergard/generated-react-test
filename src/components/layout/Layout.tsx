import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { CartLine } from '../cart/CartLine'
import { currency } from '../../utils/constants'
import type { LayoutProps } from '../../types'

export function Layout({
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

