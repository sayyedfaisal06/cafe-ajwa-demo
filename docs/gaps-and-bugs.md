# Cafe Ajwa — Missing Features and Bugs

> **Site:** https://www.cafeajwa.co
> **Checked:** 24 Nov 2026, signed out, in desktop (1440px) and mobile (390px) Chrome
> **Related:** [current-website.md](current-website.md) · [redesign-plan.md](redesign-plan.md)

**How to read this file**

| Label | Meaning |
|---|---|
| ✅ Confirmed | Reproduced on the live site |
| 🔍 From code | Seen in the site's public JavaScript, not reproduced in the browser |
| **High** | Misleads customers, loses orders, or damages trust |
| **Medium** | Hurts usability, SEO or data quality |
| **Low** | Cosmetic or minor |

No JavaScript errors or failed network requests appeared while loading Home, Menu, a product page, About, Contact or Bulk order.

---

## Part 1 — Bugs

### High

| ID | Bug | How to see it | Expected | Status |
|---|---|---|---|---|
| B1 | **Fake "people ordered" ticker.** The strip at the top of every page says "93 people ordered Truffle Pasta today", "40 people ordered Cold Brew this hour", "27 people ordered Berry Cheesecake", "112 people ordered Butter Croissant today", "18 people ordered Iced Matcha Latte", "65 people ordered Avocado Toast". None of these dishes are on the menu, and the numbers are a fixed list written into the code. | Open any page | Remove it, or show real data | ✅ Confirmed (hard-coded in the code) |
| B2 | **Home hero slide links to a dish that doesn't exist.** The "baklava" slide's **See More** goes to `/menu/baklava-assortment`. | Home → wait for the "baklava" slide → See More | Only real dishes in the hero | ✅ Confirmed: shows "Something went wrong · Product not found" |
| B3 | **Test product is live and can be ordered.** "Familty meal", ₹1,000, description "Test". Its "What's included" shows generic filler ("Freshly prepared Familty meal · Served hot"). It is filed under *Mutton Starters*. | `/menu/familty-meal`, or Menu → Mutton Starters | Removed, or replaced with a real family combo | ✅ Confirmed |
| B4 | **Home "Combo meals" shows the test product instead of the real combos.** Only "Familty meal" appears. The 4 real combos (Chicken Hakka Noodles, Chicken Biryani, Butter Chicken, Chicken Fried Rice, ₹399–₹449) are missing from the section. | Home → Combo meals | Shows the 4 real combos | ✅ Confirmed |
| B5 | **"See combos" link goes to the wrong category.** On `/combo`, the **See combos** button opens `/menu?category=combos`, which lists only the test product ("Combos · 1 item available"). The real combos are in a different category called "Combo". | `/combo` → See combos | Shows the 4 real combos | ✅ Confirmed |

### Medium

