type CartSidebarHeaderProps = {
  onClose: () => void
}

export function CartSidebarHeader({ onClose }: CartSidebarHeaderProps) {
  return (
    <header className="flex justify-between items-center">
      <div>
        <p className="text-xs tracking-widest uppercase text-slate-400">Shopping bag</p>
        <h2 className="m-0">Ready to ship</h2>
      </div>
      <button
        type="button"
        className="rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-all bg-transparent border border-slate-200 text-slate-900 hover:-translate-y-0.5"
        onClick={onClose}
      >
        Hide
      </button>
    </header>
  )
}

