import type { Config } from '@react-router/dev/config'

/*
 * SPA mode with prerendering. Public pages listed in prerender are built as real HTML so search
 * engines can read them. Every other path loads the client app from the SPA fallback, so the host
 * must serve dist/client/__spa-fallback.html for unknown paths.
 */
export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  ssr: false,
  // The public pages in the current sitemap, plus the link in bio page.
  prerender: ['/', '/menu', '/about', '/contact', '/bulk-order', '/combo', '/social'],
} satisfies Config