| ID | Bug | How to see it | Expected | Status |
|---|---|---|---|---|
| B6 | **Home page links to empty categories.** 5 of the 10 "Browse by craving" tiles (Fish & Prawns Starter, Mutton Main Course, Sea Food Main Course, Egg Dishes, Raita & Papad) open "0 items available · No dishes in this category yet". | Home → Browse by craving → Fish & Prawns Starter | Only show categories that have dishes | ✅ Confirmed |
| B7 | **9 of 20 menu categories are empty** but still shown as filter chips: Fish & Prawns Starter, Mutton Main Course, Sea Food Main Course, Egg Dishes, Raita & Papad, Pizza & Sandwiches, Falooda & Shake, Ice Cream (and "Combos" holds only the test product). | Menu → tap any of these chips | Hide empty categories | ✅ Confirmed |
| B8 | **Two combo categories:** "Combos" (1 test item) and "Combo" (4 real items). | Menu category chips | One "Combos" category | ✅ Confirmed |
| B9 | **Search suggestions return nothing.** "Try searching" chips are Biryani, Pasta, Cold brew, Matcha, Croissant, Cheesecake. Only Biryani is on the menu. The placeholder also says "Search biryani, drinks, desserts…" but no drinks or desserts are sold. | Search → tap "Pasta" | Suggestions based on real dishes | ✅ Confirmed |
| B10 | **Search has no typo tolerance.** "biriyani" → "No matches"; "panner" → "No matches". Exact spellings work ("kolhapuri" → 1 result). These are common Indian spellings. | Search → type "biriyani" | Show Biryani results | ✅ Confirmed |
| B11 | **Missing product shows an error instead of a "not found" page.** Any unknown dish URL shows "Something went wrong · Product not found · **Try again**". Trying again can't help, and there's no link to search or popular dishes. | `/menu/not-a-dish` | Proper "dish not found" page with a way back to the menu | ✅ Confirmed |
| B12 | **Every URL returns HTTP 200, even pages that don't exist** (`/doesnotexist`, `/menu/not-a-dish`, `/menu/baklava-assortment`). Google treats these as real pages ("soft 404s"). | `curl -I https://www.cafeajwa.co/doesnotexist` | HTTP 404 for unknown pages | ✅ Confirmed |
| B13 | **Link previews have no image.** The share image (`og:image`) on every page is `favicon.svg`. WhatsApp, Facebook and Instagram don't show SVG previews, so shared links appear without a picture. | Share any page link on WhatsApp | A proper 1200×630 JPG/PNG image (dish photo on dish pages) | ✅ Confirmed (tag value) |
| B14 | **Wrong fallback contact details in the code.** If the content API is slow or fails, the site falls back to `022 2888 8120` and `hello@cafeajwa.com` instead of the real +91 91675 92758 / cafeajwa08@gmail.com. First-time visitors are most likely to see it, because the real details are cached in the browser only after a successful load. | Not reproduced | Fallback values match the real ones | 🔍 From code |
| B15 | **Chatbot pretends to be live chat.** Header says "Ajwa Assistant · Online · typically replies instantly", and the button is a headset icon, but it's a fixed button menu and typing is disabled. | Tap the headset icon | Present it as a help menu, or hand off to a person | ✅ Confirmed |
| B16 | **Dish descriptions are placeholders.** Card subtitles repeat the dish name ("Tandoori Roti / Tandoori Roti"). Detail pages say "{Name} from Cafe Ajwa kitchen." | Any product card or page | A real 1–2 line description | ✅ Confirmed |
| B17 | **Every dish page's SEO description says "customizable"** ("Order {dish} from Cafe Ajwa. Freshly prepared and customizable."), but no dish currently has options. | View page source/meta on any dish | Accurate description | ✅ Confirmed |
| B18 | **Disabled feature still advertised.** `/combo` (build-your-own) is in `sitemap.xml` with the description "Build and order a customizable Cafe Ajwa meal combo", but the page says it isn't available. | `/combo` | Remove it from the sitemap, or launch it | ✅ Confirmed |
| B19 | **Delivery times don't match.** Home says "35–45 min typical ETA", About says "45 min", dish pages say "Delivery ~45 min", and the order tracker counts down from **30 min** after placing an order. | Compare pages; tracker in code | One consistent estimate | ✅ Confirmed / 🔍 tracker from code |

### Low

| ID | Bug | Where | Status |
|---|---|---|---|
| B20 | Header logo alt text is **"Café Aiwa"** (typo). Screen readers and image search read it. | Header | ✅ Confirmed |
| B21 | Grammar: "5.0 · **1 reviews**". | Product page → Guest reviews | ✅ Confirmed |
| B22 | Dish name typos and inconsistencies: "Familty meal", "Chicken Banajara Kabab Masaka", "Chicken Teryaki", "Chilly" vs "Chilli", "Pulav" vs "Pulao", "(BONE)" in capitals, sizes in names ("500GM", "1KG", "Full"). | Menu | ✅ Confirmed |
| B23 | Dishes filed in the wrong categories: khichdi, jeera rice and steamed rice under *Biryani & Pulav*; Indo-Chinese gravies (Kung Pao, Chilli Gravy) under *Indian Main Course*; paneer dishes split across two categories; Prawns Fried Rice under *Rice* while the seafood categories are empty. | Menu | ✅ Confirmed |
| B24 | Sizes set up as separate products (Chicken Pakoda 500GM and 1KG) instead of one dish with size options, although the site supports size options. | Menu | ✅ Confirmed |
| B25 | An invalid category in the URL (`/menu?category=bogus`) silently shows the whole menu with no message. | Menu | ✅ Confirmed |
| B26 | About page image alt text describes "wood-fired pizza", which isn't on the menu. | About | ✅ Confirmed |
| B27 | `/social` has no canonical tag and isn't linked from anywhere on the site. | `/social` | ✅ Confirmed |
| B28 | Demo/sample product data (made-up dishes, "ordered today" counts, chef notes) is bundled into the live site's code. It isn't shown, but it's dead weight and is where the fake ticker items came from. | Site JavaScript | 🔍 From code |
| B29 | The home page's main heading (H1) is just "Cafe Ajwa": no description of what or where it is, which is weak for SEO. | Home | ✅ Confirmed |

