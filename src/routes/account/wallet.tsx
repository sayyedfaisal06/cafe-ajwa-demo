import { Navigate } from 'react-router'

/* The old wallet link now points to the rewards page. */
export default function WalletRedirect() {
  return <Navigate to="/account/loyalty" replace />
}
