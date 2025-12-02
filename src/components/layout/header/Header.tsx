import { CartInfo } from './CartInfo'
import { AuthSection } from './AuthSection'
import { CartToggleButton } from './CartToggleButton'

export function Header() {
  return (
    <div className="flex justify-between items-center bg-white rounded-3xl px-8 py-6 border border-slate-200">
      <CartInfo />
      <div className="flex items-center gap-4">
        <AuthSection />
        <CartToggleButton />
      </div>
    </div>
  )
}
