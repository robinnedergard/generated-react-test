import { useNavigate } from 'react-router-dom'
import { EmptyState } from '#src/components/EmptyState'

export function EmptyCartState() {
  const navigate = useNavigate()

  return (
    <EmptyState
      title="Your cart is empty"
      message="Add items to your cart before proceeding to checkout."
      actionLabel="Continue Shopping"
      onAction={() => navigate('/products')}
    />
  )
}

