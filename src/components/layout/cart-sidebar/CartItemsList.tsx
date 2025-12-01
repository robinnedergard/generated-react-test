import { useCart } from '../../../contexts/CartContext'
import { CartLine } from '../../cart/CartLine'

export function CartItemsList() {
  const { cartItems, updateQuantity } = useCart()

  if (cartItems.length === 0) {
    return null
  }

  return (
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
  )
}

