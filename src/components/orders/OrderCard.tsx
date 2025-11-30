import { Link } from 'react-router-dom'
import { StatusBadge } from './StatusBadge'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  status: string
  total: number
  items: OrderItem[]
  paymentMethod: string
  createdAt: string
}

type OrderCardProps = {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white">
      <header className="flex justify-between items-start mb-4">
        <div>
          <h3 className="m-0 mb-2 text-lg">Order #{order.id.slice(0, 8)}</h3>
          <p className="m-0 text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={order.status} />
          <p className="text-xl font-semibold m-0">{currency.format(order.total)}</p>
        </div>
      </header>

      <section className="mb-4">
        <p className="m-0 mb-2 text-sm text-slate-500">Items:</p>
        <ul className="m-0 pl-5 list-disc">
          {order.items.map((item, index) => (
            <li key={index} className="mb-1">
              {item.name} × {item.quantity} - {currency.format(item.price * item.quantity)}
            </li>
          ))}
        </ul>
      </section>

      <Link
        to={`/checkout/${order.id}/success`}
        className="inline-block text-inherit underline text-sm"
      >
        View order details →
      </Link>
    </div>
  )
}
