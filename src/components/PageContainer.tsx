import BackLink from './BackLink'

type PageContainerProps = {
  children: React.ReactNode
  backLink?: {
    to: string
    label: string
  }
  className?: string
  innerClassName?: string
}

export default function PageContainer({
  children,
  backLink,
  className = '',
  innerClassName = '',
}: PageContainerProps) {
  return (
    <div className={`max-w-[1400px] mx-auto px-8 py-16 flex flex-col gap-12 ${className}`}>
      <div className={`max-w-[1400px] mx-auto px-8 py-8 ${innerClassName}`}>
        {backLink && <BackLink to={backLink.to} label={backLink.label} />}
        {children}
      </div>
    </div>
  )
}

