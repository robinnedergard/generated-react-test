import type { ChangeEvent } from 'react'

type FormFieldProps = {
  id: string
  name: string
  label: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  required?: boolean
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  minLength?: number
  rows?: number
  className?: string
  small?: React.ReactNode
}

export default function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
  disabled = false,
  minLength,
  rows,
  className = '',
  small,
}: FormFieldProps) {
  const isTextarea = type === 'textarea'
  const InputComponent = isTextarea ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-900">
        {label}
      </label>
      <InputComponent
        id={id}
        name={name}
        type={isTextarea ? undefined : type}
        className={`px-4 py-3 border border-slate-200 rounded-xl text-base font-inherit bg-white text-slate-900 transition-colors focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        minLength={minLength}
        rows={rows}
      />
      {small && <small className="block mt-1 text-slate-500">{small}</small>}
    </div>
  )
}

