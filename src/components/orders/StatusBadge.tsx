type StatusBadgeProps = {
  status: string
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = getStatusLabel(status)
  
  const statusClasses: Record<string, string> = {
    completed: 'bg-green-100 text-green-600',
    processing: 'bg-blue-100 text-blue-600',
    pending: 'bg-amber-100 text-amber-600',
    failed: 'bg-red-100 text-red-600',
    cancelled: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
      statusClasses[status] || statusClasses.cancelled
    }`}>
      {label}
    </div>
  )
}

