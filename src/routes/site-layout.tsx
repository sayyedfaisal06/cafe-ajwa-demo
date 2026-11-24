import { Outlet } from 'react-router'

import { CartBar, CartProvider, CartSheet } from '@/components/site/cart'
import { MobileTabBar } from '@/components/site/mobile-tab-bar'
import { SiteHeader } from '@/components/site/site-header'

/*
 * The frame around every site page: header, cart and the phone tab bar. Pages render inside main.
 * Phones get bottom padding so the tab bar and cart bar never cover the end of a page.
 */
export default function SiteLayout() {
  return (
    <CartProvider>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[calc(100svh-4rem)] pb-40 outline-none md:pb-0">
        <Outlet />
      </main>
      <CartBar />
      <MobileTabBar />
      <CartSheet />
    </CartProvider>
  )
}
