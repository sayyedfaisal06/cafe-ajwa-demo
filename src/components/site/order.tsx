import { cn } from 'cn'
import { ArrowRightIcon, BikeIcon, CheckIcon, ChevronDownIcon, CircleCheckIcon, CircleXIcon, ReceiptIcon, RotateCcwIcon, StoreIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { FoodMark } from '@/components/food'
import { ReceiptDialog } from '@/components/receipt-dialog'
import { useCart } from '@/components/site/cart'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { isActive, orderReceipt, type Order, type OrderStatus } from '@/data/orders'
import { formatPrice } from '@/lib/format'
import { receiptTotals } from '@/lib/receipt'

/* Order pieces shared by the account orders pages and the tracking page. */

export const formatTime = (date: Date) => date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
export const formatDay = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
export const orderTotal = (order: Order) => receiptTotals(orderReceipt(order)).total

/* What the customer sees for each status, following docs/current-website.md section 6.3. */
export function statusLabel(order: Order) {
  const labels: Record<OrderStatus, string> = {
    placed: 'Order placed',
    accepted: 'Accepted',
    preparing: 'Being prepared',
    ready: order.type === 'pickup' ? 'Ready for pickup' : 'Prepared',
    'out-for-delivery': 'Out for delivery',
    delivered: order.type === 'pickup' ? 'Collected' : 'Delivered',
    cancelled: 'Cancelled',
  }
  return labels[order.status]
}

export function OrderStatusBadge({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <Badge variant="destructive">
        <CircleXIcon />
        Cancelled
      </Badge>
    )
  }
  if (order.status === 'delivered') {
    return (
      <Badge variant="success">
        <CircleCheckIcon />
        {statusLabel(order)}
      </Badge>
    )
  }
  return (
    <Badge>
      <BadgeDot />
      {statusLabel(order)}
    </Badge>
  )
}

/* The steps from the plan: Placed, Accepted, Prepared, Out for delivery or Ready for pickup, Delivered. */
export function orderSteps(order: Order): { status: OrderStatus; label: string }[] {
  return order.type === 'delivery'
    ? [
        { status: 'placed', label: 'Placed' },
        { status: 'accepted', label: 'Accepted' },
        { status: 'ready', label: 'Prepared' },
        { status: 'out-for-delivery', label: 'Out for delivery' },
        { status: 'delivered', label: 'Delivered' },
      ]
    : [
        { status: 'placed', label: 'Placed' },
        { status: 'accepted', label: 'Accepted' },
        { status: 'ready', label: 'Ready for pickup' },
        { status: 'delivered', label: 'Collected' },
      ]
}

/* The index of the step the order has reached. Being prepared counts as Accepted. */
export function currentStep(order: Order) {
  const steps = orderSteps(order).map((step) => step.status)
  const status = order.status === 'preparing' ? 'accepted' : order.status
  return Math.max(0, steps.indexOf(status))
}

/* When the order should arrive or be ready, from the usual times in docs/current-website.md. */
export function expectedBy(order: Order) {
  const minutes = order.type === 'delivery' ? 45 : 25
  return formatTime(new Date(order.placedAt.getTime() + minutes * 60_000))
}

/* A short bar of the steps, for order cards. */
export function OrderProgress({ order }: { order: Order }) {
  const steps = orderSteps(order)
  const reached = currentStep(order)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {steps.map((step, index) => (
          <span key={step.status} className={cn('h-1.5 flex-1 rounded-full', index <= reached ? 'bg-primary' : 'bg-secondary')} />
        ))}
      </div>
      <p className="text-sm">
        <span className="font-semibold">{statusLabel(order)}</span>
        <span className="text-muted-foreground">
          , step {reached + 1} of {steps.length}.{' '}
          {order.type === 'delivery' ? `Expected by ${expectedBy(order)}.` : `Ready around ${expectedBy(order)}.`}
        </span>
      </p>
    </div>
  )
}

/* Adds every dish from an order back to the cart and opens it. */
export function ReorderButton({ order, size = 'sm', variant = 'default' }: { order: Order; size?: 'sm' | 'default'; variant?: 'default' | 'outline' }) {
  const { addDish, setOpen } = useCart()
  const reorder = () => {
    for (const { dish, quantity, price, options } of order.lines) {
      addDish(dish, dish.variants ? { variant: options, price, quantity } : { quantity })
    }
    const count = order.lines.reduce((sum, item) => sum + item.quantity, 0)
    toast.add({
      title: 'Added to cart',
      description: `${count} ${count === 1 ? 'item' : 'items'} from order ${order.number}`,
      type: 'success',
    })
    setOpen(true)
  }
  return (
    <Button size={size} variant={variant} onClick={reorder}>
      <RotateCcwIcon data-icon="inline-start" />
      Reorder
    </Button>
  )
}

