import { CircleCheckIcon, LinkIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { AuthShell, PasswordInput } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

export function meta() {
  return [{ title: 'Reset password, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/*
 * Opened from the reset email as /auth/reset-password?token=. Without a token, or with the token
 * expired, the link is shown as no longer valid. With no API yet, any other token works.
 */
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [values, setValues] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [state, setState] = useState<'editing' | 'saving' | 'saved'>('editing')

  if (!token || token === 'expired') {
    return (
      <AuthShell
        title="This link has expired"
        description="Reset links work once and only for a short time. Ask for a new one and use it soon after it arrives."
      >
        <span className="-order-1 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <LinkIcon aria-hidden="true" className="size-6" />
        </span>
        <Button size="lg" render={<Link to="/forgot-password" />} nativeButton={false}>
          Get a new link
        </Button>
      </AuthShell>
    )
  }

  if (state === 'saved') {
    return (
      <AuthShell title="Password updated" description="Use your new password the next time you log in.">
        <span className="-order-1 flex size-12 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_12%,var(--card))] text-success">
          <CircleCheckIcon aria-hidden="true" className="size-6" />
        </span>
        <Button size="lg" render={<Link to="/login" />} nativeButton={false}>
          Log in
        </Button>
      </AuthShell>
    )
  }

  const set = (key: 'password' | 'confirm', value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (values.password.length < 8) found.password = 'Use at least 8 characters.'
    if (values.confirm !== values.password) found.confirm = 'The two passwords do not match.'
    setErrors(found)
    if (found.password) return document.getElementById('reset-password')?.focus()
    if (found.confirm) return document.getElementById('reset-confirm')?.focus()
    setState('saving')
    window.setTimeout(() => setState('saved'), 600)
  }

  return (
    <AuthShell title="Set a new password" description="Choose a password you have not used for Cafe Ajwa before.">
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <FieldGroup>
          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="reset-password">New password</FieldLabel>
            <PasswordInput
              id="reset-password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => set('password', event.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'reset-password-error' : 'reset-password-help'}
            />
            {errors.password ? (
              <FieldError id="reset-password-error">{errors.password}</FieldError>
            ) : (
              <FieldDescription id="reset-password-help">At least 8 characters.</FieldDescription>
            )}
          </Field>
          <Field data-invalid={errors.confirm ? true : undefined}>
            <FieldLabel htmlFor="reset-confirm">Confirm new password</FieldLabel>
            <PasswordInput
              id="reset-confirm"
              autoComplete="new-password"
              value={values.confirm}
              onChange={(event) => set('confirm', event.target.value)}
              aria-invalid={errors.confirm ? true : undefined}
              aria-describedby={errors.confirm ? 'reset-confirm-error' : undefined}
            />
            {errors.confirm && <FieldError id="reset-confirm-error">{errors.confirm}</FieldError>}
          </Field>
        </FieldGroup>
        <Button type="submit" size="lg" disabled={state === 'saving'}>
          {state === 'saving' && <Spinner data-icon="inline-start" />}
          {state === 'saving' ? 'Updating' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  )
}
