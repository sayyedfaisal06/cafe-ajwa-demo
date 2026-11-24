import { BikeIcon, CircleXIcon, MapPinIcon, MessageCircleIcon, PackageIcon, PhoneIcon, StarIcon, StickyNoteIcon, StoreIcon, WalletIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'

import { FoodMark } from '@/components/food'
import { RequireAuth } from '@/components/site/auth'
import {
  expectedBy,
  formatDay,
  formatTime,
  OrderStatusBadge,
  OrderTimeline,
  ReceiptButton,
  ReorderButton,
  statusLabel,
} from '@/components/site/order'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from '@/components/ui/toast'
import { findOrder, isActive, orderReceipt, paymentLabel, type Order } from '@/data/orders'
import { restaurant } from '@/data/restaurant'
import { formatPrice } from '@/lib/format'
import { formatRupees, receiptTotals } from '@/lib/receipt'

import type { Route } from './+types/detail'

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Order ${params.orderId}, Cafe Ajwa` }, { name: 'robots', content: 'noindex' }]
}

/* Order tracking, following docs/redesign-plan.md section 7.7. Status updates without a refresh
   arrive with the API; for now the page shows the sample order as it stands. */

function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-6 ${className ?? ''}`}>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}

/* The headline for where the order stands. */
function StatusPanel({ order }: { order: Order }) {
  const done = order.updates.delivered

  if (order.status === 'cancelled') {
    return (
      <Alert variant="destructive">
        <CircleXIcon />
        <AlertTitle>
          This order was cancelled{order.updates.cancelled ? ` at ${formatTime(order.updates.cancelled)}` : ''}
        </AlertTitle>
        <AlertDescription>
          You pay when an order arrives or when you collect it, so nothing was charged.{' '}
          <Link to="/refund-policy">Refunds and cancellations</Link>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <section aria-labelledby="status-title" className="flex flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="status-title" className="font-heading text-2xl font-semibold tracking-tight">
          {order.status === 'delivered' && done
            ? `${statusLabel(order)} at ${formatTime(done)}`
            : statusLabel(order)}
        </h2>
        {isActive(order) && (
          <p className="text-muted-foreground">
            {order.type === 'delivery'
              ? `Expected by ${expectedBy(order)}. Most deliveries take ${restaurant.deliveryTime}.`
              : `Ready around ${expectedBy(order)}. We will update this page when it is ready.`}
          </p>
        )}
      </div>

      {order.type === 'pickup' && isActive(order) && (
        <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-highlight p-5 text-center">
          <span className="text-sm text-muted-foreground">Show this at the counter</span>
          <span className="font-heading text-4xl font-semibold tracking-tight text-primary tabular-nums">Order {order.number}</span>
        </div>
      )}

      <OrderTimeline order={order} />
    </section>
  )
}

function Items({ order }: { order: Order }) {
  const totals = receiptTotals(orderReceipt(order))
  const rows: { label: string; value: number }[] = [
    { label: 'Item total', value: totals.subtotal },
    ...(order.discount ? [{ label: order.discount.label, value: -order.discount.amount }] : []),
    ...(order.type === 'delivery' ? [{ label: 'Delivery fee', value: totals.deliveryFee }] : []),
    { label: 'CGST 2.5%', value: totals.cgst },
    { label: 'SGST 2.5%', value: totals.sgst },
    ...(totals.roundOff ? [{ label: 'Round off', value: totals.roundOff }] : []),
  ]

  return (
    <Panel title={`${order.lines.length} ${order.lines.length === 1 ? 'item' : 'items'}`}>
      <ul className="flex flex-col gap-3">
        {order.lines.map(({ dish, quantity, price, options }) => (
          <li key={dish.id} className="flex items-start gap-3 text-sm">
            <span className="pt-0.5">
              <FoodMark veg={dish.veg} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link to={`/menu/${dish.slug}`} className="font-medium underline-offset-4 hover:text-primary hover:underline">
                {dish.name}
              </Link>
              <span className="text-muted-foreground">
                {quantity} x {formatPrice(price)}
                {options && `, ${options}`}
              </span>
            </div>
            <span className="font-medium tabular-nums">{formatPrice(price * quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{formatRupees(value)}</dd>
          </div>
        ))}
        <div className="mt-1 flex justify-between border-t pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatRupees(totals.total)}</dd>
        </div>
      </dl>
    </Panel>
  )
}

/* After delivery, each dish links to its reviews. */
function RateDishes({ order }: { order: Order }) {
  return (
    <Panel title="How was it?">
      <p className="-mt-2 text-sm text-muted-foreground">Rate the dishes you tried. Your review helps other guests choose.</p>
      <ul className="flex flex-col divide-y">
        {order.lines.map(({ dish }) => {
          const rated = order.rated?.includes(dish.id)
          return (
            <li key={dish.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <FoodMark veg={dish.veg} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{dish.name}</span>
              {rated ? (
                <Badge variant="success">Rated</Badge>
              ) : (
                <Button size="sm" variant="outline" render={<Link to={`/menu/${dish.slug}#reviews-title`} />} nativeButton={false}>
                  <StarIcon data-icon="inline-start" />
                  Rate
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

function CancelOrder({ order, onCancel }: { order: Order; onCancel: () => void }) {
  if (order.status !== 'placed') {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        The kitchen has started this order, so it can no longer be cancelled here. Call us if something has changed.
      </p>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-muted-foreground">
        You can cancel until the kitchen accepts your order. After that, the Cancel button goes away.
      </p>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" className="border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive/5" />}>
          <CircleXIcon data-icon="inline-start" />
          Cancel order
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel order {order.number}?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Nothing has been charged, so there is nothing to refund.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep order</DialogClose>
            <DialogClose render={<Button variant="destructive" onClick={onCancel} />}>Cancel order</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Details({ order }: { order: Order }) {
  const rows: { icon: typeof MapPinIcon; label: string; value: ReactNode }[] = [
    order.type === 'delivery'
      ? { icon: BikeIcon, label: 'Delivering to', value: order.address }
      : {
          icon: StoreIcon,
          label: 'Pick up from',
          value: (
            <>
              {restaurant.pickupPoint}.{' '}
              <a href={restaurant.mapsHref} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-4">
                Get directions
              </a>
            </>
          ),
        },
    ...(order.note ? [{ icon: StickyNoteIcon, label: 'Delivery note', value: order.note }] : []),
    { icon: WalletIcon, label: 'Payment', value: paymentLabel(order) },
  ]
  return (
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
  )
}

function OrderView({ initial }: { initial: Order }) {
  const [order, setOrder] = useState(initial)
  const active = isActive(order)

  const cancel = () => {
    setOrder((current) => ({
      ...current,
      status: 'cancelled',
      updates: { ...current.updates, cancelled: new Date() },
    }))
    toast.add({ title: `Order ${order.number} cancelled`, description: 'The kitchen has been told.', type: 'success' })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-16">
      <Breadcrumb>
        <BreadcrumbList className="max-sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/account/orders" />}>Your orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order {order.number}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to="/account/orders" />} className="sm:hidden">
          Your orders
        </BreadcrumbBack>
      </Breadcrumb>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Order {order.number}</h1>
          <OrderStatusBadge order={order} />
        </div>
        <p className="text-muted-foreground">
          Placed {formatDay(order.placedAt)} at {formatTime(order.placedAt)}, {order.type}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <StatusPanel order={order} />
          <Items order={order} />
          {order.status === 'delivered' && <RateDishes order={order} />}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <Panel title={active ? 'Need to change something?' : 'This order'}>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" render={<a href={restaurant.phoneHref} />} nativeButton={false}>
                <PhoneIcon data-icon="inline-start" />
                Call
              </Button>
              <Button variant="outline" render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />} nativeButton={false}>
                <MessageCircleIcon data-icon="inline-start" />
                WhatsApp
              </Button>
            </div>
            {active ? (
              <CancelOrder order={order} onCancel={cancel} />
            ) : (
              <div className="flex flex-wrap gap-2">
                <ReorderButton order={order} size="default" />
                {order.status === 'delivered' && <ReceiptButton order={order} size="default" />}
              </div>
            )}
          </Panel>
          <Panel title="Details">
            <Details order={order} />
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function OrderDetailPage() {
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
            <EmptyDescription>Check the order number, or find it in your orders.</EmptyDescription>
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

  // A new key resets the page when moving from one order to another.
  return <OrderView key={order.number} initial={order} />
}

/* Orders belong to an account, so tracking needs you to log in. */
export default function OrderDetailRoute() {
  return (
    <RequireAuth>
      <OrderDetailPage />
    </RequireAuth>
  )
}
