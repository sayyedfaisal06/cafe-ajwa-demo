import {
  ArrowRightIcon,
  BikeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChefHatIcon,
  CircleCheckIcon,
  CircleHelpIcon,
  ClockIcon,
  CookingPotIcon,
  FlameIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  SendIcon,
  StoreIcon,
  UsersIcon,
  UtensilsIcon,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'

import { Container, SectionHeading } from '@/components/site/section'
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { menuItems, type Dish } from '@/data/menu'
import { restaurant } from '@/data/restaurant'
import { formatPrice } from '@/lib/format'

export function meta() {
  return [
    { title: 'Catering and bulk orders in Malwani, Malad West | Cafe Ajwa' },
    {
      name: 'description',
      content:
        'Catering from Cafe Ajwa for office lunches, parties and family events in Malwani and Malad West. Send your date and head count and we plan the menu with you.',
    },
  ]
}

/* What the customer can tick in the form. The labels are added to the message sent to staff. */

const interests = [
  { value: 'combos', label: 'Combos' },
  { value: 'starters', label: 'Starters and kebabs' },
  { value: 'curries', label: 'Curries and breads' },
  { value: 'indo-chinese', label: 'Indo Chinese' },
  { value: 'rice', label: 'Biryani and pulao' },
  { value: 'veg', label: 'Veg only' },
] as const

type Interest = (typeof interests)[number]['value']

/* The same three choices as the live site's bulk order form. */
type Fulfilment = 'delivery' | 'pickup' | 'undecided'

const fulfilmentOptions: { value: Fulfilment; title: string; description: string; icon: LucideIcon }[] = [
  { value: 'delivery', title: 'Delivery', description: 'To your venue in our delivery area.', icon: BikeIcon },
  { value: 'pickup', title: 'Pickup', description: 'Collect it from Gate 8, Malwani.', icon: StoreIcon },
  { value: 'undecided', title: 'Not sure yet', description: 'We can decide on the call.', icon: CircleHelpIcon },
]

/* Header */

const quoteChecklist: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UsersIcon, title: 'Head count', text: 'How many guests, or how many plates.' },
  { icon: CalendarDaysIcon, title: 'Date and time', text: 'The day and when you want to eat.' },
  { icon: UtensilsIcon, title: 'Dishes', text: 'What you have in mind, and how many are veg.' },
  { icon: BikeIcon, title: 'Delivery or pickup', text: 'Where the food needs to go.' },
]

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
            <BreadcrumbPage>Catering and bulk orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to="/" />} className="sm:hidden">
          Home
        </BreadcrumbBack>
      </Breadcrumb>

      <section aria-labelledby="page-title" className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center lg:gap-12">
        <div className="flex flex-col items-start gap-5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Catering and bulk orders</span>
          <h1
            id="page-title"
            className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Food for your office, party or family event
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Tell us the date and how many people you are feeding. We plan the menu with you, cook it fresh and deliver
            across Malwani and Malad West, or have it ready to collect.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<a href="#enquiry" />} nativeButton={false}>
              Plan your order
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<a href={restaurant.phoneHref} />} nativeButton={false}>
              <PhoneIcon data-icon="inline-start" />
              Call
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />}
              nativeButton={false}
            >
              <MessageCircleIcon data-icon="inline-start" />
              WhatsApp
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-secondary p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight">What helps us quote faster</h2>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {quoteChecklist.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                  <Icon aria-hidden="true" className="size-4.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-sm leading-snug text-muted-foreground">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Container>
  )
}

/* How it works */

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: SendIcon,
    title: 'Send your request',
    text: 'Fill in the form below or message us on WhatsApp with your date and head count.',
  },
  {
    icon: PhoneIcon,
    title: 'We call you back',
    text: 'We suggest dishes and quantities for your group and confirm the price with you.',
  },
  {
    icon: ChefHatIcon,
    title: 'Cooked fresh for your event',
    text: 'Delivered to your venue in our delivery area, or packed and ready to collect at Gate 8.',
  },
]

function HowItWorks() {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading id="how-title" title="How catering works" />
      <ol aria-labelledby="how-title" className="grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="font-heading text-2xl font-semibold text-muted-foreground/50 tabular-nums">
                0{index + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </Container>
  )
}

/* Menu ideas. Built from dishes on the menu with their regular prices. Group prices are agreed on
   the call, so the page does not show package prices the restaurant has not set. */

const dishByName = (name: string) => menuItems.find((item) => item.name === name) as Dish

