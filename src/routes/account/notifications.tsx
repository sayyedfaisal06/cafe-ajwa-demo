import { BellIcon, CheckCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { notifications as sample, type Notification } from '@/data/account'

export function meta() {
  return [{ title: 'Notifications, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

const formatWhen = (date: Date, today: boolean) =>
  today
    ? date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

/* Order updates and reward notices, newest first. Opening one marks it read. */
export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(sample)
  const unread = items.filter((item) => !item.read).length
  // Read once when the page opens, which is enough to split today from earlier.
  const [now] = useState(() => new Date())
  const groups = [
    { title: 'Today', items: items.filter((item) => sameDay(item.at, now)), today: true },
    { title: 'Earlier', items: items.filter((item) => !sameDay(item.at, now)), today: false },
  ].filter((group) => group.items.length)

  const markRead = (id: string) => setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground" aria-live="polite">
            {unread ? `${unread} unread` : 'You are all caught up.'}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}>
            <CheckCheckIcon data-icon="inline-start" />
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BellIcon />
            </EmptyMedia>
            <EmptyTitle>All caught up</EmptyTitle>
            <EmptyDescription>Your order updates will show here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        groups.map((group) => (
          <section key={group.title} aria-labelledby={`notifications-${group.title}`} className="flex flex-col gap-3">
            <h2 id={`notifications-${group.title}`} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {group.title}
            </h2>
            <ul className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    onClick={() => markRead(item.id)}
                    className="group flex gap-3 px-4 py-4 outline-none hover:bg-highlight/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5"
                  >
                    <span className="flex w-2.5 shrink-0 justify-center pt-1.5">
                      {!item.read && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className={item.read ? 'text-sm font-medium text-foreground/80' : 'text-sm font-semibold'}>
                        {item.title}
                        {!item.read && <span className="sr-only">, unread</span>}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.body}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{formatWhen(item.at, group.today)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
