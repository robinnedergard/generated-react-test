import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders main navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /home/i })).not.toBeNull()
    expect(screen.getByRole('link', { name: /about/i })).not.toBeNull()
    expect(screen.getByRole('link', { name: /tabs/i })).not.toBeNull()
  })
})

