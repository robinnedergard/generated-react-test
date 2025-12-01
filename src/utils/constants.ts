export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const perks = [
  { title: 'Express shipping', detail: 'Complimentary on orders over $150' },
  { title: '30-day trial', detail: 'Live with every piece before you decide' },
  { title: 'Design support', detail: 'Chat with stylists for pairing advice' },
]

export const freeShippingThreshold = 150
export const flatShippingRate = 15
