import { ArrowUpRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { restaurant } from '@/data/restaurant'

/*
 * Site footer, following the footer row of the navigation table in docs/redesign-plan.md. Offers
 * joins the lists once that page exists. On phones the bottom padding keeps the
 * last row clear of the tab bar and cart bar.
 */

const explore = [
  { to: '/menu', label: 'Menu' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/account/profile', label: 'Your account' },
]

/* Set when the page is built or loaded, which is enough for a copyright line. */
const year = new Date().getFullYear()

const policies = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/refund-policy', label: 'Refunds and cancellations' },
]

const elsewhere = [
  { href: restaurant.instagramHref, label: 'Instagram' },
  { href: restaurant.facebookHref, label: 'Facebook' },
  { href: restaurant.swiggyHref, label: 'Swiggy' },
  { href: restaurant.zomatoHref, label: 'Zomato' },
]

const linkClass =
  'rounded-sm text-sm text-foreground/80 underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary'

function Column({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 id={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary pb-40 md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-8">
        <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            aria-label="Cafe Ajwa home"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            <img src={logo} alt="" className="h-16 w-auto" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Tandoor, curries and Indo Chinese, cooked fresh after you order in Malwani, Malad West.
          </p>
          <Button render={<Link to="/menu" />} nativeButton={false}>
            Order now
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:contents">
          <Column id="footer-explore" title="Explore">
            <ul aria-labelledby="footer-explore" className="flex flex-col gap-2.5">
              {explore.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column id="footer-elsewhere" title="Find us on">
            <ul aria-labelledby="footer-elsewhere" className="flex flex-col gap-2.5">
              {elsewhere.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className={`${linkClass} inline-flex items-center gap-1`}>
                    {label}
                    <ArrowUpRightIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  </a>
                </li>
              ))}
              <li>
                <Link to="/links" className={linkClass}>
                  All our links
                </Link>
              </li>
            </ul>
          </Column>
        </div>

        <Column id="footer-visit" title="Visit us">
          <address aria-labelledby="footer-visit" className="flex flex-col gap-2.5 text-sm leading-relaxed not-italic">
            <a href={restaurant.mapsHref} target="_blank" rel="noreferrer" className={linkClass}>
              {restaurant.address}
            </a>
            <span className="text-foreground/80">
              {restaurant.hoursLabel}. {restaurant.lastOrdersLabel}.
            </span>
            <a href={restaurant.phoneHref} className={linkClass}>
              {restaurant.phone}
            </a>
            <a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" className={linkClass}>
              WhatsApp us
            </a>
            <a href={`mailto:${restaurant.email}`} className={`${linkClass} wrap-break-word`}>
              {restaurant.email}
            </a>
          </address>
        </Column>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <p>© {year} Cafe Ajwa. All rights reserved.</p>
          <nav aria-label="Policies">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {policies.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={`${linkClass} text-xs`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="sm:ml-auto">
            Crafted by{' '}
            <a
              href="https://faisal-sayyed.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline"
            >
              Faisal Sayyed
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
