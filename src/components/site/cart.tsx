import { ArrowRightIcon, PlusIcon, ShoppingBagIcon } from 'lucide-react'
import { createContext, use, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { DishThumb, FoodMark } from '@/components/food'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatPrice } from '@/lib/format'

export type CartLine = {
  id: string
  name: string
  veg: boolean
  price: number
  quantity: number
  options: string
}

/* Sample lines for the redesign preview. The real cart comes from the API and local storage. */
export const sampleCart: CartLine[] = [
  { id: 'kolhapuri', name: 'Chicken Kolhapuri', veg: false, price: 240, quantity: 1, options: 'Full, with Tandoori Roti' },
  { id: 'paneer-bg', name: 'Paneer Butter Garlic', veg: true, price: 320, quantity: 2, options: 'Full' },
  { id: 'jeera', name: 'Jeera Rice', veg: true, price: 110, quantity: 1, options: 'Half' },
]

type CartContextValue = {
  lines: CartLine[]
  count: number
  itemTotal: number
  setQuantity: (id: string, quantity: number) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

/* Holds the cart and whether the cart sheet is open, for the header, the phone cart bar and the sheet. */
export function CartProvider({ children, initialLines = sampleCart }: { children: ReactNode; initialLines?: CartLine[] }) {
  const [lines, setLines] = useState(initialLines)
  const [open, setOpen] = useState(false)
  const setQuantity = (id: string, quantity: number) =>
    setLines((current) =>
      quantity === 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
    )
  const value: CartContextValue = {
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    itemTotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    setQuantity,
    open,
    setOpen,
  }
  return <CartContext value={value}>{children}</CartContext>
}

export function useCart() {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart must be used inside CartProvider')
  return cart
}

/* Opens the cart. The icon version suits the header; labelled adds the word Cart. */
export function CartButton({ labelled = false, className }: { labelled?: boolean; className?: string }) {
  const { count, setOpen } = useCart()
  const label = count ? `Cart, ${count} items` : 'Cart, empty'
  if (labelled) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className={className}>
        <ShoppingBagIcon data-icon="inline-start" />
        Cart
        {count > 0 && (
          <Badge shape="count" size="sm">
            {count}
          </Badge>
        )}
      </Button>
    )
  }
  return (
    <div className={className ? `relative ${className}` : 'relative'}>
      <Button variant="ghost" size="icon" aria-label={label} onClick={() => setOpen(true)}>
        <ShoppingBagIcon />
      </Button>
      {count > 0 && (
        <Badge shape="count" size="sm" aria-hidden className="pointer-events-none absolute top-0.5 right-0.5">
          {count}
        </Badge>
      )}
    </div>
  )
}

/* The phone bar above the tab bar while the cart has items, as the redesign plan describes. */
export function CartBar() {
  const { count, itemTotal, setOpen } = useCart()
  if (count === 0) return null
  return (
    <div className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 md:hidden">
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="h-14 w-full justify-between rounded-2xl px-5 shadow-overlay"
      >
        <span className="flex flex-col items-start leading-tight">
          <span className="text-xs font-medium text-primary-foreground/75">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
          <span className="tabular-nums">{formatPrice(itemTotal)}</span>
        </span>
        <span className="flex items-center gap-1.5">
          View cart
          <ArrowRightIcon data-icon="inline-end" />
        </span>
      </Button>
    </div>
  )
}

/* The cart side sheet. Its open state lives in CartProvider, so any button can open it. */
export function CartSheet() {
  const { lines, count, itemTotal, setQuantity, open, setOpen } = useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>{count === 0 ? 'Nothing added yet' : `${count} items, delivery to Malwani`}</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <SheetBody className="flex items-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingBagIcon />
                </EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDescription>Add dishes from the menu to start an order.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button render={<Link to="/menu" />} nativeButton={false} onClick={() => setOpen(false)}>
                  Browse menu
                </Button>
              </EmptyContent>
            </Empty>
          </SheetBody>
        ) : (
          <>
            <SheetBody className="flex flex-col gap-4 py-2">
              <ul className="flex flex-col divide-y">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-3 py-4">
                    <DishThumb alt={line.name} />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <p className="flex items-center gap-2 font-semibold">
                            <FoodMark veg={line.veg} />
                            <span className="truncate">{line.name}</span>
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{line.options}</p>
                        </div>
                        <span className="font-semibold tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {line.quantity > 1 ? `${formatPrice(line.price)} each` : ''}
                        </span>
                        <QuantityStepper
                          size="sm"
                          value={line.quantity}
                          itemName={line.name}
                          onValueChange={(quantity) => setQuantity(line.id, quantity)}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <Button
                variant="ghost"
                size="sm"
                className="self-start"
                render={<Link to="/menu" />}
                nativeButton={false}
                onClick={() => setOpen(false)}
              >
                <PlusIcon data-icon="inline-start" />
                Add more items
              </Button>

              <dl className="flex flex-col gap-2 rounded-xl bg-secondary p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Item total</dt>
                  <dd className="tabular-nums">{formatPrice(itemTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery fee</dt>
                  <dd>Shown at checkout</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Taxes</dt>
                  <dd>Shown at checkout</dd>
                </div>
              </dl>
            </SheetBody>
            <SheetFooter>
              <Button size="lg" render={<Link to="/checkout" />} nativeButton={false} onClick={() => setOpen(false)}>
                Checkout
                <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">{formatPrice(itemTotal)}</span>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
