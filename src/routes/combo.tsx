import { Navigate } from 'react-router'

/*
 * Build your own combo is switched off on the live site. The plan (decision D5) removes it until the
 * owner launches it, and sends the old link to the ready made combos.
 */
export default function ComboRedirect() {
  return <Navigate to="/menu/c/combos" replace />
}
