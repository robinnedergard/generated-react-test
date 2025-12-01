import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { ErrorMessage } from '#src/components/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<ErrorMessage message="Error" className="custom-class" />)
    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('custom-class')
  })

  it('has correct styling classes', () => {
    const { container } = render(<ErrorMessage message="Error" />)
    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('bg-orange-50', 'border-orange-200', 'text-orange-600')
  })
})

