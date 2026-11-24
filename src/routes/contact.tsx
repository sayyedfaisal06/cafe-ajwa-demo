import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BikeIcon,
  CircleCheckIcon,
  ClockIcon,
  MailIcon,
  MessageCircleIcon,
  NavigationIcon,
  PhoneIcon,
  SendIcon,
  StoreIcon,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'

import { CateringBanner } from '@/components/site/banners'
import { FaqList } from '@/components/site/faqs'
import { Container, SectionHeading } from '@/components/site/section'
import { useStoreStatus } from '@/components/site/store-status'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge, BadgeDot } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbBack,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { restaurant } from '@/data/restaurant'

export function meta() {
  return [
    { title: 'Contact Cafe Ajwa, Malwani, Malad West' },
    {
      name: 'description',
      content:
        'Call, WhatsApp or email Cafe Ajwa in Malwani, Malad West. Open every day from 12 pm to 12 am. Pickup at Gate 8, Gaikwad Nagar Bus Depot.',
    },
  ]
}

/* Header */

function PageHeader() {
  return (
    <Container className="flex flex-col gap-6 pt-6">
      <Breadcrumb>
        <BreadcrumbList className="max-sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to="/" />} className="sm:hidden">
          Home
        </BreadcrumbBack>
      </Breadcrumb>

      <div className="flex max-w-2xl flex-col items-start gap-4">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Contact</span>
        <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
          Talk to the kitchen
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Questions about an order, delivery or the menu. We reply during kitchen hours. For a large order, use the{' '}
          <Link to="/catering" className="font-medium text-primary underline underline-offset-4">
            catering page
          </Link>
          .
        </p>
      </div>
    </Container>
  )
}

/* The three ways to reach the kitchen. Each card is one link. */

const channels: { icon: LucideIcon; title: string; value: string; note: string; action: string; href: string; external?: boolean }[] = [
  {
    icon: PhoneIcon,
    title: 'Call the kitchen',
    value: restaurant.phone,
    note: 'Best for an order that is already on its way.',
    action: 'Call now',
    href: restaurant.phoneHref,
  },
  {
    icon: MessageCircleIcon,
    title: 'WhatsApp',
    value: restaurant.phone,
    note: 'The fastest reply, and you can send photos.',
    action: 'Open WhatsApp',
    href: restaurant.whatsappHref,
    external: true,
  },
  {
    icon: MailIcon,
    title: 'Email',
    value: restaurant.email,
    note: 'For longer notes and anything you want in writing.',
    action: 'Write an email',
    href: `mailto:${restaurant.email}`,
  },
]

