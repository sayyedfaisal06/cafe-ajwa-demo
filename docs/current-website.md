# Cafe Ajwa — Current Website Documentation

> **Site:** https://www.cafeajwa.co
> **Reviewed:** 24 Nov 2026 (live site, desktop at 1440px and mobile at 390px)
> **Purpose:** A record of what the current website contains and does, written before the redesign.
> **Out of scope:** fonts, images, colours, theme and visual styling.

---

## Table of contents

1. [Overview](#1-overview)
2. [Business information shown on the site](#2-business-information-shown-on-the-site)
3. [Sitemap and routes](#3-sitemap-and-routes)
4. [Global elements (on every page)](#4-global-elements-on-every-page)
5. [Page-by-page breakdown](#5-page-by-page-breakdown)
6. [End-to-end ordering flow](#6-end-to-end-ordering-flow)
7. [Customer account area](#7-customer-account-area)
8. [Ajwa Assistant (chatbot)](#8-ajwa-assistant-chatbot)
9. [Menu catalogue](#9-menu-catalogue)
10. [Product data model](#10-product-data-model)
11. [Platform, backend and admin capabilities](#11-platform-backend-and-admin-capabilities)
12. [SEO and technical setup](#12-seo-and-technical-setup)
13. [Content and data issues found](#13-content-and-data-issues-found)
14. [Redesign considerations (functional)](#14-redesign-considerations-functional)

---

## 1. Overview

Cafe Ajwa is a neighbourhood restaurant in Malwani, Malad West, Mumbai. Its website is a **full ordering platform**, not just a brochure site. Customers can:

- browse the menu and search dishes
- add dishes to a cart and check out for **delivery or pickup**
- pay online (Razorpay), pay cash on delivery, or pay at pickup
- create an account, save addresses, track orders, reorder, cancel and review dishes
- earn and spend **loyalty points**, and use **referral codes** and **coupons**
- send contact enquiries and **bulk/catering order requests**
- get help from a scripted chatbot ("Ajwa Assistant")

| Item | Value |
|---|---|
| Brand name on site | Cafe Ajwa (also written "Café Ajwa") |
| Tagline | "Freshly made. Customizable. Delivered hot." |
| Positioning (About page) | "Hyderabadi soul, Malwani kitchen": Hyderabadi cuisine, cafe favourites and hand-plated desserts |
| What the menu actually sells | Mostly North Indian and Indo-Chinese: chicken starters and gravies, paneer, breads, rice, noodles, soups, combos (see §9) |
| Built by | ZiyadX (footer credit "Crafted by ZiyadX", links to ziyadx.com) |
| Type | Single-page React app (client-rendered), installable as a PWA |
| Backend | Custom REST API at `api.cafeajwa.co/api/v1`, with an admin panel in the same app |
| Third-party listings | Swiggy, Zomato (both listed as "Cafe Ajwaa – Malad West") |

---

## 2. Business information shown on the site

All of this is managed through the CMS/branch settings and repeated on several pages (footer, Contact, About, Home, chatbot).

| Field | Value |
|---|---|
| Branch name | Cafe Ajwa — Malwani |
| Address | Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony, Malad West, Mumbai, Maharashtra 400095 |
| Map | Google Maps short link + embedded map on Contact (coords 19.1831747, 72.8189338) |
| Phone | +91 91675 92758 (`tel:` link) |
| WhatsApp | +91 91675 92758 (`wa.me` link) |
| Email | cafeajwa08@gmail.com |
| Instagram | instagram.com/cafeajwa_malvani |
| Facebook | facebook.com/people/Cafe-Ajwa-Malwani/61581087598305 |
| Hours | Mon – Sun, 12:00 PM – 12:00 AM |
| Order cut-off | "Last orders accepted 30 minutes before closing." |
| Services | Pickup and in-house delivery |
| Delivery area copy | "In-house delivery across Malwani, Malad West, and select western Mumbai neighbourhoods. Pickup is always available at our kitchen on Gaikwad Nagar." |
| Delivery zones listed | Malwani (only one zone listed) |
| Delivery time claim | "35–45 min typical ETA across Mumbai"; product pages say "Delivery ~45 min" |
| Established | "Since 2001" |
| Trust stats (About) | 15K+ orders delivered locally · 4.8★ average guest rating · 45 min typical delivery window · 100% made to order |

> **Note:** The code also contains hard-coded fallback contact details (`022 2888 8120`, `hello@cafeajwa.com`). These differ from the live values and could show briefly if the CMS call is slow or fails.

---

## 3. Sitemap and routes

### 3.1 Public pages (listed in `sitemap.xml`)

| Route | Page | In header nav | In footer nav |
|---|---|---|---|
| `/` | Home | ✅ | ✅ |
| `/menu` | Menu (supports `?category=<slug>`) | ✅ | ✅ |
| `/about` | About | ❌ | ✅ |
| `/contact` | Contact | ✅ | ✅ |
| `/bulk-order` | Bulk order | ✅ | ✅ |
| `/combo` | Build-your-own combo (currently disabled) | ❌ | ❌ |

### 3.2 Other public routes (not in the sitemap)

| Route | Page |
|---|---|
| `/menu/:slug` | Product detail page (81 live products; none are in the sitemap) |
| `/social` | Link-in-bio page (Swiggy, Zomato, Instagram, Facebook, Website, Maps) |
| `/auth/verify-email` | Email verification landing page (opened from an email link) |
| `/auth/reset-password` | Set a new password (opened from an email link) |
| `*` | 404 page: "We couldn't find that page." with a "Go home" button |

### 3.3 Sign-in required (signed-out visitors are sent to Home and shown the sign-in modal)

| Route | Page |
|---|---|
| `/account` | Redirects to `/account/profile` |
| `/account/profile` | Profile, linked accounts, password, sign out, delete account |
| `/account/orders` | Order dashboard (active / upcoming / past) |
| `/account/orders/history` | All past orders, paginated |
| `/account/addresses` | Saved addresses |
| `/account/loyalty` | Loyalty points (`/account/wallet` redirects here) |
| `/account/referrals` | Referral code |
| `/account/notifications` | Order-update notifications |
| `/orders` | Redirects to `/account/orders` |
| `/orders/:orderId` | Order detail and tracking |
| `/checkout` | Checkout |
| `/checkout/reorder/:orderId` | Reorder checkout |
| `/checkout/success/:orderId` | Order confirmation |

### 3.4 Admin

The staff admin panel lives in the same app under a separate hidden route (see §11.3).

---

## 4. Global elements (on every page)

### 4.1 Social-proof ticker (very top)
A scrolling strip of messages such as "93 people ordered Truffle Pasta today" and "40 people ordered Cold Brew this hour". **These dishes are not on the menu.** The strip appears to be hard-coded placeholder content (see §13).

### 4.2 Header
- **Logo** (links to Home)
- **Desktop nav:** Home · Menu · Contact · Bulk order (About is missing)
- **Icon buttons:** Search · Account · Live chat (headset icon) · Cart (shows an item-count badge)

### 4.3 Mobile bottom tab bar
Fixed at the bottom on mobile: **Home · Menu · Orders · Account**. Orders and Account open the sign-in modal for signed-out visitors.

### 4.4 Search overlay
- Full-screen overlay titled "Search menu" with placeholder "Search biryani, drinks, desserts…"
- "Try searching" chips: Biryani, Pasta, Cold brew, Matcha, Croissant, Cheesecake. Only "Biryani" returns results.
- Requires at least 2 characters ("Type at least 2 characters to find dishes, drinks, and desserts from the kitchen.")
- Results update as you type: a count ("3 results") and rows of dish name + price. Tapping a row opens the product.

### 4.5 Cart drawer
- Title "Your Cart (n)", a **Clear** button and a close button
- One row per item: name, price and a quantity stepper (the minus button turns into Remove at quantity 1)
- **Item total**, plus the note "Delivery and taxes are calculated at checkout."
- **Checkout** button. Signed-out users get the sign-in modal and are sent on to checkout after signing in.
- The cart is kept across page loads

### 4.6 Sign-in / account modal
Three views in one modal:
1. **Sign in:** "Sign in to Café Ajwa". Email, password (show/hide), Sign in, **Continue with Google**, links to Create account and Forgot password.
2. **Create account:** Full name, email, password ("At least 8 characters"), Continue with Google. The note says "Phone verification happens at checkout."
3. **Forgot password:** Email, then "Send reset link". The email links to `/auth/reset-password`.

Errors handled: wrong email/password, email not verified, email already registered, weak password, invalid or expired token.

### 4.7 Live chat
The headset icon opens the **Ajwa Assistant** panel (see §8).

### 4.8 Footer
- Scrolling tagline strip: "Malwani, Mumbai · Freshly made. Customizable. Delivered hot. · Made to order · Pickup & delivery · Customizable every time"
- Block styled like a receipt: "Receipt № · Cafe Ajwa — Malwani · Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony · 400095"
- **Index (footer nav):** Home · Menu · About · Contact · Bulk order · Account
- **Visit us:** address (Maps link), phone, email, WhatsApp
- **Open:** Mon – Sun, 12:00 PM – 12:00 AM, plus the pickup/delivery and last-orders note
- Instagram link and an **Order now** button (goes to /menu)
- "© 2026 Cafe Ajwa. All rights reserved." · "Crafted by ZiyadX" · "Mumbai · Maharashtra"

---

## 5. Page-by-page breakdown

### 5.1 Home (`/`)

Sections from top to bottom:

| # | Section | Content |
|---|---|---|
| 1 | **Hero: "Featured dishes" carousel** | H1 "Cafe Ajwa". A rotating featured dish with a category label (e.g. "COMBO"), the dish name and a **See More** link. Circular text around it: "Cafe Ajwa · Taste the difference · Premium ingredients · Made fresh every day · Flavour worth remembering". CMS-managed slides seen: Tandoori Butter Paratha, Chicken Schezwan Tandoori, Chicken Ajwa Special Fried Rice, Jeera Rice, Chicken Hakka noodles combo. A leftover static slide, **"baklava"**, links to `/menu/baklava-assortment`, which shows "Product not found". |
| 2 | **Offers / Deals carousel** *(only shown when promos exist)* | Promo cards from the CMS with Add to cart / Add combo buttons and previous/next arrows. Not shown at the time of review because no promos were live. |
| 3 | **Browse by craving** | "Pick a category to see its dishes", **Explore** link. Shows the first 10 categories, each linking to `/menu?category=<slug>`. 5 of these 10 are empty. |
| 4 | **Best sellers** | "What Mumbai orders most", Explore link. 8 product cards (image, rating, price, name, Add to Order). |
| 5 | **Order again** *(signed-in users only)* | "Dishes you ordered before". |
| 6 | **Combo meals** | "Ready-made plates for sharing or solo". Shows only **"Familty meal" ₹1,000**. The four real combos (₹399–₹449) are not shown here. A "Build your own" card can appear when the combo builder is enabled. |
| 7 | **What guests say** | "Reviews from our customers": featured review cards (initials, name, star rating, date, comment, linked dish). Only 1 review exists on the site. |
| 8 | **Delivery promise: "From kitchen to your door"** | The delivery-area copy, then 4 steps: **01 Order placed** ("You tap — we fire the kitchen immediately") → **02 Kitchen fires** ("Made fresh after you order, never from a holding line") → **03 Packed hot** ("Hand-checked, sealed, and routed from Malwani") → **04 At your door** ("35–45 min typical ETA across Mumbai"). |
| 9 | **Delivery zones / hours** | Zones: Malwani · Since 2001 · Mon–Sun 12:00 PM–12:00 AM · "Pickup at Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony" · the pickup/last-orders note. |

The code also has optional home sections, **"Top rated"** and **"Dishes to try – A good place to start"**, which appear depending on available data.

### 5.2 Menu (`/menu`)

| Part | Details |
|---|---|
| **Featured product hero** | One highlighted dish (currently Tandoori Roti): "Featured" and "Veg" tags, price, rating and order count ("5.0 · 11 orders"), short description, "Serves 1", "~20 min", **Add to cart**, **View Details**. |
| **Category chips** | Scrolls sideways with arrows: **All**, Combos, Mutton Starters, Fish & Prawns Starter, Indian Starters, Indian Main Course, Mutton Main Course, Veg Main Course, Sea Food Main Course, Egg Dishes, Indian Breads, Raita & Papad, Chinese Starters, Biryani & Pulav, Rice, Noodles, Soup, Pizza & Sandwiches, Falooda & Shake, Ice Cream, Combo. The URL accepts `?category=<slug>` for deep links. |
| **Dietary filter** | All · Veg · Non-Veg |
| **Offers & Deals** *(if promos exist)* | "Swipe through offers — limited-time promotions from Cafe Ajwa" |
| **Popular Picks** | "Guest favourites from our kitchen". Carousel of 16 dishes. When a category is selected the subtitle becomes "Top favourites in {category}". |
| **All Dishes** | "81 items available": the full grid. When a category is selected this becomes "{Category} · N items available". Empty categories show "No dishes in this category yet". |
| **Product card** | Image, rating badge (if rated), price, name, a subtitle that usually repeats the name, and an **Add to Order** button. Can also show badges: Best Seller, Popular, New, Best Value, Sold Out, Combo, Customizable, and dietary tags (Veg / Non-Veg / Jain / Egg). |
| **Add behaviour** | Simple items go straight into the cart. Items with size variants or add-ons open a customise bottom sheet. Combos with choice groups open the combo builder. |

### 5.3 Product detail (`/menu/:slug`)

| Element | Details |
|---|---|
| Back link | "Back to menu" |
| Tags | Dietary tag (Veg / Non-Veg) and a **Share product** button |
| Title and price | H1 name and price. A compare-at price and % discount show when set. |
| Size variants | "Size" options, each with its price difference ("· +₹X") |
| Main CTA | **Add to cart · ₹{price}**, repeated lower on the page. Disabled with "Sold Out" when unavailable. |
| Stats | Rating and order count; "Ready in ~X min"; "Delivery ~45 min" |
| Description | Usually just the name ("Tandoori Roti from Cafe Ajwa kitchen."); an optional chef's note |
| Meta chips | Serves N, portion grams, "Contains: Gluten / Dairy / Egg / Nuts / Shellfish" (allergens) |
| What's included | For combos, e.g. "Freshly prepared Familty meal · Served hot" |
| More from this category | "Guests often pair these together": same-category dishes sorted by popularity |
| Guest reviews | Average score, review count, 5→1 star breakdown, list of reviews (name, date and time, stars, comment). "Ratings & feedback · Tap to read what others loved". **Write review** button: requires sign-in, one review per customer, and reviews are approved by admin before showing. Empty state: "No reviews yet · Be the first to share your experience." |
| Error state | Unknown slug: "Something went wrong · Product not found · Try again" (should be a proper 404) |
| SEO | Title "Cafe Ajwa \| {Dish}"; description "Order {Dish} from Cafe Ajwa. Freshly prepared and customizable." |

### 5.4 Build your own combo (`/combo`)

- **Current state:** "Build your own combo isn't available right now. Please check back soon. You can still order our ready-made combos or any dish from the menu." Buttons: **See combos** (`/menu?category=combos`) and **Browse menu**.
- **When enabled by admin:** a list of buildable combos (image, name, description, price). Choosing one shows its **choice groups** ("Choose 2" or "Choose 1–3"), each item as a toggle, and a summary per group with a "Change" option. Validation messages: "Pick at least N for '{group}'" and "Pick at most N…". CTA: **Add combo · ₹{price}**.

### 5.5 About (`/about`)

| Section | Copy |
|---|---|
| Hero | Eyebrow "Our story" · H1 "Hyderabadi soul, Malwani kitchen" · "Cafe Ajwa brings restaurant-quality Hyderabadi cuisine, cafe favourites, and hand-plated desserts to Malwani, Malad West — customizable, freshly made, and delivered while it's still hot." · **Order now** |
| Where we began | "A kitchen built on warmth & craft": "Cafe Ajwa started with a simple belief: food should feel personal. Biryanis layered slow, combos made for sharing, and desserts finished by hand. From our kitchen in Malwani Colony, we've grown by word of mouth across Malad West and the western suburbs." |
| Kitchen philosophy | "Slow-cooked. Hand-plated. Fresh-sourced." Three pillars: **Slow-cooked depth** (small-batch biryanis and gravies) · **Hand-plated precision** (finished by hand, packed to travel) · **Fresh-sourced daily** (prep to order, nothing from a freezer line) |
| The people | "Cooks, pass, & the crew behind it": small team of cooks, plating staff and riders; "we take pride in remembering our regulars and their favourites." |
| By the numbers | "Trusted across Malad West": 15K+ orders · 4.8★ · 45 min · 100% made to order. Closing line: "…we cook it the same way we'd serve our own family." |
| Visit us | Address, **Get directions**, hours, **Explore the menu**, **Get in touch** |

All About copy is editable from the admin CMS.

### 5.6 Contact (`/contact`)

| Section | Content |
|---|---|
| Hero | Eyebrow "Malwani kitchen" · H1 "Say hello. We're listening." · "Questions, feedback, or delivery help — we usually reply during kitchen hours. For catering or large orders, use Bulk order." · **Call now** · **WhatsApp** |
| Reach us | "Pick a line. We'll pick up." Three channel cards: **Phone** ("Call the kitchen") · **WhatsApp** ("Fastest reply") · **Email** ("For longer notes") |
| Kitchen hours | Hours, services, cut-off note |
| Visit us | Address and **Open in Google Maps** |
| **Contact form** ("Write to us / Send us a message") | Name\* · Phone · Email · **Topic** (General enquiry / Catering & events / Feedback / Partnership) · Message\*. A phone number or email is required ("Please add a phone number or email so we can reply."). Success: "Message sent · Thanks for reaching out… will respond during kitchen hours" with "Send another message". Submissions go to the admin **Leads** inbox. |
| Find us | "Malwani, Malad West", delivery copy, embedded Google Map |

### 5.7 Bulk order (`/bulk-order`)

The page is styled like a "kitchen pass" ticket.

| Section | Content |
|---|---|
| Header | "Kitchen pass · Bulk order · Malwani" · H1 "Bulk order Cafe Ajwa" · "Office lunches, events, or large family orders across Malwani and nearby neighbourhoods." · **Call** · **WhatsApp** · a ticket number (`PASS-DDMMYY`) generated from today's date · "Station · Catering desk" |
| What helps us quote faster | Headcount (guests or portions) · Timing (date and service window) · Menu (biryani, combos, desserts) · Service (pickup or delivery) |
| **Form** ("Tell us what you need") | Name\* · Phone\* · Estimated quantity\* ("e.g. 50 plates / 20 kg") · Preferred date (date picker) · Delivery or pickup (Delivery / Pickup / Undecided) · Requirements (free text) · expandable optional fields: Email, Company / organisation. CTA **Request bulk order**. |
| Success | "Bulk order request received · Thanks — our team will review your quantity and requirements and follow up shortly." · "Submit another request" |
| Footer note | Kitchen description and a link to Contact |

Submissions go to the admin **Leads** inbox (type "Bulk Orders"; statuses New / Contacted / Closed).

### 5.8 Social / link-in-bio (`/social`)

A minimal page (logo, "Since 2001") with large link cards: **Swiggy · Zomato · Instagram · Facebook · Website · Maps**. Probably meant for the Instagram bio. Not linked anywhere on the site and has no canonical tag.

### 5.9 Auth landing pages
- **Verify email** (`/auth/verify-email?token=…`): "Verifying your email…", then success ("You're signed in — taking you to your account") or failure (invalid/expired link). Buttons: Go to home / Back to sign in / Continue to account.
- **Reset password** (`/auth/reset-password?token=…`): New password + Confirm password (show/hide), **Update password**. Handles invalid and expired links.

### 5.10 404
"404 · We couldn't find that page." with **Go home**.

---

## 6. End-to-end ordering flow

```
Browse (Home / Menu / Search / Chatbot)
  → Add to cart (simple add, or variant/add-on sheet, or combo builder)
  → Cart drawer → Checkout
  → [Not signed in] Sign-in modal (email/password or Google) → back to checkout
  → [First order] Phone verification (SMS OTP)
  → Choose Delivery or Pickup
  → Address (delivery) → Coupon → Reward points → Payment method
  → Place order → [Online] Razorpay → Success page
  → Track order → Receipt / Reorder / Rate / Cancel (while still "Placed")
```

### 6.1 Checkout page (`/checkout`)

| Block | Behaviour |
|---|---|
| **Order type** | Delivery / Pickup toggle |
| **Deliver to** | Default saved address with Change / Add / Edit. "Usually delivered in N min". Errors: "Add a delivery address to continue", "This address needs a map pin…", "Selected address is outside delivery area.", "Delivery is temporarily unavailable.", "Minimum order for delivery is ₹X." |
| **Address form** (shared with account) | Google Maps picker: "Search your area", **Use current location**, drag/drop pin, reverse-geocoded area. Checks the pin is inside the delivery radius ("This location is outside our N km delivery area") and shows the fee for that spot ("Free delivery" / "Delivery ₹X"). Fields: Label (Home / Work / Other / custom, e.g. "Mom's place"), Area (from pin), Building, floor & house no.\*, City\*, Pincode\* (6 digits), Delivery instructions (optional), Set as default. Manual entry if the map fails to load. |
| **Delivery instructions** | "Delivery note: gate code, floor, landmark" |
| **Coupons** | Type a code or pick from "Choose a coupon" (active coupons list, "View all"). One coupon per order. Coupons can have a minimum order, be first-order only, or give free delivery. Shows "Saving ₹X" or "Saving ₹X · free delivery". |
| **Reward points** | "Use reward points · {points}" toggle |
| **Payment** | **Pay online with Razorpay** · **Cash on delivery** · **Pay at pickup**. If online payment isn't configured: "Online payments are not configured. Please choose Cash on Delivery…" |
| **Order summary** | Items, Subtotal, coupon discount, Loyalty points, **Delivery fee**, **Platform fee**, **Service charge**, Taxes (GST, either included in prices or added on top, set by admin), Round off, **Total** |
| **Place order** | "Place order · ₹X" (or "You'll complete payment next") |
| **Phone verification** (first order only) | Bottom sheet "Verify your phone · We need a verified mobile number before placing your first order." Country code (India, UAE, Saudi Arabia, US, UK) and number, then "Send code", then **4-digit SMS code**, with resend timer and "Change number". Once verified, the phone number can't be edited in the profile. |
| **Razorpay states** | "Secure checkout for order …" → Processing payment ("Please do not close this window.") → Payment successful / Payment failed (Try again). Edge case: "We could not confirm your payment. Please contact us before paying again." |

Orders are sent with an idempotency key so the same order can't be created twice.

### 6.2 Order confirmation (`/checkout/success/:orderId`)
"Order placed", order number, payment label (Paid online / Online payment / Cash on delivery / Pay at pickup), "Usually delivered in …", delivery address or "Pickup from Cafe Ajwa — Malwani", "Total · ₹X", **Track order**, **Back to menu**.

### 6.3 Order statuses (what customers see)

| Internal status | Customer label |
|---|---|
| placed | Order placed / Order received |
| accepted, preparing | Accepted + Preparing |
| ready | Prepared (pickup) / Prepared + Out for delivery (delivery) |
| out-for-delivery | Prepared + Out for delivery |
| delivered | Delivered |
| cancelled | Cancelled |

The timeline shows 4 steps: **Placed → Accepted → Prepared → Delivered**. The ETA countdown defaults to 30 minutes after the order was placed, then shows "Arriving soon".

### 6.4 Order detail (`/orders/:orderId`)
- Status timeline and ETA; cancelled banner if cancelled
- **Bill details:** Subtotal, reward points used, delivery, round off, taxable amount, taxes (GST), total payable / grand total
- **Order info:** order #, status, order type, payment, items, address (or "Address not available")
- **Actions:** Call · **Receipt** (PDF download) · Help · **Reorder** (asks "Replace your cart?") · **Rate** ("Choose a product from this order to review") · **Cancel order** (only while *Placed*; "This action cannot be undone") · refund status if any

---

## 7. Customer account area

Account pages use a shared layout with sub-navigation and a support card: "Need help with an order? Our team is here to help with delivery, payments, or anything else."

| Page | Features |
|---|---|
| **Profile** | Personal details: Full name, Email, Phone ("Verified at checkout. Can't be edited."), **Save changes**. **Linked accounts:** Google (Link / Unlink, "Sign in faster"). **Change password:** current, new (8+ characters), confirm. **Sign out.** **Delete account:** "This signs you out and deactivates your account. Order history is kept. You can register again with the same email as a new account." |
| **Orders** | Stats: Total orders · Total spent · Reward points. Groups: **Active orders**, **Upcoming orders**, **Past orders** (View all → history). Each order card has Call / Contact / Reorder actions. Empty state: "No orders yet… Browse menu". |
| **Order history** | "All past orders" (delivered and cancelled), **Load more** pagination. |
| **Addresses** | List with a Default badge · Set default · Edit · Delete ("Remove {label} from your saved addresses?") · **Add new address** (same map form as checkout). Empty state: "No addresses saved · Add a delivery address for faster checkout." |
| **Loyalty** (`/account/wallet` redirects here) | Points balance and its ₹ value. **How to earn:** "Get N points for every ₹100 spent on delivered orders." **How to use:** "1 point = ₹X, up to Y% of your order", with an optional minimum order. **Points history:** Earned from order · Used on order · Referral reward · Review reward · Points returned. Can be paused by admin ("Loyalty rewards are paused right now."). |
| **Referrals** | "Your referral code" (Copy) · "Share with friends" (native share: "Use my code {CODE} at Cafe Ajwa and get N reward points on your first order.") · "You get N" · Friends rewarded count · **Have a friend's code?** (Apply; "Apply it before your first delivered order."). Can be paused by admin. |
| **Notifications** | Order-update notifications, unread state, **Mark all read**. Empty state: "All caught up · Your order updates will show here." |

---

## 8. Ajwa Assistant (chatbot)

Opened from the headset icon. Header: "Ajwa Assistant · Online · typically replies instantly". It is a **scripted, button-driven bot, not an AI**. Typing is only enabled for the "Leave a message" support flow (footer: "Pick an option above · typing only for support messages"). Every conversation is logged to the backend for admin analytics.

**Welcome:** "Hi! Welcome to Cafe Ajwa. I can help with orders, the menu, delivery, offers, and more — pick an option below."

| Option | What happens |
|---|---|
| **Track My Order** | Signed out: asks the user to sign in. Signed in: lists the last 5 orders ("{order no.} · {status}"). Choosing one shows status, type and total, with **Refresh status**, **View full order**, and **Cancel this order** (only while Placed, with a confirmation step). |
| **Browse Menu** | Buttons: Full menu · Build a combo · the first 8 categories (each opens the menu filtered to that category) |
| **Delivery Information** | Delivery summary, hours, cut-off note, pickup address |
| **Order Help** | Track an order · Cancel an order · Talk to the restaurant |
| **Offers & Deals** | Lists up to 5 live CMS promos (with % off), or "There are no promo deals listed right now…" |
| **Restaurant Information** | About subtitle, branch, address, hours, phone |
| **FAQs** | "What are your hours?" · "Where do you deliver?" · "Can I pick up an order?" · "How do I reach you?". Answers are built from CMS data. |
| **Contact Us** | WhatsApp · Call · Contact page · **Leave a message** (free-text message sent to the team as a lead) |

Every reply also offers **Main menu** and **Contact us**.

---

## 9. Menu catalogue

**81 live dishes across 20 categories, of which 9 are empty.** Prices in ₹ at the time of review.

| Category | Items | Notes |
|---|---|---|
| Combos *(items flagged as combos)* | 1 | Only "Familty meal" |
| Mutton Starters | 2 | Includes "Familty meal" (a test product) |
| Fish & Prawns Starter | 0 | Empty, but shown on Home |
| Indian Starters | 11 | |
| Indian Main Course | 22 | Mixes chicken, paneer and Indo-Chinese gravies |
| Mutton Main Course | 0 | Empty, but shown on Home |
| Veg Main Course | 15 | |
| Sea Food Main Course | 0 | Empty, but shown on Home |
| Egg Dishes | 0 | Empty, but shown on Home |
| Indian Breads | 3 | |
| Raita & Papad | 0 | Empty, but shown on Home |
| Chinese Starters | 4 | All paneer |
| Biryani & Pulav | 8 | Also contains khichdi and plain rice |
| Rice | 7 | Fried rice |
| Noodles | 3 | |
| Soup | 2 | |
| Pizza & Sandwiches | 0 | Empty |
| Falooda & Shake | 0 | Empty |
| Ice Cream | 0 | Empty |
| Combo | 4 | The real ₹399–₹449 combos |

### Full item list

**Mutton Starters**
- Familty meal — ₹1,000 *(flagged combo; description "Test")*
- Mutton Kalimiri (8PCS) — ₹620

**Indian Starters**
- Chicken Schezwan Tikka — ₹260
- Chicken Pahadi Kabab — ₹320
- Chicken Butter Garlic — ₹380
- Chicken Barra Tandoori Full — ₹470
- Chicken Seekh Kabab (4 Pcs) — ₹230
- Lollipop Masala Dry — ₹260
- Chicken Teryaki — ₹310
- Chicken Pakoda 1KG — ₹610
- Chicken Pakoda 500GM — ₹330
- Chicken Schezwan Tandoori Full — ₹470
- Chicken Tikka Dry — ₹230

**Indian Main Course**
- Chicken Kadai (BONE) — ₹220
- Chicken Pahadi Tawa — ₹280
- Chicken Chilli Gravy — ₹220
- Chicken Kung Pao — ₹290
- Chicken Banajara Kabab Masaka — ₹240
- Chicken Kolhapuri — ₹240
- Paneer Butter Garlic — ₹320
- Paneer BBQ — ₹280
- Chicken Lucknowi — ₹240
- Chicken Akbari — ₹250
- Chicken 65 Gravy — ₹230
- Paneer 65 Gravy — ₹260
- Paneer Chilli Gravy — ₹260
- Chicken Banjara Tawa — ₹280
- Chicken Dhamaka (2 Gravy) — ₹310
- Chicken Begum Bahar — ₹280
- Chicken Nargis — ₹250
- Chicken Chingari — ₹250
- Chicken Harabara — ₹250
- Chicken Mumtaz — ₹240
- Chicken Tawa — ₹240
- Chicken Afghani — ₹220

**Veg Main Course**
- Chana Masala — ₹110
- Aloo Mutter — ₹110
- Paneer Angara — ₹270
- Paneer Cheese Garlic Tawa — ₹280
- Paneer Lasaniya — ₹270
- Paneer Tawa — ₹270
- Paneer Tiranga (3 Gravy) — ₹490
- Veg Kaju Curry — ₹280
- Mix Veg — ₹110
- Paneer Shahi Korma — ₹240
- Veg Jaipuri — ₹180
- Veg Makhanwala — ₹180
- Paneer Bhurji — ₹280
- Paneer Chatpata — ₹270
- Paneer Tikka Masala — ₹240

**Indian Breads**
- Tandoori Roti — ₹15
- Tandoori Naan — ₹45
- Tandoori Butter Paratha — ₹45

**Chinese Starters**
- Paneer Crispy — ₹290
- Paneer Garlic Dry — ₹270
- Paneer Manchurian Dry — ₹260
- Paneer Chilly Dry — ₹260

**Biryani & Pulav**
- Dal Khichdi Tadka — ₹160
- Veg Biryani — ₹170
- Paneer Biryani — ₹210
- Jeera Rice Full — ₹130
- Steam Rice Full — ₹90
- Dal Khichdi — ₹150
- Paneer Pulav — ₹210
- Chicken Pulao — ₹180

**Rice**
- Chicken Hongkong Fried Rice — ₹200
- Chicken Ajwa SPL Rice — ₹230
- Chicken Singapore Fried Rice — ₹210
- Paneer Kepsa Rice Full — ₹810
- Prawns Fried Rice — ₹230
- Chicken Schezwan Fried Rice — ₹180
- Chicken Burnt Garlic Rice — ₹270

**Noodles**
- Veg Hakka Noodles Full — ₹170
- Egg Schezwan Hakka Noodles Full — ₹190
- Veg Schezwan Hakka Noodles Full — ₹180

**Soup**
- Chicken Hot-N-Sour Soup — ₹120
- Chicken Garlic Soup — ₹140

**Combo**
- Chicken Hakka Noodles Combo — ₹399
- Chicken Biryani Combo — ₹399
- Butter Chicken Combo — ₹449
- Chicken Fried Rice Combo — ₹399

**Menu-page "Popular Picks" (16):** Tandoori Roti, Tandoori Naan, Chana Masala, Chicken Kadai (BONE), Chicken Schezwan Tikka, Chicken Pahadi Tawa, Chicken Chilli Gravy, Chicken Kung Pao, Chicken Banajara Kabab Masaka, Aloo Mutter, Chicken Pahadi Kabab, Chicken Butter Garlic, Chicken Barra Tandoori Full, Chicken Kolhapuri, Paneer Angara, Paneer Cheese Garlic Tawa.

**Home "Best sellers" (8):** the first 8 of the list above.

Product URLs use the pattern `/menu/<slugified-name>`, e.g. `/menu/chicken-kadai-bone`.

---

## 10. Product data model

These are the fields the site can show for a dish. Most are not filled in for current products, but the redesign should allow for all of them.

| Field | Used for |
|---|---|
| name, slug, price | Cards, detail page, URL |
| compare-at price / discount % | Strikethrough price on the detail page |
| category | Filtering, "More from this category" |
| dietary | Veg · Non-Veg · Jain · Egg |
| badges | Featured · Best Seller · Popular · New · Best Value · Combo · Customizable · Sold Out |
| availability | Sold out disables Add |
| description, chef note | Detail page |
| serves, portion grams | Meta chips ("Serves 1 · ~250g") |
| prep time (min) | "Ready in ~X min" |
| allergens | Dairy · Gluten · Egg · Nuts · Shellfish |
| variants (size) | Size selector with price difference |
| add-ons | Customise sheet |
| combo: fixed items | "What's included" / "Includes: …" |
| combo: choice groups (min/max) | Build-your-own combo |
| rating, review summary | Stars, average, breakdown |
| order count | Social proof ("11 orders") and popularity sorting |
| image(s) | Gallery (multiple images supported: "View image N") |

---

## 11. Platform, backend and admin capabilities

### 11.1 Front-end stack (from the production bundle)
- React single-page app built with Vite, React Router, lazy-loaded page chunks
- Tailwind CSS utility classes; Swiper (carousels); GSAP (animations)
- Google Identity Services (Google sign-in)
- Google Maps JavaScript + Places (address search, pin drop, delivery radius check)
- Razorpay (online payments)
- libphonenumber (phone input and validation)
- jsPDF + autotable (downloadable receipts)
- PWA manifest (installable, standalone, portrait)

### 11.2 Backend API (`https://api.cafeajwa.co/api/v1`)
Bearer-token auth, `Idempotency-Key` header on order creation, and an `X-Branch-Id` header, so the system is ready for **multiple branches** (only "Malwani" is live).

| Area | Capabilities |
|---|---|
| Branch settings | Store open/closed status, delivery settings (radius, fees, minimum order), cart settings, general settings, site content (CMS), GST settings, rewards settings, address serviceability check |
| Catalogue | Products, categories |
| Customer auth | Register, login, Google, verify email, resend verification, forgot/reset/change password, logout, me, delete account, link/unlink Google |
| Phone | Send / verify / resend OTP |
| Customer data | Profile, addresses (CRUD, set default), wallet and referral, coupons (validate, list active), reviews (featured, per product, mine), notifications (read, read-all) |
| Orders | List, summary, create, detail, advance, cancel |
| Payments | Create intent, confirm, retry |
| Leads | Contact and bulk-order submissions |
| Chatbot | Conversations, events, escalation |
| Public CMS | Hero slides and promos |

### 11.3 Admin panel (staff only, in the same app under a hidden route)
From the admin API, staff can manage:
- **Orders:** list, detail, status changes; **Refunds**
- **Kitchen:** KOTs (kitchen order tickets: bulk, status, reprint), **printers, stations, print routes, print agents, print jobs** (retry/cancel), print settings
- **Invoices:** reprint, PDF
- **Catalogue:** products, categories
- **Customers:** list, detail, activate/deactivate
- **Marketing:** coupons, CMS hero slides, CMS promos, file uploads
- **Reviews:** approve / reject / delete
- **Leads:** contact and bulk-order enquiries
- **Chatbot:** analytics and conversation logs
- **Reports:** reports and summary

> The admin panel only hides its location; the route can be found in the public JavaScript bundle. Make sure every admin endpoint is protected on the server. A Google Maps browser key is also embedded (normal for Maps JS); check it is limited to the cafeajwa.co domain.

---

## 12. SEO and technical setup

| Item | Current state |
|---|---|
| Rendering | Client-side only. The raw HTML is an empty `<div id="root">` with the title "Cafe Ajwa". All content, titles and meta tags are added by JavaScript. |
| Page titles | Set by JS: "Cafe Ajwa \| Home", "\| Menu", "\| About Us", "\| Contact Us", "\| Bulk Orders", "\| Combos", "\| Connect", "\| {Dish}" |
| Meta descriptions | Set by JS (editable in the CMS): Home "Freshly made. Customizable. Delivered hot."; Menu "Explore Cafe Ajwa's freshly prepared menu and customize your order."; About "Learn about Cafe Ajwa, our food, and our commitment to serving fresh meals."; Contact "Contact Cafe Ajwa for location, opening hours, and order assistance."; Bulk "Plan a bulk food order with Cafe Ajwa for gatherings and special occasions."; Combo "Build and order a customizable Cafe Ajwa meal combo."; Social "Order, follow, and visit Cafe Ajwa — Swiggy, Zomato, Instagram, and more." |
| Canonical | Set per page (missing on /social) |
| Open Graph / Twitter | og:title and og:description per page; **og:image is the favicon SVG** (poor link previews); twitter:card = summary |
| Structured data | **None** (no Restaurant, Menu, LocalBusiness or Product JSON-LD) |
| sitemap.xml | 6 URLs only; no product pages |
| robots.txt | Allow all, points to the sitemap |
| PWA | Manifest present (name, icons 192/512, standalone, portrait, theme/background colours) |
| Analytics | No analytics or tag-manager script found in the page |
| Error handling | Unknown product slugs show a "Something went wrong" error instead of a 404 |

---

## 13. Content and data issues found

### Placeholder / template leftovers
1. **Social-proof ticker** advertises dishes that aren't sold: Truffle Pasta, Cold Brew, Berry Cheesecake, Butter Croissant, Iced Matcha Latte, Avocado Toast. The numbers look made up.
2. **Search suggestions** (Pasta, Cold brew, Matcha, Croissant, Cheesecake) and the placeholder ("drinks, desserts") return nothing.
3. **Home hero "baklava" slide** links to `/menu/baklava-assortment`, which shows "Product not found". The code also has fallback slides for lotus cheesecake, falafel, margherita pizza and salad.
4. **"Familty meal"**: typo in the name, description is "Test", priced at ₹1,000, filed under *Mutton Starters*, and it is the only item in the Home "Combo meals" section.
5. About-page image alt text mentions "Wood-fired pizza", which isn't on the menu.

### Brand and positioning mismatches
6. The site sells itself as **Hyderabadi cuisine, slow-layered biryanis, and hand-plated desserts**, but the menu has no standalone chicken or mutton biryani (only Veg/Paneer Biryani and a Chicken Biryani Combo) and **no desserts** (Falooda & Shake and Ice Cream are empty). Bulk order also promises "Biryani, combos, desserts".
7. Name spelled differently in different places: "Cafe Ajwa", "Café Ajwa", header logo alt text **"Café Aiwa"**, Swiggy/Zomato "Cafe Ajwaa". The Instagram handle uses "malvani" while the site says "Malwani".
8. Claims that may need checking: "Since 2001", "15K+ orders", "4.8★ average rating", while the site shows 1 review in total and dishes with about 11 orders.
9. Delivery copy says "across Mumbai" and "select western Mumbai neighbourhoods", but the only zone listed is "Malwani".

### Menu structure problems
10. **9 of 20 categories are empty**, and 5 of them are shown on the Home page "Browse by craving" grid, leading to dead ends.
11. **Two combo categories**: "Combos" (1 item, the test product) and "Combo" (the 4 real combos). The Home "Combo meals" section shows the wrong one.
12. Items in odd categories: khichdi, jeera rice and steamed rice under *Biryani & Pulav*; Indo-Chinese gravies (Kung Pao, Chilli Gravy) under *Indian Main Course*; paneer dishes split between *Indian Main Course* and *Veg Main Course*; Prawns Fried Rice under *Rice* while the seafood categories are empty.
13. Spelling and consistency: "Banajara Kabab Masaka", "Teryaki", "Chilly" vs "Chilli", "Pulav" vs "Pulao", "(BONE)" in capitals, inconsistent "Full" / "1KG" / "500GM" naming (these should be size variants, not separate products).
14. **Descriptions are empty**: card subtitles repeat the dish name, and detail pages say "{Name} from Cafe Ajwa kitchen." Variants, add-ons, allergens and portion sizes are mostly unused.
15. `/combo` (build-your-own) is in the sitemap and has an SEO description, but the feature is turned off.

### UX / navigation gaps
16. **About** is not in the header nav (footer only).
17. `/social` is a separate, unlinked page.
18. The chatbot looks like live chat (headset icon, "Online · typically replies instantly") but is a scripted menu.
19. Fallback contact details in the code (landline, `hello@cafeajwa.com`) differ from the live ones.

---

## 14. Redesign considerations (functional)

Things the redesign should keep, fix or decide on, regardless of visual direction:

**Keep (already built and working)**
- Full ordering: cart, delivery/pickup, map-pin addresses with radius-based fees, coupons, loyalty points, referrals, Razorpay/COD/pay-at-pickup, phone OTP, GST handling
- Account area: order tracking, reorder, PDF receipts, reviews, notifications, saved addresses
- CMS-driven content (hero, promos, About copy, contact, hours, SEO text)
- Lead capture (contact and bulk) going into the admin inbox
- Kitchen tools (KOT printing, invoices, reports): any front-end change must not break the order data these rely on

**Fix or decide on**
- **Menu information architecture:** merge or remove empty and duplicate categories, re-file misplaced items, turn "Full/Half" and "500GM/1KG" into size variants, write real descriptions, fill in allergens, serves and prep time.
- **Brand story vs menu:** either bring back Hyderabadi biryani and desserts or rewrite the positioning to match what is sold (North Indian, tandoor and Indo-Chinese).
- **Remove placeholder content:** the ticker, search suggestions, baklava slide and test product.
- **Trust signals:** back up the claims (rating, orders, "Since 2001") or link to real Swiggy/Zomato/Google ratings; ask for more reviews.
- **SEO:** pre-render or server-render pages, add Restaurant/Menu/Product structured data, put product URLs in the sitemap, use a real share image, return a proper 404 for unknown products.
- **Navigation:** add About to the header and decide whether `/social` stays separate.
- **Combo builder:** launch it or remove its route, sitemap entry and links.
- **Delivery zones:** list the actual areas or show a pincode/address checker up front.
- **Chatbot:** make clear it is a help menu, or connect real chat (WhatsApp hand-off is already available).
- **Store status:** the API reports open/closed status; the redesign should handle "closed" and "delivery paused" states clearly.
