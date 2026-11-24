import { MessageCircleIcon, PhoneIcon } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { Container } from '@/components/site/section'
import {
  Breadcrumb,
  BreadcrumbBack,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { restaurant } from '@/data/restaurant'

export type LegalSection = { id: string; title: string; body: ReactNode }

/* How far below the top of the window a section counts as being read, clear of the sticky header. */
const READING_LINE = 120

/*
 * The section being read: the last one whose top has passed the reading line. At the bottom of the
 * page the last section wins, even when it is too short to reach the line.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) return setActive(ids[ids.length - 1])
      let current = ids[0]
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= READING_LINE) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])
  return active
}

function Contents({ sections }: { sections: LegalSection[] }) {
  const ids = useMemo(() => sections.map((section) => section.id), [sections])
  const active = useActiveSection(ids)

  return (
    <nav aria-labelledby="legal-contents-title" className="max-lg:hidden">
      <div className="sticky top-24 flex flex-col gap-3">
        <h2 id="legal-contents-title" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          On this page
        </h2>
        <ol className="flex flex-col gap-1 border-l">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={section.id === active ? 'location' : undefined}
                className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-primary aria-[current=location]:border-primary aria-[current=location]:font-medium aria-[current=location]:text-primary motion-reduce:transition-none"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

/*
 * The layout for policy pages: refunds, privacy and terms. A list of sections on the left on wide
 * screens, the text in a readable column, and a way to reach the kitchen at the end.
 */
export function LegalPage({
  title,
  summary,
  updated,
  intro,
  sections,
}: {
  title: string
  summary: string
  /** The date the policy last changed, such as 24 November 2026. */
  updated: string
  /** Shown between the heading and the sections, such as a short overview. */
  intro?: ReactNode
  sections: LegalSection[]
}) {
  return (
    <Container className="flex flex-col gap-10 pt-6 pb-16">
      <Breadcrumb>
        <BreadcrumbList className="max-sm:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
        <BreadcrumbBack render={<Link to="/" />} className="sm:hidden">
          Home
        </BreadcrumbBack>
      </Breadcrumb>

      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="text-base text-muted-foreground sm:text-lg">{summary}</p>
        <p className="text-sm text-muted-foreground">Last updated {updated}</p>
      </header>

      {intro}

      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <Contents sections={sections} />

        <article className="flex max-w-3xl flex-col gap-10">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-24 flex-col gap-3">
              <h2 id={`${section.id}-title`} className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                <span className="mr-2 text-muted-foreground/60 tabular-nums">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="flex flex-col gap-3 text-[0.9375rem] leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-foreground">
                {section.body}
              </div>
            </section>
          ))}

          <section
            aria-labelledby="legal-help-title"
            className="flex flex-col items-start gap-4 rounded-3xl bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex flex-col gap-1">
              <h2 id="legal-help-title" className="font-heading text-xl font-semibold tracking-tight">
                Questions about this policy?
              </h2>
              <p className="text-sm text-muted-foreground">
                Talk to the kitchen, {restaurant.hoursLabel.toLowerCase()}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button render={<a href={restaurant.phoneHref} />} nativeButton={false}>
                <PhoneIcon data-icon="inline-start" />
                Call
              </Button>
              <Button
                variant="outline"
                render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />}
                nativeButton={false}
                className="bg-card"
              >
                <MessageCircleIcon data-icon="inline-start" />
                WhatsApp
              </Button>
            </div>
          </section>
        </article>
      </div>
    </Container>
  )
}
