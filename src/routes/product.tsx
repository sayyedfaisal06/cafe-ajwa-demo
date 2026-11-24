import {
  AwardIcon,
  BikeIcon,
  ChefHatIcon,
  HeartIcon,
  LayersIcon,
  MessageSquareIcon,
  Share2Icon,
  StarIcon,
  StoreIcon,
  TriangleAlertIcon,
  UsersIcon,
  UtensilsCrossedIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'

import { FoodMark } from '@/components/food'
import { useCart } from '@/components/site/cart'
import { DishCard, DishRow } from '@/components/site/dish'
import { useFavourites } from '@/components/site/favourites'
import { MenuSearch } from '@/components/site/menu-search'
import { Badge } from '@/components/ui/badge'
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
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { toast } from '@/components/ui/toast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { bestsellers, categoryBySlug, findDish, menuItems, type Dish } from '@/data/menu'
import { dishReviews } from '@/data/menu-details'
import { restaurant } from '@/data/restaurant'
import { formatPrice } from '@/lib/format'

import type { Route } from './+types/product'

export function meta({ params }: Route.MetaArgs) {
  const dish = findDish(params.slug)
  if (!dish) return [{ title: 'Dish not found, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
  const category = categoryBySlug(dish.category)
  return [
    { title: `${dish.name}, ${formatPrice(dish.price)} | Cafe Ajwa` },
    {
      name: 'description',
      content: `Order ${dish.name} from Cafe Ajwa in Malwani, Malad West. ${dish.veg ? 'Veg' : 'Non veg'}, ${formatPrice(dish.price)}, cooked fresh after you order. Delivery and pickup.`,
    },
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'MenuItem',
        name: dish.name,
        description: dish.description,
        url: `https://www.cafeajwa.co/menu/${dish.slug}`,
        image: dish.image,
        suitableForDiet: dish.veg ? 'https://schema.org/VegetarianDiet' : undefined,
        offers: { '@type': 'Offer', price: dish.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
        isPartOf: category ? { '@type': 'MenuSection', name: category.name } : undefined,
      },
    },
  ]
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden="true"
          className={star <= Math.round(rating) ? 'size-4 fill-saffron text-saffron' : 'size-4 text-input/60'}
        />
      ))}
    </span>
  )
}

/* Curries and gravies pair with breads and rice. Other dishes suggest more from their category. */
const pairsWithBreadAndRice = ['chicken-curries', 'indo-chinese-mains', 'paneer-veg']

function suggestionsFor(dish: Dish) {
  if (dish.category && pairsWithBreadAndRice.includes(dish.category)) {
    const pick = ['Tandoori Roti', 'Tandoori Butter Paratha', 'Jeera Rice', 'Steamed Rice']
    return pick.map((name) => menuItems.find((item) => item.name === name)!).filter(Boolean)
  }
  return []
}

function DishGrid({ dishes }: { dishes: Dish[] }) {
  return (
    <>
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {dishes.map((item) => (
          <DishCard key={item.id} dish={item} />
        ))}
      </div>
      <div className="flex flex-col divide-y rounded-2xl border bg-card px-4 md:hidden">
        {dishes.map((item) => (
          <DishRow key={item.id} dish={item} />
        ))}
      </div>
    </>
  )
}

/* A real not found state with the menu search, instead of "Something went wrong". */
function DishNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">Dish not found</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">We could not find that dish</h1>
        <p className="text-muted-foreground">
          It may have been renamed or taken off the menu. Search for it, or try one of our bestsellers.
        </p>
      </div>
      <MenuSearch />
      <div className="flex flex-col divide-y rounded-2xl border bg-card px-4">
        {bestsellers.slice(0, 4).map((item) => (
          <DishRow key={item.id} dish={item} />
        ))}
      </div>
      <Button variant="outline" render={<Link to="/menu" />} nativeButton={false} className="self-start">
        Browse the full menu
      </Button>
    </div>
  )
}

/* Keyed by slug, so moving to another dish from the suggestions starts with fresh choices. */
export default function ProductRoute() {
  const { slug = '' } = useParams()
  return <ProductPage key={slug} slug={slug} />
}

