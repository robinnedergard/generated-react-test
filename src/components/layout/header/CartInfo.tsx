import { useCart } from '#src/hooks/useCart'

export function CartInfo() {
  const { cartCount } = useCart()

  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-slate-400">Your bag</p>
      <p className="m-0">
        {cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''}` : 'No items yet'}
      </p>
    </div>
  )
}
