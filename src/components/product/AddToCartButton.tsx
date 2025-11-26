type AddToCartButtonProps = {
  onClick: () => void
  isHighlighted: boolean
  className?: string
  highlightClassName?: string
  checkmarkClassName?: string
}

export default function AddToCartButton({
  onClick,
  isHighlighted,
  className = '',
  highlightClassName = '',
  checkmarkClassName = '',
}: AddToCartButtonProps) {
  return (
    <button
      type="button"
      className={`self-start rounded-full border-none bg-slate-900 text-white px-8 py-3 uppercase tracking-wider text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20 ${
        isHighlighted ? 'bg-green-500' : ''
      } ${className} ${isHighlighted ? highlightClassName : ''}`}
      onClick={onClick}
    >
      Add to bag
      {isHighlighted && (
        <span className={`inline-flex items-center -mr-1 ${checkmarkClassName}`} aria-label="Added to bag">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-currentColor"
          >
            <path
              d="M13.3333 4L6 11.3333L2.66667 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  )
}

