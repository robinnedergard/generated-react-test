// Backend API configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export async function createCheckout(input: {
  items: Array<{ productId: string; quantity: number; price: number }>
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  paymentMethod: string
}) {
  const response = await fetch(`${BACKEND_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create checkout' }))
    throw new Error(error.message || 'Failed to create checkout')
  }

  return response.json()
}

export async function getCheckout(id: string) {
  const response = await fetch(`${BACKEND_URL}/checkout/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function getCheckouts(status?: string) {
  const url = status ? `${BACKEND_URL}/checkout?status=${status}` : `${BACKEND_URL}/checkout`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return []
  }

  return response.json()
}

export async function cancelCheckout(id: string) {
  const response = await fetch(`${BACKEND_URL}/checkout/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to cancel checkout' }))
    throw new Error(error.message || 'Failed to cancel checkout')
  }

  return response.json()
}

