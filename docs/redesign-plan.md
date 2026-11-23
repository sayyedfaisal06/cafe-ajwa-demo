# Cafe Ajwa — Website Redesign Plan

> **Based on:** [current-website.md](current-website.md) (review of the live site, 24 Nov 2026)
> **Status:** Draft v1 — for discussion
> **Scope note:** This plan covers structure, content, features, UX, SEO and build approach. Visual design (fonts, colours, imagery, theme) is a later phase and is only referenced, not specified.

---

## Table of contents

1. [Summary](#1-summary)
2. [Goals and success measures](#2-goals-and-success-measures)
3. [Decisions needed before we start](#3-decisions-needed-before-we-start)
4. [Guiding principles](#4-guiding-principles)
5. [Scope](#5-scope)
6. [Information architecture](#6-information-architecture)
7. [Page-by-page plan](#7-page-by-page-plan)
8. [Menu and content overhaul](#8-menu-and-content-overhaul)
9. [UX improvements across the site](#9-ux-improvements-across-the-site)
10. [SEO, performance and analytics](#10-seo-performance-and-analytics)
11. [Technical approach](#11-technical-approach)
12. [Phased roadmap](#12-phased-roadmap)
13. [Testing and launch checklist](#13-testing-and-launch-checklist)
14. [Risks](#14-risks)
15. [Access and inputs we need](#15-access-and-inputs-we-need)
16. [Immediate next steps](#16-immediate-next-steps)

---

## 1. Summary

The current site already has the hard parts in place: a working ordering system, customer accounts, payments, loyalty, referrals, and a kitchen/admin back office. Its problems are mostly **on the surface**: the menu is badly organised, there is leftover template content, the brand story doesn't match what is sold, trust claims aren't backed up, and search engines can't read the site.

**Recommended approach:** keep the existing backend and admin panel, and rebuild the **customer-facing front end** on top of the same API, with a cleaned-up menu, honest content, a simpler home page, a clearer path to ordering, and proper SEO.

Before the rebuild, a set of **quick fixes on the live site** (Phase 0) removes the most damaging problems within days, mostly through the admin panel.

---

## 2. Goals and success measures

| # | Goal | How we'll measure it |
|---|---|---|
| G1 | More orders placed directly on the website (instead of Swiggy/Zomato) | Weekly website orders; share of total orders coming from the site |
| G2 | Make it easier to go from browsing to ordering | Add-to-cart rate; checkout start → order placed rate; drop-off at each checkout step |
| G3 | Be found on Google for local searches | Google Search Console impressions/clicks for "cafe ajwa", "restaurant in Malwani / Malad West", dish + area searches; product pages indexed |
| G4 | Build trust | Real review count and average rating shown; repeat-order rate |
| G5 | Grow catering / bulk orders | Bulk enquiries per month and how many turn into orders |
| G6 | Fast and reliable on mobile | Lighthouse mobile ≥ 90 (performance, accessibility, SEO); Core Web Vitals "good" (LCP < 2.5s, INP < 200ms, CLS < 0.1) |

> **There is no analytics on the current site**, so we have no baseline. Adding analytics is part of Phase 0 so we can measure the effect of the redesign.

---

## 3. Decisions needed before we start

Each has a recommendation; these need sign-off from the owner.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | **How to build the new front end** | (a) Plain HTML/CSS/JS (the current empty scaffold in `website/`); (b) a modern framework with pre-rendering (e.g. Next.js or Astro + React); (c) ask ZiyadX to restyle the existing app | **(b)**. Cart, checkout, maps, payments and accounts are app features; doing them in plain JS is slow and fragile. Pre-rendering solves the SEO problem. Plain HTML/JS only makes sense if we drop in-house ordering (see D2). |
| D2 | **Keep in-house ordering or send orders to Swiggy/Zomato?** | Keep the current ordering system / turn the site into a brochure that links out | **Keep in-house ordering.** It's already built, avoids aggregator commission, and owns the customer relationship (loyalty, referrals). Keep Swiggy/Zomato links as a secondary option. |
| D3 | **Brand story** | (a) Bring Hyderabadi biryani and desserts back onto the menu; (b) rewrite the story to match the current menu (North Indian, tandoor, Indo-Chinese) | Owner's call. **Until the menu changes, use (b)**: the site must not promise dishes it doesn't sell. |
| D4 | **Trust claims** ("Since 2001", "15K+ orders", "4.8★") | Verify and keep / replace with verifiable numbers / remove | Keep only what can be proven; pull real ratings from Google/Zomato. |
| D5 | **Build-your-own combo** | Launch / remove | Remove from navigation and sitemap until the owner wants to launch it; keep ready-made combos. |
| D6 | **Chatbot** | Keep scripted bot / replace with a simple WhatsApp + FAQ panel / connect real chat | Replace with a **"Help" panel**: order tracking, FAQs, WhatsApp, call. Same usefulness, no false "live chat" promise. |
| D7 | **Delivery zones** | List areas / show a radius map / address checker | **Address/pincode checker** (the API already checks serviceability) plus a short list of named areas. |
| D8 | **Sign-in before checkout** | Keep email/Google login + phone OTP / switch to phone-OTP-first login | Phone-OTP-first is faster for Indian food ordering but needs backend changes. **Keep the current flow at launch**; consider OTP-first afterwards. |

---

## 4. Guiding principles

1. **Order in as few taps as possible.** Every page should have a clear path to the menu and cart. Target: home → item in cart in 2 taps, cart → order placed in under 60 seconds for a returning customer.
2. **Mobile first.** Most food orders happen on phones. Design for 360–390px first.
3. **Only show what's real.** No placeholder dishes, made-up "people ordered" counts, empty categories, or claims we can't back up.
4. **Content comes from the admin panel.** Hero, offers, hours, delivery info, About copy and SEO text stay editable without a developer.
5. **Don't break the kitchen.** Orders feed KOT printing, invoices and reports. The order data the front end sends must stay the same.
6. **Readable by search engines.** Every public page must have real HTML content when first loaded.
7. **Accessible.** WCAG 2.2 AA: keyboard use, screen-reader labels, focus states, contrast, tap targets ≥ 44px.

---

## 5. Scope

### In scope
- All customer-facing pages: Home, Menu, Category, Product, Cart, Checkout, Order confirmation, Order tracking, Account (all sub-pages), About, Contact, Catering/Bulk, Social links, auth pages, 404, closed/unavailable states
- Menu restructure and content clean-up (categories, names, variants, descriptions, allergens)
- Copywriting for all pages
- SEO foundations, analytics, performance
- Help panel (replacing the chatbot UI)
- Redirects from old URLs

### Out of scope (for this project)
- Backend/API changes (except small ones listed in §11.4, to be agreed with ZiyadX)
- Admin panel redesign
- Kitchen printing, invoices, reports
- Native mobile apps
- Visual design system details (separate phase; see §12 Phase 3)

---

## 6. Information architecture

### 6.1 New sitemap

```
/                         Home
/menu                     Full menu (all categories, one scrolling page with sticky category bar)
/menu/c/:category         Category page (indexable; replaces ?category=)
/menu/:slug               Product page
/catering                 Catering & bulk orders   (301 from /bulk-order)
/about                    Our story
/contact                  Contact & location
/offers                   Current offers (only linked when offers exist)
/links                    Link-in-bio page         (301 from /social)
/checkout                 Checkout (sign-in required)
/checkout/success/:id     Order confirmation
/orders/:id               Order tracking
/account/...              Profile, Orders, Addresses, Rewards, Referrals, Notifications
/auth/verify-email        (unchanged)
/auth/reset-password      (unchanged)
/privacy, /terms, /refund-policy   NEW: needed for payments and trust
```

**Removed:** `/combo` (until launched; 302 to `/menu/c/combos`).

> **Legal pages:** the current site has no privacy policy, terms, or refund/cancellation policy. Razorpay and Google sign-in both expect these, and customers look for them when paying online. They need to be added.

### 6.2 Navigation

| Place | Items |
|---|---|
| **Desktop header** | Logo · Menu · Catering · About · Contact · [Search] · [Account] · [Cart with count] · **Order now** button |
| **Mobile header** | Logo · [Search] · [Cart] |
| **Mobile bottom tab bar** | Home · Menu · Orders · Account. The cart stays in the header, with a sticky "View cart · ₹X" bar above the tab bar once something is in it |
| **Footer** | Menu · Catering · About · Contact · Offers · Account · Privacy · Terms · Refund policy · address, hours, phone, WhatsApp, email · Instagram, Facebook, Swiggy, Zomato · copyright · ZiyadX credit |
| **Help** | A floating "Help" button (replaces the headset/chatbot icon) |

### 6.3 Redirects (protect existing links and search rankings)

| Old | New | Type |
|---|---|---|
| `/bulk-order` | `/catering` | 301 |
| `/social` | `/links` | 301 |
| `/menu?category=<slug>` | `/menu/c/<new-slug>` | 301 (map old → new category, see §8.1) |
| `/combo` | `/menu/c/combos` | 302 (temporary) |
| `/menu/<removed-product>` | its category page or the merged product | 301 |
| `/account/wallet`, `/orders` | unchanged redirects | — |

Product slugs stay as they are where possible. If a product is renamed (e.g. typo fixes), keep the old slug or add a redirect.

---

## 7. Page-by-page plan

### 7.1 Home
Goal: show in 5 seconds what Cafe Ajwa is, that it's open and delivers to you, and get the customer into the menu.

| # | Section | Content / behaviour | Change from today |
|---|---|---|---|
| 1 | **Status strip** (replaces fake ticker) | "Open now · Delivering until 11:30 PM" / "Closed · Opens at 12 PM" / "Delivery paused · Pickup available", from the store-status API | Replaces fake social proof with real, useful info |
| 2 | **Hero** | One clear headline (positioning per D3), one line of support text, **Order now** and **Check delivery** buttons. Optional rotating featured dishes, only real products | Removes the baklava/leftover slides; adds delivery check |
| 3 | **Delivery checker** | Enter pincode or "Use my location" → "We deliver here · ~40 min · Delivery ₹X" or "Pickup only for your area" | New |
| 4 | **Offers** (only if live) | Offer cards from the admin panel | Same, but hidden cleanly when empty |
| 5 | **Categories** | Only categories with dishes (about 8–10), linking to category pages | Removes empty-category dead ends |
| 6 | **Bestsellers** | 8 dishes based on order count | Same idea |
| 7 | **Combos** | The real combos (₹399–₹449) | Fixes the wrong "Familty meal" section |
| 8 | **Order again** (signed-in) | Last ordered dishes, one-tap reorder | Same, moved higher for returning users |
| 9 | **How it works** | 3 short steps: order → cooked fresh → delivered hot / ready for pickup | Shorter version of today's 4 steps |
| 10 | **Reviews** | Real reviews plus the Google/Zomato rating with a link | Replaces the single-review carousel |
| 11 | **Catering band** | "Feeding a group? Office lunches, parties, family events" → Catering | New, gives catering a home-page entry |
| 12 | **Visit us** | Map link, address, hours, phone, WhatsApp | Same |

### 7.2 Menu (`/menu`)
- **One scrolling page** with all categories as sections, plus a **sticky category bar** that highlights the current section as you scroll (faster than the current chip-filter + "All Dishes" grid).
- **Filters:** Veg / Non-veg (keep), plus "Bestsellers" and price sort.
- **Search** in the menu header, with results filtered as you type.
- **Compact dish rows on mobile** (name, short description, price, veg/non-veg mark, Add button, small image) so more dishes fit on screen; cards on desktop.
- **Add button turns into a quantity stepper** after the first tap, so customers don't need to open the cart.
- Dishes with sizes or add-ons open a bottom sheet; combos open the combo sheet.
- Sold-out dishes stay visible but greyed out with "Sold out today".
- Remove the duplicate "featured product" hero and the separate "Popular Picks" carousel; put bestsellers as the first section instead.

### 7.3 Category page (`/menu/c/:category`) — new
Same layout as one menu section, with its own title, short intro text (good for SEO, e.g. "Chicken starters in Malad West"), and links to neighbouring categories.

### 7.4 Product page (`/menu/:slug`)
- Keep: price, size options, add to cart, rating, prep/delivery time, allergens, "goes well with", reviews.
- Add: a real description (see §8.4), serves/portion, spice level, a veg/non-veg mark next to the name.
- Sticky **Add to cart · ₹X** bar on mobile.
- Unknown slug → real 404 page with menu search, not "Something went wrong".
- Reviews: show the newest 3 first, then "See all"; prompt for a review only after the customer has ordered the dish.

### 7.5 Cart
- Keep the drawer, plus a sticky "View cart" bar on mobile.
- Show **delivery fee and free-delivery threshold early** ("Add ₹120 more for free delivery"), instead of only "calculated at checkout".
- Show the minimum order for delivery before checkout.
- Suggest add-ons (breads, soups) based on what's in the cart.

### 7.6 Checkout
Keep all current logic; reorganise into a clear **single page with 4 steps**:
1. **Delivery or pickup** (with ETA for each)
2. **Address** (saved addresses first; the map form for new ones) or pickup location and time
3. **Offers and rewards** (coupon + points in one block, showing the saving)
4. **Payment** (UPI/cards via Razorpay, Cash on delivery, Pay at pickup) and a clear bill breakdown, then **Place order · ₹X**

Also:
- Ask for phone verification **at the start** of the first checkout, not at the end, so customers don't fill everything in and then get stopped.
- Clear blocking messages *before* the customer fills things in: store closed, delivery paused, outside area, below minimum order.
- Remember the last-used payment method and address.

### 7.7 Order confirmation and tracking
- Big status timeline (Placed → Accepted → Prepared → Out for delivery / Ready for pickup → Delivered) with ETA.
- Status updates without refreshing the page.
- Actions: Call restaurant, WhatsApp, Receipt (PDF), Cancel (only while "Placed", with an explanation of why it disappears), Reorder, Rate dishes.
- For pickup: the address, a map link and "Show this at the counter: Order #1234".

### 7.8 Account
Same features, simpler layout:
- **Orders** (default tab): active order at the top, then history with Reorder buttons.
- **Rewards**: merge Loyalty and Referrals into one page: points balance, how to earn/use, referral code with share button, history.
- **Addresses**, **Profile & security**, **Notifications**.

### 7.9 About
Rewrite to match the real menu and the D3/D4 decisions. Suggested structure: the story (who started it, when, why) → what we cook → how we cook (keep the "made to order" promise) → the team → verified numbers → visit us. Use real photos of the kitchen and team (photography brief in the design phase).

### 7.10 Contact
Keep it largely as it is (it works well): call / WhatsApp / email cards, hours, map, form. Add:
- An FAQ block (hours, delivery area, pickup, payment methods, cancellations) that reuses the Help panel content
- A link to the refund/cancellation policy

### 7.11 Catering (`/catering`, was Bulk order)
- Rename to **Catering & bulk orders**: clearer for search and customers.
- Add **sample catering packages** (e.g. "Office lunch box", "Party platter for 20", "Family feast") with "starting from" prices if the owner agrees. People enquire more when they can see a price.
- Keep the form (name, phone, quantity, date, delivery/pickup, requirements) and the WhatsApp/call shortcuts.
- Add 2–3 past events or testimonials when available.

### 7.12 Links page (`/links`, was /social)
Keep as a simple link-in-bio page for Instagram: Order on our website (first), Swiggy, Zomato, Instagram, Facebook, Google Maps, WhatsApp.

### 7.13 Help panel (replaces chatbot)
A slide-up panel with: **Track my order** (signed-in: latest order status; signed-out: sign in) · **FAQs** (expandable answers) · **WhatsApp us** · **Call us** · **Leave a message** (existing lead form). No "Online · replies instantly" wording.

### 7.14 System states (designed on purpose, not as an afterthought)
| State | Where it shows |
|---|---|
| Store closed | Status strip, menu (Add buttons say "Pre-order for 12 PM" if scheduling exists, otherwise disabled with opening time), checkout blocked with a clear message |
| Delivery paused | Status strip; checkout defaults to pickup |
| Outside delivery area | Delivery checker, checkout; offer pickup + Swiggy/Zomato links |
| Sold out item | Greyed out on the menu and product page |
| Empty cart / no orders / no addresses | Friendly message + "Browse menu" |
| Network/API error | Retry message, never a blank page |
| 404 | Search box, popular dishes, link home |

---

## 8. Menu and content overhaul

This can start immediately and mostly happens in the **admin panel**, so it benefits the current site too.

### 8.1 New category structure (20 → 12, no empty categories)

| New category | Slug | Dishes moved in | From (old category) |
|---|---|---|---|
| Combos | `combos` | Chicken Hakka Noodles Combo, Chicken Biryani Combo, Butter Chicken Combo, Chicken Fried Rice Combo | Combo |
| Tandoor & Kebabs | `tandoor-kebabs` | Chicken Barra Tandoori, Chicken Schezwan Tandoori, Chicken Seekh Kabab, Chicken Pahadi Kabab, Chicken Tikka Dry, Chicken Schezwan Tikka, Mutton Kalimiri | Indian Starters, Mutton Starters |
| Chicken Starters | `chicken-starters` | Chicken Butter Garlic, Lollipop Masala Dry, Chicken Teriyaki, Chicken Pakoda | Indian Starters |
| Indo-Chinese Starters | `indo-chinese-starters` | Paneer Crispy, Paneer Garlic Dry, Paneer Manchurian Dry, Paneer Chilli Dry | Chinese Starters |
| Chicken Curries | `chicken-curries` | Kadai, Pahadi Tawa, Kolhapuri, Lucknowi, Akbari, Banjara Tawa, Banjara Kabab Masala, Dhamaka, Begum Bahar, Nargis, Chingari, Harabara, Mumtaz, Tawa, Afghani | Indian Main Course |
| Indo-Chinese Mains | `indo-chinese-mains` | Chicken Chilli Gravy, Chicken Kung Pao, Chicken 65 Gravy, Paneer 65 Gravy, Paneer Chilli Gravy | Indian Main Course |
| Paneer & Veg | `paneer-veg` | All Veg Main Course dishes + Paneer Butter Garlic, Paneer BBQ | Veg Main Course, Indian Main Course |
| Biryani & Pulao | `biryani-pulao` | Veg Biryani, Paneer Biryani, Paneer Pulao, Chicken Pulao | Biryani & Pulav |
| Fried Rice & Noodles | `fried-rice-noodles` | All Rice + Noodles dishes | Rice, Noodles |
| Rice & Dal | `rice-dal` | Jeera Rice, Steamed Rice, Dal Khichdi, Dal Khichdi Tadka | Biryani & Pulav |
| Breads | `breads` | Tandoori Roti, Tandoori Naan, Butter Paratha | Indian Breads |
| Soups | `soups` | Chicken Hot & Sour, Chicken Garlic | Soup |

*("Rice & Dal" can be merged into "Biryani & Pulao" if the owner prefers 11 categories.)*

**Hide (don't delete) until they have dishes:** Fish & Prawns, Seafood Mains, Mutton Mains, Egg Dishes, Raita & Papad, Pizza & Sandwiches, Falooda & Shakes, Ice Cream. If the restaurant does sell these, adding them is the single biggest menu improvement, especially desserts and drinks, which raise order value.

**Remove:** the test product "Familty meal" (or replace it with a real family meal combo), and the duplicate "Combos" category.

### 8.2 Name fixes

| Current | Corrected |
|---|---|
| Familty meal | Family Meal (if kept) |
| Chicken Banajara Kabab Masaka | Chicken Banjara Kabab Masala |
| Chicken Teryaki | Chicken Teriyaki |
| Paneer Chilly Dry | Paneer Chilli Dry |
| Paneer Pulav | Paneer Pulao |
| Chicken Kadai (BONE) | Chicken Kadai (Bone-in) |
| Chicken Hot-N-Sour Soup | Chicken Hot & Sour Soup |
| Steam Rice Full | Steamed Rice |
| Chicken Ajwa SPL Rice | Chicken Ajwa Special Fried Rice (matches the hero slide) |

Agree a naming rule: Title Case, no size in the name, no shouting capitals.

### 8.3 Turn sizes into options

| Today (separate products) | New (one product with options) |
|---|---|
| Chicken Pakoda 500GM / Chicken Pakoda 1KG | Chicken Pakoda: 500 g / 1 kg |
| "… Full" items (Barra Tandoori Full, Jeera Rice Full, Hakka Noodles Full, etc.) | Base name with Half / Full, if half portions are sold; otherwise drop "Full" |
| Chicken Seekh Kabab (4 Pcs), Mutton Kalimiri (8PCS) | Keep piece count as a detail ("4 pcs"), not in the name |

Keep the old slugs redirecting to the merged product.

### 8.4 Dish descriptions
Every dish gets a 1–2 line description. Template:
> **What it is** + **key flavour/ingredient** + **how it's served**.
> *e.g. Chicken Kolhapuri: Fiery Maharashtrian curry with coconut and dry red chillies, slow-cooked on the bone. Best with tandoori roti.*

Also fill in for every dish: veg/non-veg/egg, spice level (mild/medium/hot), serves, allergens (gluten, dairy, nuts, egg, shellfish), prep time.

**Owner input needed:** a quick list of what's actually in each dish and whether half portions exist.

### 8.5 Remove placeholder content
| Item | Where | Fix |
|---|---|---|
| Fake "people ordered" ticker | Every page | Remove; replace with the status strip |
| Search suggestions (pasta, cold brew, matcha…) | Search | Use real popular dishes |
| "Baklava" hero slide | Home | Remove |
| "Café Aiwa" logo alt text | Header | "Cafe Ajwa" |
| "Wood-fired pizza" image alt text | About | Describe the real photo |
| Fallback landline/email in code | Site-wide | Update to the live contact details |

### 8.6 Copy to write
Home, About, Catering (incl. packages), Contact FAQs, category intros (one short paragraph each), dish descriptions (81 → about 75 after merges), Help-panel FAQs, legal pages (privacy, terms, refund/cancellation), SEO titles and descriptions for every page, empty/error state messages.

**Agree one spelling of the name:** "Cafe Ajwa" everywhere (and ask Swiggy/Zomato to fix "Cafe Ajwaa").

---

## 9. UX improvements across the site

| Area | Improvement |
|---|---|
| Delivery clarity | Delivery checker on Home and in the cart; ETA and fee shown before checkout |
| Store status | Live open/closed/paused status everywhere it matters |
| Speed to order | Add button → quantity stepper; sticky "View cart"; reorder in one tap |
| Search | Search dish names, categories and descriptions; tolerate typos ("biriyani", "panner"); show "no results" with suggestions |
| Pricing honesty | Show delivery fee, platform fee and taxes early, not as a surprise at the end |
| Trust | Real ratings (Google/Zomato), real photos, legal pages, clear refund policy, FSSAI licence number in footer (if available) |
| Accessibility | Keyboard navigation for all sheets/modals, labelled icon buttons, visible focus, respects "reduce motion", veg/non-veg shown by text and icon, not only colour |
| Language | Consider Hindi/Marathi later; build so text can be translated |
| Performance | Fast on budget Android phones on 4G: small JS bundles, lazy-load images and maps, load Razorpay/Maps only at checkout |

---

## 10. SEO, performance and analytics

### 10.1 SEO
| Task | Detail |
|---|---|
| Pre-render / server-render | All public pages (home, menu, categories, products, about, contact, catering) delivered as real HTML |
| Structured data (JSON-LD) | `Restaurant` (name, address, geo, phone, hours, price range, servesCuisine, acceptsReservations: false, hasMenu), `Menu` / `MenuSection` / `MenuItem` with prices, `BreadcrumbList`, `AggregateRating` only from real reviews |
| Sitemap | All public pages + all category and product pages, updated automatically when the menu changes |
| Titles & descriptions | Unique per page, local keywords (e.g. "Chicken Kolhapuri – order online in Malad West \| Cafe Ajwa") |
| Share image | Proper 1200×630 Open Graph image per page (dish photo on product pages) |
| 404 | Real 404 status for unknown URLs and removed dishes |
| Google Business Profile | Make sure the name, address, phone and hours match the site exactly; link "Order online" to the website |
| Local content | Category intros and About copy mention Malwani / Malad West naturally |

### 10.2 Performance targets
- Lighthouse mobile ≥ 90 on Home, Menu, Product
- LCP < 2.5s, INP < 200ms, CLS < 0.1 on a mid-range Android
- Initial JS on public pages < 150 KB compressed
- Images served in modern formats at the right size

### 10.3 Analytics (set up in Phase 0)
- A privacy-friendly analytics tool (e.g. GA4 or Plausible) + Google Search Console
- Track these events: `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `phone_verified`, `add_address`, `apply_coupon`, `add_payment_info`, `purchase`, `bulk_enquiry`, `contact_enquiry`, `click_whatsapp`, `click_call`, `click_swiggy`, `click_zomato`, `delivery_check` (with result)
- A simple dashboard with the measures from §2

---

## 11. Technical approach

### 11.1 Recommended stack (subject to D1)
- **Framework:** Next.js (React) or Astro + React islands, with pre-rendering for public pages and normal client-side behaviour for cart/checkout/account
- **Styling:** utility CSS or CSS modules with design tokens (exact tokens decided in the design phase)
- **Data:** existing API at `api.cafeajwa.co/api/v1`; menu pages rebuilt automatically when the menu changes (or every few minutes)
- **Integrations kept:** Google sign-in, Google Maps/Places (address pin + radius), Razorpay, phone number validation, PDF receipts
- **Hosting:** Vercel/Netlify/Cloudflare or the current host; API stays where it is

> **About the empty `website/` scaffold** (`index.html`, `script.js`, `style.css`): it suits a static brochure site. If D1 = (b), we replace it with the framework project. If the owner prefers plain HTML/JS, we should limit scope to a brochure site plus links to ordering (D2), because rebuilding checkout/accounts in plain JS isn't a good use of time.

### 11.2 Component inventory (to design and build)
Header, mobile tab bar, footer, status strip, delivery checker, category bar, dish card, dish row, quantity stepper, veg/non-veg mark, badges, size/add-on sheet, combo sheet, cart drawer, sticky cart bar, search overlay, sign-in modal (sign in / register / forgot), phone verification sheet, address form with map, coupon picker, rewards toggle, payment selector, bill breakdown, order timeline, order card, review list + form, rating stars, offer card, FAQ accordion, help panel, forms (contact, catering), empty/error states, toast messages, 404.

### 11.3 Things that must keep working exactly as today
- Order payload (items, variants, add-ons, combo selections, address, channel, coupon, points, payment method, idempotency key, branch id)
- Payment flow (create intent → Razorpay → confirm → retry)
- Phone OTP, email verification, password reset links (`/auth/verify-email`, `/auth/reset-password` URLs are in emails already sent)
- Review submission and moderation
- Leads (contact + bulk) reaching the admin inbox
- Chat/help events if the owner still wants chatbot analytics

### 11.4 Small backend requests (to agree with ZiyadX)
| Request | Why |
|---|---|
| API documentation or OpenAPI spec | Build against the API safely |
| A staging environment with test Razorpay keys | Test checkout without real payments |
| Category "hidden" flag (if not already there) | Hide empty categories without deleting them |
| Menu-changed webhook (optional) | Rebuild menu pages straight away when the menu is edited |
| Per-dish fields: spice level, short description (if missing) | Richer menu |
| Allow CORS from the new front-end domain(s) | Required for the new site and staging |

---

## 12. Phased roadmap

Durations are indicative for a small team (1 designer, 1–2 developers) and depend on the decisions in §3.

### Phase 0 — Quick fixes on the live site (week 1)
Most of this can be done in the admin panel; items marked 🔧 need a code change from ZiyadX.

- [ ] Delete or fix the "Familty meal" test product
- [ ] Rename misspelled dishes (§8.2)
- [ ] Move dishes into sensible categories; hide empty categories (§8.1)
- [ ] Remove the "baklava" hero slide (🔧 if it's a hard-coded fallback)
- [ ] 🔧 Remove the fake ticker and placeholder search suggestions
- [ ] 🔧 Fix "Café Aiwa" alt text and fallback contact details
- [ ] 🔧 Show the real "Combo" category in the Home combos section
- [ ] Add analytics + Google Search Console
- [ ] Check Google Business Profile details match the site
- [ ] Confirm the admin route is protected on the server and the Maps key is restricted to the domain

### Phase 1 — Discovery and content (weeks 1–3)
- Sign off decisions D1–D8
- Owner interview: story, real numbers, dishes (ingredients, spice, portions, half/full), catering packages
- Look at 3–5 competitor/peer restaurant sites and the Swiggy/Zomato listing (ratings, best-selling dishes, photos)
- Collect real ratings and reviews
- Write all copy (§8.6); finish menu data clean-up (§8.3, §8.4)
- Draft legal pages (privacy, terms, refund/cancellation)

### Phase 2 — Structure and wireframes (weeks 3–5)
- Final sitemap, navigation and redirect map
- Mobile-first wireframes for every page in §7 and every state in §7.14
- Click-through prototype of the order flow (home → menu → cart → checkout → tracking)
- Quick test with 5 real customers (ordering a dish, finding catering, checking delivery), then fix what confuses them

### Phase 3 — Visual design (weeks 5–7)
*(Fonts, colours, imagery and theme are decided here, not in this plan.)*
- Brand direction based on D3
- Design system: tokens, components from §11.2
- High-fidelity designs for key pages, mobile and desktop
- Food and kitchen photography brief + shoot

### Phase 4 — Build (weeks 7–12)
- Project setup, design tokens, component library
- Public pages with pre-rendering + structured data
- Menu, product, search, cart
- Checkout, payments, phone verification, address/maps
- Account, order tracking, reviews, rewards
- Help panel, forms, legal pages
- Analytics events, redirects, sitemap

### Phase 5 — Testing and launch (weeks 12–13)
- Full checklist in §13
- Soft launch on a staging URL with staff and a few regular customers
- Launch, with the old site ready to roll back to

### Phase 6 — After launch (ongoing)
- Watch analytics and checkout drop-off weekly for the first month
- Ask customers for reviews after delivered orders
- Add missing menu sections (desserts, drinks, seafood) if they're offered
- Consider: phone-OTP-first login, scheduled orders / pre-orders, combo builder, Hindi/Marathi, WhatsApp order updates

---

## 13. Testing and launch checklist

**Ordering (test on staging with test payment keys, then one real low-value order on production)**
- [ ] Add simple dish, dish with size, dish with add-ons, combo
- [ ] Cart persists after refresh and after sign-in
- [ ] New customer: register → verify email → phone OTP → address → pay online → confirmation
- [ ] Returning customer: saved address, coupon, reward points, cash on delivery
- [ ] Pickup order with pay at pickup
- [ ] Outside delivery area, below minimum order, store closed, delivery paused
- [ ] Payment failure and retry; closing the Razorpay window midway
- [ ] Cancel while "Placed"; cannot cancel after "Accepted"
- [ ] Reorder, receipt PDF, review submission
- [ ] **Order appears correctly in the admin panel, prints the KOT, and generates the invoice**

**Accounts**
- [ ] Google sign-in, link/unlink; password reset email link; email verification link
- [ ] Address add/edit/delete/default; profile edit; delete account
- [ ] Loyalty and referral pages show correct numbers

**Content & SEO**
- [ ] Every page has a unique title, description, canonical and share image
- [ ] Structured data passes Google's Rich Results Test
- [ ] Sitemap includes all categories and products; robots.txt correct
- [ ] All redirects in §6.3 work; no broken links (crawl the site)
- [ ] No placeholder text, test products, or unverified claims

**Quality**
- [ ] Lighthouse targets met on mobile
- [ ] Tested on: Android Chrome (budget + mid-range phone), iPhone Safari, desktop Chrome/Safari/Edge
- [ ] Keyboard and screen-reader check on menu, cart, checkout
- [ ] Analytics events firing (check in real-time view)
- [ ] Error monitoring set up (e.g. Sentry)

---

## 14. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| No API docs / limited cooperation from the original developer (ZiyadX) | Slow build, bugs in checkout | Agree scope and access early (§11.4); budget time to reverse-engineer from the current app |
| Breaking the kitchen workflow (KOT/invoices) | Lost or wrong orders | Keep the order payload identical; end-to-end test with the printer before launch |
| Losing search rankings | Fewer customers from Google | Redirect map, keep product slugs, launch with sitemap + Search Console |
| Menu data not provided by the owner | Thin content at launch | Start content collection in Phase 1; launch with a minimum set (names, categories, veg/non-veg, prices) if needed |
| Unverified claims kept on the site | Customer trust, consumer-protection exposure | Decision D4 before copywriting |
| Payment or legal pages missing | Razorpay compliance issues | Legal pages are in scope (Phase 1) |
| Scope creep (new features) | Delays | Anything not in §5 goes to Phase 6 |

---

## 15. Access and inputs we need

| From | What |
|---|---|
| Owner | Decisions D1–D8; story and real numbers; dish details; catering packages and prices; photos or permission to shoot; FSSAI number; legal details for policies |
| ZiyadX / current developer | API documentation, staging environment, CORS for new domains, test Razorpay keys, admin test account, confirmation of which content is CMS-managed vs hard-coded |
| Accounts | Admin panel login, Google Business Profile, Google Search Console, domain/DNS, hosting, Razorpay dashboard, Google Cloud (Maps + sign-in) |
| Test data | A test customer account so we can review the signed-in screens we couldn't see during the audit |

---

## 16. Immediate next steps

1. Owner reviews this plan and signs off **D1–D8** (§3).
2. Get admin access and start **Phase 0** quick fixes.
3. Contact ZiyadX for API docs, staging and the 🔧 code fixes.
4. Set up analytics now to get a baseline before the redesign.
5. Book the owner interview and start collecting menu details (§8.4).
