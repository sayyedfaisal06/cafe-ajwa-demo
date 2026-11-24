/*
 * Sample account data for the account pages: the signed in customer, saved addresses, reward points
 * and notifications. The features follow docs/current-website.md section 7. Reward rates are set by
 * staff in the admin panel, so the numbers in rewardSettings are placeholders. The live data comes
 * from the API.
 */

export const customer = {
  name: 'Riya Shaikh',
  email: 'riya.shaikh@example.com',
  phone: '+91 98765 43210',
  address: 'Flat 302, Sea View Apartments, Malwani Colony, Malad West, Mumbai 400095',
  rewardPoints: 240,
  googleLinked: true,
}

export type AddressLabel = 'home' | 'work' | 'other'

export type Address = {
  id: string
  label: AddressLabel
  /** A name for Other addresses, such as Mom's place. */
  name?: string
  building: string
  area: string
  pincode: string
  instructions?: string
  isDefault: boolean
}

export const addresses: Address[] = [
  {
    id: 'a1',
    label: 'home',
    building: 'Flat 302, Sea View Apartments',
    area: 'Malwani Colony, Malad West',
    pincode: '400095',
    instructions: 'Ring the bell twice. Lift is on the left.',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'work',
    building: 'Office 14, second floor, Link Plaza',
    area: 'Malad West',
    pincode: '400064',
    isDefault: false,
  },
  {
    id: 'a3',
    label: 'other',
    name: "Mom's place",
    building: 'B 104, Green Park Society',
    area: 'Malwani Gate 5, Malad West',
    pincode: '400095',
    isDefault: false,
  },
]

export const addressTitle = (address: Pick<Address, 'label' | 'name'>) =>
  address.label === 'other' ? address.name || 'Other' : address.label === 'home' ? 'Home' : 'Work'

export const addressLine = (address: Pick<Address, 'building' | 'area' | 'pincode'>) =>
  `${address.building}, ${address.area}, Mumbai ${address.pincode}`

/* Placeholder rates. Staff set the real ones in the admin panel. */
export const rewardSettings = {
  earnPer100: 5,
  /** Rupees one point is worth at checkout. */
  pointValue: 1,
  /** The most of an order points can pay for, in percent. */
  maxPercent: 10,
  minOrder: 300,
  referralPoints: 50,
}

export type PointsEntry = {
  id: string
  kind: 'earned' | 'used' | 'referral' | 'review' | 'returned'
  points: number
  at: Date
  order?: string
  note?: string
}

const at = (month: number, day: number, hour: number, minute: number) => new Date(2026, month, day, hour, minute)

/* Adds up to the 240 points in customer.rewardPoints. */
export const pointsHistory: PointsEntry[] = [
  { id: 'p9', kind: 'review', points: 10, at: at(10, 21, 12, 30), note: 'Review of Chicken Kolhapuri' },
  { id: 'p8', kind: 'earned', points: 45, at: at(10, 20, 20, 56), order: '1038' },
  { id: 'p7', kind: 'earned', points: 25, at: at(10, 17, 14, 21), order: '1035' },
  { id: 'p6', kind: 'used', points: -30, at: at(10, 11, 19, 50), order: '1027' },
  { id: 'p5', kind: 'earned', points: 40, at: at(10, 8, 21, 11), order: '1022' },
  { id: 'p4', kind: 'referral', points: 50, at: at(10, 6, 18, 5), note: 'A friend placed their first order with your code' },
  { id: 'p3', kind: 'earned', points: 35, at: at(10, 5, 14, 51), order: '1018' },
  { id: 'p2', kind: 'earned', points: 30, at: at(10, 2, 21, 41), order: '1013' },
  { id: 'p1', kind: 'earned', points: 35, at: at(9, 27, 21, 21), order: '1004' },
]

export const referral = { code: 'RIYA240', friendsRewarded: 1 }

export type Notification = { id: string; title: string; body: string; at: Date; read: boolean; to: string }

export const notifications: Notification[] = [
  { id: 'n7', title: 'Order 1044 placed', body: 'We have sent it to the kitchen. Ready around 8:37 pm.', at: at(10, 24, 20, 12), read: false, to: '/orders/1044' },
  { id: 'n6', title: 'Order 1043 is being prepared', body: 'The kitchen has started cooking. Expected by 8:50 pm.', at: at(10, 24, 20, 7), read: false, to: '/orders/1043' },
  { id: 'n5', title: 'You earned 10 points', body: 'Thanks for reviewing Chicken Kolhapuri.', at: at(10, 21, 12, 30), read: true, to: '/account/loyalty' },
  { id: 'n4', title: 'Order 1038 delivered', body: 'Enjoy your meal. Tell us how the dishes were.', at: at(10, 20, 20, 56), read: true, to: '/orders/1038' },
  { id: 'n3', title: 'You earned 45 points', body: 'From order 1038.', at: at(10, 20, 20, 56), read: true, to: '/account/loyalty' },
  { id: 'n2', title: 'Order 1031 cancelled', body: 'Nothing was charged.', at: at(10, 14, 21, 7), read: true, to: '/orders/1031' },
]