function ProductPage({ slug }: { slug: string }) {
  const dish = findDish(slug)
  const { addDish, setOpen } = useCart()
  const favourites = useFavourites()
  const [variant, setVariant] = useState<string | undefined>(dish?.variants?.[0]?.label)
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const addButtonRef = useRef<HTMLDivElement>(null)

  // On phones, show the sticky add bar whenever the main Add button is off screen, above or below.
  useEffect(() => {
    const target = addButtonRef.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting))
    observer.observe(target)
    return () => observer.disconnect()
  }, [slug])

  if (!dish) return <DishNotFound />

  const category = categoryBySlug(dish.category)
  const saved = favourites.has(dish.id)
  const unitPrice = dish.variants?.find((item) => item.label === variant)?.price ?? dish.price
  const total = unitPrice * quantity
  const pairings = suggestionsFor(dish)
  // Newest first, as the redesign plan asks.
  const reviews = [...(dishReviews[dish.slug ?? ''] ?? [])].sort((a, b) => b.date.localeCompare(a.date))
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0
  // Same rule as the current site: delivery takes the kitchen time plus 25 minutes on the road.
  const deliveryLabel = dish.prepMinutes ? `Delivery in about ${dish.prepMinutes + 25} min` : `Delivery in ${restaurant.deliveryTime}`
  const moreFromCategory = menuItems.filter((item) => item.category === dish.category && item.id !== dish.id).slice(0, 4)

  const add = () => {
    addDish(dish, { variant, price: unitPrice, quantity })
    toast.add({
      title: 'Added to cart',
      description: `${quantity} x ${dish.name}${variant ? `, ${variant}` : ''}`,
      type: 'success',
      actionProps: { children: 'View cart', onClick: () => setOpen(true) },
    })
    setQuantity(1)
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${dish.name} at Cafe Ajwa`, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.add({ title: 'Link copied', description: 'Paste it anywhere to share this dish.', type: 'info' })
      }
    } catch {
      // Closing the share sheet is not an error.
    }
  }

  const addLabel = dish.soldOut ? 'Sold out today' : 'Add to cart'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-6 pb-36 md:pb-16">
      <Breadcrumb>
        <BreadcrumbList className="max-sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/menu" />}>Menu</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to={`/menu/c/${category.slug}`} />}>{category.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dish.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to={category ? `/menu/c/${category.slug}` : '/menu'} />} className="sm:hidden">
          {category?.name ?? 'Menu'}
        </BreadcrumbBack>
      </Breadcrumb>

      {/* Photo and order panel */}
      <section className="grid gap-8 md:grid-cols-2 md:items-start lg:gap-12" aria-labelledby="dish-title">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-secondary md:aspect-square">
          {dish.image ? (
            <img src={dish.image} alt={dish.name} className="size-full object-cover" fetchPriority="high" />
          ) : (
            <UtensilsCrossedIcon aria-hidden="true" strokeWidth={1.25} className="size-20 text-muted-foreground/35" />
          )}
          {dish.soldOut && (
            <div className="absolute inset-0 flex items-end bg-background/50 p-4">
              <Badge variant="secondary" size="lg">
                Sold out today
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={dish.veg ? 'success' : 'destructive'} size="lg">
                <FoodMark veg={dish.veg} />
                {dish.veg ? 'Veg' : 'Non veg'}
              </Badge>
              {dish.bestseller && (
                <Badge size="lg">
                  <AwardIcon />
                  Bestseller
                </Badge>
              )}
              {dish.label && <Badge size="lg">{dish.label}</Badge>}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label={saved ? `Remove ${dish.name} from favourites` : `Save ${dish.name} to favourites`}
                aria-pressed={saved}
                onClick={() => favourites.toggle(dish.id)}
              >
                <HeartIcon className={saved ? 'fill-current' : undefined} />
              </Button>
              <Button variant="secondary" size="icon-sm" aria-label={`Share ${dish.name}`} onClick={share}>
                <Share2Icon />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 id="dish-title" className="font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              {dish.name}
            </h1>
            <p className="text-2xl font-semibold tabular-nums">{formatPrice(unitPrice)}</p>
            {(dish.rating || dish.orderCount) && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                {dish.rating && (
                  <span className="flex items-center gap-1 font-semibold">
                    <StarIcon aria-hidden="true" className="size-4 fill-saffron text-saffron" />
                    {dish.rating.toFixed(1)}
                    <span className="sr-only">out of 5</span>
                  </span>
                )}
                {dish.orderCount && (
                  <span className="text-muted-foreground">
                    {dish.orderCount} {dish.orderCount === 1 ? 'order' : 'orders'}
                  </span>
                )}
              </p>
            )}
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Dish details">
            {dish.options && !dish.variants && (
              <li>
                <Badge variant="outline" size="lg">
                  <LayersIcon />
                  {dish.options}
                </Badge>
              </li>
            )}
            {dish.serves && (
              <li>
                <Badge variant="outline" size="lg">
                  <UsersIcon />
                  {dish.serves}
                </Badge>
              </li>
            )}
            {dish.prepMinutes && (
              <li>
                <Badge variant="outline" size="lg">
                  <ChefHatIcon />
                  Ready in about {dish.prepMinutes} min
                </Badge>
              </li>
            )}
            <li>
              <Badge variant="outline" size="lg">
                <BikeIcon />
                {deliveryLabel}
              </Badge>
            </li>
          </ul>

          {dish.description && <p className="leading-relaxed text-muted-foreground">{dish.description}</p>}

          {dish.variants && (
            <div className="flex flex-col gap-2">
              <span id="size-label" className="text-sm font-semibold">
                Size
              </span>
              <ToggleGroup
                value={variant ? [variant] : []}
                onValueChange={(value) => value[0] && setVariant(value[0])}
                variant="segment"
                className="w-full max-w-sm"
                aria-labelledby="size-label"
              >
                {dish.variants.map((item) => (
                  <ToggleGroupItem key={item.label} value={item.label}>
                    {item.label}, {formatPrice(item.price)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <div ref={addButtonRef} className="flex flex-wrap items-center gap-3">
            {!dish.soldOut && (
              <QuantityStepper value={quantity} min={1} itemName={dish.name} onValueChange={setQuantity} />
            )}
            <Button size="lg" onClick={add} disabled={dish.soldOut} className="flex-1 sm:flex-none">
              {addLabel}
              {!dish.soldOut && (
                <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">{formatPrice(total)}</span>
              )}
            </Button>
          </div>

          <dl className="flex flex-col divide-y rounded-2xl border bg-card px-5 text-sm">
            <div className="flex items-start gap-3 py-3.5">
              <BikeIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="font-semibold">Delivery</dt>
                <dd className="text-muted-foreground">Around Malwani, Malad West and nearby areas. The fee shows at checkout.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3.5">
              <StoreIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="font-semibold">Pickup</dt>
                <dd className="text-muted-foreground">Collect from {restaurant.pickupPoint}.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3.5">
              <TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
              <div>
                <dt className="font-semibold">Allergies</dt>
                <dd className="text-muted-foreground">
                  We do not list allergens for this dish yet. Call us on{' '}
                  <a href={restaurant.phoneHref} className="font-medium text-primary underline underline-offset-4">
                    {restaurant.phone}
                  </a>{' '}
                  before you order.
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      {pairings.length > 0 && (
        <section className="flex flex-col gap-5" aria-labelledby="pairings-title">
          <h2 id="pairings-title" className="font-heading text-2xl font-semibold tracking-tight">
            Goes well with
          </h2>
          <DishGrid dishes={pairings} />
        </section>
      )}

      {category && moreFromCategory.length > 0 && (
        <section className="flex flex-col gap-5" aria-labelledby="more-title">
          <div className="flex items-end justify-between gap-4">
            <h2 id="more-title" className="font-heading text-2xl font-semibold tracking-tight">
              More from {category.name}
            </h2>
            <Button variant="link" render={<Link to={`/menu/c/${category.slug}`} />} nativeButton={false}>
              See all {category.count}
            </Button>
          </div>
          <DishGrid dishes={moreFromCategory} />
        </section>
      )}

      <section className="flex flex-col gap-5" aria-labelledby="reviews-title">
        <h2 id="reviews-title" className="font-heading text-2xl font-semibold tracking-tight">
          Reviews
        </h2>
        {reviews.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareIcon />
              </EmptyMedia>
              <EmptyTitle>No reviews yet</EmptyTitle>
              <EmptyDescription>Once you have ordered this dish, you can rate it from your order page.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-[16rem_1fr]">
            <div className="flex flex-col gap-1 rounded-2xl border bg-card p-5">
              <span className="font-heading text-4xl font-semibold tabular-nums">{average.toFixed(1)}</span>
              <Stars rating={average} />
              <span className="text-sm text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <ul className="flex flex-col divide-y rounded-2xl border bg-card px-5">
              {reviews.slice(0, 3).map((review) => (
                <li key={`${review.name}-${review.date}`} className="flex flex-col gap-1.5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{review.name}</span>
                    <time dateTime={review.date} className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                  </div>
                  <Stars rating={review.rating} />
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Phone add bar, shown while the main Add button is off screen */}
      {!dish.soldOut && showStickyBar && (
        <div className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 md:hidden">
          <Button size="lg" onClick={add} className="h-14 w-full justify-between rounded-2xl px-5 shadow-overlay">
            <span className="truncate">
              Add {quantity > 1 ? `${quantity} x ` : ''}
              {dish.name}
            </span>
            <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">{formatPrice(total)}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
