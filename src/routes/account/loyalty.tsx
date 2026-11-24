import { CheckIcon, CopyIcon, GiftIcon, MinusIcon, PlusIcon, Share2Icon, ShoppingBagIcon, StarIcon, UsersIcon, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { customer, pointsHistory, referral, rewardSettings, type PointsEntry } from '@/data/account'
import { formatPrice } from '@/lib/format'

export function meta() {
  return [{ title: 'Rewards and referrals, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/*
 * Rewards: loyalty points and referrals on one page, as docs/redesign-plan.md section 7.8 asks.
 * The old /account/referrals and /account/wallet links point here.
 */

const kinds: Record<PointsEntry['kind'], { label: string; icon: LucideIcon }> = {
  earned: { label: 'Earned from order', icon: ShoppingBagIcon },
  used: { label: 'Used on order', icon: MinusIcon },
  referral: { label: 'Referral reward', icon: UsersIcon },
  review: { label: 'Review reward', icon: StarIcon },
  returned: { label: 'Points returned', icon: PlusIcon },
}

const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function Balance() {
  const { earnPer100, pointValue, maxPercent, minOrder } = rewardSettings
  return (
    <section aria-labelledby="balance-title" className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-primary p-6 text-primary-foreground">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
          <GiftIcon aria-hidden="true" className="size-4" />
          <h2 id="balance-title">Your points</h2>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-heading text-5xl font-semibold tracking-tight tabular-nums">{customer.rewardPoints}</span>
          <span className="text-primary-foreground/80">
            Worth {formatPrice(customer.rewardPoints * pointValue)} off your next orders
          </span>
        </div>
      </div>
      <dl className="flex flex-col divide-y rounded-2xl border bg-card px-5">
        <div className="flex flex-col gap-1 py-4">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">How to earn</dt>
          <dd className="text-sm leading-relaxed">
            Get {earnPer100} points for every {formatPrice(100)} spent on delivered orders, and more when you review a
            dish or a friend uses your code.
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">How to use</dt>
          <dd className="text-sm leading-relaxed">
            1 point = {formatPrice(pointValue)} at checkout, for up to {maxPercent}% of an order of{' '}
            {formatPrice(minOrder)} or more.
          </dd>
        </div>
      </dl>
    </section>
  )
}

function History() {
  return (
    <section aria-labelledby="history-title" className="flex flex-col gap-4">
      <h2 id="history-title" className="font-heading text-2xl font-semibold tracking-tight">
        Points history
      </h2>
      <ul className="flex flex-col divide-y rounded-2xl border bg-card px-4 sm:px-5">
        {pointsHistory.map((entry) => {
          const { label, icon: Icon } = kinds[entry.kind]
          const gained = entry.points > 0
          return (
            <li key={entry.id} className="flex items-center gap-3 py-3.5 sm:gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold">
                  {label}
                  {entry.order && (
                    <>
                      {' '}
                      <Link to={`/orders/${entry.order}`} className="text-primary underline-offset-4 hover:underline">
                        {entry.order}
                      </Link>
                    </>
                  )}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {formatDate(entry.at)}
                  {entry.note && `, ${entry.note}`}
                </span>
              </div>
              <span className={`text-sm font-semibold tabular-nums ${gained ? 'text-success' : 'text-foreground'}`}>
                {gained ? `+${entry.points}` : `−${Math.abs(entry.points)}`}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Refer() {
  const [copied, setCopied] = useState(false)
  const message = `Use my code ${referral.code} at Cafe Ajwa and get ${rewardSettings.referralPoints} reward points on your first order.`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code)
      setCopied(true)
      toast.add({ title: 'Code copied', description: referral.code, type: 'success' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.add({ title: 'Could not copy', description: `Your code is ${referral.code}.`, type: 'error' })
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: `${message} https://www.cafeajwa.co` })
      } catch {
        // Closing the share sheet is not an error.
      }
      return
    }
    await navigator.clipboard.writeText(message).catch(() => undefined)
    toast.add({ title: 'Message copied', description: 'Paste it into WhatsApp or any chat.', type: 'info' })
  }

  return (
    <section id="refer" aria-labelledby="refer-title" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="refer-title" className="font-heading text-2xl font-semibold tracking-tight">
          Refer a friend
        </h2>
        <p className="text-muted-foreground">
          You both get {rewardSettings.referralPoints} points when a friend places their first order with your code.
        </p>
      </div>
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <span id="code-label" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Your code
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span
              aria-labelledby="code-label"
              className="rounded-xl border-2 border-dashed border-primary/40 bg-highlight px-4 py-2 font-heading text-2xl font-semibold tracking-wider text-primary"
            >
              {referral.code}
            </span>
            <Button variant="outline" onClick={copy}>
              {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button onClick={share}>
              <Share2Icon data-icon="inline-start" />
              Share with friends
            </Button>
          </div>
        </div>
        <p className="border-t pt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {referral.friendsRewarded} {referral.friendsRewarded === 1 ? 'friend' : 'friends'}
          </span>{' '}
          rewarded so far. A code from a friend works only before your first delivered order, so this account cannot
          apply one.
        </p>
      </div>
    </section>
  )
}

export default function RewardsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Rewards and referrals</h1>
        <p className="text-muted-foreground">Points you earn on every delivered order, and points for bringing friends.</p>
      </div>
      <Balance />
      <Refer />
      <History />
    </div>
  )
}
