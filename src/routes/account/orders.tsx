import { PackageIcon } from 'lucide-react'
import { Link } from 'react-router'

import { OrderCard, orderTotal } from '@/components/site/order'
import { SectionHeading } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { customer } from '@/data/account'
import { isActive, orders } from '@/data/orders'
import { formatPrice } from '@/lib/format'

export function meta() {
  return [{ title: 'Your orders, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* The account home: orders in progress first, then the latest past orders with Reorder. */
export default function OrdersPage() {
  const active = orders.filter(isActive)
  const past = orders.filter((order) => !isActive(order))
  const spent = orders.filter((order) => order.status === 'delivered').reduce((sum, order) => sum + orderTotal(order), 0)

  const stats = [
    { label: 'Orders', value: String(orders.length) },
    { label: 'Spent', value: formatPrice(spent) },
    { label: 'Reward points', value: String(customer.rewardPoints), to: '/account/loyalty' },
  ]

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Your orders</h1>
        <p className="text-muted-foreground">Track what is on its way and order your favourites again.</p>
      </div>

      {orders.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageIcon />
            </EmptyMedia>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>Your orders show here once you place one.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/menu" />} nativeButton={false}>
              Browse menu
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border">
            {stats.map(({ label, value, to }) => (
              <div key={label} className="flex flex-col gap-1 bg-card p-4 sm:p-5">
                <dt className="order-last text-xs leading-snug text-muted-foreground sm:text-sm">
                  {to ? (
                    <Link to={to} className="underline-offset-4 hover:text-primary hover:underline">
                      {label}
                    </Link>
                  ) : (
                    label
                  )}
                </dt>
                <dd className="font-heading text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>

          {active.length > 0 && (
            <section aria-labelledby="active-title" className="flex flex-col gap-4">
              <SectionHeading id="active-title" title="In progress" />
              <div className="grid gap-4 xl:grid-cols-2">
                {active.map((order) => (
                  <OrderCard key={order.number} order={order} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section aria-labelledby="past-title" className="flex flex-col gap-4">
              <SectionHeading
                id="past-title"
                title="Past orders"
                link={past.length > 4 ? { to: '/account/orders/history', label: `See all ${past.length}` } : undefined}
              />
              <div className="grid gap-4 xl:grid-cols-2">
                {past.slice(0, 4).map((order) => (
                  <OrderCard key={order.number} order={order} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
