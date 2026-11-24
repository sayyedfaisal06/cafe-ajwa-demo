import {
  ArrowRightIcon,
  BikeIcon,
  ChefHatIcon,
  MapPinIcon,
  ShoppingBagIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { CateringBanner } from '@/components/site/banners'
import { CategoryGrid } from '@/components/site/category'
import { DishCard, DishRow } from '@/components/site/dish'
import { FeaturedDishes } from '@/components/site/featured-dishes'
import { Container, SectionHeading } from '@/components/site/section'
import { useStoreStatus } from '@/components/site/store-status'
import { VisitUs } from '@/components/site/visit-us'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BadgeDot } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { bestsellers, combos, featuredDishes, menuCategories } from '@/data/menu'
import { restaurant } from '@/data/restaurant'

export function meta() {
  return [
    { title: 'Cafe Ajwa, Malwani: tandoor, curries and Indo Chinese' },
    {
      name: 'description',
      content:
        'Order tandoor, chicken curries, paneer and Indo Chinese from Cafe Ajwa in Malwani, Malad West. Delivery and pickup every day, 12 pm to 12 am.',
    },
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: restaurant.name,
        url: 'https://www.cafeajwa.co',
        telephone: restaurant.phone,
        email: restaurant.email,
        servesCuisine: ['North Indian', 'Tandoor', 'Indo Chinese'],
        acceptsReservations: false,
        address: {
          '@type': 'PostalAddress',
          streetAddress: restaurant.pickupPoint,
          addressLocality: 'Malad West, Mumbai',
          addressRegion: 'Maharashtra',
          postalCode: '400095',
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', ...restaurant.geo },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '12:00',
          closes: '23:59',
        },
        hasMenu: 'https://www.cafeajwa.co/menu',
      },
    },
  ]
}

/* 1. Status strip */

function StatusStrip() {
  const status = useStoreStatus()
  const open = status === 'open'
  const message = {
    unknown: `${restaurant.hoursLabel}. ${restaurant.lastOrdersLabel}.`,
    open: 'Open now, taking orders until 11:30 pm',
    'closed-early': 'Closed now, opens today at 12 pm',
    'closed-late': 'Last orders were at 11:30 pm, opens tomorrow at 12 pm',
  }[status]

  return (
    <div
      role="status"
      data-open={open || undefined}
      className="border-b bg-secondary text-foreground data-open:border-transparent data-open:bg-primary data-open:text-primary-foreground"
    >
      <Container className="flex min-h-10 items-center justify-center gap-2 py-2 text-center text-sm font-medium">
        {status !== 'unknown' && <BadgeDot className={open ? 'bg-primary-foreground' : 'bg-muted-foreground'} />}
        <span>{message}</span>
        {open && (
          <Link to="/menu" className="font-semibold whitespace-nowrap underline underline-offset-4">
            Order now
          </Link>
        )}
      </Container>
    </div>
  )
}

/* 2. Hero */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden bg-primary text-primary-foreground">
      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-10 sm:py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-8 md:py-16">
        <div className="flex flex-col items-start gap-5">
          <h1
            id="hero-title"
            className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Tandoor, curries and Indo Chinese, cooked fresh in Malwani
          </h1>
          <p className="max-w-md text-base text-primary-foreground/80 sm:text-lg">
            Made after you order, never from a holding line. Delivery and pickup every day from 12 pm to 12 am.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              render={<Link to="/menu" />}
              nativeButton={false}
              className="bg-primary-foreground text-primary shadow-none hover:bg-primary-foreground/90 focus-visible:ring-offset-primary"
            >
              Order now
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#delivery-check" />}
              nativeButton={false}
              className="border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-offset-primary"
            >
              <MapPinIcon data-icon="inline-start" />
              Check delivery
            </Button>
          </div>
        </div>
        {/* Clip the left edge on wider screens so neighbouring dishes never slide over the headline. */}
        <div className="md:[clip-path:inset(-100vmax_-100vmax_-100vmax_0)]">
          <FeaturedDishes dishes={featuredDishes} />
        </div>
      </Container>
    </section>
  )
}

/* 3. Delivery checker. Checks the pincode against the delivery area for now. The live version
   will use the API serviceability check and the customer's location. */

type CheckResult = { state: 'idle' } | { state: 'invalid' } | { state: 'delivers'; pincode: string } | { state: 'pickup'; pincode: string }

