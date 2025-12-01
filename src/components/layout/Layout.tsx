import { Header } from './header/Header'
import { CartSidebar } from './cart-sidebar/CartSidebar'
import { BackLink } from '../BackLink'

type LayoutProps = {
  children: React.ReactNode
  backLink?: {
    to: string
    label: string
  }
}

export function Layout({ children, backLink }: LayoutProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-5 lg:px-12 py-12 pb-16 flex flex-col gap-12">
      <Header />
      <CartSidebar />
      <div className="px-8 py-16 flex flex-col gap-12">
        {backLink && <BackLink to={backLink.to} label={backLink.label} />}
        {children}
      </div>
    </div>
  )
}
