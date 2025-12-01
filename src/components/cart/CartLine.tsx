import { currency } from '#src/utils/constants'
import type { CartLineItem } from '#src/types'

type CartLineProps = {
  item: CartLineItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export function CartLine({ item, onIncrement, onDecrement, onRemove }: CartLineProps) {
  return (
    <li className="rounded-3xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between font-semibold">
        <p className="m-0">{item.product.name}</p>
        <span>{currency.format(item.product.price)}</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex items-center border border-slate-200 rounded-full overflow-hidden"
            aria-label={`Quantity controls for ${item.product.name}`}
          >
            <button
              type="button"
              className="border-none bg-transparent px-3.5 py-1.5 text-xl cursor-pointer"
              aria-label={`Decrease quantity for ${item.product.name}`}
              onClick={onDecrement}
            >
              –
            </button>
            <span
              className="min-w-8 text-center font-semibold"
              data-testid={`cart-qty-${item.product.id}`}
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              className="border-none bg-transparent px-3.5 py-1.5 text-xl cursor-pointer"
              aria-label={`Increase quantity for ${item.product.name}`}
              onClick={onIncrement}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="border-none bg-transparent text-slate-600 cursor-pointer p-2 inline-flex items-center justify-center rounded-lg transition-all hover:text-orange-500 hover:bg-orange-50 hover:scale-110 active:scale-95"
            aria-label={`Remove all ${item.product.name} from cart`}
            onClick={onRemove}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-currentColor"
            >
              <path
                d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334ZM6.667 7.333v4M9.333 7.333v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <span className="font-semibold">{currency.format(item.product.price * item.quantity)}</span>
      </div>
    </li>
  )
}