function DeliveryChecker() {
  const [pincode, setPincode] = useState('')
  const [result, setResult] = useState<CheckResult>({ state: 'idle' })

  const check = (event: FormEvent) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(pincode)) return setResult({ state: 'invalid' })
    setResult(
      restaurant.deliveryPincodes.includes(pincode) ? { state: 'delivers', pincode } : { state: 'pickup', pincode },
    )
  }

  return (
    <Container>
      <section
        id="delivery-check"
        aria-labelledby="delivery-check-title"
        className="grid scroll-mt-24 gap-6 rounded-3xl border bg-card p-6 sm:p-8 md:grid-cols-[1fr_1.1fr] md:items-start"
      >
        <div className="flex flex-col gap-2">
          <h2 id="delivery-check-title" className="font-heading text-2xl font-semibold tracking-tight">
            Do we deliver to you?
          </h2>
          <p className="text-muted-foreground">
            We deliver across {restaurant.deliveryArea}. Pickup is always open at our kitchen.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <form onSubmit={check} noValidate className="flex items-start gap-3">
            <Field data-invalid={result.state === 'invalid' || undefined} className="flex-1">
              <FieldLabel htmlFor="delivery-pincode">Your pincode</FieldLabel>
              <Input
                id="delivery-pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="400095"
                value={pincode}
                onChange={(event) => {
                  setPincode(event.target.value.replace(/\D/g, ''))
                  if (result.state !== 'idle') setResult({ state: 'idle' })
                }}
                aria-invalid={result.state === 'invalid' || undefined}
                aria-describedby={result.state === 'invalid' ? 'delivery-pincode-error' : undefined}
              />
              {result.state === 'invalid' && <FieldError id="delivery-pincode-error">Enter a 6 digit pincode.</FieldError>}
            </Field>
            <Button type="submit" className="mt-7">
              Check
            </Button>
          </form>

          <div aria-live="polite">
            {result.state === 'delivers' && (
              <Alert variant="success">
                <BikeIcon />
                <AlertTitle>We deliver to {result.pincode}</AlertTitle>
                <AlertDescription>
                  Usually {restaurant.deliveryTime}. The delivery fee shows at checkout, where we confirm your exact
                  address. <Link to="/menu">Start your order</Link>
                </AlertDescription>
              </Alert>
            )}
            {result.state === 'pickup' && (
              <Alert variant="warning">
                <MapPinIcon />
                <AlertTitle>Pickup only for {result.pincode}</AlertTitle>
                <AlertDescription>
                  We do not deliver there yet. Order for pickup and collect it from {restaurant.pickupPoint}.{' '}
                  <a href={restaurant.mapsHref} target="_blank" rel="noreferrer">
                    Get directions
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </section>
    </Container>
  )
}

/* 4 to 6. Categories, bestsellers and combos */

function Categories() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading
        title="Browse by category"
        description="Pick a category to see its dishes."
        link={{ to: '/menu', label: 'Full menu' }}
      />
      <CategoryGrid categories={menuCategories} />
    </Container>
  )
}

function Bestsellers() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading
        title="Bestsellers"
        description="What Malwani orders most."
        link={{ to: '/menu', label: 'See all' }}
      />
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {bestsellers.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
      <div className="flex flex-col divide-y rounded-2xl border bg-card px-4 md:hidden">
        {bestsellers.slice(0, 4).map((dish) => (
          <DishRow key={dish.id} dish={dish} />
        ))}
      </div>
    </Container>
  )
}

function Combos() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading
        title="Combos"
        description="Ready made meals for one, from ₹399."
        link={{ to: '/menu/c/combos', label: 'All combos' }}
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {combos.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </Container>
  )
}

/* 9. How it works */

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShoppingBagIcon, title: 'Order in a few taps', text: 'Pick your dishes, choose delivery or pickup, and pay when your food arrives.' },
  { icon: ChefHatIcon, title: 'Cooked fresh', text: 'The kitchen starts your order as soon as it arrives. Nothing waits on a holding line.' },
  {
    icon: BikeIcon,
    title: 'Delivered hot or ready to collect',
    text: `Usually ${restaurant.deliveryTime} around Malwani, or collect it from Gate 8.`,
  },
]

function HowItWorks() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading title="How it works" />
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-heading text-2xl font-semibold text-muted-foreground/50 tabular-nums">
                0{index + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </Container>
  )
}

/* 10. Reviews. Links out to real ratings instead of showing numbers we cannot check yet. */

function Reviews() {
  return (
    <Container>
      <section
        aria-labelledby="reviews-title"
        className="flex flex-col items-start gap-4 rounded-3xl bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card text-warning">
            <StarIcon aria-hidden="true" className="size-5 fill-current" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="reviews-title" className="font-heading text-xl font-semibold tracking-tight">
              What guests say
            </h2>
            <p className="text-sm text-muted-foreground">
              Read reviews from our guests on Google. After your order arrives, you can review the dishes you tried.
            </p>
          </div>
        </div>
        <Button variant="outline" render={<a href={restaurant.mapsHref} target="_blank" rel="noreferrer" />} nativeButton={false} className="bg-card">
          Reviews on Google
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </section>
    </Container>
  )
}

export default function HomePage() {
  return (
    <>
      <StatusStrip />
      <Hero />
      <div className="flex flex-col gap-12 pt-10 pb-16 sm:gap-16 sm:pt-14">
        <DeliveryChecker />
        <Categories />
        <Bestsellers />
        <Combos />
        <HowItWorks />
        <Reviews />
        <Container>
          <CateringBanner />
        </Container>
        <VisitUs />
      </div>
    </>
  )
}
