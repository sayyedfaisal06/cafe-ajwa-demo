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

/*
 * Menu data for the redesign preview, taken from docs/current-website.md and the new category
 * structure in docs/redesign-plan.md. The live menu will come from the API.
 */

export type MenuCategory = { name: string; count?: number; icon: LucideIcon }

/* The 12 categories from the redesign plan. Counts are left out where the plan does not give one. */
export const menuCategories: MenuCategory[] = [
  { name: 'Combos', count: 4, icon: UtensilsIcon },
  { name: 'Tandoor and Kebabs', count: 7, icon: FlameIcon },
  { name: 'Chicken Starters', count: 4, icon: DrumstickIcon },
  { name: 'Indo Chinese Starters', count: 4, icon: ChefHatIcon },
  { name: 'Chicken Curries', count: 15, icon: CookingPotIcon },
  { name: 'Indo Chinese Mains', count: 5, icon: UtensilsCrossedIcon },
  { name: 'Paneer and Veg', icon: SaladIcon },
  { name: 'Biryani and Pulao', count: 4, icon: CookingPotIcon },
  { name: 'Fried Rice and Noodles', icon: EggFriedIcon },
  { name: 'Rice and Dal', count: 4, icon: SoupIcon },
  { name: 'Breads', count: 3, icon: WheatIcon },
  { name: 'Soups', count: 2, icon: SoupIcon },
]

export type Suggestion = {
  id: string
  label: string
  kind: 'recent' | 'dish' | 'category'
  price?: number
  veg?: boolean
  category?: string
}

/* Real dishes and prices from the current site audit. Prices are left out where the audit has none. */
export const searchDishes: Suggestion[] = [
  ['Chicken Kolhapuri', 240, false, 'Chicken Curries'],
  ['Chicken Lucknowi', 240, false, 'Chicken Curries'],
  ['Chicken Akbari', 250, false, 'Chicken Curries'],
  ['Chicken Banjara Tawa', 280, false, 'Chicken Curries'],
  ['Chicken Afghani', 220, false, 'Chicken Curries'],
  ['Chicken Kung Pao', 290, false, 'Indo Chinese Mains'],
  ['Chicken 65 Gravy', 230, false, 'Indo Chinese Mains'],
  ['Paneer 65 Gravy', 260, true, 'Indo Chinese Mains'],
  ['Paneer Chilli Gravy', 260, true, 'Indo Chinese Mains'],
  ['Paneer Butter Garlic', 320, true, 'Paneer and Veg'],
  ['Paneer Angara', 270, true, 'Paneer and Veg'],
  ['Paneer Tawa', 270, true, 'Paneer and Veg'],
  ['Chana Masala', 110, true, 'Paneer and Veg'],
  ['Aloo Mutter', 110, true, 'Paneer and Veg'],
  ['Veg Biryani', undefined, true, 'Biryani and Pulao'],
  ['Paneer Biryani', undefined, true, 'Biryani and Pulao'],
  ['Chicken Pulao', undefined, false, 'Biryani and Pulao'],
].map(([label, price, veg, category]) => ({
  id: `dish-${label}`,
  label: label as string,
  kind: 'dish' as const,
  price: price as number | undefined,
  veg: veg as boolean,
  category: category as string,
}))

export const searchCategories: Suggestion[] = menuCategories.map((category) => ({
  id: `category-${category.name}`,
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
