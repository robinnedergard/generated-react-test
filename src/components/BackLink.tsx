import { Link } from 'react-router-dom'

type BackLinkProps = {
  to: string
  label?: string
  className?: string
}

export function BackLink({
  to,
  label = '← Back',
  className = '',
}: BackLinkProps) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 text-slate-600 no-underline mb-8 text-sm transition-colors hover:text-slate-900 ${className}`}>
      {label}
    </Link>
  )
}

