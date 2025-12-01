import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '#src/components/LoadingState'

describe('LoadingState', () => {
  it('renders default loading message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders custom loading message', () => {
    render(<LoadingState message="Fetching data..." />)
    expect(screen.getByText('Fetching data...')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />)
    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('custom-class')
  })
})

