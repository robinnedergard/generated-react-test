type ColorSelectorProps = {
  colors: string[]
  selectedColor: string | null
  onColorSelect: (color: string) => void
  className?: string
  labelClassName?: string
  listClassName?: string
  optionClassName?: string
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  className = '',
  labelClassName = '',
  listClassName = '',
  optionClassName = '',
}: ColorSelectorProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className={`text-sm text-slate-600 m-0 font-semibold ${labelClassName}`}>Available colors:</p>
      <div className={`flex flex-wrap gap-3 ${listClassName}`}>
        {colors.map((color: string) => (
          <button
            key={color}
            type="button"
            className={`px-5 py-2.5 border rounded-full text-sm cursor-pointer transition-all text-slate-900 ${
              selectedColor === color
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white border-slate-200 hover:border-orange-500 hover:-translate-y-0.5'
            } ${optionClassName}`}
            onClick={() => onColorSelect(color)}
            aria-label={`Select color ${color}`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  )
}

