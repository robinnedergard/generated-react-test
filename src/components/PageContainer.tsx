import { BackLink } from './BackLink'

type PageContainerProps = {
  children: React.ReactNode
  backLink?: {
    to: string
    label: string
  }
  className?: string
  innerClassName?: string
}

export function PageContainer({
  children,
  backLink,
  className = '',
  innerClassName = '',
}: PageContainerProps) {
  return (
    <div className={`max-w-[1400px] mx-auto px-8 py-16 ${className}`}>
      <div className={innerClassName}>
        {backLink && <BackLink to={backLink.to} label={backLink.label} />}
        {children}
      </div>
    </div>
  )
}
