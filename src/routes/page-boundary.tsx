import { Outlet, useRouteError } from 'react-router'

import { ErrorView } from '@/components/site/error-view'

/*
 * Wraps every page inside the site layout. When a page fails, this boundary shows the error in place
 * of the page, so the header, footer, cart and Help panel stay usable around it.
 */
export default function PageBoundary() {
  return <Outlet />
}

export function ErrorBoundary() {
  return <ErrorView error={useRouteError()} />
}
