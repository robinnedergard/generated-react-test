import { Link } from 'react-router-dom'

type EmptyStateProps = {
  title: string
  message?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`max-w-[1400px] mx-auto px-8 py-24 text-center flex flex-col gap-6 items-center ${className}`}
    >
      <h1 className="text-4xl m-0">{title}</h1>
      {message && <p className="text-slate-600 text-lg m-0">{message}</p>}
      {actionLabel && (
        <>
          {actionTo ? (
            <Link
              to={actionTo}
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              type="button"
              className="rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}
