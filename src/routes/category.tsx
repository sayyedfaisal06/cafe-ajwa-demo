import { cn } from 'cn'
import { ArrowRightIcon, UtensilsCrossedIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, NavLink, useParams } from 'react-router'

import { DishCard, DishRow } from '@/components/site/dish'
import { Container } from '@/components/site/section'
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ScrollRow } from '@/components/ui/scroll-row'
import { toggleVariants } from '@/components/ui/toggle'
import { categoryIntros } from '@/data/category-intros'
import { categoryBySlug, menuCategories, menuItems } from '@/data/menu'
import { formatPrice } from '@/lib/format'

import type { Route } from './+types/category'

const SITE = 'https://www.cafeajwa.co'

export function meta({ params }: Route.MetaArgs) {
  const category = categoryBySlug(params.category)
  if (!category) return [{ title: 'Category not found, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
  const dishes = menuItems.filter((item) => item.category === category.slug)
  const url = `${SITE}/menu/c/${category.slug}`
  return [
    { title: `${category.name}, ${dishes.length} dishes | Cafe Ajwa, Malwani` },
    { name: 'description', content: `${categoryIntros[category.slug]} Order for delivery or pickup in Malwani, Malad West.` },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:title', content: `${category.name} at Cafe Ajwa` },
    { property: 'og:url', content: url },
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'MenuSection',
        name: category.name,
        url,
        hasMenuItem: dishes.map((dish) => ({
          '@type': 'MenuItem',
          name: dish.name,
          url: `${SITE}/menu/${dish.slug}`,
          offers: { '@type': 'Offer', price: dish.price, priceCurrency: 'INR' },
        })),
      },
    },
  ]
}

const chipClassName = cn(toggleVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')
const activeChipClassName =
  'border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:text-primary-foreground'

/* One category as its own page, so search engines can index it (docs/redesign-plan.md section 6.1). */
export default function CategoryPage() {
  const { category: slug } = useParams()
  const category = categoryBySlug(slug)
  const chipsRef = useRef<HTMLElement>(null)

  // Bring the current category's chip into view in the scrolling row.
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>('[aria-current="page"]')
    const viewport = chip?.closest<HTMLElement>('[data-slot=scroll-row-viewport]')
    if (chip && viewport) viewport.scrollLeft = chip.offsetLeft - (viewport.clientWidth - chip.offsetWidth) / 2
  }, [slug])

  if (!category) {
    return (
      <Container className="pt-10 pb-16">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossedIcon />
            </EmptyMedia>
            <EmptyTitle>We could not find that category</EmptyTitle>
            <EmptyDescription>The menu has every dish we cook, sorted by category.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/menu" />} nativeButton={false}>
              See the menu
            </Button>
          </EmptyContent>
        </Empty>
      </Container>
    )
  }

  const dishes = menuItems.filter((item) => item.category === category.slug)
  const prices = dishes.map((dish) => dish.price)
  const Icon = category.icon

  return (
    <div className="flex flex-col gap-8 pt-6 pb-16">
      <Container className="flex flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList className="max-sm:hidden">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/menu" />}>Menu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
          <BreadcrumbBack render={<Link to="/menu" />} className="sm:hidden">
            Menu
          </BreadcrumbBack>
        </Breadcrumb>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-highlight text-primary">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          <div className="flex max-w-2xl flex-col gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{category.name}</h1>
            <p className="text-muted-foreground sm:text-lg">{categoryIntros[category.slug]}</p>
            <p className="text-sm font-medium text-foreground/80">
              {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'}
              {dishes.length > 1 && `, ${formatPrice(Math.min(...prices))} to ${formatPrice(Math.max(...prices))}`}
            </p>
          </div>
        </header>

        <ScrollRow scrollLabel="categories">
          <nav ref={chipsRef} aria-label="Menu categories" className="flex w-max gap-2">
            {menuCategories.map((item) => (
              <NavLink
                key={item.slug}
                to={`/menu/c/${item.slug}`}
                className={({ isActive }) => cn(chipClassName, isActive && activeChipClassName)}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </ScrollRow>
      </Container>

      <Container className="flex flex-col gap-6">
        <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
        <div className="flex flex-col divide-y rounded-2xl border bg-card px-4 md:hidden">
          {dishes.map((dish) => (
            <DishRow key={dish.id} dish={dish} />
          ))}
        </div>
        <Button variant="outline" className="self-center" render={<Link to="/menu" />} nativeButton={false}>
          See the full menu
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </Container>
    </div>
  )
}
