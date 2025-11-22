import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { GET_PRODUCTS } from './graphql/queries'

// Mock data for products query
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    category: 'Test',
    price: 100,
    image: 'test.jpg',
    description: 'Test description',
    badge: null,
    featured: false,
    colors: ['Red', 'Blue'],
  },
  {
    id: '2',
    name: 'Test Product 2',
    category: 'Test',
    price: 200,
    image: 'test2.jpg',
    description: 'Test description 2',
    badge: null,
    featured: false,
    colors: ['Green'],
  },
]

const mocks = [
  {
    request: {
      query: GET_PRODUCTS,
    },
    result: {
      data: {
        products: mockProducts,
      },
    },
  },
]

describe('App', () => {
  it('renders hero content on home page', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /modern home shop/i })).toBeInTheDocument()
    })
  })

  it('renders product cards on products page', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/products']}>
          <App />
        </MemoryRouter>
      </MockedProvider>,
    )

    // Wait for products to load from GraphQL
    await waitFor(() => {
      const productCards = screen.queryAllByTestId('product-card')
      expect(productCards.length).toBeGreaterThan(0)
    })
  })

  it('adds items to the basket and adjusts quantities', async () => {
    const user = userEvent.setup()
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/products']}>
          <App />
        </MemoryRouter>
      </MockedProvider>,
    )

    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryAllByRole('button', { name: /add to bag/i }).length).toBeGreaterThan(0)
    })

    const addButtons = screen.getAllByRole('button', { name: /add to bag/i })
    await user.click(addButtons[0])

    const count = screen.getByTestId('cart-count')
    expect(count).toHaveTextContent('1')

    await user.click(screen.getByTestId('cart-toggle'))

    // Get the first product name from the cart
    const cartItems = screen.getAllByRole('listitem')
    expect(cartItems.length).toBeGreaterThan(0)

    // Find increase and decrease buttons (they should be in the cart)
    const increaseButton = screen.getByRole('button', {
      name: /increase quantity/i,
    })
    const decreaseButton = screen.getByRole('button', {
      name: /decrease quantity/i,
    })

    // Get quantity display - it should have a data-testid with cart-qty-
    const quantityDisplays = screen.queryAllByTestId(/cart-qty-/)
    expect(quantityDisplays.length).toBeGreaterThan(0)
    const quantityDisplay = quantityDisplays[0]

    await user.click(increaseButton)
    expect(quantityDisplay).toHaveTextContent('2')

    await user.click(decreaseButton)
    expect(quantityDisplay).toHaveTextContent('1')
  })
})
