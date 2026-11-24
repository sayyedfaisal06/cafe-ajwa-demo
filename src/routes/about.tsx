import {
  ArrowRightIcon,
  ChefHatIcon,
  CookingPotIcon,
  FlameIcon,
  PackageIcon,
  SaladIcon,
  SoupIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { CateringBanner } from '@/components/site/banners'
import { Container, SectionHeading } from '@/components/site/section'
import { VisitUs } from '@/components/site/visit-us'
import {
  Breadcrumb,
  BreadcrumbBack,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { menuItems } from '@/data/menu'
import { restaurant } from '@/data/restaurant'

/*
 * About page, following docs/redesign-plan.md section 7.9. The story keeps only what the live About
 * copy says and the current menu supports (decision D3). Claims nobody has verified yet, such as
 * Since 2001, 15K+ orders and the 4.8 rating, are left out until the owner confirms them (D4).
 * The owner still needs to supply who started the kitchen and when, and photos of the kitchen
 * and team for the photo slots.
 */

export function meta() {
  return [
    { title: 'About Cafe Ajwa, a Malwani kitchen cooking to order' },
    {
      name: 'description',
      content:
        'Cafe Ajwa is a neighbourhood kitchen in Malwani Colony, Malad West, cooking tandoor, chicken curries, paneer and Indo Chinese after you order.',
    },
  ]
}

/* An image slot until real photos of the kitchen and team arrive. */
function PhotoSlot({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center overflow-hidden rounded-3xl bg-secondary ${className ?? ''}`}>
      <Icon strokeWidth={1.25} className="size-16 text-primary/35" />
    </div>
  )
}

/* Header */

function PageHeader() {
  return (
    <Container className="flex flex-col gap-6 pt-6">
      <Breadcrumb>
        <BreadcrumbList className="max-sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to="/" />} className="sm:hidden">
          Home
        </BreadcrumbBack>
      </Breadcrumb>

      <section aria-labelledby="page-title" className="grid gap-8 md:grid-cols-2 md:items-center lg:gap-12">
        <div className="flex flex-col items-start gap-5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Our story</span>
          <h1
            id="page-title"
            className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            A Malwani kitchen that cooks after you order
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Tandoor, chicken curries, paneer and Indo Chinese from our kitchen at Gate 8, Malwani Colony. Every dish is
            made when your order comes in and sent out while it is still hot.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link to="/menu" />} nativeButton={false}>
              See the menu
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<a href="#visit" />} nativeButton={false}>
              Visit us
            </Button>
          </div>
        </div>
        <PhotoSlot icon={ChefHatIcon} className="aspect-[4/3]" />
      </section>
    </Container>
  )
}

/* Where we began */

function Story() {
  return (
    <Container>
      <section aria-labelledby="story-title" className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-12">
        <SectionHeading id="story-title" title="Where we began" />
        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-foreground/85 sm:text-lg">
          <p>
            Cafe Ajwa started with a simple belief: food should feel personal. We cook every order the way we would
            serve our own family.
          </p>
          <p>From our kitchen in Malwani Colony, we have grown by word of mouth across Malad West.</p>
        </div>
      </section>
    </Container>
  )
}

/* What we cook. Counts and examples come from the menu, so they stay right when dishes change. */

const cooking: { title: string; text: string; icon: LucideIcon; categories: string[]; examples: string[] }[] = [
  {
    title: 'Tandoor and kebabs',
    text: 'Chicken and mutton from the tandoor, marinated and cooked over high heat.',
    icon: FlameIcon,
    categories: ['tandoor-kebabs'],
    examples: ['Chicken Barra Tandoori', 'Chicken Seekh Kabab', 'Mutton Kalimiri'],
  },
  {
    title: 'Chicken curries',
    text: 'Gravies cooked fresh for each order, from Kolhapuri to Lucknowi and Afghani.',
    icon: CookingPotIcon,
    categories: ['chicken-curries'],
    examples: ['Chicken Kolhapuri', 'Chicken Lucknowi', 'Chicken Banjara Tawa'],
  },
  {
    title: 'Paneer and veg',
    text: 'Paneer gravies and dry dishes, plus everyday veg curries.',
    icon: SaladIcon,
    categories: ['paneer-veg'],
    examples: ['Paneer Tikka Masala', 'Paneer Butter Garlic', 'Veg Kaju Curry'],
  },
  {
    title: 'Indo Chinese',
    text: 'Starters, gravies, fried rice and noodles from the wok.',
    icon: SoupIcon,
    categories: ['indo-chinese-starters', 'indo-chinese-mains', 'fried-rice-noodles'],
    examples: ['Paneer Chilli Dry', 'Chicken Kung Pao', 'Chicken Hongkong Fried Rice'],
  },
]

function WhatWeCook() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading
        id="cook-title"
        title="What we cook"
        description={`${menuItems.length} dishes, with breads, rice and dal to go with them.`}
        link={{ to: '/menu', label: 'Full menu' }}
      />
      <ul aria-labelledby="cook-title" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cooking.map(({ title, text, icon: Icon, categories, examples }) => {
          const count = menuItems.filter((item) => item.category && categories.includes(item.category)).length
          return (
            <li key={title}>
              <Link
                to={`/menu/c/${categories[0]}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors duration-150 outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">{count} dishes</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
                <p className="mt-auto border-t pt-3 text-sm leading-relaxed text-foreground/80">{examples.join(', ')}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

/* How we cook, from the kitchen philosophy on the live About page. */

const principles: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ChefHatIcon,
    title: 'Cooked after you order',
    text: 'The kitchen starts your dishes when the order arrives. Nothing waits on a holding line.',
  },
  {
    icon: UtensilsCrossedIcon,
    title: 'Fresh prep every day',
    text: 'Prepared in our kitchen every day, with nothing from a freezer line.',
  },
  {
    icon: PackageIcon,
    title: 'Packed to travel',
    text: `Sealed so it reaches you hot, usually in ${restaurant.deliveryTime} around Malwani.`,
  },
]

function HowWeCook() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading id="how-title" title="How we cook" />
      <ul aria-labelledby="how-title" className="grid gap-4 md:grid-cols-3">
        {principles.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </Container>
  )
}

/* The team */

function Team() {
  return (
    <Container>
      <section
        aria-labelledby="team-title"
        className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
      >
        <PhotoSlot icon={UsersIcon} className="aspect-[16/10] rounded-none md:aspect-auto md:min-h-72" />
        <div className="flex flex-col items-start justify-center gap-3 p-6 sm:p-8">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">The people</span>
          <h2 id="team-title" className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Cooks, packers and riders
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            A small team of cooks, packers and riders runs the kitchen and brings every order to your door. We take
            pride in remembering our regulars and their favourites.
          </p>
        </div>
      </section>
    </Container>
  )
}

/* Facts the menu and kitchen hours back up. Ratings and order counts join once they are verified. */

const facts: { value: string; label: string }[] = [
  { value: `${menuItems.length}`, label: 'dishes on the menu' },
  { value: '12 hours', label: 'open every day, 12 pm to 12 am' },
  { value: '35 to 45', label: 'minutes for most deliveries' },
  { value: 'Pay later', label: 'cash on delivery or when you collect' },
]

function Facts() {
  return (
    <Container>
      <section aria-labelledby="facts-title" className="flex flex-col gap-6">
        <h2 id="facts-title" className="sr-only">
          Cafe Ajwa in numbers
        </h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-border lg:grid-cols-4">
          {facts.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1 bg-card p-5 sm:p-6">
              <dt className="order-last text-sm leading-snug text-muted-foreground">{label}</dt>
              <dd className="font-heading text-2xl font-semibold tracking-tight text-primary sm:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  )
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 sm:gap-16">
      <PageHeader />
      <Story />
      <WhatWeCook />
      <HowWeCook />
      <Facts />
      <Team />
      <div id="visit" className="scroll-mt-24">
        <VisitUs />
      </div>
      <Container>
        <CateringBanner />
      </Container>
    </div>
  )
}
