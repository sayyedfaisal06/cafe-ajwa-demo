import { Navigate } from 'react-router'

/* The orders list lives in the account area. */
export default function OrdersRedirect() {
  return <Navigate to="/account/orders" replace />
}
