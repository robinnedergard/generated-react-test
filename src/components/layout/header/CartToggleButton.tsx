import { useCart } from '../../../contexts/CartContext'

export function CartToggleButton() {
  const { cartCount, toggleCart } = useCart()

  return (
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
  )
}

