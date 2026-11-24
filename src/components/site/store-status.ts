import { useEffect, useState } from 'react'

import { restaurant } from '@/data/restaurant'

/*
 * Whether the kitchen is taking orders, worked out in the browser from the kitchen hours in India
 * Standard Time. It stays unknown during prerendering, so the built HTML never shows a stale open
 * or closed state. The live version will use the store status from the API.
 */

export type StoreStatus = 'unknown' | 'open' | 'closed-early' | 'closed-late'

export function useStoreStatus(): StoreStatus {
  const [status, setStatus] = useState<StoreStatus>('unknown')
  useEffect(() => {
    const update = () => {
      const [hour, minute] = new Date()
        .toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })
        .split(':')
        .map(Number)
      const minutes = hour * 60 + minute
      const { opens, lastOrders } = restaurant.hours
      setStatus(minutes < opens ? 'closed-early' : minutes < lastOrders ? 'open' : 'closed-late')
    }
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [])
  return status
}
