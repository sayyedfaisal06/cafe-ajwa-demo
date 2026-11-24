import type { Config } from '@react-router/dev/config'

import { publicPaths } from './src/data/site-pages'

/*
 * SPA mode with prerendering. Public pages listed in prerender are built as real HTML so search
 * engines can read them, and sitemap.xml is built from the same list. Every other path loads the
 * client app from the SPA fallback, so the host must serve dist/client/__spa-fallback.html for
 * unknown paths. vercel.json does that on Vercel, and public/_redirects on hosts that read it.
 */
export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  ssr: false,
  prerender: () => [...publicPaths, '/sitemap.xml'],
} satisfies Config
