import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes'

/*
 * The route table, following the routes of the current site in docs/current-website.md section 3.
 * Public pages that search engines should read are also listed in prerender in
 * react-router.config.ts. The admin panel is not part of this app.
 */
export default [
  // Every site page shares the header, cart and phone tab bar from the site layout.
  layout('routes/site-layout.tsx', [
    // Public pages in the sitemap
    index('routes/home.tsx'),
    route('menu', 'routes/menu.tsx'),
    route('about', 'routes/about.tsx'),
    route('contact', 'routes/contact.tsx'),
    route('bulk-order', 'routes/bulk-order.tsx'),
    route('combo', 'routes/combo.tsx'),

    // Other public pages
    route('menu/:slug', 'routes/product.tsx'),
    route('social', 'routes/social.tsx'),
    ...prefix('auth', [
      route('verify-email', 'routes/auth/verify-email.tsx'),
      route('reset-password', 'routes/auth/reset-password.tsx'),
    ]),

    // Sign in required
    ...prefix('account', [
      index('routes/account/index.tsx'),
      route('wallet', 'routes/account/wallet.tsx'),
      layout('routes/account/layout.tsx', [
        route('profile', 'routes/account/profile.tsx'),
        route('orders', 'routes/account/orders.tsx'),
        route('orders/history', 'routes/account/order-history.tsx'),
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

  // Design system preview of every UI element, not linked from the site
  route('ui', 'pages/ui-preview.tsx'),
] satisfies RouteConfig
