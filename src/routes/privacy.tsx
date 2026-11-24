import { Link } from 'react-router'

import { LegalPage, type LegalSection } from '@/components/site/legal'
import { restaurant } from '@/data/restaurant'

/*
 * Privacy policy, a draft. What it says the site collects follows the features in
 * docs/current-website.md: accounts, Google sign in, phone codes, saved addresses with a map pin,
 * orders, reviews, rewards and the contact and catering forms. These need confirming by the owner,
 * ideally with legal advice, before launch:
 * 1. Which outside services receive data: SMS codes, Google sign in and Maps, hosting, analytics,
 *    and what riders see.
 * 2. How long data is kept after an account is deleted.
 * 3. Which privacy law the policy cites, such as India's Digital Personal Data Protection Act, 2023.
 */

export function meta() {
  return [
    { title: 'Privacy policy | Cafe Ajwa' },
    { name: 'description', content: 'What Cafe Ajwa collects when you order, why, who it is shared with, and how to see or delete it.' },
    { tagName: 'link', rel: 'canonical', href: 'https://www.cafeajwa.co/privacy' },
  ]
}

const sections: LegalSection[] = [
  {
    id: 'collect',
    title: 'What we collect',
    body: (
      <ol>
        <li>
          <strong>Your account:</strong> your name, email, password and phone number. If you log in with Google, we
          receive your name and email from Google.
        </li>
        <li>
          <strong>Your addresses:</strong> the delivery addresses you save, the map pin you drop and any delivery
          notes.
        </li>
        <li>
          <strong>Your orders:</strong> what you order, when, delivery or pickup, coupons and reward points used.
        </li>
        <li>
          <strong>What you send us:</strong> reviews, and messages from the contact and catering forms.
        </li>
        <li>
          <strong>On your device:</strong> the site keeps your cart and whether you are logged in in your browser, so
          they are still there next time.
        </li>
      </ol>
    ),
  },
  {
    id: 'use',
    title: 'How we use it',
    body: (
      <ol>
        <li>To cook, deliver and hand over your orders, and to call you about them.</li>
        <li>To check your phone number with a one time code before your first order.</li>
        <li>To show your order history, receipts, reward points and referrals.</li>
        <li>To answer your messages and catering requests.</li>
        <li>To check an address is inside our delivery area.</li>
      </ol>
    ),
  },
  {
    id: 'share',
    title: 'Who we share it with',
    body: (
      <>
        <p>
          We do not sell your data. We share only what is needed with the services that run the site: the SMS service
          that sends your phone code, Google for log in and maps, and the company that hosts the site.
        </p>
        <p>Our own riders deliver orders, and see only your name, phone number and delivery address.</p>
      </>
    ),
  },
  {
    id: 'keep',
    title: 'How long we keep it',
    body: (
      <p>
        We keep your account while you use it. If you delete your account, it is deactivated and you are logged out.
        Your order history is kept.
      </p>
    ),
  },
  {
    id: 'choices',
    title: 'Your choices',
    body: (
      <ol>
        <li>
          See and change your details on your <Link to="/account/profile">profile</Link>, and your addresses on the{' '}
          <Link to="/account/addresses">addresses page</Link>.
        </li>
        <li>Unlink Google from your profile at any time.</li>
        <li>Delete your account from your profile.</li>
        <li>
          Ask for a copy of your data, or for it to be corrected or removed, by emailing{' '}
          <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>.
        </li>
      </ol>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>If we change how we use your data, we will update this page and the date at the top.</p>,
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      summary="What we collect when you order, why we need it, and how to see or delete it."
      updated="24 November 2026"
      sections={sections}
    />
  )
}
