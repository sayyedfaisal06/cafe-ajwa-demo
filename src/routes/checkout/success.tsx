import { ArrowRightIcon, BikeIcon, CircleCheckIcon, ClockIcon, PackageIcon, StoreIcon, WalletIcon, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import { RequireAuth } from '@/components/site/auth'
import { expectedBy, orderTotal } from '@/components/site/order'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { checkoutSettings } from '@/data/checkout'
import { findOrder, paymentLabel } from '@/data/orders'
import { restaurant } from '@/data/restaurant'
import { formatPrice } from '@/lib/format'

import type { Route } from './+types/success'

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Order ${params.orderId} placed, Cafe Ajwa` }, { name: 'robots', content: 'noindex' }]
}

/* The confirmation after Place order, following docs/current-website.md section 6.2. */
function SuccessPage() {
  const { orderId } = useParams()
  const order = findOrder(orderId)

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon />
            </EmptyMedia>
            <EmptyTitle>We could not find order {orderId}</EmptyTitle>
            <EmptyDescription>Your orders list shows everything you have placed.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/account/orders" />} nativeButton={false}>
              Your orders
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const delivery = order.type === 'delivery'
  const rows: { icon: LucideIcon; label: string; value: ReactNode }[] = [
    {
      icon: ClockIcon,
      label: delivery ? 'Expected by' : 'Ready around',
      value: delivery
        ? `${expectedBy(order)}. Most deliveries take ${restaurant.deliveryTime}.`
        : `${expectedBy(order)}, about ${checkoutSettings.pickupMinutes} minutes after you ordered.`,
    },
    delivery
      ? { icon: BikeIcon, label: 'Delivering to', value: order.address }
      : { icon: StoreIcon, label: 'Pick up from', value: restaurant.pickupPoint },
    { icon: WalletIcon, label: 'Payment', value: `${paymentLabel(order)}, ${formatPrice(orderTotal(order))}` },
  ]

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-10 pb-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_12%,var(--card))] text-success">
          <CircleCheckIcon aria-hidden="true" className="size-8" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Order placed</h1>
          <p className="text-muted-foreground">We have sent it to the kitchen. You will see each step on the tracking page.</p>
        </div>
      </div>

      <section aria-labelledby="order-number" className="flex flex-col gap-5 rounded-3xl border bg-card p-6">
        <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-highlight p-4 text-center">
          <span className="text-sm text-muted-foreground">{delivery ? 'Your order number' : 'Show this at the counter'}</span>
          <span id="order-number" className="font-heading text-3xl font-semibold tracking-tight text-primary tabular-nums">
            Order {order.number}
          </span>
        </div>
        <dl className="flex flex-col divide-y">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <Icon aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
                <dd className="text-sm leading-relaxed">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="sm:flex-1" render={<Link to={`/orders/${order.number}`} />} nativeButton={false}>
          Track order
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button size="lg" variant="outline" className="sm:flex-1" render={<Link to="/menu" />} nativeButton={false}>
          Back to the menu
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Need to change something? You can cancel from the tracking page until the kitchen accepts it, or call us on{' '}
        <a href={restaurant.phoneHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {restaurant.phone}
        </a>
        .
      </p>
    </div>
  )
}

export default function SuccessRoute() {
  return (
    <RequireAuth>
      <SuccessPage />
    </RequireAuth>
  )
}
