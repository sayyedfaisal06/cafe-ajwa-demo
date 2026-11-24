import { cn } from 'cn'
import { ArrowUpDownIcon, AwardIcon, ChevronDownIcon, DrumstickIcon, LeafIcon, SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Navigate, useSearchParams } from 'react-router'

import { DishCard, DishRow } from '@/components/site/dish'
import { fuzzyMatch } from '@/components/site/menu-search'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { ScrollRow } from '@/components/ui/scroll-row'
import { Toggle, toggleVariants } from '@/components/ui/toggle'
import { bestsellers, menuCategories, menuItems, type Dish } from '@/data/menu'

export function meta() {
  return [
    { title: 'Menu, Cafe Ajwa' },
    {
      name: 'description',
      content: `All ${menuItems.length} dishes at Cafe Ajwa in Malwani: tandoor and kebabs, chicken curries, paneer, Indo Chinese, biryani, breads and combos from ₹399.`,
    },
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Menu',
        name: 'Cafe Ajwa menu',
        hasMenuSection: menuCategories.map((category) => ({
          '@type': 'MenuSection',
          name: category.name,
          hasMenuItem: menuItems
            .filter((item) => item.category === category.slug)
            .map((item) => ({
              '@type': 'MenuItem',
              name: item.name,
              url: `https://www.cafeajwa.co/menu/${item.slug}`,
              suitableForDiet: item.veg ? 'https://schema.org/VegetarianDiet' : undefined,
              offers: { '@type': 'Offer', price: item.price, priceCurrency: 'INR' },
            })),
        })),
      },
    },
  ]
}

type Sort = 'recommended' | 'price-asc' | 'price-desc'
const sortLabels: Record<Sort, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price, low to high',
  'price-desc': 'Price, high to low',
}

const chipClassName = cn(toggleVariants({ variant: 'outline', size: 'sm' }), 'shrink-0')
const activeChipClassName =
  'border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] hover:text-primary-foreground'

const sectionId = (slug: string) => `cat-${slug}`
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const subscribeNever = () => () => {}

/* False while rendering the prerendered HTML and during hydration, true once the app runs. */
function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
}

