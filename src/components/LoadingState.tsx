type LoadingStateProps = {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`max-w-[1400px] mx-auto px-8 py-24 text-center flex flex-col gap-6 items-center ${className}`}
    >
      <h1 className="text-4xl m-0">{message}</h1>
    </div>
  )
}