### Content that is inaccurate or unproven (not code bugs, but should be fixed)

| ID | Issue | Where |
|---|---|---|
| C1 | The site describes "Hyderabadi cuisine", "biryanis layered slow" and "hand-plated desserts", but there's no standalone chicken/mutton biryani (only Veg, Paneer and a Chicken Biryani Combo) and **no desserts** at all. | About, Bulk order, Home |
| C2 | Bulk order lists "Biryani, combos, desserts" as the menu. | Bulk order |
| C3 | "4.8★ average guest rating", while the site has **1 review** in total. | About |
| C4 | "15K+ orders delivered", while the first dish in Popular Picks (Tandoori Roti) shows "11 orders". | About |
| C5 | "Since 2001", while the story says the business "grew by word of mouth"; needs confirming. | Home, About, /social |
| C6 | "In-house delivery across… select western Mumbai neighbourhoods" and "ETA across Mumbai", but the only zone listed is **Malwani**. | Home, Contact |
| C7 | Name spelled differently in different places: "Cafe Ajwa", "Café Ajwa", "Café Aiwa" (logo alt text), "Cafe Ajwaa" (Swiggy/Zomato). Instagram handle uses "malvani", the site uses "Malwani". | Site-wide, listings |

### Security items to verify (not confirmed problems)

| ID | Item | Why |
|---|---|---|
| S1 | The staff admin panel's location can be read from the public JavaScript. | Normal for this kind of app, but every admin API endpoint must check staff login on the server. Worth confirming with the developer. |
| S2 | A Google Maps API key is included in the public JavaScript. | Normal for Google Maps, but the key must be restricted to cafeajwa.co in Google Cloud, or others can use it at your cost. |

---

## Part 2 — Missing features

### 2.1 Trust and legal

| Feature | Notes |
|---|---|
| **Privacy policy** | None. The site collects names, emails, phone numbers, addresses and location, and uses Google sign-in. |
| **Terms & conditions** | None. |
| **Refund & cancellation policy** | None. Customers pay online via Razorpay; payment providers and customers expect one. |
| **FSSAI licence number** | Not shown anywhere (normally shown by food businesses in India). |
| **External ratings** | No Google, Zomato or Swiggy rating or review link shown, so the "4.8★" claim is unsupported. |
| **Review volume** | Reviewing works, but there is only 1 review; no visible prompt that brings customers back to review. |

### 2.2 Finding the site (SEO) and measuring it

| Feature | Notes |
|---|---|
| **Pages readable without JavaScript** | The raw HTML is empty; all content, titles and descriptions load via JavaScript. Search engines and link previews see very little. |
| **Structured data** | No Restaurant / Menu / Dish / Rating data for Google. |
| **Dish and category pages in the sitemap** | Sitemap lists 6 pages; none of the 81 dish pages. |
| **Category pages with their own URL** | Categories are only `?category=` filters, not indexable pages. |
| **Proper 404 handling** | See B11, B12. |
| **Analytics** | No analytics or tracking found, so there's no data on visitors, conversions or drop-off. |

### 2.3 Ordering

