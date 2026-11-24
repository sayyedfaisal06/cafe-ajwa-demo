import { CloudOffIcon, HomeIcon, MessageCircleIcon, PhoneIcon, RefreshCwIcon, SearchXIcon, TriangleAlertIcon, type LucideIcon } from 'lucide-react'
import { isRouteErrorResponse } from 'react-router'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { restaurant } from '@/data/restaurant'

/*
 * What a visitor sees when a page fails. Used by the page boundary inside the site layout, which keeps
 * the header and footer, and by the root boundary for failures in the layout itself.
 */

type Kind = 'not-found' | 'offline' | 'outdated' | 'broken'

/* After a new deploy, an open tab can ask for page code that no longer exists. Reloading fixes it. */
const isStaleChunk = (error: unknown) =>
  error instanceof Error &&
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
    error.message,
  )

function kindOf(error: unknown): Kind {
  if (isRouteErrorResponse(error) && error.status === 404) return 'not-found'
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline'
  if (isStaleChunk(error)) return 'outdated'
  return 'broken'
}

const copy: Record<Kind, { icon: LucideIcon; eyebrow: string; title: string; text: string }> = {
  'not-found': {
    icon: SearchXIcon,
    eyebrow: '404',
    title: 'We could not find that page',
    text: 'The link may be old, or the dish may have moved. Head back home or browse the menu.',
  },
  offline: {
    icon: CloudOffIcon,
    eyebrow: 'You are offline',
    title: 'This page needs a connection',
    text: 'Check your mobile data or internet connection, then try again. Your cart is saved on this device.',
  },
  outdated: {
    icon: RefreshCwIcon,
    eyebrow: 'The site was updated',
    title: 'Reload to get the latest version',
    text: 'We updated the site while this page was open. Reloading takes a second and keeps your cart.',
  },
  broken: {
    icon: TriangleAlertIcon,
    eyebrow: 'Something went wrong',
    title: 'This page did not load',
    text: 'Try again in a moment. If it keeps happening, message us and we will take your order directly.',
  },
}

export function ErrorView({ error, fullScreen = false }: { error: unknown; fullScreen?: boolean }) {
  const kind = kindOf(error)
  const { icon: Icon, eyebrow, title, text } = copy[kind]
  const status = isRouteErrorResponse(error) && kind === 'broken' ? ` (${error.status})` : ''

  return (
    <div
      role="alert"
      className={
        fullScreen
          ? 'mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-12 text-center'
          : 'mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 pt-14 pb-20 text-center'
      }
    >
      <title>{`${title}, Cafe Ajwa`}</title>
      <meta name="robots" content="noindex" />
      {/* Without the site header, the logo shows where the visitor is. */}
      {fullScreen && <img src={logo} alt="Cafe Ajwa" className="h-16 w-auto" />}
      <span className="flex size-16 items-center justify-center rounded-full bg-highlight text-primary">
        <Icon aria-hidden="true" className="size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">
          {eyebrow}
          {status}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        <p className="text-muted-foreground">{text}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {kind === 'not-found' ? (
          <Button render={<a href="/menu" />} nativeButton={false}>
            See the menu
          </Button>
        ) : (
          <Button onClick={() => window.location.reload()}>
            <RefreshCwIcon data-icon="inline-start" />
            {kind === 'outdated' ? 'Reload' : 'Try again'}
          </Button>
        )}
        {/* A plain link, so it works even if the app itself is what failed. */}
        <Button variant="outline" render={<a href="/" />} nativeButton={false}>
          <HomeIcon data-icon="inline-start" />
          Go to the home page
        </Button>
      </div>

      {kind === 'broken' && (
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <span>Want to order now?</span>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="ghost" render={<a href={restaurant.whatsappHref} target="_blank" rel="noreferrer" />} nativeButton={false}>
              <MessageCircleIcon data-icon="inline-start" />
              WhatsApp
            </Button>
            <Button size="sm" variant="ghost" render={<a href={restaurant.phoneHref} />} nativeButton={false}>
              <PhoneIcon data-icon="inline-start" />
              {restaurant.phone}
            </Button>
          </div>
        </div>
      )}

      {/* Details for developers only. Visitors never see the stack. */}
      {import.meta.env.DEV && error instanceof Error && (
        <details className="w-full text-left">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground">Error details</summary>
          <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-secondary p-4 text-xs whitespace-pre-wrap">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}
