import type { ChangeEvent } from 'react'
import { FormField } from '#src/components/FormField'

type ShippingAddressFormProps = {
  formData: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export function ShippingAddressForm({ formData, onChange }: ShippingAddressFormProps) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-6">
      <h2 className="text-xl mb-2 font-semibold">Shipping Address</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <FormField
          id="firstName"
          name="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={onChange}
          required
        />
        <FormField
          id="lastName"
          name="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={onChange}
          required
        />
      </div>

      <FormField
        id="address"
        name="address"
        label="Street Address"
        type="text"
        value={formData.address}
        onChange={onChange}
        required
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <FormField
          id="city"
          name="city"
          label="City"
          type="text"
          value={formData.city}
          onChange={onChange}
          required
        />
        <FormField
          id="state"
          name="state"
          label="State"
          type="text"
          value={formData.state}
          onChange={onChange}
          required
        />
        <FormField
          id="zipCode"
          name="zipCode"
          label="ZIP Code"
          type="text"
          value={formData.zipCode}
          onChange={onChange}
          required
        />
      </div>

      <FormField
        id="country"
        name="country"
        label="Country"
        type="text"
        value={formData.country}
        onChange={onChange}
        required
      />
    </section>
  )
}

