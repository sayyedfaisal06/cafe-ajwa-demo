import { AwardIcon, FlameIcon, HeartIcon, LayersIcon, PlusIcon, UsersIcon, UtensilsCrossedIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { FoodMark } from '@/components/food'
import { useOptionalCart } from '@/components/site/cart'
import { useFavourites } from '@/components/site/favourites'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from '@/components/ui/card'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { Skeleton } from '@/components/ui/skeleton'
import type { Dish } from '@/data/menu'
import { formatPrice } from '@/lib/format'

/* The dish name links to its page when the dish has a slug. */
function DishName({ dish }: { dish: Dish }) {
  if (!dish.slug) return <>{dish.name}</>
  return (
    <Link to={`/menu/${dish.slug}`} className="rounded-sm outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">
      {dish.name}
    </Link>
  )
}

export function DishMeta({ dish }: { dish: Dish }) {
  if (!dish.options && !dish.serves && !dish.spice) return null
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground [&_svg]:size-3.5">
      {dish.options && (
        <span className="flex items-center gap-1.5">
          <LayersIcon aria-hidden="true" />
          {dish.options}
        </span>
      )}
      {dish.serves && (
        <span className="flex items-center gap-1.5">
          <UsersIcon aria-hidden="true" />
          {dish.serves}
        </span>
      )}
      {dish.spice && (
        <span className="flex items-center gap-1.5">
          <FlameIcon aria-hidden="true" />
          {dish.spice}
        </span>
      )}
    </div>
  )
}

/*
 * Add turns into a quantity stepper after the first tap, so the cart does not need opening. Inside
 * CartProvider it reads and updates the shared cart. Outside it, as on the /ui preview, it keeps
 * its own count.
 */
export function AddControl({ dish, size = 'default' }: { dish: Dish; size?: 'default' | 'sm' }) {
  const cart = useOptionalCart()
  const [localQuantity, setLocalQuantity] = useState(0)
  // A dish with sizes is added at its first size, such as Chicken Pakoda, 500 g.
  const variant = dish.variants?.[0]
  const lineId = variant ? `${dish.id}:${variant.label}` : dish.id
  const quantity = cart ? cart.quantityOf(lineId) : localQuantity
  const setQuantity = (value: number) =>
    cart
      ? quantity === 0
        ? cart.addDish(dish, variant ? { variant: variant.label, price: variant.price } : undefined)
        : cart.setQuantity(lineId, value)
      : setLocalQuantity(value)

  if (dish.soldOut) {
    return (
      <Button disabled size={size === 'sm' ? 'sm' : 'default'} className="bg-card">
        Sold out
      </Button>
    )
  }
  if (quantity === 0) {
    return (
      <Button
        variant="outline"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={() => setQuantity(1)}
        aria-label={`Add ${dish.name}`}
        className="min-w-24 bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
      >
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
    )
  }
  return (
    <QuantityStepper
      size={size}
      value={quantity}
      itemName={dish.name}
      onValueChange={setQuantity}
      className="shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
    />
  )
}

export function DishCard({ dish }: { dish: Dish }) {
  const favourites = useFavourites()
  const saved = favourites.has(dish.id)
  return (
    <Card data-sold-out={dish.soldOut || undefined} className="group/dish">
      <CardMedia className="aspect-square">
        <div className="flex size-full items-center justify-center group-data-sold-out/dish:grayscale">
          {dish.image ? (
            <img src={dish.image} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
          ) : (
            <UtensilsCrossedIcon aria-hidden="true" className="size-10 text-muted-foreground/40" />
          )}
        </div>
        {(dish.bestseller || dish.label) && (
          <Badge className="absolute top-3 left-3">
            {dish.bestseller && <AwardIcon />}
            {dish.label ?? 'Bestseller'}
          </Badge>
        )}
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={saved ? `Remove ${dish.name} from favourites` : `Save ${dish.name} to favourites`}
          aria-pressed={saved}
          onClick={() => favourites.toggle(dish.id)}
          className="absolute top-3 right-3 bg-card/90 hover:bg-card"
        >
          <HeartIcon className={saved ? 'fill-current' : undefined} />
        </Button>
        {dish.soldOut && (
          <div className="absolute inset-0 flex items-end bg-background/50 p-3">
            <Badge variant="secondary" size="lg">
              Sold out today
            </Badge>
          </div>
        )}
      </CardMedia>
      <CardHeader>
        <CardTitle className="flex items-start gap-2 group-data-sold-out/dish:text-muted-foreground">
          <span className="mt-1">
            <FoodMark veg={dish.veg} />
          </span>
          <DishName dish={dish} />
        </CardTitle>
        {dish.description && <CardDescription className="line-clamp-2">{dish.description}</CardDescription>}
      </CardHeader>
      {(dish.options || dish.serves || dish.spice) && (
        <CardContent>
          <DishMeta dish={dish} />
        </CardContent>
      )}
      <CardFooter className="mt-auto justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-semibold tabular-nums group-data-sold-out/dish:text-muted-foreground">
            {formatPrice(dish.price)}
          </span>
          {dish.customisable && <span className="text-xs text-muted-foreground">Customisable</span>}
        </div>
        <AddControl dish={dish} />
      </CardFooter>
    </Card>
  )
}

export function DishCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardMedia>
        <Skeleton className="size-full rounded-none" />
      </CardMedia>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </CardFooter>
    </Card>
  )
}

/* The compact row for phones: text on the left, photo on the right with Add over its edge. */
export function DishRow({ dish }: { dish: Dish }) {
  return (
    <div data-sold-out={dish.soldOut || undefined} className="group/dish flex gap-4 py-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <FoodMark veg={dish.veg} />
          {dish.bestseller && (
            <span className="flex items-center gap-1 text-xs font-semibold text-warning">
              <AwardIcon aria-hidden="true" className="size-3.5" />
              Bestseller
            </span>
          )}
        </div>
        <h4 className="text-base leading-snug font-semibold group-data-sold-out/dish:text-muted-foreground">
          <DishName dish={dish} />
        </h4>
        <span className="font-semibold tabular-nums">{formatPrice(dish.price)}</span>
        {dish.description && <p className="line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>}
        <DishMeta dish={dish} />
      </div>
      <div className="flex w-32 shrink-0 flex-col items-center">
        <div className="flex size-32 items-center justify-center overflow-hidden rounded-2xl bg-secondary group-data-sold-out/dish:grayscale">
          {dish.image ? (
            <img src={dish.image} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
          ) : (
            <UtensilsCrossedIcon aria-hidden="true" className="size-8 text-muted-foreground/40" />
          )}
        </div>
        <div className="-mt-6">
          <AddControl dish={dish} />
        </div>
        {dish.customisable && (
          <span className="mt-1.5 text-[0.6875rem] text-muted-foreground">Customisable</span>
        )}
      </div>
    </div>
  )
}
