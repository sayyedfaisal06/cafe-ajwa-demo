import { cn } from 'cn'
import { HomeIcon, PackageIcon, UserIcon, UtensilsIcon, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'

type Tab = { to: string; label: string; icon: LucideIcon; isActive: (path: string) => boolean }

/* The phone tab bar from the navigation table in docs/redesign-plan.md. */
const tabs: Tab[] = [
  { to: '/', label: 'Home', icon: HomeIcon, isActive: (path) => path === '/' },
  { to: '/menu', label: 'Menu', icon: UtensilsIcon, isActive: (path) => path.startsWith('/menu') },
  {
    to: '/account/orders',
    label: 'Orders',
    icon: PackageIcon,
    isActive: (path) => path.startsWith('/account/orders') || path.startsWith('/orders'),
  },
  {
    to: '/account/profile',
    label: 'Account',
    icon: UserIcon,
    isActive: (path) => path.startsWith('/account') && !path.startsWith('/account/orders'),
  },
]

export function MobileTabBar() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, isActive }) => {
          const active = isActive(pathname)
          return (
            <li key={to} className="flex">
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group/tab flex flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold text-muted-foreground outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  active && 'text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150 motion-reduce:transition-none',
                    active && 'bg-highlight'
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