| Feature | Notes |
|---|---|
| **Guest checkout** | An account is required to order. |
| **Phone-number (OTP) login** | Sign-in is email + password or Google only. The phone OTP is only used to verify the number at first checkout. |
| **Delivery area check before checkout** | Customers find out whether you deliver to them only at checkout. |
| **Delivery fee / free-delivery threshold in the cart** | Cart just says "Delivery and taxes are calculated at checkout." |
| **Scheduled orders / pre-order for later** | Not found. When closed, customers can't order ahead. |
| **Cooking instructions per dish** (e.g. "less spicy", "no onion") | Not available. Only a delivery note at checkout. |
| **Tipping the delivery rider** | Not available. |
| **Live rider location on a map** | Order tracking shows status steps and a countdown only. |
| **Rating the order/delivery experience** | Only individual dishes can be reviewed. |
| **Favourites / saved dishes** | Not available (there is "Order again" for past dishes). |
| **WhatsApp / SMS order updates** | Not seen in the site. Updates appear in the site's notifications page; email/SMS updates from the backend unknown. |
| **Dine-in / table QR ordering** | Not available (may not be needed). |
| **Table reservations** | Not available (may not be needed). |
| **Gift cards** | Not available. |

### 2.4 Built but not used (the site supports these; no content is set up)

These features exist in the code but every dish or setting leaves them empty. They can be switched on without a rebuild, mostly from the admin panel.

| Feature | Current state |
|---|---|
| Size options (Half/Full, 500 g/1 kg) | Supported, unused; sizes are separate products instead |
| Add-ons | Supported, unused |
| Spice level | Supported, unused |
| Calories | Supported, unused |
| Allergens | Shown on Tandoori Roti only ("Contains: Gluten") |
| Serves / portion size | Mostly "Serves 1" only |
| Chef's note | Supported, unused |
| Discount price (strikethrough) | Supported, unused |
| Badges (Best Seller, New, Best Value, Jain, Egg) | Supported, unused (only "Featured" and Veg/Non-Veg seen) |
| Offers & Deals carousel | Supported, no offers set up |
| Build-your-own combo | Built, switched off |
| Coupons | Supported; unknown whether any are active |
| Loyalty points and referrals | Built; may be paused by admin (couldn't check without an account) |
| Extra home sections ("Top rated", "Dishes to try") | In the code, not showing |

### 2.5 Menu content

| Missing | Notes |
|---|---|
| **Desserts** | Ice Cream and Falooda & Shake categories are empty, though the brand story promises desserts |
| **Drinks** | None at all (no shakes, juices, soft drinks, chai) |
| **Seafood, egg and mutton mains** | Categories exist but are empty |
| **Raita, papad, sides** | Category empty |
| **Standalone chicken/mutton biryani** | Only as a combo |
| **Real dish descriptions** | See B16 |

### 2.6 Information and help

| Feature | Notes |
|---|---|
| **FAQ page** | FAQs exist only inside the chatbot (4 questions) |
| **Human chat** | Chat is automated only; WhatsApp is the real channel |
| **Catering packages / prices** | Bulk order is just an enquiry form; no sample menus or price ranges |
| **Downloadable menu (PDF)** | Not available |
| **About link in header** | About is only in the footer |
| **Photo gallery / Instagram feed** | Not available (optional) |
| **Newsletter / offers sign-up** | Not available (optional) |

### 2.7 Accessibility and reach

| Feature | Notes |
|---|---|
| **"Skip to content" link** | None found |
| **Full accessibility audit** | Not done yet; icon buttons do have labels |
| **Other languages (Hindi / Marathi)** | Not available |

---

## Part 3 — Not tested (needs a test account or would create real data)

| Area | Why not tested |
|---|---|
| Checkout, payment (Razorpay, COD, pay at pickup) | Needs a signed-in account; would place real orders |
| Phone OTP, email verification, password reset emails | Needs an account |
| Account pages, order tracking, reorder, cancel, receipt PDF | Needs an account with orders |
| Loyalty, referrals, coupons | Needs an account |
| Writing a review | Needs an account (confirmed it asks you to sign in) |
| Contact and bulk-order form submission | Submitting would send a real enquiry to the restaurant |
| "Store closed" behaviour | The code has it ("Ordering is closed", "Closed · Opens …"), but the store was open during testing |
| iPhone Safari, older Android browsers | Only Chrome was used |

A test customer account and a staging environment with test payment keys would allow these to be checked.
