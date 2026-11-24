import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { AuthShell, GoogleButton, isEmail, nextPath, PasswordInput, useAuth } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'

export function meta() {
  return [{ title: 'Create an account, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

type Key = 'name' | 'email' | 'password'

/* Create an account, following the live form: name, email and a password of at least 8 characters.
   The phone number is verified at the first checkout. */
export default function RegisterPage() {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [values, setValues] = useState<Record<Key, string>>({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({})
  const [busy, setBusy] = useState(false)

  const finish = (description: string) => {
    logIn({ newAccount: true })
    toast.add({ title: 'Account created', description, type: 'success' })
    navigate(nextPath(search), { replace: true })
  }

  const set = (key: Key, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Partial<Record<Key, string>> = {}
    if (!values.name.trim()) found.name = 'Enter your name.'
    if (!values.email.trim()) found.email = 'Enter your email.'
    else if (!isEmail(values.email)) found.email = 'Enter an email address like name@example.com.'
    if (values.password.length < 8) found.password = 'Use at least 8 characters.'
    setErrors(found)
    const first = (['name', 'email', 'password'] as const).find((key) => found[key])
    if (first) return document.getElementById(`register-${first}`)?.focus()
    setBusy(true)
    window.setTimeout(() => finish(`We sent a link to ${values.email.trim()} to verify your email.`), 600)
  }

  const passwordHelp = values.password.length >= 8 ? 'Looks good.' : `At least 8 characters${values.password ? `, ${8 - values.password.length} to go` : ''}.`

  return (
    <AuthShell
      title="Create your account"
      description="Order faster, track deliveries and earn points on every order."
      footer={
        <>
          Already have an account?{' '}
          <Link to={`/login${search}`} className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" onSuccess={() => finish('Signed up with Google.')} />
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">or</FieldSeparator>
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="register-name">Full name</FieldLabel>
            <Input
              id="register-name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              placeholder="Your name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'register-name-error' : undefined}
            />
            {errors.name && <FieldError id="register-name-error">{errors.name}</FieldError>}
          </Field>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="register-email">Email</FieldLabel>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              placeholder="name@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
            />
            {errors.email && <FieldError id="register-email-error">{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="register-password">Password</FieldLabel>
            <PasswordInput
              id="register-password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => set('password', event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'register-password-error' : 'register-password-help'}
            />
            {errors.password ? (
              <FieldError id="register-password-error">{errors.password}</FieldError>
            ) : (
              <FieldDescription id="register-password-help" aria-live="polite">
                {passwordHelp}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
        <p className="-mt-2 text-sm text-muted-foreground">We verify your phone number at your first checkout.</p>
        <Button type="submit" size="lg" disabled={busy}>
          {busy && <Spinner data-icon="inline-start" />}
          {busy ? 'Creating your account' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}