const menuIdeas: { title: string; text: string; icon: LucideIcon; dishes: Dish[]; interests: Interest[] }[] = [
  {
    title: 'Office lunch',
    text: 'A packed combo for each person, so the whole team eats at the same time.',
    icon: BriefcaseIcon,
    dishes: ['Chicken Biryani Combo', 'Butter Chicken Combo', 'Chicken Hakka Noodles Combo'].map(dishByName),
    interests: ['combos'],
  },
  {
    title: 'Party starters',
    text: 'Kebabs and dry starters by the plate, for birthdays and get togethers.',
    icon: FlameIcon,
    dishes: ['Chicken Seekh Kabab', 'Chicken Pahadi Kabab', 'Lollipop Masala Dry', 'Paneer Chilli Dry'].map(dishByName),
    interests: ['starters'],
  },
  {
    title: 'Family feast',
    text: 'Curries, pulao and tandoor breads to share, for family functions at home.',
    icon: CookingPotIcon,
    dishes: ['Chicken Kolhapuri', 'Paneer Tikka Masala', 'Chicken Pulao', 'Tandoori Butter Paratha'].map(dishByName),
    interests: ['curries', 'rice'],
  },
]

function MenuIdeas({ onChoose }: { onChoose: (choice: Interest[]) => void }) {
  return (
    <Container className="flex flex-col gap-6">
      <SectionHeading
        id="ideas-title"
        title="Menu ideas for groups"
        description="A starting point. We can cook anything from the menu in bulk."
      />
      <ul aria-labelledby="ideas-title" className="grid gap-4 md:grid-cols-3">
        {menuIdeas.map(({ title, text, icon: Icon, dishes, interests: choice }) => (
          <li key={title} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
            <ul className="flex flex-col divide-y border-y text-sm">
              {dishes.map((dish) => (
                <li key={dish.id} className="flex items-baseline justify-between gap-3 py-2.5">
                  <Link to={`/menu/${dish.slug}`} className="underline-offset-4 hover:text-primary hover:underline">
                    {dish.name}
                    {dish.options && <span className="text-muted-foreground"> ({dish.options})</span>}
                  </Link>
                  <span className="shrink-0 font-medium tabular-nums">{formatPrice(dish.price)}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-auto self-start" onClick={() => onChoose(choice)}>
              Ask about this menu
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Prices are our regular menu prices for one portion. We confirm the price for your group when we call.
      </p>
    </Container>
  )
}

/* Enquiry form */

type Values = {
  estimatedQuantity: string
  preferredDate: string
  fulfillmentPreference: Fulfilment
  interests: Interest[]
  requirements: string
  name: string
  phone: string
  email: string
  company: string
}

type ErrorKey = 'estimatedQuantity' | 'preferredDate' | 'name' | 'phone' | 'email'

const emptyValues: Values = {
  estimatedQuantity: '',
  preferredDate: '',
  fulfillmentPreference: 'undecided',
  interests: [],
  requirements: '',
  name: '',
  phone: '',
  email: '',
  company: '',
}

/* The order fields appear in, so the first invalid one gets focus. */
const fieldIds: Record<ErrorKey, string> = {
  estimatedQuantity: 'bulk-quantity',
  preferredDate: 'bulk-date',
  name: 'bulk-name',
  phone: 'bulk-phone',
  email: 'bulk-email',
}

/* Today in India Standard Time, in the form 2026-12-31. */
const todayInIndia = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

function validate(values: Values): Partial<Record<ErrorKey, string>> {
  const errors: Partial<Record<ErrorKey, string>> = {}
  if (!values.estimatedQuantity.trim()) errors.estimatedQuantity = 'Tell us roughly how many people or plates.'
  if (values.preferredDate && values.preferredDate < todayInIndia()) errors.preferredDate = 'Pick today or a later date.'
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.phone) errors.phone = 'Enter your phone number so we can call you back.'
  else if (!/^[6-9]\d{9}$/.test(values.phone)) errors.phone = 'Enter a 10 digit mobile number.'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter an email address like name@example.com.'
  }
  return errors
}

const fulfilmentLabel = (value: Fulfilment) => fulfilmentOptions.find((option) => option.value === value)!.title

/* Keeps the 10 digit number when someone types or pastes +91 or a leading 0. */
const cleanPhone = (value: string) => {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

type Status = { state: 'editing' } | { state: 'sending' } | { state: 'sent'; request: Values }

function EnquiryForm({ values, setValues }: { values: Values; setValues: (update: (values: Values) => Values) => void }) {
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({})
  const [status, setStatus] = useState<Status>({ state: 'editing' })
  const [minDate, setMinDate] = useState<string>()
  const successRef = useRef<HTMLHeadingElement>(null)

  // Worked out in the browser so the prerendered page never carries a stale date.
  useEffect(() => setMinDate(todayInIndia()), [])

  useEffect(() => {
    // The confirmation is much shorter than the form, so bring the section back under the header first.
    if (status.state !== 'sent') return
    document.getElementById('enquiry')?.scrollIntoView({ block: 'start' })
    successRef.current?.focus({ preventScroll: true })
  }, [status.state])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = (Object.keys(fieldIds) as ErrorKey[]).find((key) => found[key])
    if (first) return document.getElementById(fieldIds[first])?.focus()

    // The form is not connected to the API yet, so sending is simulated.
    const request = values
    setStatus({ state: 'sending' })
    await new Promise((resolve) => setTimeout(resolve, 800))
    setStatus({ state: 'sent', request })
    setValues(() => emptyValues)
  }

  if (status.state === 'sent') {
    const { request } = status
    const summary: { label: string; value: string }[] = [
      { label: 'Quantity', value: request.estimatedQuantity.trim() },
      { label: 'Date', value: request.preferredDate ? formatDate(request.preferredDate) : 'Not set yet' },
      { label: 'Delivery or pickup', value: fulfilmentLabel(request.fulfillmentPreference) },
    ]
    return (
      <div className="flex flex-col items-start gap-5 rounded-3xl border bg-card p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_12%,var(--card))] text-success">
          <CircleCheckIcon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-2">
          <h3 ref={successRef} tabIndex={-1} className="font-heading text-2xl font-semibold tracking-tight outline-none">
            Request received
          </h3>
          <p className="text-muted-foreground">
            Thanks, {request.name.trim().split(' ')[0]}. We will call you on{' '}
            {request.phone.replace(/^(\d{5})(\d{5})$/, '+91 $1 $2')} during kitchen hours to plan the menu and confirm the
            price.
          </p>
        </div>
        <dl className="grid w-full gap-x-6 gap-y-3 rounded-2xl bg-secondary p-4 sm:grid-cols-3">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
              <dd className="text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setStatus({ state: 'editing' })}>
            Send another request
          </Button>
          <Button variant="ghost" render={<Link to="/menu" />} nativeButton={false}>
            Browse the menu
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
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
      aria-labelledby="enquiry-form-title"
      className="flex flex-col gap-8 rounded-3xl border bg-card p-5 sm:p-8"
    >
      <div className="flex flex-col gap-1">
        <h3 id="enquiry-form-title" className="font-heading text-xl font-semibold tracking-tight">
          Tell us what you need
        </h3>
        <p className="text-sm text-muted-foreground">Fields marked optional can be left for the call.</p>
      </div>

      <FieldSet>
        <FieldLegend>Your event</FieldLegend>
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={invalid('estimatedQuantity')}>
              <FieldLabel htmlFor="bulk-quantity">Guests or quantity</FieldLabel>
              <Input
                id="bulk-quantity"
                value={values.estimatedQuantity}
                onChange={(event) => set('estimatedQuantity', event.target.value)}
                placeholder="For example 50 plates"
                aria-invalid={invalid('estimatedQuantity')}
                aria-describedby={describedBy('estimatedQuantity', 'bulk-quantity-help')}
              />
              <FieldDescription id="bulk-quantity-help">A rough number is fine, such as 40 guests or 20 kg.</FieldDescription>
              {errors.estimatedQuantity && (
                <FieldError id="bulk-quantity-error">{errors.estimatedQuantity}</FieldError>
              )}
            </Field>
            <Field data-invalid={invalid('preferredDate')}>
              <FieldLabel htmlFor="bulk-date">
                Date <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="bulk-date"
                type="date"
                min={minDate}
                value={values.preferredDate}
                onChange={(event) => set('preferredDate', event.target.value)}
                aria-invalid={invalid('preferredDate')}
                aria-describedby={describedBy('preferredDate')}
              />
              {errors.preferredDate && <FieldError id="bulk-date-error">{errors.preferredDate}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel id="bulk-fulfilment-label">Delivery or pickup</FieldLabel>
            <RadioGroup
              value={values.fulfillmentPreference}
              onValueChange={(value) => set('fulfillmentPreference', value as Fulfilment)}
              aria-labelledby="bulk-fulfilment-label"
              className="grid gap-3 sm:grid-cols-3"
            >
              {fulfilmentOptions.map(({ value, title, description, icon: Icon }) => (
                <FieldLabel key={value} htmlFor={`bulk-fulfilment-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Icon aria-hidden="true" className="size-4 text-primary" />
                        {title}
                      </FieldTitle>
                      <FieldDescription>{description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`bulk-fulfilment-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel id="bulk-interests-label">
              What would you like? <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <ToggleGroup
              multiple
              value={values.interests}
              onValueChange={(value) => set('interests', value as Interest[])}
              variant="outline"
              aria-labelledby="bulk-interests-label"
            >
              {interests.map(({ value, label }) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="bulk-requirements">
              Anything else <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Textarea
              id="bulk-requirements"
              value={values.requirements}
              onChange={(event) => set('requirements', event.target.value)}
              placeholder="The occasion, serving time, dishes you have in mind, spice level"
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Your details</FieldLegend>
        <FieldGroup>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={invalid('name')}>
              <FieldLabel htmlFor="bulk-name">Name</FieldLabel>
              <Input
                id="bulk-name"
                autoComplete="name"
                value={values.name}
                onChange={(event) => set('name', event.target.value)}
                placeholder="Your name"
                aria-invalid={invalid('name')}
                aria-describedby={describedBy('name')}
              />
              {errors.name && <FieldError id="bulk-name-error">{errors.name}</FieldError>}
            </Field>
            <Field data-invalid={invalid('phone')}>
              <FieldLabel htmlFor="bulk-phone">Phone number</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText className="font-semibold text-foreground">+91</InputGroupText>
                  <span aria-hidden="true" className="h-5 w-px bg-border" />
                </InputGroupAddon>
                <InputGroupInput
                  id="bulk-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={values.phone}
                  onChange={(event) => set('phone', cleanPhone(event.target.value))}
                  placeholder="98765 43210"
                  aria-invalid={invalid('phone')}
                  aria-describedby={describedBy('phone')}
                />
              </InputGroup>
              {errors.phone && <FieldError id="bulk-phone-error">{errors.phone}</FieldError>}
            </Field>
            <Field data-invalid={invalid('email')}>
              <FieldLabel htmlFor="bulk-email">
                Email <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="bulk-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => set('email', event.target.value)}
                placeholder="For the quote in writing"
                aria-invalid={invalid('email')}
                aria-describedby={describedBy('email')}
              />
              {errors.email && <FieldError id="bulk-email-error">{errors.email}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="bulk-company">
                Company or organisation <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="bulk-company"
                autoComplete="organization"
                value={values.company}
                onChange={(event) => set('company', event.target.value)}
                placeholder="For office orders"
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">We reply during kitchen hours, 12 pm to 12 am.</p>
        <Button type="submit" size="lg" disabled={sending} className="max-sm:w-full">
          {sending ? <Spinner data-icon="inline-start" /> : <SendIcon data-icon="inline-start" />}
          {sending ? 'Sending' : 'Send request'}
        </Button>
      </div>
    </form>
  )
}

/* Contact panel beside the form */

function ContactPanel() {
  const rows: { icon: LucideIcon; label: string; value: ReactNode }[] = [
    {
      icon: PhoneIcon,
      label: 'Call the kitchen',
      value: (
        <a href={restaurant.phoneHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {restaurant.phone}
        </a>
      ),
    },
    {
      icon: MessageCircleIcon,
      label: 'WhatsApp, fastest reply',
      value: (
        <a
          href={restaurant.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Message us
        </a>
      ),
    },
    {
      icon: MailIcon,
      label: 'Email',
      value: (
        <a href={`mailto:${restaurant.email}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {restaurant.email}
        </a>
      ),
    },
    { icon: ClockIcon, label: 'Kitchen hours', value: restaurant.hoursLabel },
    { icon: MapPinIcon, label: 'Pickup point', value: restaurant.pickupPoint },
    { icon: BikeIcon, label: 'Delivery area', value: restaurant.deliveryArea },
  ]

  return (
    <aside aria-labelledby="contact-panel-title" className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div className="flex flex-col rounded-3xl border bg-card px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 id="contact-panel-title" className="font-heading text-lg font-semibold">
          Rather talk it through?
        </h3>
        <p className="text-sm text-muted-foreground">Call or message the kitchen and we will plan it with you.</p>
        <dl className="mt-2 flex flex-col divide-y">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 py-4">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
                <dd className="text-sm leading-relaxed wrap-break-word">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  )
}

function Enquiry({ values, setValues }: { values: Values; setValues: (update: (values: Values) => Values) => void }) {
  return (
    <Container className="flex flex-col gap-6">
      <section id="enquiry" aria-labelledby="enquiry-title" className="flex scroll-mt-24 flex-col gap-6">
        <SectionHeading
          id="enquiry-title"
          title="Request a catering quote"
          description="Send us the basics and we will call you back to plan the menu."
        />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <EnquiryForm values={values} setValues={setValues} />
          <ContactPanel />
        </div>
      </section>
    </Container>
  )
}

export default function BulkOrderPage() {
  const [values, setValues] = useState<Values>(emptyValues)

  // A menu idea ticks its interests in the form and moves the customer to it.
  const chooseIdea = (choice: Interest[]) => {
    setValues((current) => ({ ...current, interests: [...new Set([...current.interests, ...choice])] }))
    document.getElementById('enquiry')?.scrollIntoView({ block: 'start' })
    document.getElementById('bulk-quantity')?.focus({ preventScroll: true })
  }

  return (
    <div className="flex flex-col gap-12 pb-16 sm:gap-16">
      <PageHeader />
      <HowItWorks />
      <MenuIdeas onChoose={chooseIdea} />
      <Enquiry values={values} setValues={setValues} />
    </div>
  )
}
