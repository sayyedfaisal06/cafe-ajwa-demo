import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { AuthShell, GoogleButton, isEmail, nextPath, PasswordInput, useAuth } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'

export function meta() {
  return [{ title: 'Log in, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* Log in with email and password or Google. The form checks the details are filled in properly;
   with no API yet, any such details log you in. */
export default function LoginPage() {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const { search } = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [busy, setBusy] = useState(false)

  const finish = (how: string) => {
    logIn()
    toast.add({ title: 'Welcome back', description: how, type: 'success' })
    navigate(nextPath(search), { replace: true })
  }

  const set = (key: 'email' | 'password', value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!values.email.trim()) found.email = 'Enter your email.'
    else if (!isEmail(values.email)) found.email = 'Enter an email address like name@example.com.'
    if (!values.password) found.password = 'Enter your password.'
    setErrors(found)
    if (found.email) return document.getElementById('login-email')?.focus()
    if (found.password) return document.getElementById('login-password')?.focus()
    setBusy(true)
    window.setTimeout(() => finish(`Logged in as ${values.email.trim()}`), 600)
  }

  return (
    <AuthShell
      title="Log in to Cafe Ajwa"
      description="Track your orders, order again and earn reward points."
      footer={
        <>
          New here?{' '}
          <Link to={`/register${search}`} className="font-semibold text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton onSuccess={() => finish('Logged in with Google')} />
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">or</FieldSeparator>
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              placeholder="name@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && <FieldError id="login-email-error">{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={errors.password ? true : undefined}>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Link to="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => set('password', event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password && <FieldError id="login-password-error">{errors.password}</FieldError>}
          </Field>
        </FieldGroup>
        <Button type="submit" size="lg" disabled={busy}>
          {busy && <Spinner data-icon="inline-start" />}
          {busy ? 'Logging in' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}
