import { CircleCheckIcon, LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { AuthShell, useAuth } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function meta() {
  return [{ title: 'Verify email, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/*
 * Opened from the verification email as /auth/verify-email?token=, following docs/current-website.md
 * section 5.9. A verified email also logs you in. Without a token, or with the token expired, the
 * link fails. With no API yet, any other token works.
 */
export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const valid = Boolean(token) && token !== 'expired'
  const { logIn } = useAuth()
  const [checking, setChecking] = useState(valid)

  useEffect(() => {
    if (!valid) return
    const timer = window.setTimeout(() => {
      // Verifying an email finishes creating a new account, which has no verified phone yet.
      logIn({ newAccount: true })
      setChecking(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [valid, logIn])

  if (checking) {
    return (
      <AuthShell title="Verifying your email" description="This only takes a moment.">
        <Spinner className="-order-1 size-8 text-primary" />
      </AuthShell>
    )
  }

  if (!valid) {
    return (
      <AuthShell
        title="This link did not work"
        description="It may have expired or already been used. Log in and we will offer to send a new one."
      >
        <span className="-order-1 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <LinkIcon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-3">
          <Button size="lg" render={<Link to="/login" />} nativeButton={false}>
            Back to log in
          </Button>
          <Button size="lg" variant="ghost" render={<Link to="/" />} nativeButton={false}>
            Go to the home page
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Your email is verified" description="You are logged in and ready to order.">
      <span className="-order-1 flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_12%,var(--card))] text-success">
        <CircleCheckIcon aria-hidden="true" className="size-6" />
      </span>
      <div className="flex flex-col gap-3">
        <Button size="lg" render={<Link to="/account/orders" />} nativeButton={false}>
          Continue to your account
        </Button>
        <Button size="lg" variant="ghost" render={<Link to="/menu" />} nativeButton={false}>
          Browse the menu
        </Button>
      </div>
    </AuthShell>
  )
}
