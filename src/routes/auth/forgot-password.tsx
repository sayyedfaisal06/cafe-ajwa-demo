import { MailCheckIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { AuthShell, isEmail } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export function meta() {
  return [{ title: 'Forgot password, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* Asks for an email and confirms a reset link was sent. The email links to /auth/reset-password. */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [state, setState] = useState<'editing' | 'sending' | 'sent'>('editing')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found = !email.trim() ? 'Enter your email.' : !isEmail(email) ? 'Enter an email address like name@example.com.' : undefined
    setError(found)
    if (found) return document.getElementById('forgot-email')?.focus()
    setState('sending')
    window.setTimeout(() => setState('sent'), 600)
  }

  if (state === 'sent') {
    return (
      <AuthShell
        title="Check your email"
        description={
          <>
            If an account uses <span className="font-semibold text-foreground">{email.trim()}</span>, we sent it a link to
            reset your password. It can take a minute to arrive.
          </>
        }
        footer={
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Back to log in
          </Link>
        }
      >
        <span className="-order-1 flex size-12 items-center justify-center rounded-full bg-highlight text-primary">
          <MailCheckIcon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>Nothing there? Check your spam folder, or try again with a different email.</p>
        </div>
        <Button variant="outline" size="lg" onClick={() => setState('editing')}>
          Use a different email
        </Button>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter the email you use for Cafe Ajwa and we will send you a link to set a new password."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError(undefined)
            }}
            placeholder="name@example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'forgot-email-error' : undefined}
          />
          {error && <FieldError id="forgot-email-error">{error}</FieldError>}
        </Field>
        <Button type="submit" size="lg" disabled={state === 'sending'}>
          {state === 'sending' && <Spinner data-icon="inline-start" />}
          {state === 'sending' ? 'Sending' : 'Send reset link'}
        </Button>
      </form>
    </AuthShell>
  )
}
