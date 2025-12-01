import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EmptyState } from '#src/components/EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />)
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('renders message when provided', () => {
    render(<EmptyState title="Empty" message="No items to display" />)
    expect(screen.getByText('No items to display')).toBeInTheDocument()
  })

  it('renders link when actionTo is provided', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Empty" actionLabel="Go Home" actionTo="/" />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Go Home' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders button when onAction is provided', async () => {
    const handleAction = vi.fn()
    const user = userEvent.setup()
    render(<EmptyState title="Empty" actionLabel="Click me" onAction={handleAction} />)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('does not render action when neither actionTo nor onAction is provided', () => {
    render(<EmptyState title="Empty" actionLabel="Should not appear" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
