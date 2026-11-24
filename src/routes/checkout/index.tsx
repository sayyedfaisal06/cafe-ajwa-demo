import { cn } from 'cn'
import {
  BadgeCheckIcon,
  BikeIcon,
  CheckIcon,
  ClockIcon,
  GiftIcon,
  LockIcon,
  MapPinIcon,
  NavigationIcon,
  PencilIcon,
  PlusIcon,
  ShoppingBagIcon,
  StickyNoteIcon,
  StoreIcon,
  TicketPercentIcon,
  WalletIcon,
  type LucideIcon,
} from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router'

import { FoodMark } from '@/components/food'
import { AddressForm, emptyAddressDraft, type AddressDraft } from '@/components/site/address-form'
import { RequireAuth, useAuth } from '@/components/site/auth'
import { useCart } from '@/components/site/cart'
import { useStoreStatus } from '@/components/site/store-status'
import { VerifyPhone } from '@/components/site/verify-phone'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { addressLine, addresses as savedAddresses, addressTitle, customer, rewardSettings, type Address } from '@/data/account'
import { checkCoupon, checkoutSettings, coupons, type Coupon } from '@/data/checkout'
import { menuItems } from '@/data/menu'
import { orders, placeOrder, type OrderType } from '@/data/orders'
import { restaurant } from '@/data/restaurant'
import { formatPrice } from '@/lib/format'
import { formatRupees } from '@/lib/receipt'

