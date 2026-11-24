import { ArrowRightIcon, SearchXIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { DishCard, DishRow } from '@/components/site/dish'
import { MenuSearch } from '@/components/site/menu-search'
import { Container, SectionHeading } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { bestsellers } from '@/data/menu'

export function meta() {
  return [{ title: 'Page not found, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* Any path the site does not know. Offers the menu, a search and the bestsellers as ways back. */
export default function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <div className="flex flex-col gap-12 pt-10 pb-16 sm:gap-16 sm:pt-14">
      <Container>
        <section aria-labelledby="not-found-title" className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-highlight text-primary">
            <SearchXIcon aria-hidden="true" className="size-8" />
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 id="not-found-title" className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              We could not find that page
            </h1>
            <p className="text-muted-foreground">
              Nothing lives at <span className="font-mono text-sm break-all text-foreground">{pathname}</span>. The link may be
              old, or the dish may have moved. Search the menu or head back home.
            </p>
          </div>
          <div className="w-full max-w-md text-left">
            <MenuSearch />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button render={<Link to="/menu" />} nativeButton={false}>
              See the menu
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" render={<Link to="/" />} nativeButton={false}>
              Go to the home page
            </Button>
          </div>
        </section>
      </Container>

      <Container className="flex flex-col gap-6">
        <SectionHeading title="Bestsellers" description="What Malwani orders most." link={{ to: '/menu', label: 'Full menu' }} />
        <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
          {bestsellers.slice(0, 4).map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
        <div className="flex flex-col divide-y rounded-2xl border bg-card px-4 md:hidden">
          {bestsellers.slice(0, 4).map((dish) => (
            <DishRow key={dish.id} dish={dish} />
          ))}
        </div>
      </Container>
    </div>
  )
}
