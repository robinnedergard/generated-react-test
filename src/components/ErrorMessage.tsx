type ErrorMessageProps = {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`bg-orange-50 border border-orange-200 rounded-xl p-4 text-orange-600 ${className}`}
    >
      <p className="m-0">{message}</p>
    </div>
  )
}
