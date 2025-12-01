import { useCart } from '../../../contexts/CartContext'
import { CartSummary } from './CartSummary'
import { CartSidebarHeader } from './CartSidebarHeader'
import { EmptyCartMessage } from './EmptyCartMessage'
import { CartItemsList } from './CartItemsList'

export function CartSidebar() {
  const { cartItems, freeShippingMessage, isCartOpen, toggleCart, subtotal, shipping, total } =
    useCart()

  if (!isCartOpen) return null

  return (
    <section
      className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 grid gap-6 shadow-xl shadow-slate-900/10"
      aria-live="polite"
    >
      <CartSidebarHeader onClose={toggleCart} />
      <p className="text-slate-600 m-0">{freeShippingMessage}</p>
      {cartItems.length === 0 ? <EmptyCartMessage /> : <CartItemsList />}
      {cartItems.length > 0 && (
        <CartSummary subtotal={subtotal} shipping={shipping} total={total} onCheckout={toggleCart} />
      )}
    </section>
  )
}

