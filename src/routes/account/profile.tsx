import { LinkIcon, LogOutIcon, Trash2Icon, UnlinkIcon } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { LogOutDialog } from '@/components/site/account'
import { useAuth } from '@/components/site/auth'
import { customer } from '@/data/account'

export function meta() {
  return [{ title: 'Profile, Cafe Ajwa' }, { name: 'robots', content: 'noindex' }]
}

/* Profile and security, following the live account features in docs/current-website.md section 7.
   Nothing is sent to the API yet, so saving shows a confirmation only. */

function Panel({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="font-heading text-lg font-semibold">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function Details() {
  const [saved, setSaved] = useState({ name: customer.name, email: customer.email })
  const [values, setValues] = useState(saved)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const changed = values.name !== saved.name || values.email !== saved.email

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!values.name.trim()) found.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) found.email = 'Enter an email address like name@example.com.'
    setErrors(found)
    if (found.name) return document.getElementById('profile-name')?.focus()
    if (found.email) return document.getElementById('profile-email')?.focus()
    const next = { name: values.name.trim(), email: values.email.trim() }
    setSaved(next)
    setValues(next)
    toast.add({ title: 'Profile saved', type: 'success' })
  }

  return (
    <Panel id="details-title" title="Personal details">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
            <Input
              id="profile-name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
              aria-invalid={errors.email ? true : undefined}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
            <Input id="profile-phone" value={customer.phone} readOnly aria-describedby="profile-phone-help" />
            <FieldDescription id="profile-phone-help">
              Verified at checkout, so it cannot be changed here. Call us if your number has changed.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button type="submit" className="self-start" disabled={!changed}>
          Save changes
        </Button>
      </form>
    </Panel>
  )
}

function LinkedAccounts() {
  const [linked, setLinked] = useState(customer.googleLinked)
  const toggle = () => {
    setLinked(!linked)
    toast.add({ title: linked ? 'Google account unlinked' : 'Google account linked', type: 'success' })
  }
  return (
    <Panel id="linked-title" title="Linked accounts">
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background font-heading text-lg font-semibold"
        >
          G
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">Google</span>
          <span className="text-sm text-muted-foreground">
            {linked ? `Linked to ${customer.email}. Sign in faster with one tap.` : 'Link it to sign in faster with one tap.'}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={toggle}>
          {linked ? <UnlinkIcon data-icon="inline-start" /> : <LinkIcon data-icon="inline-start" />}
          {linked ? 'Unlink' : 'Link'}
        </Button>
      </div>
    </Panel>
  )
}

function ChangePassword() {
  const empty = { current: '', next: '', confirm: '' }
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState<Partial<typeof empty>>({})
  const set = (key: keyof typeof empty, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Partial<typeof empty> = {}
    if (!values.current) found.current = 'Enter your current password.'
    if (values.next.length < 8) found.next = 'Use at least 8 characters.'
    else if (values.next === values.current) found.next = 'Choose a password you have not used here.'
    if (values.confirm !== values.next) found.confirm = 'The two new passwords do not match.'
    setErrors(found)
    const first = (['current', 'next', 'confirm'] as const).find((key) => found[key])
    if (first) return document.getElementById(`password-${first}`)?.focus()
    setValues(empty)
    toast.add({ title: 'Password changed', description: 'Use it the next time you sign in.', type: 'success' })
  }

  const fields: { key: keyof typeof empty; label: string; autoComplete: string; help?: string }[] = [
    { key: 'current', label: 'Current password', autoComplete: 'current-password' },
    { key: 'next', label: 'New password', autoComplete: 'new-password', help: 'At least 8 characters.' },
    { key: 'confirm', label: 'Confirm new password', autoComplete: 'new-password' },
  ]

  return (
    <Panel id="password-title" title="Change password">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <FieldGroup>
          {fields.map(({ key, label, autoComplete, help }) => (
            <Field key={key} data-invalid={errors[key] ? true : undefined}>
              <FieldLabel htmlFor={`password-${key}`}>{label}</FieldLabel>
              <Input
                id={`password-${key}`}
                type="password"
                autoComplete={autoComplete}
                value={values[key]}
                onChange={(event) => set(key, event.target.value)}
                aria-invalid={errors[key] ? true : undefined}
              />
              {help && !errors[key] && <FieldDescription>{help}</FieldDescription>}
              {errors[key] && <FieldError>{errors[key]}</FieldError>}
            </Field>
          ))}
        </FieldGroup>
        <Button type="submit" variant="outline" className="self-start">
          Change password
        </Button>
      </form>
    </Panel>
  )
}

function LogOutAndDelete() {
  const navigate = useNavigate()
  const { logOut } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const leave = (title: string) => {
    logOut({ to: '/' })
    navigate('/')
    toast.add({ title, type: 'success' })
  }
  return (
    <Panel id="session-title" title="Your account">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Log out of Cafe Ajwa on this device.</p>
          <Button variant="outline" size="sm" onClick={() => setLoggingOut(true)}>
            <LogOutIcon data-icon="inline-start" />
            Log out
          </Button>
          <LogOutDialog open={loggingOut} onOpenChange={setLoggingOut} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="max-w-md text-sm text-muted-foreground">
            Deleting your account logs you out and deactivates it. Your order history is kept.
          </p>
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                />
              }
            >
              <Trash2Icon data-icon="inline-start" />
              Delete account
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This logs you out and deactivates your account. Order history is kept. You can register again with
                  the same email as a new account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Keep my account</DialogClose>
                <DialogClose render={<Button variant="destructive" onClick={() => leave('Account deleted')} />}>
                  Delete account
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Panel>
  )
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Your details, log in and security.</p>
      </div>
      <Details />
      <LinkedAccounts />
      <ChangePassword />
      <LogOutAndDelete />
    </div>
  )
}
