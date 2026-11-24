import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { restaurant } from '@/data/restaurant'

/* Questions people ask the kitchen. The answers come from the business details, so they change
   when restaurant data changes. */

export const faqs: { value: string; question: string; answer: ReactNode }[] = [
  {
    value: 'hours',
    question: 'What are your hours?',
    answer: `We are open ${restaurant.hoursLabel.toLowerCase()}. ${restaurant.lastOrdersLabel}, 30 minutes before closing.`,
  },
  {
    value: 'delivery',
    question: 'Where do you deliver?',
    answer: (
      <>
        Across {restaurant.deliveryArea}. You can <Link to="/#delivery-check">check your pincode</Link> on the home
        page, and we confirm your exact address at checkout.
      </>
    ),
  },
  {
    value: 'time',
    question: 'How long does delivery take?',
    answer: `Usually ${restaurant.deliveryTime}. Every order is cooked after you place it, so busy evenings can take a little longer.`,
  },
  {
    value: 'pickup',
    question: 'Can I collect my order?',
    answer: `Yes. Choose pickup at checkout and collect it from ${restaurant.pickupPoint}.`,
  },
  {
    value: 'payment',
    question: 'How can I pay?',
    answer: 'You pay when your food reaches you, cash on delivery, or when you collect a pickup order. There is no online payment.',
  },
  {
    value: 'cancel',
    question: 'Can I cancel my order?',
    answer: (
      <>
        You can cancel from your <Link to="/account/orders">order page</Link> while its status is Placed. Once the
        kitchen has started, call us on <a href={restaurant.phoneHref}>{restaurant.phone}</a>. Our{' '}
        <Link to="/refund-policy">refund and cancellation policy</Link> has the details.
      </>
    ),
  },
  {
    value: 'catering',
    question: 'Do you take large orders?',
    answer: (
      <>
        Yes, for offices, parties and family events. Send the date and head count on the{' '}
        <Link to="/catering">catering page</Link> and we will plan the menu with you.
      </>
    ),
  },
]

/* The questions as an accordion, on the contact page and in the help panel. */
export function FaqList({ className }: { className?: string }) {
  return (
    <Accordion className={className}>
      {faqs.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
