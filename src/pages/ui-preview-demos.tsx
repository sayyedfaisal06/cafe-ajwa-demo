import { cn } from 'cn'
import {
  ArrowRightIcon,
  ArrowUpDownIcon,
  AwardIcon,
  BikeIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CopyIcon,
  DrumstickIcon,
  FlameIcon,
  GiftIcon,
  HomeIcon,
  LeafIcon,
  LocateFixedIcon,
  LockIcon,
  MapPinIcon,
  PartyPopperIcon,
  PercentIcon,
  PhoneIcon,
  ReceiptIcon,
  RotateCcwIcon,
  Share2Icon,
  TicketPercentIcon,
  TimerIcon,
  UtensilsCrossedIcon,
  UtensilsIcon,
  type LucideIcon,
  XIcon,
} from 'lucide-react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useState, type ReactNode } from 'react'

import { FoodMark } from '@/components/food'
import { ReceiptDialog } from '@/components/receipt-dialog'
import { CartButton, CartProvider, CartSheet } from '@/components/site/cart'
import { CateringBanner, PromoBanner } from '@/components/site/banners'
import { CategoryGrid, CategoryTile } from '@/components/site/category'
import { DishCard, DishCardSkeleton, DishRow } from '@/components/site/dish'
import { MenuSearch } from '@/components/site/menu-search'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ScrollRow } from '@/components/ui/scroll-row'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Toggle, toggleVariants } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { menuCategories, searchDishes, type Dish } from '@/data/menu'
import { formatPrice } from '@/lib/format'
import { receiptTotals, type Receipt } from '@/lib/receipt'

function CartSheetDemo() {
  return (
    <CartProvider>
      <CartButton labelled />
      <CartSheet />
    </CartProvider>
  )
}

const cardDishes: Dish[] = [
  {
    id: 'kolhapuri',
    slug: 'kolhapuri',
    name: 'Chicken Kolhapuri',
    description: 'Fiery Maharashtrian curry with coconut and dry red chillies, slow cooked on the bone.',
    price: 240,
    veg: false,
    serves: 'Serves 2',
    spice: 'Hot',
    bestseller: true,
    customisable: true,
  },
  {
    id: 'paneer-butter-garlic',
    slug: 'paneer-butter-garlic',
    name: 'Paneer Butter Garlic',
    description: 'Paneer cubes tossed in butter, garlic and herbs.',
    price: 320,
    veg: true,
    serves: 'Serves 2',
    spice: 'Mild',
  },
  {
    id: 'chicken-kung-pao',
    slug: 'chicken-kung-pao',
    name: 'Chicken Kung Pao',
    description: 'Chicken with peanuts, dried chillies and a sweet soy glaze.',
    price: 290,
    veg: false,
    serves: 'Serves 2',
    spice: 'Medium',
    soldOut: true,
  },
]

function OfferCard() {
  const [copied, setCopied] = useState(false)
  return (
    <Card className="border-transparent bg-primary text-primary-foreground">
      <CardHeader>
        <span className="text-xs font-semibold tracking-wide text-primary-foreground/70 uppercase">
          First order
        </span>
        <CardTitle className="text-2xl">20% off your first order</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          On orders above {formatPrice(299)}. Delivery and pickup.
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <span className="rounded-lg border border-dashed border-primary-foreground/40 px-3 py-1.5 font-mono text-sm font-semibold tracking-wider">
          AJWA20
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            void navigator.clipboard?.writeText('AJWA20')
            setCopied(true)
          }}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy code'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function FestiveOfferCard() {
  return (
    <Card className="border-warning/25 bg-[color-mix(in_oklch,var(--warning)_9%,var(--card))]">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide whitespace-nowrap text-warning uppercase">
            <GiftIcon aria-hidden="true" className="size-4" />
            Festive special
          </span>
          <Badge variant="warning">
            <TimerIcon />
            Ends Sunday
          </Badge>
        </div>
        <CardTitle className="text-2xl">Festive feast for 4</CardTitle>
        <CardDescription className="text-foreground/75">
          Chicken Biryani, Chicken Kolhapuri, Paneer Butter Garlic and 4 Tandoori Roti.
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{formatPrice(999)}</span>
          <span className="text-sm text-muted-foreground line-through tabular-nums">{formatPrice(1180)}</span>
        </div>
        <Button>Order now</Button>
      </CardFooter>
    </Card>
  )
}

