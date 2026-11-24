import { cn } from 'cn'
import { LogOutIcon, SearchIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'

import logo from '@/assets/logo.png'
import { accountSections, LogOutDialog } from '@/components/site/account'
import { useAuth } from '@/components/site/auth'
import { CartButton } from '@/components/site/cart'
import { MenuSearch } from '@/components/site/menu-search'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

/* Header links from the navigation table in docs/redesign-plan.md, pointing at the current routes. */
const navLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

/* Logged out: a Log in button that returns to this page afterwards. Logged in: the account menu,
   which phones reach from the tab bar instead. */
function AccountArea() {
  const { signedIn } = useAuth()
  const { pathname, search } = useLocation()
  if (signedIn) return <AccountMenu className="hidden md:inline-flex" />
  // The auth pages already show the form, so the button would only point back at them.
  if (['/login', '/register', '/forgot-password'].includes(pathname)) return null
  const next = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + search)}`
  return (
    <Button variant="outline" size="sm" render={<Link to={`/login${next}`} />} nativeButton={false} className="mx-1">
      <UserIcon data-icon="inline-start" />
      Log in
    </Button>
  )
}

function AccountMenu({ className }: { className?: string }) {
  const [loggingOut, setLoggingOut] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Account" className={className} />}>
          <UserIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            {accountSections.map(({ to, label, icon: Icon }) => (
              <DropdownMenuItem key={to} render={<Link to={to} />}>
                <Icon />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={() => setLoggingOut(true)}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogOutDialog open={loggingOut} onOpenChange={setLoggingOut} />
    </>
  )
}

/* On phones, search opens in a panel from the top with the field focused. */
function MobileSearch({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Search the menu" className={className} />}>
        <SearchIcon />
      </SheetTrigger>
      <SheetContent side="top" showCloseButton={false}>
        <SheetHeader className="sr-only">
          <SheetTitle>Search the menu</SheetTitle>
        </SheetHeader>
        <SheetBody className="py-4">
          <MenuSearch autoFocus />
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}

/*
 * Site header. Desktop: logo, page links, inline search, account, cart and Order now. Phones: logo,
 * search and cart, with the rest in the bottom tab bar.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link to="/" aria-label="Cafe Ajwa home" className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <img src={logo} alt="" className="h-14 w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(buttonVariants({ variant: 'ghost', size: 'sm' }), isActive && 'bg-highlight text-primary')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <div className="mr-1 hidden w-64 md:block xl:w-80">
            <MenuSearch />
          </div>
          <MobileSearch className="md:hidden" />
          <AccountArea />
          <CartButton />
          <Button size="sm" render={<Link to="/menu" />} nativeButton={false} className="ml-2 hidden lg:inline-flex">
            Order now
          </Button>
        </div>
      </div>
    </header>
  )
}
