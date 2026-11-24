import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { MessageSquareTextIcon, SmartphoneIcon } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

import { useAuth } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'

/*
 * Checks a phone number with an SMS code before the first order, as docs/redesign-plan.md section
 * 7.6 asks: at the start of checkout, not at the end. The live site sends a 4 digit code. With no
 * API yet, any 4 digits verify the number.
 */

const CODE_LENGTH = 4
const RESEND_SECONDS = 30

/* Keeps the 10 digit number when someone types or pastes +91 or a leading 0. */
const cleanPhone = (value: string) => {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1)
  return digits.slice(0, 10)
}

const formatPhone = (digits: string) => `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`

export function VerifyPhone() {
  const { verifyPhone } = useAuth()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState<string>()
  const [stage, setStage] = useState<'number' | 'sending' | 'code' | 'checking'>('number')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const [wait, setWait] = useState(0)

  // Counts down until the code can be sent again.
  useEffect(() => {
    if (wait <= 0) return
    const timer = window.setTimeout(() => setWait((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [wait])

  const sendCode = (event?: FormEvent) => {
    event?.preventDefault()
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError(phone ? 'Enter a 10 digit mobile number.' : 'Enter your mobile number.')
      return document.getElementById('verify-phone')?.focus()
    }
    setStage('sending')
    window.setTimeout(() => {
      setStage('code')
      setCode('')
      setCodeError(undefined)
      setWait(RESEND_SECONDS)
      toast.add({ title: 'Code sent', description: `We sent a ${CODE_LENGTH} digit code to ${formatPhone(phone)}.`, type: 'info' })
    }, 700)
  }

  const checkCode = (event?: FormEvent) => {
    event?.preventDefault()
    if (code.length < CODE_LENGTH) return setCodeError(`Enter all ${CODE_LENGTH} digits.`)
    setStage('checking')
    window.setTimeout(() => {
      verifyPhone(formatPhone(phone))
      toast.add({ title: 'Phone verified', description: `We will call ${formatPhone(phone)} about your orders.`, type: 'success' })
    }, 600)
  }

  return (
    <section aria-labelledby="verify-title" className="flex flex-col gap-5 rounded-2xl border border-primary/50 bg-card p-5 sm:p-6">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-highlight text-primary">
          {stage === 'number' || stage === 'sending' ? (
            <SmartphoneIcon aria-hidden="true" className="size-5" />
          ) : (
            <MessageSquareTextIcon aria-hidden="true" className="size-5" />
          )}
        </span>
        <div className="flex flex-col gap-1">
          <h2 id="verify-title" className="font-heading text-lg font-semibold">
            Verify your phone
          </h2>
          <p className="text-sm text-muted-foreground">
            {stage === 'number' || stage === 'sending'
              ? 'We need a number we can call about your order. You only do this once.'
              : (
                  <>
                    Enter the {CODE_LENGTH} digit code sent to{' '}
                    <span className="font-semibold text-foreground">{formatPhone(phone)}</span>.
                  </>
                )}
          </p>
        </div>
      </div>

      {stage === 'number' || stage === 'sending' ? (
        <form onSubmit={sendCode} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Field data-invalid={phoneError ? true : undefined} className="sm:max-w-xs">
            <FieldLabel htmlFor="verify-phone">Mobile number</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText className="font-semibold text-foreground">+91</InputGroupText>
                <span aria-hidden="true" className="h-5 w-px bg-border" />
              </InputGroupAddon>
              <InputGroupInput
                id="verify-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(event) => {
                  setPhone(cleanPhone(event.target.value))
                  setPhoneError(undefined)
                }}
                placeholder="98765 43210"
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? 'verify-phone-error' : undefined}
              />
            </InputGroup>
            {phoneError && <FieldError id="verify-phone-error">{phoneError}</FieldError>}
          </Field>
          <Button type="submit" disabled={stage === 'sending'} className="sm:mt-7">
            {stage === 'sending' && <Spinner data-icon="inline-start" />}
            {stage === 'sending' ? 'Sending' : 'Send code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={checkCode} noValidate className="flex flex-col gap-4">
          <Field data-invalid={codeError ? true : undefined}>
            <FieldLabel htmlFor="verify-code" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              id="verify-code"
              maxLength={CODE_LENGTH}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={(value) => {
                setCode(value)
                setCodeError(undefined)
              }}
              aria-invalid={codeError ? true : undefined}
              autoComplete="one-time-code"
              autoFocus
            >
              <InputOTPGroup>
                {Array.from({ length: CODE_LENGTH }, (_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {codeError ? (
              <FieldError>{codeError}</FieldError>
            ) : (
              <FieldDescription>
                {wait > 0 ? (
                  <>
                    No code? You can ask again in <span className="font-semibold text-foreground tabular-nums">0:{String(wait).padStart(2, '0')}</span>.
                  </>
                ) : (
                  'No code yet? Send it again.'
                )}
              </FieldDescription>
            )}
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={stage === 'checking'}>
              {stage === 'checking' && <Spinner data-icon="inline-start" />}
              {stage === 'checking' ? 'Verifying' : 'Verify'}
            </Button>
            <Button type="button" variant="outline" disabled={wait > 0 || stage === 'checking'} onClick={() => sendCode()}>
              Send again
            </Button>
            <Button type="button" variant="ghost" disabled={stage === 'checking'} onClick={() => setStage('number')}>
              Change number
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
