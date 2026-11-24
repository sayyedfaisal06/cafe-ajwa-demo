import { Navigate } from 'react-router'

/* The old link in bio page is now /links, as docs/redesign-plan.md section 6.3 asks. The host's
   redirect rules send a 301 before this loads; this covers hosts without them. */
export default function SocialRedirect() {
  return <Navigate to="/links" replace />
}
