import { BikeIcon, PercentIcon, TicketPercentIcon, type LucideIcon } from 'lucide-react'

/*
 * Checkout settings and coupons. Staff set the delivery fee, delivery minimum, GST and coupons in
 * the admin panel (docs/current-website.md section 6.1), so the values here are placeholders until
 * the API supplies them.
 */
export const checkoutSettings = {
  deliveryFee: 30,
  minDeliveryOrder: 199,
  gstRate: 0.05,
  /** Minutes until a pickup order is usually ready. */
  pickupMinutes: 25,
}

export type Coupon = {
  code: string
  title: string
  icon: LucideIcon
  minOrder: number
  /** Percent off the item total, with an optional cap in rupees. */
  percent?: number
  maxDiscount?: number
  freeDelivery?: boolean
  firstOrderOnly?: boolean
  /** Only Monday to Friday, 12 pm to 4 pm. */
  weekdayLunch?: boolean
}

export const coupons: Coupon[] = [
  { code: 'FREEDEL', title: 'Free delivery', icon: BikeIcon, minOrder: 499, freeDelivery: true },
  { code: 'LUNCH10', title: '10% off weekday lunch, up to ₹100', icon: PercentIcon, minOrder: 300, percent: 10, maxDiscount: 100, weekdayLunch: true },
  { code: 'AJWA20', title: '20% off your first order, up to ₹150', icon: TicketPercentIcon, minOrder: 299, percent: 20, maxDiscount: 150, firstOrderOnly: true },
]

export type CouponCheck =
  | { ok: true; discount: number; freeDelivery: boolean }
  | { ok: false; reason: string; shortBy?: number }

/* Whether a coupon works for this order, and what it saves. */
export function checkCoupon(
  coupon: Coupon,
  order: { subtotal: number; type: 'delivery' | 'pickup'; firstOrder: boolean; now: Date },
): CouponCheck {
  if (coupon.firstOrderOnly && !order.firstOrder) return { ok: false, reason: 'Only for your first order' }
  if (coupon.freeDelivery && order.type === 'pickup') return { ok: false, reason: 'Only for delivery orders' }
  if (coupon.weekdayLunch) {
    const [weekday, hour] = order.now
      .toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', hour12: false })
      .split(' ')
    const lunch = !['Sat', 'Sun'].includes(weekday.replace(',', '')) && Number(hour) >= 12 && Number(hour) < 16
    if (!lunch) return { ok: false, reason: 'Monday to Friday, 12 pm to 4 pm' }
  }
  if (order.subtotal < coupon.minOrder) {
    return { ok: false, reason: `On orders of ₹${coupon.minOrder} or more`, shortBy: coupon.minOrder - order.subtotal }
  }
  const percentOff = coupon.percent ? Math.floor((order.subtotal * coupon.percent) / 100) : 0
  return {
    ok: true,
    discount: coupon.maxDiscount ? Math.min(percentOff, coupon.maxDiscount) : percentOff,
    freeDelivery: Boolean(coupon.freeDelivery),
  }
}
