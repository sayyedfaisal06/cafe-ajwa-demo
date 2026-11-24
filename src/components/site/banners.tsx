import { cn } from 'cn'
import { ArrowRightIcon, ChefHatIcon, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

/* A wide banner with a photo on one side, for sections such as catering or a festival. */
export function PromoBanner({
  eyebrow,
  title,
  description,
  action,
  tone = 'card',
  icon: Icon,
  reverse = false,
}: {
  eyebrow: string
  title: string
  description: string
  action: ReactNode
  tone?: 'card' | 'turmeric'
  icon: LucideIcon
  reverse?: boolean
}) {
  return (
    <section
      aria-label={title}
      data-tone={tone}
      className={cn(
        'grid overflow-hidden rounded-3xl border sm:grid-cols-[2fr_3fr]',
        'data-[tone=card]:bg-card',
        'data-[tone=turmeric]:border-warning/25 data-[tone=turmeric]:bg-[color-mix(in_oklch,var(--warning)_9%,var(--card))]',
        reverse && 'sm:grid-cols-[3fr_2fr]'
      )}
    >
      <div
        className={cn(
          'flex aspect-[16/9] items-center justify-center bg-secondary sm:aspect-auto sm:min-h-56',
          'in-data-[tone=turmeric]:bg-[color-mix(in_oklch,var(--warning)_15%,var(--card))]',
          reverse && 'sm:order-last'
        )}
      >
        <Icon aria-hidden="true" strokeWidth={1.25} className="size-14 text-primary/40 in-data-[tone=turmeric]:text-warning/50" />
      </div>
      <div className="flex flex-col items-start justify-center gap-3 p-6 sm:p-8">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase in-data-[tone=turmeric]:text-warning">
          {eyebrow}
        </span>
        <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight text-balance">{title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-2">{action}</div>
      </div>
    </section>
  )
}

export function CateringBanner() {
  return (
    <PromoBanner
      eyebrow="Catering and bulk orders"
      title="Feeding a group?"
      description="Office lunches, parties and family events. Tell us the date and head count and we will plan the menu with you."
      icon={ChefHatIcon}
      action={
        <Button variant="secondary" render={<Link to="/catering" />} nativeButton={false}>
          Plan a catering order
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      }
    />
  )
}
