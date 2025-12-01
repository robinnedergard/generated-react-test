import { Link } from 'react-router-dom'

type CheckoutButtonProps = {
  onClick: () => void
}

export function CheckoutButton({ onClick }: CheckoutButtonProps) {
  return (
    <Link
      to="/checkout"
      className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 text-center block no-underline"
      onClick={onClick}
    >
      Proceed to checkout
    </Link>
  )
}