export function meta() {
  return [{ title: 'Checkout, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/*
 * Checkout on one page in the four steps of docs/redesign-plan.md section 7.6: delivery or pickup,
 * where it goes, offers and rewards, and payment. Each step shows what is chosen; Edit opens its
 * controls on a copy, Save applies them and Cancel drops them. Payment is always offline and follows
 * step 1. Messages that block the order show before the customer fills anything in. With no API
 * yet, placing an order adds it to the sample orders.
 */

const NOTE_MAX = 120
const round2 = (value: number) => Math.round(value * 100) / 100
const inArea = (address: Pick<Address, 'pincode'>) => restaurant.deliveryPincodes.includes(address.pincode)

type StepKey = 'type' | 'address' | 'offers'

function Step({
  number,
  title,
  editing,
  onEdit,
  onSave,
  onCancel,
  summary,
  children,
}: {
  number: number
  title: string
  /** Leave out onEdit for a step that only shows information. */
  editing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  summary: ReactNode
  children?: ReactNode
}) {
  const id = `step-${number}-title`
  return (
    <section
      aria-labelledby={id}
      data-editing={editing || undefined}
      className="flex flex-col gap-4 rounded-2xl border bg-card p-5 data-editing:border-primary/50 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="flex items-center gap-3 font-heading text-lg font-semibold">
          <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground tabular-nums">
            {number}
          </span>
          {title}
        </h2>
        {onEdit && !editing && (
          <Button variant="outline" size="sm" onClick={onEdit} aria-label={`Edit ${title.toLowerCase()}`}>
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
        )}
      </div>
      {editing ? (
        <>
          {children}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button onClick={onSave}>Save</Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        summary
      )}
    </section>
  )
}

/* The read-only view of a step: an icon, the choice and a line about it. */
function Summary({ icon: Icon, title, children }: { icon: LucideIcon; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className="flex flex-wrap items-center gap-2 font-semibold">{title}</span>
        {children && <span className="text-sm leading-relaxed text-muted-foreground">{children}</span>}
      </div>
    </div>
  )
}

/* A radio card in the option card style from the UI preview. */
function OptionCard({
  id,
  value,
  title,
  description,
  icon,
  disabled,
}: {
  id: string
  value: string
  title: ReactNode
  description: ReactNode
  icon?: ReactNode
  disabled?: boolean
}) {
  return (
    <FieldLabel htmlFor={id}>
      <Field orientation="horizontal" data-disabled={disabled || undefined}>
        <FieldContent>
          <FieldTitle>
            {icon}
            {title}
          </FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
        <RadioGroupItem value={value} id={id} disabled={disabled} />
      </Field>
    </FieldLabel>
  )
}

function CheckoutPage() {
  const { lines, itemTotal, setQuantity, clear } = useCart()
  const status = useStoreStatus()
  const { phone } = useAuth()
  const [now] = useState(() => new Date())

  // What is chosen
  const [type, setType] = useState<OrderType>('delivery')
  const [addresses, setAddresses] = useState(savedAddresses)
  const [addressId, setAddressId] = useState(() => savedAddresses.find((address) => address.isDefault && inArea(address))?.id ?? '')
  const [note, setNote] = useState('')
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [usePoints, setUsePoints] = useState(false)

  // The step being edited, and its unsaved copy. The address step opens by itself without a usable address.
  const [editing, setEditing] = useState<StepKey | null>(() => (addressId ? null : 'address'))
  const [draftType, setDraftType] = useState<OrderType>(type)
  const [draftAddressId, setDraftAddressId] = useState(addressId)
  const [draftNote, setDraftNote] = useState('')
  const [draftCoupon, setDraftCoupon] = useState<string | null>(null)
  const [draftPoints, setDraftPoints] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const [adding, setAdding] = useState(false)

  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState<string>()

  if (placed) return <Navigate to={`/checkout/success/${placed}`} replace />

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingBagIcon />
            </EmptyMedia>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDescription>Add a few dishes and come back here to place your order.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/menu" />} nativeButton={false}>
              Browse the menu
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const startEditing = (step: StepKey) => {
    // Opening a step drops unsaved changes in any other step.
    setDraftType(type)
    setDraftAddressId(addressId)
    setDraftNote(note)
    setDraftCoupon(couponCode)
    setDraftPoints(usePoints)
    setCodeInput('')
    setCodeError(undefined)
    setEditing(step)
  }
  const cancelEditing = () => setEditing(null)
  const saveStep = () => {
    if (editing === 'type') setType(draftType)
    if (editing === 'address') {
      setAddressId(draftAddressId)
      setNote(draftNote.trim())
    }
    if (editing === 'offers') {
      setCouponCode(draftCoupon)
      setUsePoints(draftPoints)
    }
    setEditing(null)
  }

  // The bill, from the saved choices
  const subtotal = itemTotal
  const firstOrder = orders.length === 0
  const couponContext = { subtotal, type, firstOrder, now }
  const coupon = coupons.find((item) => item.code === couponCode)
  const couponResult = coupon ? checkCoupon(coupon, couponContext) : undefined
  const couponDiscount = couponResult?.ok ? couponResult.discount : 0
  const freeDelivery = couponResult?.ok === true && couponResult.freeDelivery
  const deliveryFee = type === 'delivery' && !freeDelivery ? checkoutSettings.deliveryFee : 0
  const pointsAllowed =
    subtotal >= rewardSettings.minOrder
      ? Math.min(customer.rewardPoints * rewardSettings.pointValue, Math.floor((subtotal * rewardSettings.maxPercent) / 100))
      : 0
  const pointsDiscount = usePoints ? Math.min(pointsAllowed, subtotal - couponDiscount) : 0
  // Rupee amounts above, point counts here, for the text.
  const pointsFor = (rupees: number) => Math.ceil(rupees / rewardSettings.pointValue)
  const taxable = round2(subtotal - couponDiscount - pointsDiscount)
  const halfTax = round2((taxable * checkoutSettings.gstRate) / 2)
  const beforeRounding = round2(taxable + halfTax * 2 + deliveryFee)
  const total = Math.round(beforeRounding)
  const roundOff = round2(total - beforeRounding)

  // What stops the order, shown before the customer fills anything in
  const closed = status === 'closed-early' || status === 'closed-late'
  const shortOfMinimum = type === 'delivery' ? checkoutSettings.minDeliveryOrder - subtotal : 0
  const address = addresses.find((item) => item.id === addressId && inArea(item))
  const blockers: { title: string; text: ReactNode }[] = []
  if (!phone) {
    blockers.push({ title: 'Verify your phone first', text: 'We need a number we can call about your order. It only takes a minute.' })
  }
  const closedNotice = closed
    ? {
        title: 'We are closed right now',
        text: `${restaurant.hoursLabel}. ${status === 'closed-early' ? 'Orders open today at 12 pm.' : 'Orders open tomorrow at 12 pm.'} Your cart is saved.`,
      }
    : null
  if (closedNotice) blockers.push(closedNotice)
  if (shortOfMinimum > 0) {
    blockers.push({
      title: `Add ${formatPrice(shortOfMinimum)} more for delivery`,
      text: (
        <>
          The minimum for delivery is {formatPrice(checkoutSettings.minDeliveryOrder)}.{' '}
          <button type="button" className="font-semibold underline underline-offset-4" onClick={() => setType('pickup')}>
            Switch to pickup
          </button>{' '}
          to order this as it is.
        </>
      ),
    })
  }
  if (type === 'delivery' && !address && shortOfMinimum <= 0) {
    blockers.push({ title: 'Choose a delivery address', text: 'Pick a saved address in our delivery area, or add a new one.' })
  }
  if (editing) {
    blockers.push({ title: 'Save your changes first', text: 'Save or cancel the step you are editing, then place your order.' })
  }
  const canPlace = blockers.length === 0 && !placing

  const applyCode = (event: FormEvent) => {
    event.preventDefault()
    if (!codeInput.trim()) return setCodeError('Enter a code.')
    const found = coupons.find((item) => item.code === codeInput.trim().toUpperCase())
    if (!found) return setCodeError('This code is not valid.')
    const result = checkCoupon(found, couponContext)
    if (!result.ok) return setCodeError(`${found.code} does not apply: ${result.reason.toLowerCase()}.`)
    setDraftCoupon(found.code)
    setCodeInput('')
    setCodeError(undefined)
  }

  const saveAddress = (draft: AddressDraft) => {
    const id = `a${Date.now()}`
    setAddresses((current) => [...current, { ...draft, id, isDefault: false }])
    if (inArea(draft)) setDraftAddressId(id)
    setAdding(false)
    toast.add({
      title: 'Address saved',
      description: inArea(draft) ? `Save this step to deliver to ${addressTitle(draft)}.` : 'It is outside our delivery area, so it cannot be used for this order.',
      type: inArea(draft) ? 'success' : 'warning',
    })
  }

  const place = () => {
    if (!canPlace) return
    setPlacing(true)
    const discounts = [couponDiscount > 0 && `Coupon ${couponCode}`, pointsDiscount > 0 && 'reward points'].filter(Boolean)
    window.setTimeout(() => {
      const order = placeOrder({
        type,
        lines: lines.flatMap((line) => {
          // Cart lines keep the dish id, with the size after a colon. Older sample lines only match by name.
          const dish = menuItems.find((item) => item.id === line.id.split(':')[0]) ?? menuItems.find((item) => item.name === line.name)
          return dish ? [{ dish, quantity: line.quantity, price: line.price, options: dish.variants ? line.options : dish.options }] : []
        }),
        deliveryFee,
        address: type === 'delivery' && address ? addressLine(address) : undefined,
        discount: discounts.length ? { label: discounts.join(' and '), amount: couponDiscount + pointsDiscount } : undefined,
        note: type === 'delivery' ? note || undefined : undefined,
      })
      clear()
      setPlaced(order.number)
    }, 900)
  }

  const bill: { label: string; value: number; tone?: 'saving' }[] = [
    { label: 'Item total', value: subtotal },
    ...(couponDiscount ? [{ label: `Coupon ${couponCode}`, value: -couponDiscount, tone: 'saving' as const }] : []),
    ...(pointsDiscount ? [{ label: 'Reward points', value: -pointsDiscount, tone: 'saving' as const }] : []),
    ...(type === 'delivery' ? [{ label: freeDelivery ? 'Delivery fee, free with coupon' : 'Delivery fee', value: deliveryFee }] : []),
    { label: 'CGST 2.5%', value: halfTax },
    { label: 'SGST 2.5%', value: halfTax },
    ...(roundOff ? [{ label: 'Round off', value: roundOff }] : []),
  ]
  const saving = couponDiscount + pointsDiscount + (freeDelivery && type === 'delivery' ? checkoutSettings.deliveryFee : 0)
  const placeLabel = placing ? (
    'Placing your order'
  ) : (
    <>
      Place order
      <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">{formatPrice(total)}</span>
    </>
  )
  const deliveryLine = `${restaurant.deliveryTime}, ${freeDelivery ? 'free delivery' : `${formatPrice(checkoutSettings.deliveryFee)} delivery fee`}.`
  const pickupLine = `Ready in about ${checkoutSettings.pickupMinutes} minutes at Gate 8. No fee.`
  // Coupons in the offers step are checked against the saved delivery or pickup choice.
  const draftCouponItem = coupons.find((item) => item.code === draftCoupon)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 pb-16">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="flex flex-wrap items-center gap-x-2 text-muted-foreground">
          Ordering as {customer.name}
          {phone && (
            <>
              , {phone}
              <Badge variant="success">
                <BadgeCheckIcon />
                Phone verified
              </Badge>
            </>
          )}
        </p>
      </div>

      {!phone && <VerifyPhone />}

      {closedNotice && (
        <Alert variant="warning">
          <ClockIcon />
          <AlertTitle>{closedNotice.title}</AlertTitle>
          <AlertDescription>{closedNotice.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <Step
            number={1}
            title="Delivery or pickup"
            editing={editing === 'type'}
            onEdit={() => startEditing('type')}
            onSave={saveStep}
            onCancel={cancelEditing}
            summary={
              type === 'delivery' ? (
                <Summary icon={BikeIcon} title="Delivery">
                  {deliveryLine}
                </Summary>
              ) : (
                <Summary icon={StoreIcon} title="Pickup">
                  {pickupLine}
                </Summary>
              )
            }
          >
            <RadioGroup value={draftType} onValueChange={(value) => setDraftType(value as OrderType)} aria-label="Delivery or pickup" className="grid gap-3 sm:grid-cols-2">
              <OptionCard id="type-delivery" value="delivery" icon={<BikeIcon aria-hidden="true" className="size-4 text-primary" />} title="Delivery" description={deliveryLine} />
              <OptionCard id="type-pickup" value="pickup" icon={<StoreIcon aria-hidden="true" className="size-4 text-primary" />} title="Pickup" description={pickupLine} />
            </RadioGroup>
          </Step>

          {type === 'delivery' ? (
            <Step
              number={2}
              title="Deliver to"
              editing={editing === 'address'}
              onEdit={() => startEditing('address')}
              onSave={saveStep}
              onCancel={cancelEditing}
              summary={
                address ? (
                  <div className="flex flex-col gap-4">
                    <Summary
                      icon={MapPinIcon}
                      title={
                        <>
                          {addressTitle(address)}
                          {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </>
                      }
                    >
                      {addressLine(address)}
                    </Summary>
                    {note && (
                      <Summary icon={StickyNoteIcon} title="Delivery note">
                        {note}
                      </Summary>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No address chosen yet. Choose where to deliver with Edit.</p>
                )
              }
            >
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
                  <PlusIcon data-icon="inline-start" />
                  Add address
                </Button>
              </div>
              {addresses.length > 0 ? (
                <RadioGroup value={draftAddressId} onValueChange={(value) => setDraftAddressId(value as string)} aria-label="Delivery address" className="grid gap-3">
                  {addresses.map((item) => (
                    <OptionCard
                      key={item.id}
                      id={`address-${item.id}`}
                      value={item.id}
                      disabled={!inArea(item)}
                      title={
                        <>
                          {addressTitle(item)}
                          {item.isDefault && <Badge variant="secondary">Default</Badge>}
                        </>
                      }
                      description={inArea(item) ? addressLine(item) : `${addressLine(item)}. Outside our delivery area, pickup only.`}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">You have no saved addresses yet. Add one to continue.</p>
              )}
              <Field>
                <div className="flex items-baseline justify-between gap-3">
                  <FieldLabel htmlFor="checkout-note">
                    Delivery note <span className="font-normal text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {draftNote.length}/{NOTE_MAX}
                  </span>
                </div>
                <Textarea
                  id="checkout-note"
                  maxLength={NOTE_MAX}
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Gate code, floor or landmark"
                  className="min-h-20"
                />
              </Field>
            </Step>
          ) : (
            <Step
              number={2}
              title="Pick up from"
              summary={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Summary icon={StoreIcon} title="Cafe Ajwa, Gate 8">
                    {restaurant.pickupPoint}. Ready in about {checkoutSettings.pickupMinutes} minutes. Show your order number at the counter.
                  </Summary>
                  <Button variant="outline" size="sm" className="shrink-0" render={<a href={restaurant.mapsHref} target="_blank" rel="noreferrer" />} nativeButton={false}>
                    <NavigationIcon data-icon="inline-start" />
                    Directions
                  </Button>
                </div>
              }
            />
          )}

          <Step
            number={3}
            title="Offers and rewards"
            editing={editing === 'offers'}
            onEdit={() => startEditing('offers')}
            onSave={saveStep}
            onCancel={cancelEditing}
            summary={
              <div className="flex flex-col gap-4">
                {coupon && couponResult?.ok ? (
                  <Summary icon={TicketPercentIcon} title={`Coupon ${coupon.code}`}>
                    {couponResult.freeDelivery ? `Free delivery, saves ${formatPrice(checkoutSettings.deliveryFee)}.` : `Saves ${formatPrice(couponDiscount)}.`}
                  </Summary>
                ) : (
                  <Summary icon={TicketPercentIcon} title="No coupon">
                    {coupon && couponResult && !couponResult.ok
                      ? `${coupon.code} no longer applies: ${couponResult.reason.toLowerCase()}.`
                      : `${coupons.filter((item) => checkCoupon(item, couponContext).ok).length} coupons work on this order.`}
                  </Summary>
                )}
                <Summary icon={GiftIcon} title={pointsDiscount ? `Using ${pointsFor(pointsDiscount)} reward points` : 'Not using reward points'}>
                  {pointsDiscount
                    ? `Saves ${formatPrice(pointsDiscount)}. ${customer.rewardPoints - pointsFor(pointsDiscount)} points stay for later.`
                    : pointsAllowed > 0
                      ? `You can use ${pointsFor(pointsAllowed)} of your ${customer.rewardPoints} points to save ${formatPrice(pointsAllowed)}.`
                      : `Points work on orders of ${formatPrice(rewardSettings.minOrder)} or more.`}
                </Summary>
              </div>
            }
          >
            <form onSubmit={applyCode} noValidate>
              <Field data-invalid={codeError ? true : undefined}>
                <FieldLabel htmlFor="checkout-coupon">Coupon code</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="checkout-coupon"
                    value={codeInput}
                    onChange={(event) => {
                      setCodeInput(event.target.value)
                      setCodeError(undefined)
                    }}
                    placeholder="Enter a code"
                    autoCapitalize="characters"
                    className="uppercase placeholder:normal-case"
                    aria-invalid={codeError ? true : undefined}
                    aria-describedby={codeError ? 'checkout-coupon-error' : undefined}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" variant="secondary">
                      Apply
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {codeError && <FieldError id="checkout-coupon-error">{codeError}</FieldError>}
              </Field>
            </form>

            <ul className="flex flex-col gap-2" aria-label="Coupons">
              {coupons.map((item) => (
                <CouponRow
                  key={item.code}
                  coupon={item}
                  applied={item.code === draftCoupon}
                  check={checkCoupon(item, couponContext)}
                  onApply={() => {
                    setDraftCoupon(item.code)
                    setCodeError(undefined)
                  }}
                  onRemove={() => setDraftCoupon(null)}
                />
              ))}
            </ul>
            {draftCouponItem && !checkCoupon(draftCouponItem, couponContext).ok && (
              <p className="text-sm text-warning">{draftCouponItem.code} does not apply to this order. Remove it or change the order.</p>
            )}

            <div className="border-t pt-4">
              <Field orientation="horizontal" data-disabled={pointsAllowed === 0 || undefined}>
                <FieldContent>
                  <FieldLabel htmlFor="checkout-points">Use reward points</FieldLabel>
                  <FieldDescription>
                    {pointsAllowed > 0
                      ? `You have ${customer.rewardPoints} points. Use ${pointsFor(pointsAllowed)} here to save ${formatPrice(pointsAllowed)}.`
                      : `You have ${customer.rewardPoints} points. They work on orders of ${formatPrice(rewardSettings.minOrder)} or more.`}
                  </FieldDescription>
                </FieldContent>
                <Switch id="checkout-points" checked={draftPoints && pointsAllowed > 0} disabled={pointsAllowed === 0} onCheckedChange={setDraftPoints} />
              </Field>
            </div>
          </Step>

          <Step
            number={4}
            title="Payment"
            summary={
              <div className="flex flex-col gap-3">
                {type === 'delivery' ? (
                  <Summary icon={WalletIcon} title="Cash on delivery">
                    Pay the rider when your order arrives.
                  </Summary>
                ) : (
                  <Summary icon={StoreIcon} title="Pay at pickup">
                    Pay at the counter when you collect.
                  </Summary>
                )}
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LockIcon aria-hidden="true" className="size-4 shrink-0" />
                  Nothing is charged now. We do not take payment online, so payment follows step 1.
                </p>
              </div>
            }
          />
        </div>

        {/* Order summary */}
        <aside aria-labelledby="summary-title" className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="summary-title" className="font-heading text-lg font-semibold">
              Your order
            </h2>
            <Link to="/menu" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Add more
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.id} className="flex items-start gap-3">
                <span className="pt-1">
                  <FoodMark veg={line.veg} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-medium">{line.name}</span>
                      <span className="text-xs text-muted-foreground">{line.options}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                  </div>
                  <QuantityStepper size="sm" value={line.quantity} onValueChange={(value) => setQuantity(line.id, value)} itemName={line.name} className="self-start" />
                </div>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
            {bill.map(({ label, value, tone }) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className={cn('tabular-nums', tone === 'saving' && 'text-success')}>{formatRupees(value)}</dd>
              </div>
            ))}
            <div className="mt-1 flex justify-between border-t pt-3 text-base font-semibold">
              <dt>To pay {type === 'delivery' ? 'on delivery' : 'at pickup'}</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          {saving > 0 && (
            <p className="flex items-center gap-2 rounded-xl bg-[color-mix(in_oklch,var(--success)_8%,var(--card))] px-3 py-2 text-sm font-medium text-success">
              <CheckIcon aria-hidden="true" className="size-4" />
              You save {formatPrice(saving)} on this order
            </p>
          )}

          {/* The closed notice already sits above the steps, so the summary shows the next blocker. */}
          {blockers.filter((item) => item !== closedNotice).slice(0, 1).map((item) => (
            <Alert key={item.title} variant="warning">
              <AlertTitle>{item.title}</AlertTitle>
              <AlertDescription>{item.text}</AlertDescription>
            </Alert>
          ))}

          <Button size="lg" disabled={!canPlace} onClick={place} className="max-md:hidden">
            {placing && <Spinner data-icon="inline-start" />}
            {placeLabel}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            By placing this order you agree to our <Link to="/terms" className="underline underline-offset-4">terms</Link> and{' '}
            <Link to="/refund-policy" className="underline underline-offset-4">refund and cancellation policy</Link>.
          </p>
        </aside>
      </div>

      {/* Phones: Place order stays in reach above the tab bar */}
      <div className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 md:hidden">
        <Button size="lg" disabled={!canPlace} onClick={place} className="h-14 w-full rounded-2xl shadow-overlay">
          {placing && <Spinner data-icon="inline-start" />}
          {placeLabel}
        </Button>
      </div>

      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New address</SheetTitle>
            <SheetDescription>We deliver across {restaurant.deliveryArea}.</SheetDescription>
          </SheetHeader>
          {adding && <AddressForm initial={emptyAddressDraft} onSave={saveAddress} onCancel={() => setAdding(false)} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function CouponRow({
  coupon,
  applied,
  check,
  onApply,
  onRemove,
}: {
  coupon: Coupon
  applied: boolean
  check: ReturnType<typeof checkCoupon>
  onApply: () => void
  onRemove: () => void
}) {
  const Icon = coupon.icon
  const state = applied && check.ok ? 'applied' : check.ok ? 'available' : 'locked'
  const detail = check.ok
    ? check.freeDelivery
      ? `Saves ${formatPrice(checkoutSettings.deliveryFee)} on delivery`
      : `Saves ${formatPrice(check.discount)} on this order`
    : check.shortBy
      ? `Add ${formatPrice(check.shortBy)} more to unlock`
      : check.reason
  return (
    <li
      data-state={state}
      className="flex items-center gap-3 rounded-2xl border bg-card p-3 data-[state=applied]:border-success/40 data-[state=applied]:bg-[color-mix(in_oklch,var(--success)_6%,var(--card))]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-highlight text-primary in-data-[state=applied]:bg-[color-mix(in_oklch,var(--success)_14%,var(--card))] in-data-[state=applied]:text-success in-data-[state=locked]:bg-secondary in-data-[state=locked]:text-muted-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold">{coupon.title}</span>
        <span className="text-xs text-muted-foreground">
          <span className="font-mono font-semibold">{coupon.code}</span>, {detail}
        </span>
      </div>
      {state === 'applied' && (
        <Button variant="ghost" size="sm" onClick={onRemove} aria-label={`Remove coupon ${coupon.code}`}>
          Remove
        </Button>
      )}
      {state === 'available' && (
        <Button variant="secondary" size="sm" onClick={onApply} aria-label={`Apply coupon ${coupon.code}`}>
          Apply
        </Button>
      )}
      {state === 'locked' && (
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground">
          <LockIcon aria-hidden="true" className="size-3.5" />
          Locked
        </span>
      )}
    </li>
  )
}

export default function CheckoutRoute() {
  return (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  )
}
