import { HeartIcon } from 'lucide-react'
import { Link } from 'react-router'

import { DishCard, DishRow } from '@/components/site/dish'
import { useFavourites } from '@/components/site/favourites'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { menuItems } from '@/data/menu'

export function meta() {
  return [{ title: 'Favourites, Cafe Ajwa' }]
}

/* Dishes the customer saved with the heart, newest first. */
export default function FavouritesPage() {
  const { ids } = useFavourites()
  const dishes = [...ids]
    .reverse()
    .map((id) => menuItems.find((item) => item.id === id))
    .filter((item) => item !== undefined)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Favourites</h1>
        <p className="text-muted-foreground">
          {dishes.length
            ? `${dishes.length} saved ${dishes.length === 1 ? 'dish' : 'dishes'}. Tap the heart on any dish to add or remove it.`
            : 'Dishes you save with the heart show here.'}
        </p>
      </div>

      {dishes.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HeartIcon />
            </EmptyMedia>
            <EmptyTitle>No favourites yet</EmptyTitle>
            <EmptyDescription>Tap the heart on a dish to keep it here for your next order.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<Link to="/menu" />} nativeButton={false}>
              Browse menu
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
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
      )}
    </div>
  )
}
