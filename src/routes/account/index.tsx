import { Navigate } from 'react-router'

/* The account area opens on orders, the default tab in docs/redesign-plan.md section 7.8. */
export default function AccountIndex() {
  return <Navigate to="/account/orders" replace />
}
