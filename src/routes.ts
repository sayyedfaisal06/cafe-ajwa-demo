import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes'

/*
 * The route table, following the new sitemap in docs/redesign-plan.md section 6.1. Old paths from
 * the current site redirect to their new pages (section 6.3). Public pages that search engines
 * should read are listed in src/data/site-pages.ts. The admin panel is not part of this app.
 */
export default [
  // Every site page shares the header, cart and phone tab bar from the site layout.
  layout('routes/site-layout.tsx', [
    // A failing page shows its error inside the layout, so the header and footer stay.
    layout('routes/page-boundary.tsx', [
      // Public pages in the sitemap
      index('routes/home.tsx'),
      route('menu', 'routes/menu.tsx'),
      route('menu/c/:category', 'routes/category.tsx'),
      route('menu/:slug', 'routes/product.tsx'),
      route('catering', 'routes/catering.tsx'),
      route('about', 'routes/about.tsx'),
      route('contact', 'routes/contact.tsx'),
      route('privacy', 'routes/privacy.tsx'),
      route('terms', 'routes/terms.tsx'),
      route('refund-policy', 'routes/refund-policy.tsx'),

      // Old paths from the current site
      route('bulk-order', 'routes/bulk-order.tsx'),
      route('combo', 'routes/combo.tsx'),

      // Logging in. Emails already sent link to the two /auth pages, so their paths stay as they are.
      route('login', 'routes/auth/login.tsx'),
      route('register', 'routes/auth/register.tsx'),
      route('forgot-password', 'routes/auth/forgot-password.tsx'),
      ...prefix('auth', [
        route('verify-email', 'routes/auth/verify-email.tsx'),
        route('reset-password', 'routes/auth/reset-password.tsx'),
      ]),

      // Log in required
      ...prefix('account', [
        index('routes/account/index.tsx'),
        route('wallet', 'routes/account/wallet.tsx'),
        layout('routes/account/layout.tsx', [
          route('profile', 'routes/account/profile.tsx'),
          route('orders', 'routes/account/orders.tsx'),
          route('orders/history', 'routes/account/order-history.tsx'),
          route('favourites', 'routes/account/favourites.tsx'),
          route('addresses', 'routes/account/addresses.tsx'),
          route('loyalty', 'routes/account/loyalty.tsx'),
          route('referrals', 'routes/account/referrals.tsx'),
          route('notifications', 'routes/account/notifications.tsx'),
        ]),
      ]),
      route('orders', 'routes/orders/index.tsx'),
      route('orders/:orderId', 'routes/orders/detail.tsx'),
      route('checkout', 'routes/checkout/index.tsx'),
      route('checkout/reorder/:orderId', 'routes/checkout/reorder.tsx'),
      route('checkout/success/:orderId', 'routes/checkout/success.tsx'),

      // Anything else
      route('*', 'routes/not-found.tsx'),
    ]),
  ]),

  // The link in bio page stands alone, without the site header, footer or tab bar.
  route('links', 'routes/links.tsx'),
  route('social', 'routes/social.tsx'),

  // Built at build time for search engines.
  route('sitemap.xml', 'routes/sitemap.ts'),

  // Design system preview of every UI element, not linked from the site
  route('ui', 'pages/ui-preview.tsx'),
] satisfies RouteConfig
