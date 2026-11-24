import { publicPaths, siteUrl } from '@/data/site-pages'

/* sitemap.xml, built once at build time from the list of public pages. */
export function loader() {
  const urls = publicPaths.map((path) => `  <url><loc>${siteUrl}${path === '/' ? '/' : path}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
