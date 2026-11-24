import { Navigate } from 'react-router'

/* The account area opens on the profile page. */
export default function AccountIndex() {
  return <Navigate to="/account/profile" replace />
}
