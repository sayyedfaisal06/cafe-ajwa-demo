import { customer } from '@/data/account'
import { menuItems, type Dish } from '@/data/menu'
import { restaurant } from '@/data/restaurant'
import type { Receipt } from '@/lib/receipt'

/*
 * Sample orders for the account and tracking pages, built from real dishes and prices. The statuses
 * follow docs/current-website.md section 6.3. The live orders come from the API. Payment is always
 * offline: cash on delivery for delivery orders and pay at pickup for pickup orders.
 */

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled'
export type OrderType = 'delivery' | 'pickup'

export type OrderLine = { dish: Dish; quantity: number; price: number; options?: string }

export type Order = {
  number: string
  placedAt: Date
  type: OrderType
  status: OrderStatus
  lines: OrderLine[]
  deliveryFee: number
  /** Delivery address. Pickup orders are collected from the kitchen. */
  address?: string
  /** When each step happened, for the timeline. */
  updates: Partial<Record<OrderStatus, Date>>
  /** Dishes from this order the customer has already rated. */
  rated?: string[]
  /** Coupon and reward points taken off the item total. */
  discount?: { label: string; amount: number }
  /** The delivery note from checkout, such as a gate code. */
  note?: string
}

const dish = (name: string) => {
  const found = menuItems.find((item) => item.name === name)
  if (!found) throw new Error(`Sample order uses a dish that is not on the menu: ${name}`)
  return found
}

const line = (name: string, quantity: number, variant?: string): OrderLine => {
  const item = dish(name)
  const choice = item.variants?.find((option) => option.label === variant)
  return { dish: item, quantity, price: choice?.price ?? item.price, options: choice?.label ?? item.options }
}

const at = (day: number, hour: number, minute: number) => new Date(2026, 10, day, hour, minute)
const later = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60_000)

/* Steps for an order that went all the way, timed from when it was placed. */
function finished(placedAt: Date, type: OrderType): Order['updates'] {
  return {
    placed: placedAt,
    accepted: later(placedAt, 3),
    ready: later(placedAt, 22),
    ...(type === 'delivery' ? { 'out-for-delivery': later(placedAt, 25) } : {}),
    delivered: later(placedAt, type === 'delivery' ? 41 : 34),
  }
}

const activeDelivery = at(24, 20, 5)
const activePickup = at(24, 20, 12)

export const orders: Order[] = [
  {
    number: '1043',
    placedAt: activeDelivery,
    type: 'delivery',
    status: 'preparing',
    lines: [line('Chicken Kolhapuri', 1), line('Paneer Tikka Masala', 1), line('Tandoori Butter Paratha', 4), line('Jeera Rice', 1), line('Chicken Hot and Sour Soup', 2)],
    deliveryFee: 30,
    address: customer.address,
    updates: { placed: activeDelivery, accepted: later(activeDelivery, 2) },
  },
  {
    number: '1044',
    placedAt: activePickup,
    type: 'pickup',
    status: 'placed',
    lines: [line('Chicken Pakoda', 1, '1 kg'), line('Veg Hakka Noodles', 2)],
    deliveryFee: 0,
    updates: { placed: activePickup },
  },
  {
    number: '1038',
    placedAt: at(20, 20, 15),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Kolhapuri', 1), line('Paneer Butter Garlic', 2)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(at(20, 20, 15), 'delivery'),
    rated: [dish('Chicken Kolhapuri').id],
  },
  {
    number: '1035',
    placedAt: at(17, 13, 40),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Kung Pao', 1), line('Chicken Hongkong Fried Rice', 1)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(at(17, 13, 40), 'delivery'),
  },
  {
    number: '1031',
    placedAt: at(14, 21, 5),
    type: 'delivery',
    status: 'cancelled',
    lines: [line('Chicken Barra Tandoori', 1), line('Tandoori Naan', 3)],
    deliveryFee: 30,
    address: customer.address,
    updates: { placed: at(14, 21, 5), cancelled: at(14, 21, 7) },
  },
  {
    number: '1027',
    placedAt: at(11, 19, 50),
    type: 'pickup',
    status: 'delivered',
    lines: [line('Paneer Tawa', 1), line('Tandoori Roti', 4)],
    deliveryFee: 0,
    updates: finished(at(11, 19, 50), 'pickup'),
  },
  {
    number: '1022',
    placedAt: at(8, 20, 30),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Biryani Combo', 2), line('Chicken Hot and Sour Soup', 1)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(at(8, 20, 30), 'delivery'),
  },
  {
    number: '1018',
    placedAt: at(5, 14, 10),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Butter Chicken Combo', 1)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(at(5, 14, 10), 'delivery'),
  },
  {
    number: '1013',
    placedAt: at(2, 21, 0),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Seekh Kabab', 2), line('Chicken Lucknowi', 1), line('Tandoori Naan', 4)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(at(2, 21, 0), 'delivery'),
  },
  {
    number: '1009',
    placedAt: new Date(2026, 9, 30, 13, 25),
    type: 'pickup',
    status: 'cancelled',
    lines: [line('Dal Khichdi Tadka', 2)],
    deliveryFee: 0,
    updates: { placed: new Date(2026, 9, 30, 13, 25), cancelled: new Date(2026, 9, 30, 13, 26) },
  },
  {
    number: '1004',
    placedAt: new Date(2026, 9, 27, 20, 40),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Afghani', 1), line('Steamed Rice', 1), line('Mix Veg', 1)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(new Date(2026, 9, 27, 20, 40), 'delivery'),
  },
  {
    number: '1001',
    placedAt: new Date(2026, 9, 24, 19, 15),
    type: 'delivery',
    status: 'delivered',
    lines: [line('Chicken Fried Rice Combo', 2)],
    deliveryFee: 30,
    address: customer.address,
    updates: finished(new Date(2026, 9, 24, 19, 15), 'delivery'),
  },
]

export const isActive = (order: Order) => order.status !== 'delivered' && order.status !== 'cancelled'
export const findOrder = (number?: string) => orders.find((order) => order.number === number)

/* There is no online payment. Customers pay the rider or pay at the counter. */
export const paymentLabel = (order: Order) => (order.type === 'delivery' ? 'Cash on delivery' : 'Pay at pickup')

/* The receipt for an order, in the shape the receipt dialog and PDF use. */
export function orderReceipt(order: Order): Receipt {
  return {
    orderNumber: order.number,
    placedAt: order.placedAt,
    orderType: order.type === 'delivery' ? 'Delivery' : 'Pickup',
    payment: paymentLabel(order),
    customer: { name: customer.name, phone: customer.phone, address: order.address ?? `Pickup from ${restaurant.pickupPoint}` },
    lines: order.lines.map(({ dish: item, quantity, price, options }) => ({ name: item.name, quantity, price, options })),
    deliveryFee: order.deliveryFee,
    gstRate: 0.05,
    discount: order.discount,
  }
}

/*
 * Adds an order placed at checkout to the list, so the confirmation and tracking pages can show it.
 * It lasts until the page reloads. The live order goes to the API with the same fields the current
 * site sends.
 */
export function placeOrder(details: Pick<Order, 'type' | 'lines' | 'deliveryFee' | 'address' | 'discount' | 'note'>): Order {
  const number = String(Math.max(...orders.map((order) => Number(order.number))) + 1)
  const placedAt = new Date()
  const order: Order = { ...details, number, placedAt, status: 'placed', updates: { placed: placedAt } }
  orders.unshift(order)
  return order
}
