import { cn } from 'cn'
import { MessageCircleIcon, PhoneIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'

import { accountSections } from '@/components/site/account'
import { RequireAuth } from '@/components/site/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollRow } from '@/components/ui/scroll-row'
import { toggleVariants } from '@/components/ui/toggle'
import { customer } from '@/data/account'
import { restaurant } from '@/data/restaurant'

/*
 * Shared layout for the account pages: who is signed in, the account sections and a help card.
 * Wide screens show the sections down the side. Phones show them as a row of chips above the page.
 */

const sections = accountSections

const initials = customer.name
  .split(' ')
  .map((part) => part[0])
  .join('')

function Who() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold">{customer.name}</span>
        <span className="truncate text-sm text-muted-foreground">{customer.phone}</span>
      </div>
    </div>
  )
}

function HelpCard({ className }: { className?: string }) {
  return (
    <section aria-labelledby="account-help-title" className={cn('flex flex-col gap-3 rounded-2xl bg-secondary p-5', className)}>
      <div className="flex flex-col gap-1">
        <h2 id="account-help-title" className="font-semibold">
          Need help with an order?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We can help with delivery, payments or anything else, {restaurant.hoursLabel.toLowerCase()}.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" render={<a href={restaurant.phoneHref} />} nativeButton={false}>
          <PhoneIcon data-icon="inline-start" />
          Call
        </Button>
        <Button
          size="sm"
          variant="outline"
          render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />}
          nativeButton={false}
          className="bg-card"
        >
          <MessageCircleIcon data-icon="inline-start" />
          WhatsApp
        </Button>
      </div>
    </section>
  )
}

const chipClassName = cn(toggleVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')
const activeChipClassName =
  'border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:text-primary-foreground'

export default function AccountLayout() {
  return (
    <RequireAuth>
      <AccountArea />
    </RequireAuth>
  )
}

function AccountArea() {
  const { pathname } = useLocation()
  const chipsRef = useRef<HTMLElement>(null)

  // Bring the current section's chip into view, so a long label is never hidden under the arrow.
  useEffect(() => {
    const nav = chipsRef.current
    const chip = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    const viewport = chip?.closest<HTMLElement>('[data-slot=scroll-row-viewport]') ?? nav?.parentElement
    if (!chip || !viewport) return
    viewport.scrollLeft = chip.offsetLeft - (viewport.clientWidth - chip.offsetWidth) / 2
  }, [pathname])

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 px-4 pt-6 pb-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 lg:pt-10">
      {/* Phones and tablets: who is signed in, then the sections as chips */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Who />
        <ScrollRow scrollLabel="account sections">
          <nav ref={chipsRef} aria-label="Account" className="flex w-max gap-2">
            {sections.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => cn(chipClassName, isActive && activeChipClassName)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </ScrollRow>
      </div>

      {/* Wide screens: the same sections down the side */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-6">
          <Who />
          <nav aria-label="Account">
            <ul className="flex flex-col gap-1">
              {sections.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors duration-150 outline-none hover:bg-highlight hover:text-primary focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                        isActive && 'bg-highlight text-primary',
                      )
                    }
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <HelpCard />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-10">
        <Outlet />
        <HelpCard className="lg:hidden" />
      </div>
    </div>
  )
}
