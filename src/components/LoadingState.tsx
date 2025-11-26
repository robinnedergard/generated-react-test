type LoadingStateProps = {
  message?: string
  className?: string
}

export default function LoadingState({
  message = 'Loading...',
  className = '',
}: LoadingStateProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16 flex flex-col gap-12">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className={`text-center py-16 px-8 flex flex-col gap-6 items-center ${className}`}>
          <h1 className="text-4xl m-0">{message}</h1>
        </div>
      </div>
    </div>
  )
}
