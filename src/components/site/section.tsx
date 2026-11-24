import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

/* The centred page column every site page uses. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4', className)}>{children}</div>
}

/* A section title with an optional line under it and an optional link on the right. */
export function SectionHeading({
  id,
  title,
  description,
  link,
}: {
  id?: string
  title: string
  description?: string
  link?: { to: string; label: string }
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {link && (
        <Button variant="link" render={<Link to={link.to} />} nativeButton={false} className="shrink-0">
          {link.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      )}
    </div>
  )
}
