import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { customer } from '@/data/account'

/*
 * Sign in for the redesign preview. There is no API yet, so any well formed details log you in and
 * the signed in flag is kept in this browser. The live version will use the auth endpoints in
 * docs/current-website.md section 11.2.
 */

const SIGNED_IN_KEY = 'cafe-ajwa-signed-in'
const PHONE_KEY = 'cafe-ajwa-phone'

/* Whether someone is logged in, and the phone number they verified with a code, if any. */
type Session = { signedIn: boolean; phone: string | null }

const listeners = new Set<() => void>()
let session: Session | null = null
// Prerendered pages are built logged out. The same object every time, as React expects.
const loggedOut: Session = { signedIn: false, phone: null }

function readStored(): Session {
  try {
    return { signedIn: window.localStorage.getItem(SIGNED_IN_KEY) === '1', phone: window.localStorage.getItem(PHONE_KEY) }
  } catch {
    return loggedOut
  }
}

function setSession(next: Session) {
  session = next
  try {
    if (next.signedIn) window.localStorage.setItem(SIGNED_IN_KEY, '1')
    else window.localStorage.removeItem(SIGNED_IN_KEY)
    if (next.phone) window.localStorage.setItem(PHONE_KEY, next.phone)
    else window.localStorage.removeItem(PHONE_KEY)
  } catch {
    // Without storage the state still lasts until the tab closes.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Logging in or out in another tab updates this one.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SIGNED_IN_KEY && event.key !== PHONE_KEY) return
    session = readStored()
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const getSnapshot = () => (session ??= readStored())
const getServerSnapshot = () => loggedOut

/* Where an account page goes after a deliberate log out, instead of the log in page. */
let afterLogOut: string | null = null

// Defined once, so effects that call them do not rerun on every render.

/* Logging in to an existing account keeps the sample customer's verified phone. A new account has
   no verified phone yet, so its first checkout asks for one. */
const logIn = (options: { newAccount?: boolean } = {}) => {
  afterLogOut = null
  setSession({ signedIn: true, phone: options.newAccount ? null : (getSnapshot().phone ?? customer.phone) })
}
const logOut = (options: { to?: string } = {}) => {
  afterLogOut = options.to ?? null
  setSession(loggedOut)
}
const verifyPhone = (phone: string) => setSession({ ...getSnapshot(), phone })

export function useAuth() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { signedIn: current.signedIn, phone: current.phone, logIn, logOut, verifyPhone }
}

/* Where to go after logging in. Only paths on this site are allowed. */
export function nextPath(search: string, fallback = '/account/orders') {
  const next = new URLSearchParams(search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

/* Clears the log out destination once the visitor reaches it, so a later visit to an account page
   while logged out asks to log in again. Called from the site layout, which stays mounted. */
export function useLogOutLanding() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (afterLogOut !== null && pathname === afterLogOut) afterLogOut = null
  }, [pathname])
}

/* Pages that need an account send logged out visitors to log in, then back here. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn: isSignedIn } = useAuth()
  const { pathname, search } = useLocation()
  if (!isSignedIn) return <Navigate to={afterLogOut ?? `/login?next=${encodeURIComponent(pathname + search)}`} replace />
  return children
}

/* A password field with a button to show or hide what was typed. */
export function PasswordInput(props: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <InputGroup>
      <InputGroupInput {...props} type={visible ? 'text' : 'password'} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

/* The Google mark in its own colours, as Google asks for on sign in buttons. */
function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  )
}

export function GoogleButton({ onSuccess, label = 'Continue with Google' }: { onSuccess: () => void; label?: string }) {
  const [busy, setBusy] = useState(false)
  const start = () => {
    setBusy(true)
    // Stands in for the Google account picker.
    window.setTimeout(onSuccess, 700)
  }
  return (
    <Button type="button" variant="outline" size="lg" className="w-full border-input bg-card text-foreground" disabled={busy} onClick={start}>
      {busy ? <Spinner data-icon="inline-start" /> : <GoogleMark />}
      {busy ? 'Connecting to Google' : label}
    </Button>
  )
}

/* The centred card every auth page sits in. */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 pt-8 pb-16 sm:pt-14">
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
      {footer && <p className="text-center text-sm text-muted-foreground">{footer}</p>}
    </div>
  )
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
