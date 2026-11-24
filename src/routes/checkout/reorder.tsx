import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router'

import { RequireAuth } from '@/components/site/auth'
import { useCart } from '@/components/site/cart'
import { findOrder } from '@/data/orders'

/*
 * Reorder from a past order: the cart is replaced with that order's dishes and the customer lands
 * on checkout. Unknown orders go back to the orders list.
 */
function Reorder() {
  const { orderId } = useParams()
  const order = findOrder(orderId)
  const { replaceWith } = useCart()

  // Replacing is safe to repeat, so a second run in development does not double the dishes.
  useEffect(() => {
    if (!order) return
    replaceWith(
      order.lines.map(({ dish, quantity, price, options }) =>
        dish.variants ? { dish, quantity, price, variant: options } : { dish, quantity },
      ),
    )
  }, [order, replaceWith])

  return <Navigate to={order ? '/checkout' : '/account/orders'} replace />
}

export default function ReorderRoute() {
  return (
    <RequireAuth>
      <Reorder />
    </RequireAuth>
  )
}
