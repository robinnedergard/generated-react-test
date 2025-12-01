import { currency } from '../../../utils/constants'
import { SummaryRow } from './SummaryRow'
import { CheckoutButton } from './CheckoutButton'

type CartSummaryProps = {
  subtotal: number
  shipping: number
  total: number
  onCheckout: () => void
}

export function CartSummary({ subtotal, shipping, total, onCheckout }: CartSummaryProps) {
  return (
    <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
      <SummaryRow label="Subtotal" value={currency.format(subtotal)} />
      <SummaryRow
        label="Shipping"
        value={shipping === 0 ? 'Complimentary' : currency.format(shipping)}
      />
      <SummaryRow label="Total" value={currency.format(total)} isTotal />
      <CheckoutButton onClick={onCheckout} />
    </div>
  )
}

