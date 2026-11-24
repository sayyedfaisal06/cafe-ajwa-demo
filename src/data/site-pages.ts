import { menuCategories, menuItems } from './menu'

/*
 * The public pages search engines should find. react-router.config.ts prerenders them as real HTML
 * and the sitemap lists them. Pages behind a log in, checkout and old redirecting paths stay out.
 */
export const siteUrl = 'https://www.cafeajwa.co'

export const publicPaths: string[] = [
  '/',
  '/menu',
  ...menuCategories.map((category) => `/menu/c/${category.slug}`),
  ...menuItems.map((item) => `/menu/${item.slug}`),
  '/catering',
  '/about',
  '/contact',
  '/links',
  '/privacy',
  '/terms',
  '/refund-policy',
]