export function ReceiptButton({ order, size = 'sm' }: { order: Order; size?: 'sm' | 'default' }) {
  return (
    <ReceiptDialog
      receipt={orderReceipt(order)}
      trigger={
        <Button variant="ghost" size={size}>
          <ReceiptIcon data-icon="inline-start" />
          Receipt
        </Button>
      }
    />
  )
}

/* The order card from the UI preview. Active orders show their progress and a Track button. */
export function OrderCard({ order }: { order: Order }) {
  const active = isActive(order)
  const [expanded, setExpanded] = useState(false)
  // Long orders show 3 dishes and a button for the rest. Hiding a single dish saves no space, so
  // an order with 4 dishes shows them all.
  const collapsible = order.lines.length > 4
  const shown = collapsible && !expanded ? order.lines.slice(0, 3) : order.lines
  const hidden = order.lines.length - 3
  const listId = `order-${order.number}-items`
  const TypeIcon = order.type === 'delivery' ? BikeIcon : StoreIcon

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <Link to={`/orders/${order.number}`} className="underline-offset-4 hover:text-primary hover:underline">
            Order {order.number}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <TypeIcon aria-hidden="true" className="size-3.5" />
          {formatDay(order.placedAt)}, {formatTime(order.placedAt)}, {order.type}
        </CardDescription>
        <CardAction>
          <OrderStatusBadge order={order} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {active && <OrderProgress order={order} />}
        <ul id={listId} className="flex flex-col gap-1.5 text-sm">
          {shown.map(({ dish, quantity, options }) => (
            <li key={dish.id} className="flex items-center gap-2">
              <FoodMark veg={dish.veg} />
              <span className="min-w-0 flex-1 truncate">
                {dish.name}
                {dish.variants && options && <span className="text-muted-foreground">, {options}</span>}
              </span>
              <span className="text-muted-foreground tabular-nums">x{quantity}</span>
            </li>
          ))}
        </ul>
        {collapsible && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((open) => !open)}
            className="-mt-2 flex w-fit items-center gap-1 rounded-sm pl-5.5 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {expanded ? 'Show less' : `Show ${hidden} more ${hidden === 1 ? 'dish' : 'dishes'}`}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn('size-4 transition-transform duration-150 motion-reduce:transition-none', expanded && 'rotate-180')}
            />
          </button>
        )}
      </CardContent>
      <CardFooter className="border-t">
        <span className="flex-1 font-semibold tabular-nums">{formatPrice(orderTotal(order))}</span>
        {active ? (
          <Button size="sm" render={<Link to={`/orders/${order.number}`} />} nativeButton={false}>
            Track order
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        ) : (
          <>
            {order.status === 'delivered' && <ReceiptButton order={order} />}
            <ReorderButton order={order} />
          </>
        )}
      </CardFooter>
    </Card>
  )
}

/* The vertical timeline on the tracking page. */
export function OrderTimeline({ order }: { order: Order }) {
  const steps = orderSteps(order)
  const reached = currentStep(order)
  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => {
        const done = index < reached || order.status === 'delivered'
        const current = index === reached && order.status !== 'delivered'
        const time = order.updates[step.status] ?? (step.status === 'accepted' ? order.updates.preparing : undefined)
        return (
          <li key={step.status} aria-current={current ? 'step' : undefined} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={cn('absolute top-8 bottom-1 left-[0.9375rem] w-0.5 rounded-full', done ? 'bg-primary' : 'bg-border')}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                done && 'border-primary bg-primary text-primary-foreground',
                current && 'border-primary bg-card',
                !done && !current && 'border-border bg-card',
              )}
            >
              {done ? <CheckIcon className="size-4" strokeWidth={3} /> : current ? <span className="size-2.5 rounded-full bg-primary" /> : null}
            </span>
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 pt-1">
              <span className={cn('font-semibold', !done && !current && 'font-medium text-muted-foreground')}>
                {step.label}
                <span className="sr-only">{done ? ', done' : current ? ', current step' : ', to come'}</span>
              </span>
              {time && <span className="text-sm text-muted-foreground tabular-nums">{formatTime(time)}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
