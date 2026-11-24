import { ClockIcon, MailIcon, MapPinIcon, MessageCircleIcon, NavigationIcon, PhoneIcon, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Container, SectionHeading } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { restaurant } from '@/data/restaurant'

/* Address, hours and contact details beside a green card with directions. Used on Home and About. */
export function VisitUs() {
  const rows: { icon: LucideIcon; label: string; value: ReactNode }[] = [
    {
      icon: MapPinIcon,
      label: 'Address',
      value: restaurant.address,
    },
    { icon: ClockIcon, label: 'Hours', value: `${restaurant.hoursLabel}. ${restaurant.lastOrdersLabel}.` },
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: (
        <a href={restaurant.phoneHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {restaurant.phone}
        </a>
      ),
    },
    {
      icon: MailIcon,
      label: 'Email',
      value: (
        <a href={`mailto:${restaurant.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {restaurant.email}
        </a>
      ),
    },
  ]

  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading title="Visit us" description="Pickup is always available at our kitchen." />
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <dl className="flex flex-col divide-y rounded-2xl border bg-card px-5">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 py-4">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
                <dd className="text-sm leading-relaxed">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary p-6 text-primary-foreground">
          <div className="flex flex-col gap-2">
            <NavigationIcon aria-hidden="true" className="size-6" />
            <p className="font-heading text-xl font-semibold">Find us at Gate 8</p>
            <p className="text-sm text-primary-foreground/80">{restaurant.pickupPoint}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              render={<a href={restaurant.mapsHref} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              className="bg-primary-foreground text-primary shadow-none hover:bg-primary-foreground/90"
            >
              Get directions
            </Button>
            <Button
              variant="outline"
              render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              className="border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <MessageCircleIcon data-icon="inline-start" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}