function Channels() {
  return (
    <Container>
      <ul aria-label="Ways to reach us" className="grid gap-4 md:grid-cols-3">
        {channels.map(({ icon: Icon, title, value, note, action, href, external }) => (
          <li key={title}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors duration-150 outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="font-medium wrap-break-word text-primary">{value}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
              </div>
              <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
                {action}
                {external ? (
                  <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                ) : (
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Container>
  )
}

/* Message form. Not connected to the API yet, so sending is simulated. */

const topics = [
  { value: 'general', label: 'General enquiry' },
  { value: 'catering', label: 'Catering and events' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'partnership', label: 'Partnership' },
] as const

type Topic = (typeof topics)[number]['value']

type Values = { topic: Topic; name: string; phone: string; email: string; message: string }
type ErrorKey = 'name' | 'phone' | 'email' | 'message'

const emptyValues: Values = { topic: 'general', name: '', phone: '', email: '', message: '' }

/* The order fields appear in, so the first invalid one gets focus. */
const fieldIds: Record<ErrorKey, string> = {
  name: 'contact-name',
  phone: 'contact-phone',
  email: 'contact-email',
  message: 'contact-message',
}

function validate(values: Values): Partial<Record<ErrorKey, string>> {
  const errors: Partial<Record<ErrorKey, string>> = {}
  const email = values.email.trim()
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.phone && !email) errors.phone = 'Add a phone number or an email so we can reply.'
  else if (values.phone && !/^[6-9]\d{9}$/.test(values.phone)) errors.phone = 'Enter a 10 digit mobile number.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter an email address like name@example.com.'
  if (!values.message.trim()) errors.message = 'Write your message.'
  return errors
}

/* Keeps the 10 digit number when someone types or pastes +91 or a leading 0. */
const cleanPhone = (value: string) => {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

const formatPhone = (digits: string) => digits.replace(/^(\d{5})(\d{5})$/, '+91 $1 $2')

type Status = { state: 'editing' } | { state: 'sending' } | { state: 'sent'; message: Values }

function MessageForm() {
  const [values, setValues] = useState<Values>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({})
  const [status, setStatus] = useState<Status>({ state: 'editing' })
  const successRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // The confirmation is shorter than the form, so bring the section back under the header first.
    if (status.state !== 'sent') return
    document.getElementById('message')?.scrollIntoView({ block: 'start' })
    successRef.current?.focus({ preventScroll: true })
  }, [status.state])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    // A phone number or an email clears the shared reply error.
    const cleared = key === 'email' ? ['email', 'phone'] : [key]
    if (cleared.some((name) => name in errors)) {
      setErrors((current) => ({ ...current, ...Object.fromEntries(cleared.map((name) => [name, undefined])) }))
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = (Object.keys(fieldIds) as ErrorKey[]).find((key) => found[key])
    if (first) return document.getElementById(fieldIds[first])?.focus()

    const message = values
    setStatus({ state: 'sending' })
    await new Promise((resolve) => setTimeout(resolve, 800))
    setStatus({ state: 'sent', message })
    setValues(emptyValues)
  }

  if (status.state === 'sent') {
    const { message } = status
    const replyTo = [message.phone && formatPhone(message.phone), message.email.trim()].filter(Boolean).join(' or ')
    return (
      <div className="flex flex-col items-start gap-5 rounded-3xl border bg-card p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_12%,var(--card))] text-success">
          <CircleCheckIcon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-2">
          <h3 ref={successRef} tabIndex={-1} className="font-heading text-2xl font-semibold tracking-tight outline-none">
            Message sent
          </h3>
          <p className="text-muted-foreground">
            Thanks, {message.name.trim().split(' ')[0]}. We will reply on {replyTo} during kitchen hours,{' '}
            {restaurant.hoursLabel.toLowerCase()}.
          </p>
        </div>
        <Button variant="outline" onClick={() => setStatus({ state: 'editing' })}>
          Send another message
        </Button>
      </div>
    )
  }

  const sending = status.state === 'sending'
  const invalid = (key: ErrorKey) => (errors[key] ? true : undefined)
  const describedBy = (key: ErrorKey, help?: string) =>
    [help, errors[key] ? `${fieldIds[key]}-error` : undefined].filter(Boolean).join(' ') || undefined

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="message-form-title"
      className="flex flex-col gap-6 rounded-3xl border bg-card p-5 sm:p-8"
    >
      <div className="flex flex-col gap-1">
        <h3 id="message-form-title" className="font-heading text-xl font-semibold tracking-tight">
          Send us a message
        </h3>
        <p className="text-sm text-muted-foreground">We reply by phone or email, whichever you give us.</p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel id="contact-topic-label">What is it about?</FieldLabel>
          <ToggleGroup
            value={[values.topic]}
            onValueChange={(value) => {
              if (value.length) set('topic', value[0] as Topic)
            }}
            variant="outline"
            aria-labelledby="contact-topic-label"
          >
            {topics.map(({ value, label }) => (
              <ToggleGroupItem key={value} value={value}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>

        {values.topic === 'catering' && (
          <Alert variant="info">
            <StoreIcon />
            <AlertTitle>Planning food for a group?</AlertTitle>
            <AlertDescription>
              The <Link to="/catering">catering form</Link> asks for the date, head count and dishes, so we can quote
              faster.
            </AlertDescription>
          </Alert>
        )}

        <Field data-invalid={invalid('name')}>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => set('name', event.target.value)}
            placeholder="Your name"
            aria-invalid={invalid('name')}
            aria-describedby={describedBy('name')}
          />
          {errors.name && <FieldError id="contact-name-error">{errors.name}</FieldError>}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={invalid('phone')}>
            <FieldLabel htmlFor="contact-phone">Phone number</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="font-semibold text-foreground">+91</InputGroupText>
                <span aria-hidden="true" className="h-5 w-px bg-border" />
              </InputGroupAddon>
              <InputGroupInput
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={values.phone}
                onChange={(event) => set('phone', cleanPhone(event.target.value))}
                placeholder="98765 43210"
                aria-invalid={invalid('phone')}
                aria-describedby={describedBy('phone', 'contact-reply-help')}
              />
            </InputGroup>
            {errors.phone && <FieldError id="contact-phone-error">{errors.phone}</FieldError>}
          </Field>
          <Field data-invalid={invalid('email')}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              placeholder="name@example.com"
              aria-invalid={invalid('email')}
              aria-describedby={describedBy('email', 'contact-reply-help')}
            />
            {errors.email && <FieldError id="contact-email-error">{errors.email}</FieldError>}
          </Field>
        </div>
        <FieldDescription id="contact-reply-help" className="-mt-2">
          Give us at least one of the two so we can reply.
        </FieldDescription>

        <Field data-invalid={invalid('message')}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            value={values.message}
            onChange={(event) => set('message', event.target.value)}
            placeholder="If it is about an order, add the order number."
            aria-invalid={invalid('message')}
            aria-describedby={describedBy('message')}
          />
          {errors.message && <FieldError id="contact-message-error">{errors.message}</FieldError>}
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">For an order on its way, calling is faster.</p>
        <Button type="submit" size="lg" disabled={sending} className="max-sm:w-full">
          {sending ? <Spinner data-icon="inline-start" /> : <SendIcon data-icon="inline-start" />}
          {sending ? 'Sending' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}

/* Hours and location beside the form */

function KitchenHours() {
  const status = useStoreStatus()
  const note = {
    unknown: null,
    open: 'Taking orders until 11:30 pm',
    'closed-early': 'Opens today at 12 pm',
    'closed-late': 'Opens tomorrow at 12 pm',
  }[status]

  const rows: { icon: LucideIcon; label: string; value: ReactNode }[] = [
    { icon: ClockIcon, label: 'Open', value: restaurant.hoursLabel },
    { icon: StoreIcon, label: 'Last orders', value: '11:30 pm, 30 minutes before closing' },
    { icon: BikeIcon, label: 'Services', value: `Delivery in ${restaurant.deliveryTime}, and pickup` },
  ]

  return (
    <section aria-labelledby="hours-title" className="flex flex-col rounded-3xl border bg-card px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="hours-title" className="font-heading text-lg font-semibold">
          Kitchen hours
        </h3>
        {status !== 'unknown' && (
          <Badge variant={status === 'open' ? 'success' : 'secondary'}>
            <BadgeDot />
            {status === 'open' ? 'Open now' : 'Closed now'}
          </Badge>
        )}
      </div>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
      <dl className="mt-2 flex flex-col divide-y">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-4 py-4">
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
              <dd className="text-sm leading-relaxed">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

function VisitUs() {
  return (
    <section aria-labelledby="visit-title" className="flex flex-col overflow-hidden rounded-3xl border bg-card">
      <iframe
        title="Map of Cafe Ajwa at Gate 8, Gaikwad Nagar Bus Depot, Malwani"
        src={`https://www.google.com/maps?q=${restaurant.geo.latitude},${restaurant.geo.longitude}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full border-0 bg-secondary"
      />
      <div className="flex flex-col items-start gap-3 p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 id="visit-title" className="font-heading text-lg font-semibold">
            Visit us at Gate 8
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{restaurant.address}</p>
        </div>
        <Button render={<a href={restaurant.mapsHref} target="_blank" rel="noreferrer" />} nativeButton={false}>
          <NavigationIcon data-icon="inline-start" />
          Get directions
        </Button>
      </div>
    </section>
  )
}

function MessageSection() {
  return (
    <Container>
      <section id="message" aria-labelledby="message-title" className="flex scroll-mt-24 flex-col gap-6">
        <SectionHeading id="message-title" title="Write to us" description="For anything that does not need an answer right now." />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <MessageForm />
          <div className="flex flex-col gap-4">
            <KitchenHours />
            <VisitUs />
          </div>
        </div>
      </section>
    </Container>
  )
}

function Faqs() {
  return (
    <Container>
      <section aria-labelledby="faq-title" className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start md:gap-10">
        <SectionHeading id="faq-title" title="Common questions" description="Quick answers before you call." />
        <FaqList className="rounded-2xl border bg-card px-5" />
      </section>
    </Container>
  )
}

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-12 pb-16 sm:gap-16">
      <div className="flex flex-col gap-8">
        <PageHeader />
        <Channels />
      </div>
      <MessageSection />
      <Faqs />
      <Container>
        <CateringBanner />
      </Container>
    </div>
  )
}
