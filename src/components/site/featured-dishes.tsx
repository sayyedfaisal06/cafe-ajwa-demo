import { cn } from 'cn'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import type { FeaturedDish } from '@/data/menu'

const ADVANCE_MS = 4500
/* Phrases from the current site's ring, separated by wide spaces instead of dots. */
const RING_TEXT = 'Cafe Ajwa  Made fresh every day  Taste the difference  Flavour worth remembering  '

/*
 * A turning ring of text around the featured dish, as on the current site. Decorative, so it is
 * hidden from screen readers. It stops when the carousel is paused or the visitor prefers reduced
 * motion.
 */
function TextRing({ paused }: { paused: boolean }) {
  const pathId = useId()
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={cn(
        'absolute inset-0 size-full animate-[spin_30s_linear_infinite] motion-reduce:animate-none',
        paused && '[animation-play-state:paused]'
      )}
    >
      <defs>
        <path id={pathId} d="M 200,200 m -178,0 a 178,178 0 1,1 356,0 a 178,178 0 1,1 -356,0" />
      </defs>
      <text className="fill-saffron text-[15px] font-semibold tracking-[0.32em] uppercase">
        <textPath href={`#${pathId}`} textLength={1110} lengthAdjust="spacing">
          {RING_TEXT}
        </textPath>
      </text>
    </svg>
  )
}

/* Position of a slide relative to the current one: 0 is centre, 1 is right, -1 is left. */
function offsetOf(index: number, current: number, count: number) {
  let offset = (index - current + count) % count
  if (offset > count / 2) offset -= count
  return offset
}

/*
 * The animated featured dish stage for the home hero. Dishes slide through the centre of the ring
 * with their neighbours peeking in at the sides. It advances every few seconds, pauses on hover,
 * on keyboard focus, while the tab is hidden and with the pause button, and starts paused when the
 * visitor prefers reduced motion. The caption names the dish and links to it.
 */
export function FeaturedDishes({ dishes }: { dishes: FeaturedDish[] }) {
  const [current, setCurrent] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const count = dishes.length
  const paused = userPaused || hovered || focused || hidden || reducedMotion
  const dish = dishes[current]

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(query.matches)
    const syncVisibility = () => setHidden(document.visibilityState === 'hidden')
    syncMotion()
    query.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      query.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  useEffect(() => {
    if (paused || count < 2) return
    const timer = window.setTimeout(() => setCurrent((value) => (value + 1) % count), ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [paused, current, count])

  const go = (step: 1 | -1) => setCurrent((value) => (value + step + count) % count)

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured dishes"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      className="flex flex-col items-center gap-6"
    >
      {/* Stage: the ring, the plate area and the sliding dishes */}
      <div className="relative aspect-square w-full max-w-[19rem] sm:max-w-[26rem]">
        <div className="absolute inset-[9%] rounded-full bg-primary-foreground/[0.06] ring-1 ring-primary-foreground/10" />
        <TextRing paused={paused} />
        {dishes.map((item, index) => {
          const offset = offsetOf(index, current, count)
          const visible = Math.abs(offset) <= 1
          return (
            <div
              key={item.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={offset !== 0}
              data-pos={offset === 0 ? 'center' : !visible ? 'hidden' : offset < 0 ? 'left' : 'right'}
              className={cn(
                'absolute inset-[16%] transition-[translate,scale,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                'data-[pos=center]:opacity-100 data-[pos=hidden]:opacity-0 data-[pos=left]:opacity-40 data-[pos=right]:opacity-40',
                // Beside the headline on wider screens, only the next dish peeks in.
                'md:data-[pos=left]:opacity-0'
              )}
              style={{
                translate: `${offset * 112}% 0`,
                scale: offset === 0 ? '1' : visible ? '0.62' : '0.4',
                zIndex: offset === 0 ? 2 : 1,
              }}
            >
              <img
                src={item.image}
                alt={offset === 0 ? item.name : ''}
                width={640}
                height={640}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className="size-full object-contain drop-shadow-[0_18px_24px_rgb(0_0_0/0.35)]"
              />
            </div>
          )
        })}
      </div>

      {/* Caption and controls */}
      <div className="flex w-full max-w-[26rem] items-end justify-between gap-4">
        <div
          key={dish.slug}
          aria-live={paused ? 'polite' : 'off'}
          className="flex min-w-0 flex-col gap-1 animate-in fade-in-0 slide-in-from-bottom-1 duration-500 motion-reduce:animate-none"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-saffron uppercase">{dish.category}</span>
          <span className="line-clamp-2 font-heading text-xl leading-tight font-semibold">{dish.name}</span>
          <Link
            to={`/menu/${dish.slug}`}
            className="flex w-fit items-center gap-1 text-sm font-semibold text-primary-foreground/85 underline-offset-4 hover:text-primary-foreground hover:underline"
          >
            See dish
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {[
            { label: 'Previous dish', icon: ChevronLeftIcon, onClick: () => go(-1) },
            {
              label: userPaused ? 'Play featured dishes' : 'Pause featured dishes',
              icon: userPaused ? PlayIcon : PauseIcon,
              onClick: () => setUserPaused((value) => !value),
            },
            { label: 'Next dish', icon: ChevronRightIcon, onClick: () => go(1) },
          ].map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              onClick={onClick}
              className="border border-primary-foreground/25 text-primary-foreground hover:border-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-offset-primary"
            >
              <Icon />
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        {dishes.map((item, index) => (
          <span
            key={item.slug}
            className={cn(
              'h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none',
              index === current ? 'w-6 bg-saffron' : 'w-1.5 bg-primary-foreground/30'
            )}
          />
        ))}
      </div>
    </section>
  )
}
