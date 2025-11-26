import type { ChangeEvent } from 'react'

type PaymentMethodSelectProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-6">
      <h2 className="text-xl mb-2 font-semibold">Payment Method</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="paymentMethod" className="text-sm font-semibold text-slate-900">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          className="px-4 py-3 border border-slate-200 rounded-xl text-base font-inherit bg-white text-slate-900 transition-colors focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          value={value}
          onChange={onChange}
          required
        >
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="DEBIT_CARD">Debit Card</option>
          <option value="PAYPAL">PayPal</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>
      </div>
    </section>
  )
}
