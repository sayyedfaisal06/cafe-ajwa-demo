"use client"

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { cn } from "cn"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/*
 * A search field with a suggestion list, built on the Base UI autocomplete. Typing filters the
 * list, arrow keys move through it and Enter picks an item. Screen readers hear it as a combobox.
 * Pass grouped items, such as recent searches and popular dishes, and render each group with
 * SearchGroup, SearchGroupLabel and SearchCollection.
 */
const Search = AutocompletePrimitive.Root

function SearchInput({
  className,
  size = "default",
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> & { size?: "default" | "lg" }) {
  return (
    <AutocompletePrimitive.InputGroup
      data-slot="search-field"
      data-size={size}
      className={cn(
        "group/search relative flex w-full min-w-0 items-center rounded-full border border-input bg-card transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "data-[size=default]:h-11 data-[size=lg]:h-13",
        "hover:border-[color-mix(in_oklch,var(--input),black_25%)]",
        "has-focus-visible:border-primary has-focus-visible:ring-[3px] has-focus-visible:ring-primary/20",
        className
      )}
    >
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none ml-4 size-[1.125rem] shrink-0 text-muted-foreground group-has-focus-visible/search:text-primary"
      />
      <AutocompletePrimitive.Input
        data-slot="search-input"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground md:text-[0.9375rem] [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      <AutocompletePrimitive.Clear
        aria-label="Clear search"
        render={<Button variant="ghost" size="icon-sm" className="mr-1 text-muted-foreground" />}
      >
        <XIcon />
      </AutocompletePrimitive.Clear>
    </AutocompletePrimitive.InputGroup>
  )
}

function SearchContent({
  className,
  children,
  sideOffset = 8,
  ...props
}: AutocompletePrimitive.Popup.Props & { sideOffset?: number }) {
  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner sideOffset={sideOffset} className="isolate z-50 outline-none">
        <AutocompletePrimitive.Popup
          data-slot="search-content"
          className={cn(
            "max-h-[min(var(--available-height),28rem)] w-(--anchor-width) min-w-72 origin-(--transform-origin) overflow-y-auto overscroll-contain rounded-2xl bg-popover p-1.5 text-popover-foreground shadow-overlay ring-1 ring-foreground/8",
            "transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-opacity motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100",
            className
          )}
          {...props}
        >
          {children}
        </AutocompletePrimitive.Popup>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  )
}

function SearchList({ className, ...props }: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="search-list"
      className={cn("flex flex-col gap-1 empty:hidden", className)}
      {...props}
    />
  )
}

function SearchGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="search-group"
      className={cn("flex flex-col not-first:mt-1 not-first:border-t not-first:pt-1", className)}
      {...props}
    />
  )
}

function SearchGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="search-group-label"
      className={cn("px-2.5 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase", className)}
      {...props}
    />
  )
}

const SearchCollection = AutocompletePrimitive.Collection

function SearchItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="search-item"
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-sm outline-none select-none",
        "data-highlighted:bg-highlight data-highlighted:text-primary",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SearchEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="search-empty"
      className={cn("flex flex-col gap-3 px-2.5 py-3 text-sm empty:hidden", className)}
      {...props}
    />
  )
}

/* Bolds the part of a label that matches the query, so the eye finds it fast. */
function SearchHighlight({ text, query }: { text: string; query: string }) {
  const index = query.trim() ? text.toLowerCase().indexOf(query.trim().toLowerCase()) : -1
  if (index < 0) return <>{text}</>
  const end = index + query.trim().length
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-bold text-current">{text.slice(index, end)}</mark>
      {text.slice(end)}
    </>
  )
}

export type SearchGroupItems<ItemValue> = { value: string; items: ItemValue[] }

export {
  Search,
  SearchInput,
  SearchContent,
  SearchList,
  SearchGroup,
  SearchGroupLabel,
  SearchCollection,
  SearchItem,
  SearchEmpty,
  SearchHighlight,
}
