import { Outlet } from 'react-router'

import { useLogOutLanding } from '@/components/site/auth'
import { CartBar, CartProvider, CartSheet } from '@/components/site/cart'
import { HelpPanel } from '@/components/site/help-panel'
import { MobileTabBar } from '@/components/site/mobile-tab-bar'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

/*
 * The frame around every site page: header, footer, cart and the phone tab bar. Pages render inside
 * main. On phones the footer carries the bottom padding, so the tab bar and cart bar never cover it.
 */
export default function SiteLayout() {
  useLogOutLanding()
  return (
    <CartProvider>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[calc(100svh-4rem)] outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <CartBar />
      <MobileTabBar />
      <CartSheet />
      <HelpPanel />
    </CartProvider>
  )
}
