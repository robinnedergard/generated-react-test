import type { Product } from '../../data/products'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type CartLineItem = {
  product: Product
  quantity: number
}

type OrderSummaryProps = {
  cartItems: CartLineItem[]
  subtotal: number
  shipping: number
  total: number
}

export function OrderSummary({ cartItems, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 h-fit sticky top-8">
      <h2 className="text-2xl mb-6 font-semibold">Order Summary</h2>
      <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-slate-200">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-base mb-1 font-semibold">{item.product.name}</h3>
              <p className="text-sm text-slate-600 m-0">Quantity: {item.quantity}</p>
            </div>
            <div className="font-semibold text-base">
              {currency.format(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
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
      </div>
    </div>
  )
}
