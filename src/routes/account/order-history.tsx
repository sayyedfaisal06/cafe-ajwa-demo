import { ChevronRightIcon, ReceiptIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { formatTime, OrderStatusBadge, orderTotal } from '@/components/site/order'
import { BreadcrumbBack } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { isActive, orders } from '@/data/orders'
import { formatPrice } from '@/lib/format'

export function meta() {
  return [{ title: 'Order history, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

const PAGE_SIZE = 6

const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

/* Every past order, delivered and cancelled, newest first, a page at a time. */
export default function OrderHistoryPage() {
  const past = orders.filter((order) => !isActive(order))
  const [shown, setShown] = useState(PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <BreadcrumbBack render={<Link to="/account/orders" />}>Your orders</BreadcrumbBack>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Order history</h1>
          <p className="text-muted-foreground">
            {past.length} past {past.length === 1 ? 'order' : 'orders'}, delivered and cancelled.
          </p>
        </div>
      </div>

      <ul className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
        {past.slice(0, shown).map((order) => (
          <li key={order.number}>
            <Link
              to={`/orders/${order.number}`}
              className="group flex items-center gap-3 px-4 py-4 outline-none hover:bg-highlight/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:gap-4 sm:px-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <ReceiptIcon aria-hidden="true" className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold group-hover:text-primary">Order {order.number}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(order.placedAt)}, {formatTime(order.placedAt)}, {order.type}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {order.lines.map((line) => (line.quantity > 1 ? `${line.dish.name} x${line.quantity}` : line.dish.name)).join(', ')}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-sm font-semibold tabular-nums">{formatPrice(orderTotal(order))}</span>
                <OrderStatusBadge order={order} />
              </div>
              <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground max-sm:hidden" />
            </Link>
          </li>
        ))}
      </ul>

      {shown < past.length && (
        <div className="flex flex-col items-center gap-2">
          <Button variant="outline" onClick={() => setShown((count) => count + PAGE_SIZE)}>
            Load more
          </Button>
          <p className="text-xs text-muted-foreground">
            Showing {shown} of {past.length}
          </p>
        </div>
      )}
    </div>
  )
}
