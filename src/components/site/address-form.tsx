import { BriefcaseIcon, HomeIcon, MapPinIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SheetBody, SheetFooter } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Address, AddressLabel } from '@/data/account'
import { restaurant } from '@/data/restaurant'

/*
 * The add and edit address form, shown in a side sheet on the Addresses page and at checkout. The
 * live form also has a map to drop a pin, which checks the delivery radius and fee. This version
 * checks the pincode against the delivery area instead.
 */

const INSTRUCTIONS_MAX = 120

export type AddressDraft = Omit<Address, 'id'>
export const emptyAddressDraft: AddressDraft = { label: 'home', name: '', building: '', area: '', pincode: '', instructions: '', isDefault: false }

export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddressDraft
  onSave: (draft: AddressDraft) => void
  onCancel: () => void
}) {
  const [draft, setAddressDraft] = useState(initial)
  const [errors, setErrors] = useState<Partial<Record<'building' | 'area' | 'pincode' | 'name', string>>>({})
  const set = <K extends keyof AddressDraft>(key: K, value: AddressDraft[K]) => {
    setAddressDraft((current) => ({ ...current, [key]: value }))
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }))
  }
  const outsideArea = /^\d{6}$/.test(draft.pincode) && !restaurant.deliveryPincodes.includes(draft.pincode)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (draft.label === 'other' && !draft.name?.trim()) found.name = 'Give this address a name, such as Mom’s place.'
    if (!draft.building.trim()) found.building = 'Enter your building, floor and house number.'
    if (!draft.area.trim()) found.area = 'Enter your area.'
    if (!/^\d{6}$/.test(draft.pincode)) found.pincode = 'Pincode must be 6 digits.'
    setErrors(found)
    const first = (['name', 'building', 'area', 'pincode'] as const).find((key) => found[key])
    if (first) return document.getElementById(`addr-${first}`)?.focus()
    onSave({ ...draft, name: draft.label === 'other' ? draft.name?.trim() : undefined, instructions: draft.instructions?.trim() || undefined })
  }

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <SheetBody>
        <FieldGroup>
          <Field>
            <FieldLabel id="addr-label">Save as</FieldLabel>
            <ToggleGroup
              value={[draft.label]}
              onValueChange={(value) => {
                if (value.length) set('label', value[0] as AddressLabel)
              }}
              variant="segment"
              className="w-full"
              aria-labelledby="addr-label"
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
          {draft.label === 'other' && (
            <Field data-invalid={errors.name ? true : undefined}>
              <FieldLabel htmlFor="addr-name">Name this address</FieldLabel>
              <Input
                id="addr-name"
                value={draft.name}
                onChange={(event) => set('name', event.target.value)}
                placeholder="Mom's place"
                aria-invalid={errors.name ? true : undefined}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>
          )}
          <Field data-invalid={errors.building ? true : undefined}>
            <FieldLabel htmlFor="addr-building">Building, floor and house no.</FieldLabel>
            <Input
              id="addr-building"
              autoComplete="address-line1"
              value={draft.building}
              onChange={(event) => set('building', event.target.value)}
              placeholder="Flat 302, Sea View Apartments"
              aria-invalid={errors.building ? true : undefined}
            />
            {errors.building && <FieldError>{errors.building}</FieldError>}
          </Field>
          <Field data-invalid={errors.area ? true : undefined}>
            <FieldLabel htmlFor="addr-area">Area</FieldLabel>
            <Input
              id="addr-area"
              autoComplete="address-line2"
              value={draft.area}
              onChange={(event) => set('area', event.target.value)}
              placeholder="Malwani Colony, Malad West"
              aria-invalid={errors.area ? true : undefined}
            />
            {errors.area && <FieldError>{errors.area}</FieldError>}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="addr-city">City</FieldLabel>
              <Input id="addr-city" value="Mumbai" readOnly />
            </Field>
            <Field data-invalid={errors.pincode ? true : undefined}>
              <FieldLabel htmlFor="addr-pincode">Pincode</FieldLabel>
              <Input
                id="addr-pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={draft.pincode}
                onChange={(event) => set('pincode', event.target.value.replace(/\D/g, ''))}
                placeholder="400095"
                aria-invalid={errors.pincode ? true : undefined}
              />
              {errors.pincode && <FieldError>{errors.pincode}</FieldError>}
            </Field>
          </div>
          {outsideArea && (
            <Alert variant="warning">
              <MapPinIcon />
              <AlertTitle>Outside our delivery area</AlertTitle>
              <AlertDescription>
                You can save it, but orders to {draft.pincode} are pickup only from {restaurant.pickupPoint}.
              </AlertDescription>
            </Alert>
          )}
          <Field>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="addr-instructions">
                Delivery instructions <span className="font-normal text-muted-foreground">(optional)</span>
              </FieldLabel>
              <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
                {draft.instructions?.length ?? 0}/{INSTRUCTIONS_MAX}
              </span>
            </div>
            <Textarea
              id="addr-instructions"
              maxLength={INSTRUCTIONS_MAX}
              value={draft.instructions}
              onChange={(event) => set('instructions', event.target.value)}
              placeholder="Ring the bell, the gate code is 1234"
            />
          </Field>
          <Field orientation="horizontal">
            <Switch id="addr-default" checked={draft.isDefault} onCheckedChange={(checked) => set('isDefault', checked)} />
            <FieldLabel htmlFor="addr-default">Set as my default address</FieldLabel>
          </Field>
        </FieldGroup>
      </SheetBody>
      <SheetFooter>
        <Button type="submit" size="lg">
          Save address
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </SheetFooter>
    </form>
  )
}
