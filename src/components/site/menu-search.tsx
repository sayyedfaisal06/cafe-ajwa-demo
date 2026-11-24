import { HistoryIcon, LayoutGridIcon } from 'lucide-react'
import { useState } from 'react'

import { FoodMark } from '@/components/food'
import { Button } from '@/components/ui/button'
import {
  Search,
  SearchCollection,
  SearchContent,
  SearchEmpty,
  SearchGroup,
  SearchGroupLabel,
  SearchHighlight,
  SearchInput,
  SearchItem,
  SearchList,
  type SearchGroupItems,
} from '@/components/ui/search'
import { popularDishes, recentSearches, searchCategories, searchDishes, type Suggestion } from '@/data/menu'
import { formatPrice } from '@/lib/format'

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]
}

/*
 * Every word of the query must start a word in the label. Words of 4 letters or more may be one
 * letter off, so "biriyani" finds Biryani and "panner" finds Paneer.
 */
export function fuzzyMatch(label: string, query: string) {
  const words = label.toLowerCase().split(/\s+/)
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) =>
      words.some(
        (word) =>
          word.startsWith(part) ||
          (part.length >= 4 &&
            [part.length - 1, part.length, part.length + 1].some(
              (length) => editDistance(part, word.slice(0, length)) <= 1,
            )),
      ),
    )
}

export function MenuSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const trimmed = query.trim()

  const groups: SearchGroupItems<Suggestion>[] = trimmed
    ? [
        { value: 'Dishes', items: searchDishes.filter((dish) => fuzzyMatch(dish.label, trimmed)).slice(0, 6) },
        { value: 'Categories', items: searchCategories.filter((category) => fuzzyMatch(category.label, trimmed)).slice(0, 3) },
      ].filter((group) => group.items.length > 0)
    : [
        { value: 'Recent searches', items: recentSearches },
        { value: 'Popular dishes', items: popularDishes },
      ]

  return (
    <Search
      items={groups}
      filteredItems={groups}
      value={query}
      onValueChange={setQuery}
      itemToStringValue={(item: Suggestion) => item.label}
      openOnInputClick
    >
      <SearchInput placeholder="Search dishes, like biryani or paneer" aria-label="Search the menu" autoFocus={autoFocus} />
      <SearchContent>
        <SearchEmpty>
          <p className="text-muted-foreground">
            No dishes match <span className="font-semibold text-foreground">"{trimmed}"</span>. Try one of
            these:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularDishes.map((dish) => (
              <Button key={dish.id} variant="outline" size="xs" onClick={() => setQuery(dish.label)}>
                {dish.label}
              </Button>
            ))}
          </div>
        </SearchEmpty>
        <SearchList>
          {(group: SearchGroupItems<Suggestion>) => (
            <SearchGroup key={group.value} items={group.items}>
              <SearchGroupLabel>{group.value}</SearchGroupLabel>
              <SearchCollection>
                {(item: Suggestion) => (
                  <SearchItem key={item.id} value={item}>
                    {item.kind === 'recent' && (
                      <>
                        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          <HistoryIcon aria-hidden="true" className="size-4" />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                      </>
                    )}
                    {item.kind === 'dish' && (
                      <>
                        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                          <FoodMark veg={Boolean(item.veg)} />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            <SearchHighlight text={item.label} query={trimmed} />
                          </span>
                          <span className="truncate text-xs text-muted-foreground">{item.category}</span>
                        </span>
                        {item.price !== undefined && (
                          <span className="text-sm font-semibold tabular-nums">{formatPrice(item.price)}</span>
                        )}
                      </>
                    )}
                    {item.kind === 'category' && (
                      <>
                        <span className="flex size-8 items-center justify-center rounded-lg bg-highlight text-primary">
                          <LayoutGridIcon aria-hidden="true" className="size-4" />
                        </span>
                        <span className="flex-1 truncate font-medium">
                          <SearchHighlight text={item.label} query={trimmed} />
                        </span>
                        <span className="text-xs text-muted-foreground">Category</span>
                      </>
                    )}
                  </SearchItem>
                )}
              </SearchCollection>
            </SearchGroup>
          )}
        </SearchList>
      </SearchContent>
    </Search>
  )
}
