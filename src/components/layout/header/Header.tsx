import { Link } from 'react-router-dom'
import { CartInfo } from './CartInfo'
import { AuthSection } from './AuthSection'
import { CartToggleButton } from './CartToggleButton'
import { usePermissions } from '#src/hooks/usePermissions'

export function Header() {
  const { hasAdminAccess } = usePermissions()

  return (
    <div className="flex justify-between items-center bg-white rounded-3xl px-8 py-6 border border-slate-200">
      <div className="flex items-center gap-4">
        <CartInfo />
        {hasAdminAccess() && (
          <Link
            to="/admin"
            className="text-sm font-semibold text-slate-700 hover:text-orange-500 transition-colors"
          >
            Admin
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <AuthSection />
        <CartToggleButton />
      </div>
    </div>
  )
}
