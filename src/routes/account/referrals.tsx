import { Navigate } from 'react-router'

/* Referrals now live on the rewards page, as docs/redesign-plan.md section 7.8 asks. */
export default function ReferralsRedirect() {
  return <Navigate to="/account/loyalty#refer" replace />
}
