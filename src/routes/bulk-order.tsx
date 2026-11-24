import { Navigate } from 'react-router'

/* The old bulk order page is now Catering, as docs/redesign-plan.md section 6.3 asks. The host's
   redirect rules send a 301 before this loads; this covers hosts without them. */
export default function BulkOrderRedirect() {
  return <Navigate to="/catering" replace />
}
