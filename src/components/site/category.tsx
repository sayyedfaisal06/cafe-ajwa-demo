import { ArrowRightIcon, ChevronUpIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardMedia } from '@/components/ui/card'
import type { MenuCategory } from '@/data/menu'

/*
 * A square photo tile with the name below. The whole tile is one link. Until category photos
 * exist, a food icon stands in so the grid does not look the same everywhere.
 */
export function CategoryTile({ category, src }: { category: MenuCategory; src?: string }) {
  const Icon = category.icon
  return (
    <Card interactive size="sm" className="gap-3 pb-4">
      <CardMedia className="aspect-square">
        {src ? (
          <img src={src} alt="" loading="lazy" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-10 text-primary/45" />
          </div>
        )}
      </CardMedia>
      <div className="flex flex-col gap-0.5 px-4">
        <Link
          to={`/menu/c/${category.slug}`}
          className="line-clamp-2 text-sm leading-snug font-semibold outline-none after:absolute after:inset-0"
        >
          {category.name}
        </Link>
        {category.count !== undefined && (
          <span className="text-xs text-muted-foreground">{category.count} dishes</span>
        )}
      </div>
    </Card>
  )
}

/*
 * Shows the first few categories and an Explore more tile in the same card style. The tile opens
 * the rest in place; Show fewer folds them away again. On the live home page the tile can link to
 * the menu instead.
 */
export function CategoryGrid({ categories, initial = 5 }: { categories: MenuCategory[]; initial?: number }) {
  const [expanded, setExpanded] = useState(false)
  const hidden = categories.length - initial
  const shown = expanded ? categories : categories.slice(0, initial)

  return (
    <div className="flex flex-col items-center gap-4">
      <div id="category-grid" className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {shown.map((category) => (
          <CategoryTile key={category.name} category={category} />
        ))}
        {!expanded && hidden > 0 && (
          <Card interactive size="sm" className="gap-3 pb-4">
            <CardMedia className="flex aspect-square items-center justify-center bg-highlight">
              <span className="flex size-14 items-center justify-center rounded-full bg-card text-primary shadow-[0_1px_2px_rgb(0_0_0/0.08)] transition-transform duration-150 group-hover/card:translate-x-0.5 motion-reduce:transition-none">
                <ArrowRightIcon aria-hidden="true" className="size-6" />
              </span>
            </CardMedia>
            <div className="flex flex-col gap-0.5 px-4">
              <button
                type="button"
                aria-expanded={false}
                aria-controls="category-grid"
                onClick={() => setExpanded(true)}
                className="text-left text-sm leading-snug font-semibold text-primary outline-none after:absolute after:inset-0"
              >
                Explore more
              </button>
              <span className="text-xs text-muted-foreground">{hidden} more categories</span>
            </div>
          </Card>
        )}
      </div>
      {expanded && (
        <Button
          variant="outline"
          aria-expanded
          aria-controls="category-grid"
          onClick={() => setExpanded(false)}
        >
          Show fewer
          <ChevronUpIcon data-icon="inline-end" />
        </Button>
      )}
    </div>
  )
}