function ComboOfferCard() {
  return (
    <Card>
      <CardMedia className="aspect-[16/9]">
        <div className="flex size-full items-center justify-center">
          <UtensilsIcon aria-hidden="true" strokeWidth={1.5} className="size-10 text-primary/45" />
        </div>
        <Badge className="absolute top-3 left-3">Combo</Badge>
      </CardMedia>
      <CardHeader>
        <CardTitle>Meals for one, ready to go</CardTitle>
        <CardDescription>Biryani, noodles, butter chicken or fried rice combos.</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <span className="text-sm text-muted-foreground">
          From <span className="text-lg font-semibold text-foreground tabular-nums">{formatPrice(399)}</span>
        </span>
        <Button variant="secondary">
          See combos
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function ReferralCard() {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-card text-primary">
          <PartyPopperIcon aria-hidden="true" className="size-5" />
        </span>
        <CardTitle>Refer a friend, you both earn points</CardTitle>
        <CardDescription>Points land in your account after their first delivered order.</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <span className="rounded-lg border border-dashed border-input/60 bg-card px-3 py-1.5 font-mono text-sm font-semibold tracking-wider">
          REF4821
        </span>
        <Button variant="outline">
          <Share2Icon data-icon="inline-start" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}

type CouponState = 'available' | 'applied' | 'locked'
const coupons: { code: string; title: string; detail: string; icon: LucideIcon; state: CouponState }[] = [
  { code: 'AJWA20', title: '20% off your first order', detail: 'On orders above ₹299', icon: TicketPercentIcon, state: 'applied' },
  { code: 'FREEDEL', title: 'Free delivery', detail: 'Add ₹120 more to unlock', icon: BikeIcon, state: 'locked' },
  { code: 'LUNCH10', title: '10% off weekday lunch', detail: '12 pm to 4 pm, Monday to Friday', icon: PercentIcon, state: 'available' },
]

/* A one line offer for the cart and checkout. Shows whether it is applied, available or locked. */
function CouponStrip({ coupon }: { coupon: (typeof coupons)[number] }) {
  const Icon = coupon.icon
  return (
    <div
      data-state={coupon.state}
      className="flex items-center gap-3 rounded-2xl border bg-card p-3 data-[state=applied]:border-success/40 data-[state=applied]:bg-[color-mix(in_oklch,var(--success)_6%,var(--card))]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-highlight text-primary in-data-[state=applied]:bg-[color-mix(in_oklch,var(--success)_14%,var(--card))] in-data-[state=applied]:text-success in-data-[state=locked]:bg-secondary in-data-[state=locked]:text-muted-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold">{coupon.title}</span>
        <span className="line-clamp-2 text-xs text-muted-foreground">
          <span className="font-mono font-semibold">{coupon.code}</span>, {coupon.detail}
        </span>
      </div>
      {coupon.state === 'applied' && (
        <Badge variant="success">
          <CheckIcon />
          Applied
        </Badge>
      )}
      {coupon.state === 'available' && (
        <Button variant="secondary" size="sm">
          Apply
        </Button>
      )}
      {coupon.state === 'locked' && (
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <LockIcon aria-hidden="true" className="size-3.5" />
          Locked
        </span>
      )}
    </div>
  )
}

type AnnouncementTone = 'brand' | 'warning' | 'info'

/* A thin strip above the header for live status or one offer. It can be closed. */
function AnnouncementBar({
  tone = 'brand',
  icon: Icon,
  children,
  linkLabel,
}: {
  tone?: AnnouncementTone
  icon: LucideIcon
  children: ReactNode
  linkLabel?: string
}) {
  const [open, setOpen] = useState(true)
  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpen(true)}>
        Show the bar again
      </Button>
    )
  }
  return (
    <div
      role="region"
      aria-label="Announcement"
      data-tone={tone}
      className={cn(
        'relative flex min-h-11 w-full items-center justify-center gap-2 px-12 py-2 text-center text-sm font-medium',
        'data-[tone=brand]:bg-primary data-[tone=brand]:text-primary-foreground',
        'data-[tone=warning]:bg-warning data-[tone=warning]:text-warning-foreground',
        'data-[tone=info]:bg-highlight data-[tone=info]:text-primary'
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>
        {children}
        {linkLabel && (
          <>
            {' '}
            <a href="#" className="font-semibold whitespace-nowrap underline underline-offset-4">
              {linkLabel}
            </a>
          </>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Close announcement"
        onClick={() => setOpen(false)}
        className="absolute right-1.5 text-current hover:bg-current/10 hover:text-current"
      >
        <XIcon />
      </Button>
    </div>
  )
}

/* The home page hero from the redesign plan: one headline, one line of support, two actions. */
function HeroBanner({ tone = 'brand' }: { tone?: 'brand' | 'cream' }) {
  const brand = tone === 'brand'
  return (
    <section
      aria-label="Welcome"
      className={cn(
        'grid overflow-hidden rounded-3xl md:grid-cols-[1.15fr_1fr]',
        brand ? 'bg-primary text-primary-foreground' : 'border bg-secondary text-foreground'
      )}
    >
      <div className="flex flex-col items-start gap-5 p-6 sm:p-10">
        <Badge variant={brand ? 'secondary' : 'success'} size="lg">
          <BadgeDot className={brand ? 'bg-success' : undefined} />
          Open now until 12 am
        </Badge>
        <h2 className="font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Tandoor, curries and Indo Chinese, cooked fresh in Malwani
        </h2>
        <p className={cn('max-w-md text-base', brand ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
          Order for delivery or pickup, every day from 12 pm to 12 am.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className={brand ? 'bg-primary-foreground text-primary shadow-none hover:bg-primary-foreground/90' : undefined}
          >
            Order now
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={
              brand
                ? 'border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground'
                : 'bg-card'
            }
          >
            <MapPinIcon data-icon="inline-start" />
            Check delivery
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'flex aspect-[2/1] items-center justify-center md:aspect-auto',
          brand ? 'bg-primary-foreground/8' : 'bg-accent'
        )}
      >
        <UtensilsCrossedIcon
          aria-hidden="true"
          strokeWidth={1.25}
          className={cn('size-16', brand ? 'text-primary-foreground/35' : 'text-primary/40')}
        />
      </div>
    </section>
  )
}

function FestiveBanner() {
  return (
    <PromoBanner
      tone="turmeric"
      reverse
      eyebrow="Festive special"
      title="Festive feast for 4, now on the menu"
      description="Chicken Biryani, Chicken Kolhapuri, Paneer Butter Garlic and 4 Tandoori Roti. Available until Sunday."
      icon={GiftIcon}
      action={<Button>Order the feast</Button>}
    />
  )
}

const INSTRUCTIONS_MAX = 120

function AddressFormDemo() {
  const [label, setLabel] = useState<string[]>(['home'])
  const [pincode, setPincode] = useState('4000')
  const [instructions, setInstructions] = useState('')
  const pincodeInvalid = pincode.length > 0 && !/^\d{6}$/.test(pincode)

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6"
      aria-labelledby="address-form-title"
    >
      <div className="flex flex-col gap-1">
        <h3 id="address-form-title" className="font-heading text-lg font-semibold">
          Delivery address
        </h3>
        <p className="text-sm text-muted-foreground">We check the pin is inside our delivery area.</p>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel id="address-label">Save as</FieldLabel>
          <ToggleGroup
            value={label}
            onValueChange={(value) => setLabel(value.length ? value : label)}
            variant="segment"
            className="w-full"
            aria-labelledby="address-label"
          >
            <ToggleGroupItem value="home">
              <HomeIcon data-icon="inline-start" />
              Home
            </ToggleGroupItem>
            <ToggleGroupItem value="work">
              <BriefcaseIcon data-icon="inline-start" />
              Work
            </ToggleGroupItem>
            <ToggleGroupItem value="other">
              <MapPinIcon data-icon="inline-start" />
              Other
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="addr-building">Building, floor and house no.</FieldLabel>
          <Input id="addr-building" autoComplete="address-line1" placeholder="Flat 302, Sea View Apartments" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="addr-area">Area</FieldLabel>
          <InputGroup>
            <InputGroupInput id="addr-area" autoComplete="address-line2" defaultValue="Malwani Colony, Malad West" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="sm"
                className="gap-1.5 bg-transparent text-primary underline-offset-4 hover:bg-transparent hover:text-primary hover:underline active:bg-transparent aria-expanded:bg-transparent"
              >
                <LocateFixedIcon aria-hidden="true" />
                <span className="max-sm:sr-only">Use my location</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel>City</FieldLabel>
            <Select items={cityOptions} defaultValue="mumbai">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {cityOptions.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field data-invalid={pincodeInvalid || undefined}>
            <FieldLabel htmlFor="addr-pincode">Pincode</FieldLabel>
            <Input
              id="addr-pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={pincode}
              onChange={(event) => setPincode(event.target.value.replace(/\D/g, ''))}
              aria-invalid={pincodeInvalid || undefined}
              aria-describedby={pincodeInvalid ? 'addr-pincode-error' : undefined}
            />
            {pincodeInvalid && <FieldError id="addr-pincode-error">Pincode must be 6 digits.</FieldError>}
          </Field>
        </div>
        <Field>
          <div className="flex items-baseline justify-between gap-3">
            <FieldLabel htmlFor="addr-instructions">
              Delivery instructions <span className="font-normal text-muted-foreground">(optional)</span>
            </FieldLabel>
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {instructions.length}/{INSTRUCTIONS_MAX}
            </span>
          </div>
          <Textarea
            id="addr-instructions"
            maxLength={INSTRUCTIONS_MAX}
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Ring the bell, the gate code is 1234"
          />
        </Field>
        <Field orientation="horizontal">
          <Switch id="addr-default" defaultChecked />
          <FieldLabel htmlFor="addr-default">Set as my default address</FieldLabel>
        </Field>
      </FieldGroup>
      <Button type="submit" size="lg">
        Save address
      </Button>
    </form>
  )
}

const cityOptions = [
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Thane', value: 'thane' },
  { label: 'Navi Mumbai', value: 'navi-mumbai' },
]

function DetailsFormDemo() {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex min-w-0 flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-6"
      aria-labelledby="details-form-title"
    >
      <h3 id="details-form-title" className="font-heading text-lg font-semibold">
        Your details
      </h3>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="details-name">Full name</FieldLabel>
          <Input id="details-name" autoComplete="name" placeholder="Your name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="details-phone">Phone number</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText className="font-semibold text-foreground">+91</InputGroupText>
              <span aria-hidden="true" className="h-5 w-px bg-border" />
            </InputGroupAddon>
            <InputGroupInput
              id="details-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              aria-describedby="details-phone-help"
            />
          </InputGroup>
          <FieldDescription id="details-phone-help">We call this number if the rider cannot find you.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="details-email">
            Email <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Input id="details-email" type="email" autoComplete="email" placeholder="For receipts" />
        </Field>
        <Field>
          <FieldLabel htmlFor="details-branch">Branch</FieldLabel>
          <Input id="details-branch" value="Malwani, Malad West" readOnly />
          <FieldDescription>Set by your address.</FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

function VerifyPhoneDemo() {
  const [code, setCode] = useState('')
  const complete = code.length === 6
  const wrong = complete && code !== '123456'
  const verified = complete && !wrong

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold">Verify your phone</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6 digit code sent to <span className="font-semibold text-foreground">+91 98765 43210</span>.
        </p>
      </div>
      <Field data-invalid={wrong || undefined}>
        <FieldLabel htmlFor="otp" className="sr-only">
          Verification code
        </FieldLabel>
        <InputOTP
          id="otp"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={code}
          onChange={setCode}
          aria-invalid={wrong || undefined}
          autoComplete="one-time-code"
        >
          <InputOTPGroup>
            {[0, 1, 2].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {wrong && <FieldError>That code is not right. Check the SMS and try again.</FieldError>}
        {verified && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-success">
            <CircleCheckIcon aria-hidden="true" className="size-4" />
            Phone verified
          </p>
        )}
        {!complete && <FieldDescription>In this preview the right code is 123456.</FieldDescription>}
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Resend code in <span className="font-semibold tabular-nums text-foreground">0:30</span>
        </span>
        <Button disabled={!complete || wrong}>Verify</Button>
      </div>
    </div>
  )
}

/* Sample data for one past order. The real receipt comes from the order API. */
const sampleReceipt: Receipt = {
  orderNumber: '1038',
  placedAt: new Date(2026, 10, 20, 20, 15),
  orderType: 'Delivery',
  payment: 'Cash on delivery',
  customer: { name: 'Riya Shaikh', phone: '+91 98765 43210', address: 'Flat 302, Sea View Apartments, Malwani Colony, Malad West, Mumbai 400095' },
  lines: [
    { name: 'Chicken Kolhapuri', quantity: 1, price: 240, options: 'Full, with Tandoori Roti' },
    { name: 'Paneer Butter Garlic', quantity: 2, price: 320, options: 'Full' },
  ],
  deliveryFee: 30,
  gstRate: 0.05,
}

function OrderCard() {
  const total = receiptTotals(sampleReceipt).total
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Order {sampleReceipt.orderNumber}</CardTitle>
        <CardDescription>20 Nov, 8:15 pm, delivery</CardDescription>
        <CardAction>
          <Badge variant="success">
            <CircleCheckIcon />
            Delivered
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1.5 text-sm">
          <li className="flex items-center gap-2">
            <FoodMark veg={false} />
            <span className="flex-1">Chicken Kolhapuri</span>
            <span className="text-muted-foreground tabular-nums">x1</span>
          </li>
          <li className="flex items-center gap-2">
            <FoodMark veg />
            <span className="flex-1">Paneer Butter Garlic</span>
            <span className="text-muted-foreground tabular-nums">x2</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="border-t">
        <span className="flex-1 font-semibold tabular-nums">{formatPrice(total)}</span>
        <ReceiptDialog
          receipt={sampleReceipt}
          trigger={
            <Button variant="ghost" size="sm">
              <ReceiptIcon data-icon="inline-start" />
              Receipt
            </Button>
          }
        />
        <Button size="sm">
          <RotateCcwIcon data-icon="inline-start" />
          Reorder
        </Button>
      </CardFooter>
    </Card>
  )
}

/* A whole card that links somewhere. The link stretches over the card so any tap opens it. */
function CategoryCard({ name, count }: { name: string; count: number }) {
  return (
    <Card interactive size="sm" className="flex-row items-center gap-4 px-4">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <UtensilsCrossedIcon aria-hidden="true" className="size-6 text-muted-foreground/50" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <a href="#" className="truncate font-semibold outline-none after:absolute after:inset-0">
          {name}
        </a>
        <span className="text-xs text-muted-foreground">{count} dishes</span>
      </div>
      <ChevronRightIcon aria-hidden="true" className="size-5 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 motion-reduce:transition-none" />
    </Card>
  )
}

const SearchDemo = MenuSearch

const orderHistory = Array.from({ length: 10 }, (_, index) => ({
  id: 1037 - index,
  date: `${20 - index} Nov, ${index % 2 ? '1:40 pm' : '8:15 pm'}`,
  items: index % 3 === 0 ? 'Chicken Kolhapuri, Paneer Butter Garlic x2' : index % 3 === 1 ? 'Chicken Kung Pao, Jeera Rice' : 'Paneer Tawa, Tandoori Roti x4',
  total: [880, 400, 350][index % 3],
  delivered: index !== 4,
}))

function ScrollAreaDemo() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Vertical, order history</p>
        <ScrollArea className="h-80 rounded-2xl border bg-card">
          <ul className="flex flex-col divide-y px-4">
            {orderHistory.map((order) => (
              <li key={order.id} className="flex items-center gap-3 py-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <ReceiptIcon aria-hidden="true" className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold">Order {order.id}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {order.date}, {order.items}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold tabular-nums">{formatPrice(order.total)}</span>
                  <Badge size="sm" variant={order.delivered ? 'success' : 'destructive'}>
                    {order.delivered ? 'Delivered' : 'Cancelled'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Horizontal, popular dishes</p>
        <ScrollArea className="rounded-2xl border bg-card">
          <div className="flex w-max gap-3 p-4 pb-5">
            {searchDishes.slice(0, 10).map((dish) => (
              <div key={dish.id} className="flex w-36 flex-col gap-2">
                <div className="flex aspect-square items-center justify-center rounded-xl bg-secondary">
                  <UtensilsCrossedIcon aria-hidden="true" className="size-7 text-muted-foreground/40" />
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <FoodMark veg={Boolean(dish.veg)} />
                  <span className="truncate">{dish.label}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{dish.price ? formatPrice(dish.price) : dish.category}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}

const cuisines = ['North Indian', 'Indo Chinese', 'Tandoor', 'Maharashtrian']
const spiceLevels = ['Mild', 'Medium', 'Hot']
const priceRanges = [
  { value: 'any', label: 'Any price', short: '' },
  { value: 'under200', label: `Under ${formatPrice(200)}`, short: `Under ${formatPrice(200)}` },
  { value: '200to300', label: `${formatPrice(200)} to ${formatPrice(300)}`, short: `${formatPrice(200)} to ${formatPrice(300)}` },
  { value: 'over300', label: `Over ${formatPrice(300)}`, short: `Over ${formatPrice(300)}` },
]
const sortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'low', label: 'Price, low to high' },
  { value: 'high', label: 'Price, high to low' },
]

/* Chip look shared by toggle chips and the chips that open a list. Active chips turn solid green. */
const chipClassName = cn(toggleVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')
const activeChipClassName =
  'border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:text-primary-foreground'

function ChipCount({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1 text-[0.6875rem] tabular-nums">
      {children}
    </span>
  )
}

function FilterBarDemo() {
  const [sort, setSort] = useState('popular')
  const [dishType, setDishType] = useState<'veg' | 'non-veg' | null>(null)
  const [bestsellers, setBestsellers] = useState(false)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [price, setPrice] = useState('any')
  const [spice, setSpice] = useState<string[]>([])

  const anyActive =
    dishType !== null || bestsellers || selectedCuisines.length > 0 || price !== 'any' || spice.length > 0
  const clearAll = () => {
    setDishType(null)
    setBestsellers(false)
    setSelectedCuisines([])
    setPrice('any')
    setSpice([])
  }
  const toggleIn = (list: string[], item: string, on: boolean) =>
    on ? [...list, item] : list.filter((entry) => entry !== item)
  const priceShort = priceRanges.find((range) => range.value === price)?.short

  return (
    <ScrollRow scrollLabel="filters">
      <div role="toolbar" aria-label="Filter dishes" className="flex w-max items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className={chipClassName}>
            <ArrowUpDownIcon data-icon="inline-start" />
            {sortOptions.find((option) => option.value === sort)?.label}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          variant="outline"
          size="sm"
          pressed={dishType === 'veg'}
          onPressedChange={(on) => setDishType(on ? 'veg' : null)}
        >
          <LeafIcon data-icon="inline-start" />
          Veg
        </Toggle>
        <Toggle
          variant="outline"
          size="sm"
          pressed={dishType === 'non-veg'}
          onPressedChange={(on) => setDishType(on ? 'non-veg' : null)}
        >
          <DrumstickIcon data-icon="inline-start" />
          Non veg
        </Toggle>
        <Toggle variant="outline" size="sm" pressed={bestsellers} onPressedChange={setBestsellers}>
          <AwardIcon data-icon="inline-start" />
          Bestsellers
        </Toggle>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(chipClassName, selectedCuisines.length > 0 && activeChipClassName)}
          >
            Cuisine
            {selectedCuisines.length > 0 && <ChipCount>{selectedCuisines.length}</ChipCount>}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Cuisine</DropdownMenuLabel>
              {cuisines.map((cuisine) => (
                <DropdownMenuCheckboxItem
                  key={cuisine}
                  checked={selectedCuisines.includes(cuisine)}
                  onCheckedChange={(on) => setSelectedCuisines((current) => toggleIn(current, cuisine, on))}
                >
                  {cuisine}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
            {selectedCuisines.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedCuisines([])}>Clear cuisine</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(chipClassName, price !== 'any' && activeChipClassName)}>
            {priceShort || 'Price'}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Price</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={price} onValueChange={setPrice}>
                {priceRanges.map((range) => (
                  <DropdownMenuRadioItem key={range.value} value={range.value} closeOnClick>
                    {range.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(chipClassName, spice.length > 0 && activeChipClassName)}>
            <FlameIcon data-icon="inline-start" />
            Spice
            {spice.length > 0 && <ChipCount>{spice.length}</ChipCount>}
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Spice level</DropdownMenuLabel>
              {spiceLevels.map((level) => (
                <DropdownMenuCheckboxItem
                  key={level}
                  checked={spice.includes(level)}
                  onCheckedChange={(on) => setSpice((current) => toggleIn(current, level, on))}
                >
                  {level}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {anyActive && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <XIcon data-icon="inline-start" />
            Clear all
          </Button>
        )}
      </div>
    </ScrollRow>
  )
}

const carouselBanners: { title: string; description: string; link: string; icon: LucideIcon; tone: 'leaf' | 'turmeric' | 'cream' }[] = [
  { title: `Combos from ${formatPrice(399)}`, description: 'Biryani, noodles, butter chicken or fried rice, packed for one.', link: 'See combos', icon: UtensilsIcon, tone: 'leaf' },
  { title: '10% off weekday lunch', description: 'Monday to Friday, 12 pm to 4 pm. Use LUNCH10.', link: 'View offer', icon: PercentIcon, tone: 'turmeric' },
  { title: 'Order on WhatsApp', description: 'Send your order and we will confirm it with a total.', link: 'Open WhatsApp', icon: PhoneIcon, tone: 'cream' },
  { title: 'Refer a friend', description: 'You both earn points after their first delivered order.', link: 'Get your code', icon: PartyPopperIcon, tone: 'leaf' },
]

/* Promo banners in a row that snaps one banner at a time, with the same arrows as the category bar. */
function BannerCarousel() {
  return (
    <ScrollRow scrollLabel="offers" viewportClassName="scroll-px-1 snap-x snap-mandatory gap-4">
      {carouselBanners.map((banner) => {
        const Icon = banner.icon
        return (
          <a
            key={banner.title}
            href="#"
            data-tone={banner.tone}
            className={cn(
              'group/banner flex w-[85%] shrink-0 snap-start items-center gap-4 rounded-3xl p-5 outline-none sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)]',
              'transition-colors duration-150 motion-reduce:transition-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'data-[tone=leaf]:bg-highlight data-[tone=leaf]:hover:bg-[color-mix(in_oklch,var(--primary)_13%,var(--popover))]',
              'data-[tone=turmeric]:bg-[color-mix(in_oklch,var(--warning)_10%,var(--card))] data-[tone=turmeric]:hover:bg-[color-mix(in_oklch,var(--warning)_15%,var(--card))]',
              'data-[tone=cream]:bg-secondary data-[tone=cream]:hover:bg-accent'
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-lg leading-snug font-semibold tracking-tight">{banner.title}</span>
              <span className="line-clamp-2 text-sm text-muted-foreground">{banner.description}</span>
              <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary">
                {banner.link}
                <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover/banner:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </div>
            <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-card">
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-8 text-primary/60 in-data-[tone=turmeric]:text-warning/70" />
            </span>
          </a>
        )
      })}
    </ScrollRow>
  )
}

export {
  AddressFormDemo,
  AnnouncementBar,
  BannerCarousel,
  CartSheetDemo,
  CateringBanner,
  CategoryCard,
  CategoryGrid,
  CategoryTile,
  ComboOfferCard,
  CouponStrip,
  DishCard,
  DishCardSkeleton,
  DetailsFormDemo,
  DishRow,
  FestiveBanner,
  FestiveOfferCard,
  FilterBarDemo,
  HeroBanner,
  OfferCard,
  OrderCard,
  PromoBanner,
  ReferralCard,
  ScrollAreaDemo,
  SearchDemo,
  VerifyPhoneDemo,
  cardDishes,
  coupons,
  menuCategories,
}
