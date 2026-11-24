import { BriefcaseIcon, HomeIcon, MapPinIcon, PencilIcon, PlusIcon, Trash2Icon, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { AddressForm, emptyAddressDraft, type AddressDraft } from '@/components/site/address-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/toast'
import { addressLine, addresses as sampleAddresses, addressTitle, type Address, type AddressLabel } from '@/data/account'
import { restaurant } from '@/data/restaurant'

export function meta() {
  return [{ title: 'Addresses, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* Saved delivery addresses, added and edited in a side sheet. */

const labelIcons: Record<AddressLabel, LucideIcon> = { home: HomeIcon, work: BriefcaseIcon, other: MapPinIcon }
export default function AddressesPage() {
  const [list, setList] = useState<Address[]>(sampleAddresses)
  const [editing, setEditing] = useState<{ id?: string; draft: AddressDraft } | null>(null)
  const [removing, setRemoving] = useState<Address | null>(null)

  const save = (draft: AddressDraft) => {
    const id = editing?.id ?? `a${Date.now()}`
    setList((current) => {
      const next = editing?.id ? current.map((item) => (item.id === id ? { ...draft, id } : item)) : [...current, { ...draft, id }]
      // Exactly one default. A new default replaces the old one, and the first address is always the default.
      const withDefault = draft.isDefault ? next.map((item) => ({ ...item, isDefault: item.id === id })) : next
      return withDefault.some((item) => item.isDefault) ? withDefault : withDefault.map((item, index) => ({ ...item, isDefault: index === 0 }))
    })
    toast.add({ title: editing?.id ? 'Address updated' : 'Address saved', description: addressTitle(draft), type: 'success' })
    setEditing(null)
  }

  const makeDefault = (address: Address) => {
    setList((current) => current.map((item) => ({ ...item, isDefault: item.id === address.id })))
    toast.add({ title: `${addressTitle(address)} is now your default`, type: 'success' })
  }

  const remove = (address: Address) => {
    setList((current) => {
      const next = current.filter((item) => item.id !== address.id)
      return address.isDefault && next.length ? next.map((item, index) => ({ ...item, isDefault: index === 0 })) : next
    })
    toast.add({ title: 'Address removed', description: addressTitle(address), type: 'success' })
  }

  // The default address first.
  const sorted = [...list].sort((a, b) => Number(b.isDefault) - Number(a.isDefault))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Addresses</h1>
          <p className="text-muted-foreground">Where we deliver your orders. Checkout uses your default.</p>
        </div>
        {list.length > 0 && (
          <Button onClick={() => setEditing({ draft: { ...emptyAddressDraft, isDefault: list.length === 0 } })}>
            <PlusIcon data-icon="inline-start" />
            Add new address
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPinIcon />
            </EmptyMedia>
            <EmptyTitle>No addresses saved</EmptyTitle>
            <EmptyDescription>Add a delivery address for faster checkout.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setEditing({ draft: { ...emptyAddressDraft, isDefault: true } })}>
              <PlusIcon data-icon="inline-start" />
              Add new address
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {sorted.map((address) => {
            const Icon = labelIcons[address.label]
            return (
              <li key={address.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{addressTitle(address)}</h2>
                      {address.isDefault && <Badge variant="success">Default</Badge>}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{addressLine(address)}</p>
                    {address.instructions && <p className="text-sm text-muted-foreground">{address.instructions}</p>}
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing({ id: address.id, draft: address })}
                    aria-label={`Edit ${addressTitle(address)}`}
                  >
                    <PencilIcon data-icon="inline-start" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button size="sm" variant="ghost" onClick={() => makeDefault(address)}>
                      Set as default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-destructive hover:bg-destructive/5 hover:text-destructive"
                    onClick={() => setRemoving(address)}
                    aria-label={`Delete ${addressTitle(address)}`}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    Delete
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing?.id ? 'Edit address' : 'New address'}</SheetTitle>
            <SheetDescription>We deliver across {restaurant.deliveryArea}.</SheetDescription>
          </SheetHeader>
          {editing && <AddressForm key={editing.id ?? 'new'} initial={editing.draft} onSave={save} onCancel={() => setEditing(null)} />}
        </SheetContent>
      </Sheet>

      <Dialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this address?</DialogTitle>
            <DialogDescription>
              Remove {removing ? addressTitle(removing) : ''} from your saved addresses?
              {removing?.isDefault && list.length > 1 ? ' Your next address becomes the default.' : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep it</DialogClose>
            <DialogClose render={<Button variant="destructive" onClick={() => removing && remove(removing)} />}>Delete</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