/* Dishes as cards on wider screens and as compact rows on phones, as the redesign plan asks. */
function DishList({ dishes }: { dishes: Dish[] }) {
  return (
    <>
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
      <div className="flex flex-col divide-y rounded-2xl border bg-card px-4 md:hidden">
        {dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} />
        ))}
      </div>
    </>
  )
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const hydrated = useHydrated()
  // Filters, search and sort live in the URL, so a shared link opens the same view. The first render
  // ignores them to match the prerendered page, which has no filters.
  const params = hydrated ? searchParams : new URLSearchParams()
  const query = params.get('q') ?? ''
  const typeParam = params.get('type')
  const dishType = typeParam === 'veg' || typeParam === 'non-veg' ? typeParam : null
  const bestsellersOnly = params.get('bestsellers') === '1'
  const sortParam = params.get('sort')
  const sort: Sort = sortParam === 'price-asc' || sortParam === 'price-desc' ? sortParam : 'recommended'

  // Each change replaces the history entry, so typing a search does not fill the back button.
  const updateParams = (changes: Record<string, string | null>) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  const setQuery = (value: string) => updateParams({ q: value || null })
  const setDishType = (value: 'veg' | 'non-veg' | null) => updateParams({ type: value })
  const setBestsellersOnly = (on: boolean) => updateParams({ bestsellers: on ? '1' : null })
  const setSort = (value: Sort) => updateParams({ sort: value === 'recommended' ? null : value })
  const [active, setActive] = useState<string>('bestsellers')
  const chipBarRef = useRef<HTMLDivElement>(null)
  // While the page scrolls to a chosen category, keep that chip active instead of every section passed.
  const jumpTarget = useRef<string | null>(null)

  const trimmed = query.trim()
  const filtering = Boolean(trimmed) || dishType !== null || bestsellersOnly

  const matches = (dish: Dish) =>
    (!dishType || (dishType === 'veg' ? dish.veg : !dish.veg)) &&
    (!bestsellersOnly || dish.bestseller) &&
    (!trimmed || fuzzyMatch(dish.name, trimmed))

  const sortDishes = (dishes: Dish[]) =>
    sort === 'recommended' ? dishes : [...dishes].sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price))

  const sections = useMemo(() => {
    const byCategory = menuCategories
      .map((category) => ({
        slug: category.slug,
        name: category.name,
        dishes: sortDishes(menuItems.filter((item) => item.category === category.slug && matches(item))),
      }))
      .filter((section) => section.dishes.length > 0)
    // Bestsellers lead the page, but step aside while searching or filtering to them, to avoid repeats.
    const lead = !trimmed && !bestsellersOnly ? sortDishes(bestsellers.filter(matches)) : []
    return lead.length ? [{ slug: 'bestsellers', name: 'Bestsellers', dishes: lead }, ...byCategory] : byCategory
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, dishType, bestsellersOnly, sort])

  const shownCount = new Set(sections.filter((section) => section.slug !== 'bestsellers').flatMap((section) => section.dishes.map((dish) => dish.id))).size

  const clearFilters = () => {
    updateParams({ q: null, type: null, bestsellers: null })
  }

  const scrollToSection = (slug: string, behavior: ScrollBehavior) => {
    const element = document.getElementById(sectionId(slug))
    if (!element) return
    jumpTarget.current = slug
    // Keep the chosen chip active until the visitor scrolls themselves. Sections near the end of the
    // page cannot scroll up to the bar, so waiting for scrolling to settle would pick the one above.
    const release = () => {
      jumpTarget.current = null
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchmove', release)
      window.removeEventListener('keydown', release)
    }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchmove', release, { passive: true })
    window.addEventListener('keydown', release)
    element.scrollIntoView({ behavior, block: 'start' })
  }



  // Highlight the last section whose top has passed the sticky bar. At the very bottom of the page
  // the last section wins, since it may be too short to reach the bar.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      if (jumpTarget.current) return
      const barBottom = chipBarRef.current?.getBoundingClientRect().bottom ?? 0
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      let current = sections[0]?.slug
      for (const section of sections) {
        const element = document.getElementById(sectionId(section.slug))
        if (element && element.getBoundingClientRect().top - barBottom <= 24) current = section.slug
      }
      if (atBottom && sections.length) current = sections[sections.length - 1].slug
      if (current) setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sections])

  // Bring the active chip into the category bar only when it is hidden or under an arrow, and only
  // by the distance needed. A chip that is already in view never moves.
  useEffect(() => {
    const chip = chipBarRef.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`)
    const viewport = chip?.closest<HTMLElement>('[data-slot=scroll-row-viewport]')
    if (!chip || !viewport) return
    const arrowSpace = 56
    const start = viewport.scrollLeft
    const end = start + viewport.clientWidth
    const chipStart = chip.offsetLeft
    const chipEnd = chipStart + chip.offsetWidth
    const leftClear = start === 0 ? 0 : arrowSpace
    const rightClear = end >= viewport.scrollWidth - 1 ? 0 : arrowSpace
    let target: number | null = null
    if (chipStart < start + leftClear) target = chipStart - arrowSpace
    else if (chipEnd > end - rightClear) target = chipEnd - viewport.clientWidth + arrowSpace
    if (target === null) return
    viewport.scrollTo({ left: Math.max(0, target), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [active])

  // Old ?category= links move to the category's own page, as docs/redesign-plan.md section 6.3 asks.
  // Only after hydrating, so the first render still matches the prerendered menu.
  const oldCategory = params.get('category')
  if (oldCategory && menuCategories.some((category) => category.slug === oldCategory)) {
    return <Navigate to={`/menu/c/${oldCategory}`} replace />
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-8 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Menu</h1>
          <p className="text-muted-foreground">{menuItems.length} dishes, cooked fresh after you order.</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <InputGroup className="rounded-full md:max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              aria-label="Search the menu"
              placeholder="Search dishes, like kolhapuri"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="[&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-sm" aria-label="Clear search" onClick={() => setQuery('')} className="rounded-full">
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <div role="toolbar" aria-label="Filter dishes" className="flex flex-wrap items-center gap-2">
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
            <Toggle variant="outline" size="sm" pressed={bestsellersOnly} onPressedChange={setBestsellersOnly}>
              <AwardIcon data-icon="inline-start" />
              Bestsellers
            </Toggle>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(chipClassName, sort !== 'recommended' && activeChipClassName)}>
                <ArrowUpDownIcon data-icon="inline-start" />
                {sortLabels[sort]}
                <ChevronDownIcon data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value as Sort)}>
                    {(Object.keys(sortLabels) as Sort[]).map((key) => (
                      <DropdownMenuRadioItem key={key} value={key} closeOnClick>
                        {sortLabels[key]}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filtering && (
          <div className="flex items-center justify-between gap-3 text-sm" aria-live="polite">
            <span className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{shownCount}</span> of {menuItems.length} dishes
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon data-icon="inline-start" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Sticky category bar under the site header */}
      {sections.length > 0 && (
        <div ref={chipBarRef} className="sticky top-16 z-30 border-y bg-background">
          <div className="mx-auto max-w-6xl px-4 py-2.5">
            <ScrollRow scrollLabel="categories">
              <nav aria-label="Menu categories" className="flex w-max gap-2">
                {sections.map((section) => (
                  <a
                    key={section.slug}
                    href={`#${sectionId(section.slug)}`}
                    data-chip={section.slug}
                    aria-current={active === section.slug ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setActive(section.slug)
                      scrollToSection(section.slug, prefersReducedMotion() ? 'auto' : 'smooth')
                    }}
                    className={cn(chipClassName, active === section.slug && activeChipClassName)}
                  >
                    {section.name}
                    <span className={cn('text-xs tabular-nums', active === section.slug ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                      {section.dishes.length}
                    </span>
                  </a>
                ))}
              </nav>
            </ScrollRow>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-6 pb-16">
        {sections.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>{trimmed ? `No dishes match "${trimmed}"` : 'No dishes match these filters'}</EmptyTitle>
              <EmptyDescription>Check the spelling or clear the filters to see the full menu.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={clearFilters}>Clear filters</Button>
            </EmptyContent>
          </Empty>
        ) : (
          sections.map((section) => (
            <section
              key={section.slug}
              id={sectionId(section.slug)}
              aria-labelledby={`${sectionId(section.slug)}-title`}
              className="flex scroll-mt-36 flex-col gap-4"
            >
              <h2 id={`${sectionId(section.slug)}-title`} className="flex items-baseline gap-2 font-heading text-2xl font-semibold tracking-tight">
                {section.name}
                <span className="text-base font-medium text-muted-foreground tabular-nums">{section.dishes.length}</span>
              </h2>
              <DishList dishes={section.dishes} />
            </section>
          ))
        )}
      </div>
    </>
  )
}
