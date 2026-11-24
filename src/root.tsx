import type { ReactNode } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router'

import { ErrorView } from '@/components/site/error-view'
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
        {/* Link previews for every page. Titles and descriptions come from each route's meta. */}
        <meta property="og:site_name" content="Cafe Ajwa" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.cafeajwa.co/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Cafe Ajwa: tandoor, curries and Indo Chinese, cooked fresh in Malwani" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.cafeajwa.co/og-image.jpg" />
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

/* The last resort, for failures in the site layout itself. Page errors show inside the layout via
   routes/page-boundary.tsx. */
export function ErrorBoundary() {
  return (
    <main>
      <ErrorView error={useRouteError()} fullScreen />
    </main>
  )
}
