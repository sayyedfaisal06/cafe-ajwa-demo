import {
  ChefHatIcon,
  CookingPotIcon,
  DrumstickIcon,
  EggFriedIcon,
  FlameIcon,
  SaladIcon,
  SoupIcon,
  UtensilsCrossedIcon,
  UtensilsIcon,
  WheatIcon,
  type LucideIcon,
} from 'lucide-react'

import { dishDetails } from './menu-details'

/*
 * Menu data for the redesign, taken from the full item list in docs/current-website.md and sorted
 * into the new category structure in docs/redesign-plan.md section 8. Names use the plan's fixes,
 * sizes are merged into one dish, and slugs keep the current product URLs. The live menu will come
 * from the API.
 */

export type Dish = {
  id: string
  /** The product page path segment, as in /menu/chicken-kolhapuri. */
  slug?: string
  name: string
  description?: string
  price: number
  veg: boolean
  /** Category slug, for dishes that belong to the menu. */
  category?: string
  serves?: string
  spice?: 'Mild' | 'Medium' | 'Hot'
  bestseller?: boolean
  /** A short label on the photo, such as Combo. */
  label?: string
  /** A short detail such as 4 pcs, or a summary of the size choices. */
  options?: string
  /** Size choices with their own prices. The first one is the default. */
  variants?: { label: string; price: number }[]
  /** Photo URL. Dishes without one show a plate icon. */
  image?: string
  /** Minutes the kitchen needs, from the backend. */
  prepMinutes?: number
  /** Average guest rating out of 5, when the dish has reviews. */
  rating?: number
  /** Delivered orders so far. */
  orderCount?: number
  customisable?: boolean
  soldOut?: boolean
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/* Builds a dish. Pass oldName when the plan renamed it, so the slug stays the current URL. */
const dish = (
  category: string,
  name: string,
  price: number,
  veg: boolean,
  extra: Partial<Dish> & { oldName?: string } = {},
): Dish => {
  const { oldName, ...rest } = extra
  return { id: slugify(oldName ?? name), slug: slugify(oldName ?? name), name, price, veg, category, ...rest }
}

/* The 8 bestsellers on the current home page. The live list will rank dishes by order count. */
const bestsellerNames = [
  'Tandoori Roti',
  'Tandoori Naan',
  'Chana Masala',
  'Chicken Kadai (Bone-in)',
  'Chicken Schezwan Tikka',
  'Chicken Pahadi Tawa',
  'Chicken Chilli Gravy',
  'Chicken Kung Pao',
]

const items: Dish[] = [
  // Combos
  dish('combos', 'Chicken Hakka Noodles Combo', 399, false, { label: 'Combo' }),
  dish('combos', 'Chicken Biryani Combo', 399, false, { label: 'Combo' }),
  dish('combos', 'Butter Chicken Combo', 449, false, { label: 'Combo' }),
  dish('combos', 'Chicken Fried Rice Combo', 399, false, { label: 'Combo' }),

  // Tandoor and Kebabs
  dish('tandoor-kebabs', 'Chicken Barra Tandoori', 470, false, { oldName: 'Chicken Barra Tandoori Full' }),
  dish('tandoor-kebabs', 'Chicken Schezwan Tandoori', 470, false, { oldName: 'Chicken Schezwan Tandoori Full' }),
  dish('tandoor-kebabs', 'Chicken Seekh Kabab', 230, false, { oldName: 'Chicken Seekh Kabab (4 Pcs)', options: '4 pcs' }),
  dish('tandoor-kebabs', 'Chicken Pahadi Kabab', 320, false),
  dish('tandoor-kebabs', 'Chicken Tikka Dry', 230, false),
  dish('tandoor-kebabs', 'Chicken Schezwan Tikka', 260, false),
  dish('tandoor-kebabs', 'Mutton Kalimiri', 620, false, { oldName: 'Mutton Kalimiri (8PCS)', options: '8 pcs' }),

  // Chicken Starters
  dish('chicken-starters', 'Chicken Butter Garlic', 380, false),
  dish('chicken-starters', 'Lollipop Masala Dry', 260, false),
  dish('chicken-starters', 'Chicken Teriyaki', 310, false, { oldName: 'Chicken Teryaki' }),
  dish('chicken-starters', 'Chicken Pakoda', 330, false, {
    oldName: 'Chicken Pakoda 500GM',
    options: '500 g, or 1 kg for ₹610',
    variants: [
      { label: '500 g', price: 330 },
      { label: '1 kg', price: 610 },
    ],
    customisable: true,
  }),

  // Indo Chinese Starters
  dish('indo-chinese-starters', 'Paneer Crispy', 290, true),
  dish('indo-chinese-starters', 'Paneer Garlic Dry', 270, true),
  dish('indo-chinese-starters', 'Paneer Manchurian Dry', 260, true),
  dish('indo-chinese-starters', 'Paneer Chilli Dry', 260, true, { oldName: 'Paneer Chilly Dry' }),

  // Chicken Curries
  dish('chicken-curries', 'Chicken Kadai (Bone-in)', 220, false, { oldName: 'Chicken Kadai (BONE)' }),
  dish('chicken-curries', 'Chicken Pahadi Tawa', 280, false),
  dish('chicken-curries', 'Chicken Kolhapuri', 240, false, {
    description: 'Fiery Maharashtrian curry with coconut and dry red chillies, slow cooked on the bone.',
  }),
  dish('chicken-curries', 'Chicken Lucknowi', 240, false),
  dish('chicken-curries', 'Chicken Akbari', 250, false),
  dish('chicken-curries', 'Chicken Banjara Tawa', 280, false),
  dish('chicken-curries', 'Chicken Banjara Kabab Masala', 240, false, { oldName: 'Chicken Banajara Kabab Masaka' }),
  dish('chicken-curries', 'Chicken Dhamaka', 310, false, { oldName: 'Chicken Dhamaka (2 Gravy)', options: '2 gravies' }),
  dish('chicken-curries', 'Chicken Begum Bahar', 280, false),
  dish('chicken-curries', 'Chicken Nargis', 250, false),
  dish('chicken-curries', 'Chicken Chingari', 250, false),
  dish('chicken-curries', 'Chicken Harabara', 250, false),
  dish('chicken-curries', 'Chicken Mumtaz', 240, false),
  dish('chicken-curries', 'Chicken Tawa', 240, false),
  dish('chicken-curries', 'Chicken Afghani', 220, false),

  // Indo Chinese Mains
  dish('indo-chinese-mains', 'Chicken Chilli Gravy', 220, false),
  dish('indo-chinese-mains', 'Chicken Kung Pao', 290, false),
  dish('indo-chinese-mains', 'Chicken 65 Gravy', 230, false),
  dish('indo-chinese-mains', 'Paneer 65 Gravy', 260, true),
  dish('indo-chinese-mains', 'Paneer Chilli Gravy', 260, true),

  // Paneer and Veg
  dish('paneer-veg', 'Paneer Butter Garlic', 320, true),
  dish('paneer-veg', 'Paneer BBQ', 280, true),
  dish('paneer-veg', 'Paneer Angara', 270, true),
  dish('paneer-veg', 'Paneer Cheese Garlic Tawa', 280, true),
  dish('paneer-veg', 'Paneer Lasaniya', 270, true),
  dish('paneer-veg', 'Paneer Tawa', 270, true),
  dish('paneer-veg', 'Paneer Tiranga', 490, true, { oldName: 'Paneer Tiranga (3 Gravy)', options: '3 gravies' }),
  dish('paneer-veg', 'Paneer Shahi Korma', 240, true),
  dish('paneer-veg', 'Paneer Bhurji', 280, true),
  dish('paneer-veg', 'Paneer Chatpata', 270, true),
  dish('paneer-veg', 'Paneer Tikka Masala', 240, true),
  dish('paneer-veg', 'Veg Kaju Curry', 280, true),
  dish('paneer-veg', 'Veg Jaipuri', 180, true),
  dish('paneer-veg', 'Veg Makhanwala', 180, true),
  dish('paneer-veg', 'Chana Masala', 110, true),
  dish('paneer-veg', 'Aloo Mutter', 110, true),
  dish('paneer-veg', 'Mix Veg', 110, true),

  // Biryani and Pulao
  dish('biryani-pulao', 'Veg Biryani', 170, true),
  dish('biryani-pulao', 'Paneer Biryani', 210, true),
  dish('biryani-pulao', 'Paneer Pulao', 210, true, { oldName: 'Paneer Pulav' }),
  dish('biryani-pulao', 'Chicken Pulao', 180, false),

  // Fried Rice and Noodles
  dish('fried-rice-noodles', 'Chicken Ajwa Special Fried Rice', 230, false, { oldName: 'Chicken Ajwa SPL Rice' }),
  dish('fried-rice-noodles', 'Chicken Hongkong Fried Rice', 200, false),
  dish('fried-rice-noodles', 'Chicken Singapore Fried Rice', 210, false),
  dish('fried-rice-noodles', 'Chicken Schezwan Fried Rice', 180, false),
  dish('fried-rice-noodles', 'Chicken Burnt Garlic Rice', 270, false),
  dish('fried-rice-noodles', 'Prawns Fried Rice', 230, false),
  dish('fried-rice-noodles', 'Paneer Kepsa Rice', 810, true, { oldName: 'Paneer Kepsa Rice Full' }),
  dish('fried-rice-noodles', 'Veg Hakka Noodles', 170, true, { oldName: 'Veg Hakka Noodles Full' }),
  dish('fried-rice-noodles', 'Veg Schezwan Hakka Noodles', 180, true, { oldName: 'Veg Schezwan Hakka Noodles Full' }),
  dish('fried-rice-noodles', 'Egg Schezwan Hakka Noodles', 190, false, { oldName: 'Egg Schezwan Hakka Noodles Full' }),

  // Rice and Dal
  dish('rice-dal', 'Jeera Rice', 130, true, { oldName: 'Jeera Rice Full' }),
  dish('rice-dal', 'Steamed Rice', 90, true, { oldName: 'Steam Rice Full' }),
  dish('rice-dal', 'Dal Khichdi', 150, true),
  dish('rice-dal', 'Dal Khichdi Tadka', 160, true),

  // Breads
  dish('breads', 'Tandoori Roti', 15, true),
  dish('breads', 'Tandoori Naan', 45, true),
  dish('breads', 'Tandoori Butter Paratha', 45, true),

  // Soups
  dish('soups', 'Chicken Hot and Sour Soup', 120, false, { oldName: 'Chicken Hot-N-Sour Soup' }),
  dish('soups', 'Chicken Garlic Soup', 140, false),
]

const cloudinaryPhoto = (path: string) => `https://res.cloudinary.com/dyrvwfuj4/image/upload/f_auto,q_auto,w_800/${path}`

/* Every dish on the menu, with the current bestsellers flagged and the backend details merged in. */
export const menuItems: Dish[] = items.map((item) => {
  const details = dishDetails[item.slug ?? ''] ?? {}
  return {
    ...item,
    bestseller: bestsellerNames.includes(item.name) || undefined,
    image: details.image ? cloudinaryPhoto(details.image) : undefined,
    serves: details.serves ? `Serves ${details.serves}` : undefined,
    prepMinutes: details.prepMinutes,
    rating: details.rating,
    orderCount: details.orderCount,
  }
})

export const bestsellers: Dish[] = bestsellerNames.map((name) => menuItems.find((item) => item.name === name)!)
export const combos: Dish[] = menuItems.filter((item) => item.category === 'combos')

export type MenuCategory = { name: string; slug: string; count?: number; icon: LucideIcon }

/* The 12 categories and slugs from the redesign plan, with dish counts from the menu. */
export const menuCategories: MenuCategory[] = [
  { name: 'Combos', slug: 'combos', icon: UtensilsIcon },
  { name: 'Tandoor and Kebabs', slug: 'tandoor-kebabs', icon: FlameIcon },
  { name: 'Chicken Starters', slug: 'chicken-starters', icon: DrumstickIcon },
  { name: 'Indo Chinese Starters', slug: 'indo-chinese-starters', icon: ChefHatIcon },
  { name: 'Chicken Curries', slug: 'chicken-curries', icon: CookingPotIcon },
  { name: 'Indo Chinese Mains', slug: 'indo-chinese-mains', icon: UtensilsCrossedIcon },
  { name: 'Paneer and Veg', slug: 'paneer-veg', icon: SaladIcon },
  { name: 'Biryani and Pulao', slug: 'biryani-pulao', icon: CookingPotIcon },
  { name: 'Fried Rice and Noodles', slug: 'fried-rice-noodles', icon: EggFriedIcon },
  { name: 'Rice and Dal', slug: 'rice-dal', icon: SoupIcon },
  { name: 'Breads', slug: 'breads', icon: WheatIcon },
  { name: 'Soups', slug: 'soups', icon: SoupIcon },
].map((category) => ({ ...category, count: menuItems.filter((item) => item.category === category.slug).length }))

export type Suggestion = {
  id: string
  label: string
  kind: 'recent' | 'dish' | 'category'
  price?: number
  veg?: boolean
  category?: string
}

const categoryName = (slug?: string) => menuCategories.find((category) => category.slug === slug)?.name

/* Search suggestions for every dish on the menu. */
export const searchDishes: Suggestion[] = menuItems.map((item) => ({
  id: `dish-${item.id}`,
  label: item.name,
  kind: 'dish' as const,
  price: item.price,
  veg: item.veg,
  category: categoryName(item.category),
}))

export const searchCategories: Suggestion[] = menuCategories.map((category) => ({
  id: `category-${category.slug}`,
  label: category.name,
  kind: 'category' as const,
}))

export const recentSearches: Suggestion[] = ['Chicken Kolhapuri', 'paneer'].map((label) => ({
  id: `recent-${label}`,
  label,
  kind: 'recent' as const,
}))

export const popularDishes = searchDishes.filter((dish) =>
  ['Chicken Kolhapuri', 'Paneer Butter Garlic', 'Chicken Kung Pao', 'Veg Biryani'].includes(dish.label),
)

export type FeaturedDish = {
  name: string
  category: string
  slug: string
  image: string
}

/* Cloudinary resizes and picks a modern format, so the hero stays light on phones. */
const cloudinary = (path: string) => `https://res.cloudinary.com/dyrvwfuj4/image/upload/f_auto,q_auto,w_640/${path}`

/*
 * The featured dishes on the current home page, with their photos from the existing Cloudinary
 * account. The live list comes from the content API. Slugs keep the current product URLs.
 */
export const featuredDishes: FeaturedDish[] = [
  {
    name: 'Chicken Hakka Noodles Combo',
    category: 'Combos',
    slug: 'chicken-hakka-noodles-combo',
    image: cloudinary('v1793628028/cafe-ajwa/l46lkt4wsmilp0zyuave.png'),
  },
  {
    name: 'Chicken Ajwa Special Fried Rice',
    category: 'Fried Rice and Noodles',
    slug: 'chicken-ajwa-spl-rice',
    image: cloudinary('v1793628009/cafe-ajwa/lw7toa2lbrswuoh9hbla.png'),
  },
  {
    name: 'Jeera Rice',
    category: 'Rice and Dal',
    slug: 'jeera-rice-full',
    image: cloudinary('v1793628018/cafe-ajwa/gpvkeqbcy6xgpzfiexun.png'),
  },
  {
    name: 'Chicken Schezwan Tandoori',
    category: 'Tandoor and Kebabs',
    slug: 'chicken-schezwan-tandoori-full',
    image: cloudinary('v1793628001/cafe-ajwa/gizecjddo5g3y5pvjxuz.png'),
  },
  {
    name: 'Tandoori Butter Paratha',
    category: 'Breads',
    slug: 'tandoori-butter-paratha',
    image: cloudinary('v1793627985/cafe-ajwa/ylmk3zwqp1ghirxc4jdi.png'),
  },
]

/* A featured dish without its own photo borrows the hero photo. */
for (const featured of featuredDishes) {
  const item = menuItems.find((entry) => entry.slug === featured.slug)
  if (item && !item.image) item.image = featured.image
}

export const findDish = (slug: string) => menuItems.find((item) => item.slug === slug)
export const categoryBySlug = (slug?: string) => menuCategories.find((category) => category.slug === slug)

