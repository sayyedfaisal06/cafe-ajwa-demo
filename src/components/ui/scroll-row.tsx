"use client"

import { cn } from "cn"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react"

import { Button } from "@/components/ui/button"

/*
 * A horizontal row that scrolls without a visible scrollbar. Arrow buttons appear only on the
 * side that has more content. Touch, trackpad and keyboard scrolling keep working, so the
 * arrows are skipped by the tab order. Each arrow sits on a fade into the page background, so the
 * row edge shows that more items continue. The fade lets clicks through to the items under it.
 */
function ScrollRow({
  className,
  children,
  scrollLabel = "items",
  viewportClassName,
  ...props
}: ComponentProps<"div"> & {
  /** Names what scrolls, used in the arrow labels, such as "categories". */
  scrollLabel?: string
  /** Extra classes for the scrolling area, such as snap points for a carousel. */
  viewportClassName?: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [canScrollStart, setCanScrollStart] = useState(false)
  const [canScrollEnd, setCanScrollEnd] = useState(false)

  const update = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    // A 1px allowance avoids an arrow that never hides because of subpixel widths.
    setCanScrollStart(el.scrollLeft > 1)
    setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    for (const child of Array.from(el.children)) observer.observe(child)
    el.addEventListener("scroll", update, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener("scroll", update)
    }
  }, [update])

  const scrollByPage = (direction: 1 | -1) => {
    const el = viewportRef.current
    if (!el) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <div data-slot="scroll-row" className={cn("relative", className)} {...props}>
      <div
        ref={viewportRef}
        data-slot="scroll-row-viewport"
        // The padding with a matching negative margin keeps focus rings from being clipped, and
        // the scroll padding stops a focused item from landing under an arrow.
        className={cn(
          "-m-1 flex scroll-px-12 overflow-x-auto overscroll-x-contain p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          viewportClassName
        )}
      >
        {children}
      </div>
      <ScrollRowArrow
        side="start"
        visible={canScrollStart}
        label={`Scroll ${scrollLabel} left`}
        onClick={() => scrollByPage(-1)}
      />
      <ScrollRowArrow
        side="end"
        visible={canScrollEnd}
        label={`Scroll ${scrollLabel} right`}
        onClick={() => scrollByPage(1)}
      />
    </div>
  )
}

function ScrollRowArrow({
  side,
  visible,
  label,
  onClick,
}: {
  side: "start" | "end"
  visible: boolean
  label: string
  onClick: () => void
}) {
  return (
    <div
      data-slot="scroll-row-arrow"
      data-side={side}
      data-visible={visible}
      className={cn(
        "pointer-events-none absolute inset-y-0 flex items-center transition-opacity duration-150 motion-reduce:transition-none",
        // The viewport reaches 4px past the row on each side, so the arrows sit at -1 to cover it.
        "data-[side=start]:-left-1 data-[side=start]:justify-start data-[side=start]:bg-linear-to-r data-[side=start]:pr-12 data-[side=start]:pl-1",
        "data-[side=end]:-right-1 data-[side=end]:justify-end data-[side=end]:bg-linear-to-l data-[side=end]:pr-1 data-[side=end]:pl-12",
        "from-background from-45% to-transparent",
        "data-[visible=false]:opacity-0 [&>*]:pointer-events-auto data-[visible=false]:[&>*]:pointer-events-none"
      )}
    >
      <Button
        variant="outline"
        size="icon-sm"
        tabIndex={-1}
        aria-label={label}
        aria-hidden={!visible}
        onClick={onClick}
        className="border-border bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.08)] hover:border-primary/70 hover:text-primary"
      >
        {side === "start" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Button>
    </div>
  )
}

export { ScrollRow }
