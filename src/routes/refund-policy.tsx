import { BanIcon, ClockIcon, WalletIcon, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

import { LegalPage, type LegalSection } from '@/components/site/legal'
import { restaurant } from '@/data/restaurant'

/*
 * Refund and cancellation policy, a draft. Payment is always offline, cash on delivery or pay at
 * pickup, so a cancelled order has nothing to refund. The cancel rule follows how the ordering
 * system works today (docs/current-website.md section 6). These terms are the owner's decision and
 * need confirming before launch:
 * 1. Problems with an order are reported within 2 hours of delivery or pickup.
 * 2. Money for a refunded dish is returned by UPI or at the kitchen.
 * 3. Orders the kitchen has accepted cannot be cancelled when the customer changes their mind.
 */

export function meta() {
  return [
    { title: 'Refund and cancellation policy | Cafe Ajwa' },
    {
      name: 'description',
      content:
        'How to cancel a Cafe Ajwa order, how payment works, and what to do if something is wrong with your order.',
    },
  ]
}

const updated = '24 November 2026'

const glance: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: WalletIcon, title: 'Pay when it arrives', text: 'Cash on delivery, or pay when you collect. Nothing is paid online.' },
  { icon: BanIcon, title: 'Cancel while Placed', text: 'Cancel from your order page until the kitchen accepts it.' },
  { icon: ClockIcon, title: 'Tell us within 2 hours', text: 'Report a wrong, missing or damaged item with a photo.' },
]

function AtAGlance() {
  return (
    <ul aria-label="The policy at a glance" className="grid gap-4 md:grid-cols-3">
      {glance.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-4 rounded-2xl border bg-card p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{title}</span>
            <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

const sections: LegalSection[] = [
  {
    id: 'paying',
    title: 'Paying for your order',
    body: (
      <>
        <p>
          We do not take payment online. You pay for a delivery order when it reaches you, cash on delivery, and for a
          pickup order when you collect it from {restaurant.pickupPoint}.
        </p>
        <p>Because nothing is charged when you place an order, a cancelled order never needs a refund.</p>
      </>
    ),
  },
  {
    id: 'cancelling',
    title: 'Cancelling your order',
    body: (
      <>
        <p>
          You can cancel an order yourself while its status is <strong>Placed</strong>, which means the kitchen has not
          accepted it yet. Open the order from <Link to="/account/orders">your orders</Link> and choose Cancel order.
        </p>
        <p>
          Once the kitchen accepts the order it starts cooking, and the Cancel button goes away. If something has
          changed, call us on <a href={restaurant.phoneHref}>{restaurant.phone}</a> and we will help where we can.
        </p>
      </>
    ),
  },
  {
    id: 'we-cancel',
    title: 'If we cancel your order',
    body: (
      <p>
        Sometimes we have to cancel an order, for example when a dish runs out, the kitchen closes early or we cannot
        reach your address. We call or message you first whenever we can. You have not paid anything, so there is
        nothing to refund.
      </p>
    ),
  },
  {
    id: 'problems',
    title: 'Wrong, missing or damaged items',
    body: (
      <>
        <p>
          If an item is missing, wrong or damaged, tell us within <strong>2 hours</strong> of delivery or pickup. Send
          your order number and a photo on{' '}
          <a href={restaurant.whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          , or call us.
        </p>
        <p>
          After checking, we send the missing item, replace the dish, or return what you paid for it by UPI or at the
          kitchen.
        </p>
      </>
    ),
  },
  {
    id: 'pickup',
    title: 'Pickup orders',
    body: (
      <p>
        Pickup orders are cooked as soon as you place them. Collect yours from {restaurant.pickupPoint} before we close,
        and call us if you cannot make it.
      </p>
    ),
  },
  {
    id: 'delivery-times',
    title: 'Delivery times',
    body: (
      <p>
        Delivery usually takes {restaurant.deliveryTime}. This is an estimate, and busy evenings or traffic can make
        it longer. If your order is running late, call us and we will tell you where it is.
      </p>
    ),
  },
  {
    id: 'catering',
    title: 'Catering and bulk orders',
    body: (
      <p>
        For <Link to="/catering">catering and bulk orders</Link>, we agree payment and cancellation terms with you
        when we confirm the order.
      </p>
    ),
  },
]

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refunds and cancellations"
      summary="How to cancel an order, how payment works, and what to do if something is wrong."
      updated={updated}
      intro={<AtAGlance />}
      sections={sections}
    />
  )
}
