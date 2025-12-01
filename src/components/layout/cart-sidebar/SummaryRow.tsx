type SummaryRowProps = {
  label: string
  value: string | number
  isTotal?: boolean
}

export function SummaryRow({ label, value, isTotal = false }: SummaryRowProps) {
  const className = isTotal
    ? 'flex justify-between text-xl text-slate-900 font-semibold pt-3 border-t border-slate-200'
    : 'flex justify-between text-slate-600'

  return (
    <div className={className}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
