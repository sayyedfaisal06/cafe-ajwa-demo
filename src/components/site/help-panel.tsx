import { cn } from 'cn'
import { ArrowRightIcon, CircleCheckIcon, CircleHelpIcon, MessageCircleIcon, PackageIcon, PhoneIcon } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useMatch } from 'react-router'

import { useAuth } from '@/components/site/auth'
import { useCart } from '@/components/site/cart'
import { FaqList } from '@/components/site/faqs'
import { OrderStatusBadge, expectedBy } from '@/components/site/order'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { isActive, orders } from '@/data/orders'
import { restaurant } from '@/data/restaurant'

/*
 * The Help panel from docs/redesign-plan.md section 7.13, which replaces the live site's scripted
 * chatbot: track an order, talk to the kitchen, common questions and a message to the team. There
 * is no live chat, so nothing here promises an instant reply.
 */

function Part({ title, children }: { title: string; children: ReactNode }) {
  const id = `help-${title.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h3 id={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function TrackOrder({ close }: { close: () => void }) {
  const { signedIn } = useAuth()
  const { pathname, search } = useLocation()

  if (!signedIn) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">Log in to see where your order is.</p>
        <Button size="sm" render={<Link to={`/login?next=${encodeURIComponent(pathname + search)}`} onClick={close} />} nativeButton={false}>
          Log in
        </Button>
      </div>
    )
  }

  const active = orders.filter(isActive)
  if (active.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">Nothing is on its way right now.</p>
        <Button size="sm" variant="outline" render={<Link to="/account/orders" onClick={close} />} nativeButton={false}>
          Your orders
        </Button>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {active.map((order) => (
        <li key={order.number}>
          <Link
            to={`/orders/${order.number}`}
            onClick={close}
            className="group flex items-center gap-3 rounded-2xl border bg-card p-4 outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
              <PackageIcon aria-hidden="true" className="size-4.5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-2 text-sm font-semibold group-hover:text-primary">
                Order {order.number}
                <OrderStatusBadge order={order} />
              </span>
              <span className="text-xs text-muted-foreground">
                {order.type === 'delivery' ? `Expected by ${expectedBy(order)}` : `Ready around ${expectedBy(order)}`}
              </span>
            </span>
            <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* A note to the team, the help panel's version of the live chatbot's Leave a message. */
function LeaveMessage() {
  const { signedIn, phone } = useAuth()
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [errors, setErrors] = useState<{ message?: string; contact?: string }>({})
  const [state, setState] = useState<'editing' | 'sending' | 'sent'>('editing')
  const replyTo = signedIn && phone ? phone : contact.trim()

  const send = (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!message.trim()) found.message = 'Write your message.'
    if (!replyTo) found.contact = 'Add a phone number or email so we can reply.'
    setErrors(found)
    if (found.message) return document.getElementById('help-message')?.focus()
    if (found.contact) return document.getElementById('help-contact')?.focus()
    setState('sending')
    window.setTimeout(() => setState('sent'), 700)
  }

  if (state === 'sent') {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border bg-card p-4" role="status">
        <p className="flex items-center gap-2 text-sm font-semibold text-success">
          <CircleCheckIcon aria-hidden="true" className="size-4" />
          Message sent
        </p>
        <p className="text-sm text-muted-foreground">
          We reply on {replyTo} during kitchen hours, {restaurant.hoursLabel.toLowerCase()}.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setMessage('')
            setState('editing')
          }}
        >
          Send another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={send} noValidate className="flex flex-col gap-3">
      <Field data-invalid={errors.message ? true : undefined}>
        <FieldLabel htmlFor="help-message" className="sr-only">
          Your message
        </FieldLabel>
        <Textarea
          id="help-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setErrors((current) => ({ ...current, message: undefined }))
          }}
          placeholder="What can we help with? Add your order number if it is about an order."
          className="min-h-24"
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message && <FieldError>{errors.message}</FieldError>}
      </Field>
      {!(signedIn && phone) && (
        <Field data-invalid={errors.contact ? true : undefined}>
          <FieldLabel htmlFor="help-contact">Phone or email for our reply</FieldLabel>
          <Input
            id="help-contact"
            value={contact}
            onChange={(event) => {
              setContact(event.target.value)
              setErrors((current) => ({ ...current, contact: undefined }))
            }}
            autoComplete="email"
            aria-invalid={errors.contact ? true : undefined}
          />
          {errors.contact && <FieldError>{errors.contact}</FieldError>}
        </Field>
      )}
      <Button type="submit" variant="secondary" disabled={state === 'sending'} className="self-start">
        {state === 'sending' && <Spinner data-icon="inline-start" />}
        {state === 'sending' ? 'Sending' : 'Send message'}
      </Button>
    </form>
  )
}

export function HelpPanel() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  // On phones the button sits above the tab bar, and above the cart or Place order bar when one shows.
  const onCheckout = useMatch('/checkout') !== null
  const onDishPage = useMatch('/menu/:slug') !== null
  const barBelow = onCheckout || (count > 0 && !onDishPage)
  const close = () => setOpen(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        aria-label="Help"
        className={cn(
          'fixed right-4 z-40 size-12 rounded-full p-0 shadow-overlay md:right-6 md:bottom-6 md:h-11 md:w-auto md:px-5',
          barBelow
            ? 'bottom-[calc(8.5rem+env(safe-area-inset-bottom))]'
            : 'bottom-[calc(5rem+env(safe-area-inset-bottom))]',
        )}
      >
        <CircleHelpIcon className="size-5" />
        <span className="max-md:sr-only">Help</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>How can we help?</SheetTitle>
            <SheetDescription>The kitchen team answers during opening hours, {restaurant.hoursLabel.toLowerCase()}.</SheetDescription>
          </SheetHeader>
          {/* Any link to a page on this site closes the panel, including those in the answers. */}
          <SheetBody
            className="flex flex-col gap-7"
            onClickCapture={(event) => {
              if ((event.target as HTMLElement).closest('a[href^="/"]')) close()
            }}
          >
            <Part title="Track my order">
              <TrackOrder close={close} />
            </Part>

            <Part title="Talk to us">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />} nativeButton={false}>
                  <MessageCircleIcon data-icon="inline-start" />
                  WhatsApp
                </Button>
                <Button variant="outline" render={<a href={restaurant.phoneHref} />} nativeButton={false}>
                  <PhoneIcon data-icon="inline-start" />
                  Call
                </Button>
              </div>
            </Part>

            <Part title="Common questions">
              <FaqList className="rounded-2xl border bg-card px-4" />
            </Part>

            <Part title="Leave a message">
              <LeaveMessage />
            </Part>

            <p className="text-sm text-muted-foreground">
              More ways to reach us are on the{' '}
              <Link to="/contact" onClick={close} className="font-medium text-primary underline underline-offset-4">
                contact page
              </Link>
              .
            </p>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  )
}
