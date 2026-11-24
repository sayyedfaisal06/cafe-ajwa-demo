import { Link } from 'react-router'

import { LegalPage, type LegalSection } from '@/components/site/legal'
import { restaurant } from '@/data/restaurant'

/*
 * Terms of use, a draft. The ordering, payment, coupon and points rules follow how the site works
 * (docs/current-website.md section 6, and payment is always offline). These need confirming by the
 * owner, ideally with legal advice, before launch:
 * 1. The legal name of the business and its FSSAI licence number.
 * 2. The allergy wording.
 * 3. The rules on closing accounts, and that points have no cash value and stay when the scheme
 *    changes.
 * 4. The governing law and the courts named for disputes.
 */

export function meta() {
  return [
    { title: 'Terms of use | Cafe Ajwa' },
    { name: 'description', content: 'The terms for ordering from Cafe Ajwa: accounts, prices, delivery, payment, coupons and reward points.' },
    { tagName: 'link', rel: 'canonical', href: 'https://www.cafeajwa.co/terms' },
  ]
}

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <p>
        These terms cover ordering from Cafe Ajwa, {restaurant.address}, on this website. By placing an order you agree
        to them, and to our <Link to="/refund-policy">refund and cancellation policy</Link> and{' '}
        <Link to="/privacy">privacy policy</Link>.
      </p>
    ),
  },
  {
    id: 'account',
    title: 'Your account',
    body: (
      <ol>
        <li>Give your real name, email and phone number. We check your phone number before your first order.</li>
        <li>Keep your password to yourself. You are responsible for orders placed from your account.</li>
        <li>We may close an account used to place fake orders or to misuse coupons or points.</li>
      </ol>
    ),
  },
  {
    id: 'orders',
    title: 'Orders and prices',
    body: (
      <ol>
        <li>Prices are in rupees. GST and any delivery fee are shown at checkout before you place the order.</li>
        <li>An order is confirmed when the kitchen accepts it. If a dish runs out, we call or message you before changing or cancelling the order whenever we can.</li>
        <li>Photos show how a dish is usually served. Portions and garnish can vary a little.</li>
        <li>
          If you have a food allergy, call us on <a href={restaurant.phoneHref}>{restaurant.phone}</a> before
          ordering. Our kitchen handles nuts, dairy, gluten and egg, so we cannot promise a dish is free of them.
        </li>
      </ol>
    ),
  },
  {
    id: 'delivery',
    title: 'Delivery and pickup',
    body: (
      <ol>
        <li>We deliver across {restaurant.deliveryArea}. Checkout tells you if an address is outside the area.</li>
        <li>Delivery times are estimates, usually {restaurant.deliveryTime}.</li>
        <li>Pickup orders are collected from {restaurant.pickupPoint}. Show your order number at the counter.</li>
      </ol>
    ),
  },
  {
    id: 'payment',
    title: 'Payment',
    body: (
      <p>
        We do not take payment online. You pay the full amount in cash when a delivery order arrives, or at the counter
        when you collect a pickup order.
      </p>
    ),
  },
  {
    id: 'offers',
    title: 'Coupons and reward points',
    body: (
      <ol>
        <li>One coupon per order. Each coupon shows its own conditions, such as a minimum order.</li>
        <li>
          Reward points are earned on delivered orders and can pay for part of a later order, as shown on your{' '}
          <Link to="/account/loyalty">rewards page</Link>. Points have no cash value and cannot be transferred.
        </li>
        <li>We may change or end coupons and the points scheme. Points already earned stay in your account.</li>
      </ol>
    ),
  },
  {
    id: 'reviews',
    title: 'Reviews',
    body: (
      <p>
        Reviews should be honest and about the food and service. We may remove reviews that are abusive, off topic or
        not about a real order.
      </p>
    ),
  },
  {
    id: 'catering',
    title: 'Catering and bulk orders',
    body: (
      <p>
        <Link to="/catering">Catering and bulk orders</Link> are agreed with you directly. Their menu, price, payment and
        cancellation terms are confirmed when we accept the order.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and disputes',
    body: (
      <p>
        We may update these terms, and the date at the top shows when. These terms follow the laws of India, and
        disputes are handled by the courts in Mumbai.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      summary="The rules for ordering from Cafe Ajwa: accounts, prices, delivery, payment, coupons and points."
      updated="24 November 2026"
      sections={sections}
    />
  )
}
