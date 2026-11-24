import type { ReactNode } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'

import './index.css'

/* The HTML document shared by every page. Page titles come from each route's meta export. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f3d2e" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/* App wide providers wrap every page. */
export default function App() {
  return (
    <Toaster>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </Toaster>
  )
}

/* Shown while the client app starts on paths that were not prerendered. */
export function HydrateFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center text-primary">
      <Spinner className="size-8" />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <title>{notFound ? 'Page not found, Cafe Ajwa' : 'Something went wrong, Cafe Ajwa'}</title>
      <p className="text-sm font-semibold text-primary">{notFound ? '404' : 'Something went wrong'}</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        {notFound ? 'We could not find that page' : 'This page did not load'}
      </h1>
      <p className="text-muted-foreground">
        {notFound
          ? 'The link may be old or the dish may have moved. Head back to the home page.'
          : 'Refresh the page or try again in a minute.'}
      </p>
      <Button render={<a href="/" />} nativeButton={false}>
        Go to the home page
      </Button>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="mt-4 w-full overflow-x-auto rounded-xl bg-secondary p-4 text-left text-xs">{error.stack}</pre>
      )}
    </main>
  )
}
