/* Business details from docs/current-website.md section 2. */
export const restaurant = {
  name: 'Cafe Ajwa',
  branch: 'Malwani',
  address: 'Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony, Malad West, Mumbai, Maharashtra 400095',
  pickupPoint: 'Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony',
  phone: '+91 91675 92758',
  phoneHref: 'tel:+919167592758',
  whatsappHref: 'https://wa.me/919167592758',
  email: 'cafeajwa08@gmail.com',
  geo: { latitude: 19.1831747, longitude: 72.8189338 },
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=19.1831747,72.8189338',
  /** Kitchen hours in India Standard Time, as minutes after midnight. */
  hours: { opens: 12 * 60, closes: 24 * 60, lastOrders: 23 * 60 + 30 },
  hoursLabel: 'Every day, 12 pm to 12 am',
  lastOrdersLabel: 'Last orders at 11:30 pm',
  deliveryArea: 'Malwani, Malad West and nearby western Mumbai neighbourhoods',
  deliveryTime: '35 to 45 minutes',
  /** Pincodes for Malwani and Malad West. The exact address is confirmed at checkout. */
  deliveryPincodes: ['400095', '400064'],
  instagramHref: 'https://www.instagram.com/cafeajwa_malvani',
  facebookHref: 'https://www.facebook.com/people/Cafe-Ajwa-Malwani/61581087598305',
  /** The delivery app listings, from the live site's link in bio page. */
  swiggyHref: 'https://www.swiggy.com/city/mumbai/cafe-ajwaa-malad-west-rest134914',
  zomatoHref: 'https://www.zomato.com/mumbai/cafe-ajwaa-malad-west',
}
