import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from './App'
import products from './data/products'

describe('App', () => {
  it('renders hero content and product cards', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /modern home shop/i })).toBeInTheDocument()
    expect(screen.getAllByTestId('product-card')).toHaveLength(products.length)
  })

  it('adds items to the basket and adjusts quantities', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    const addButtons = screen.getAllByRole('button', { name: /add to bag/i })
    await user.click(addButtons[0])

    const count = screen.getByTestId('cart-count')
    expect(count).toHaveTextContent('1')

    await user.click(screen.getByTestId('cart-toggle'))

    const firstProduct = products[0]
    const increaseButton = screen.getByRole('button', {
      name: new RegExp(`Increase quantity for ${firstProduct.name}`, 'i'),
    })
    const decreaseButton = screen.getByRole('button', {
      name: new RegExp(`Decrease quantity for ${firstProduct.name}`, 'i'),
    })
    const quantityDisplay = screen.getByTestId(`cart-qty-${firstProduct.id}`)

    await user.click(increaseButton)
    expect(quantityDisplay).toHaveTextContent('2')

    await user.click(decreaseButton)
    expect(quantityDisplay).toHaveTextContent('1')
  })
})
