import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BikeIcon,
  CameraIcon,
  ChefHatIcon,
  MapPinIcon,
  MessageCircleIcon,
  ShoppingBagIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import logo from '@/assets/logo.png'
import { useStoreStatus } from '@/components/site/store-status'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { restaurant } from '@/data/restaurant'

/*
 * The link in bio page for Instagram, following docs/redesign-plan.md section 7.12. Ordering on our
 * own website comes first. It stands alone, outside the site layout, so the links are all there
 * is. The old /social link redirects here.
 */

export function meta() {
  return [
    { title: 'Cafe Ajwa links: order online, Swiggy, Zomato, Instagram' },
    {
      name: 'description',
      content: 'Order from Cafe Ajwa in Malwani, Malad West, on our website, Swiggy or Zomato. Follow us, message us or get directions.',
    },
    { tagName: 'link', rel: 'canonical', href: 'https://www.cafeajwa.co/links' },
  ]
}

type LinkItem = { icon: LucideIcon; title: string; text: string; href: string; internal?: boolean }

const groups: { id: string; title: string; links: LinkItem[] }[] = [
  {
    id: 'links-order',
    title: 'Order',
    links: [
      { icon: BikeIcon, title: 'Order on Swiggy', text: 'Listed as Cafe Ajwaa, Malad West', href: restaurant.swiggyHref },
      { icon: BikeIcon, title: 'Order on Zomato', text: 'Listed as Cafe Ajwaa, Malad West', href: restaurant.zomatoHref },
      { icon: ChefHatIcon, title: 'Catering and bulk orders', text: 'Offices, parties and family events', href: '/catering', internal: true },
    ],
  },
  {
    id: 'links-reach',
    title: 'Reach us',
    links: [
      { icon: MessageCircleIcon, title: 'WhatsApp us', text: restaurant.phone, href: restaurant.whatsappHref },
      { icon: MapPinIcon, title: 'Get directions', text: 'Gate 8, Malwani Colony', href: restaurant.mapsHref },
    ],
  },
  {
    id: 'links-follow',
    title: 'Follow us',
    links: [
      { icon: CameraIcon, title: 'Instagram', text: '@cafeajwa_malvani', href: restaurant.instagramHref },
      { icon: UsersIcon, title: 'Facebook', text: 'Cafe Ajwa Malwani', href: restaurant.facebookHref },
    ],
  },
]

const cardClass =
  'group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors duration-150 outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'

function LinkCard({ icon: Icon, title, text, href, internal }: LinkItem) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold group-hover:text-primary">{title}</span>
        <span className="truncate text-sm text-muted-foreground">{text}</span>
      </span>
      {internal ? (
        <ArrowRightIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground group-hover:text-primary" />
      ) : (
        <ArrowUpRightIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground group-hover:text-primary" />
      )}
    </>
  )
  return internal ? (
    <Link to={href} className={cardClass}>
      {content}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className={cardClass}>
      {content}
    </a>
  )
}

function OpenStatus() {
  const status = useStoreStatus()
  if (status === 'unknown') return <p className="text-sm text-muted-foreground">{restaurant.hoursLabel}</p>
  const open = status === 'open'
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
      <Badge variant={open ? 'success' : 'secondary'}>
        <BadgeDot />
        {open ? 'Open now' : 'Closed now'}
      </Badge>
      <span>
        {open
          ? 'Taking orders until 11:30 pm'
          : status === 'closed-early'
            ? 'Opens today at 12 pm'
            : 'Opens tomorrow at 12 pm'}
      </span>
    </div>
  )
}

export default function SocialPage() {
  return (
    <main id="main" className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-8 px-4 pt-10 pb-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <img src={logo} alt="" className="h-24 w-auto" />
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Cafe Ajwa, Malwani</h1>
        <p className="text-sm text-muted-foreground">Tandoor, curries and Indo Chinese, cooked after you order.</p>
        <OpenStatus />
      </header>

      <Link
        to="/menu"
        className="group flex items-center gap-4 rounded-2xl bg-primary p-4 text-primary-foreground shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.28)] transition-colors duration-150 outline-none hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
          <ShoppingBagIcon aria-hidden="true" className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">Order on our website</span>
          <span className="text-sm text-primary-foreground/80">Delivery and pickup, straight from the kitchen</span>
        </span>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>

      {groups.map(({ id, title, links }) => (
        <section key={id} aria-labelledby={id} className="flex flex-col gap-3">
          <h2 id={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </h2>
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.title}>
                <LinkCard {...link} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="flex flex-col items-center gap-1 pt-2 text-center text-xs text-muted-foreground">
        <Link to="/" className="font-medium text-foreground/80 underline-offset-4 hover:text-primary hover:underline">
          cafeajwa.co
        </Link>
        <p>{restaurant.address}</p>
      </footer>
    </main>
  )
}
