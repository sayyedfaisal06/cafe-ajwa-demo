import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Tinted panels that match the badges. The title takes the variant colour and the description
 * stays dark for easy reading. Warning and destructive alerts are announced straight away to
 * screen readers. The others are announced politely, so a static notice does not interrupt.
 */
const alertVariants = cva(
  [
    "group/alert relative grid w-full content-start gap-1 rounded-xl border p-4 text-left text-sm",
    "has-data-[slot=alert-action]:pr-14 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3",
    "*:[svg]:row-span-2 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground *:[svg]:text-primary",
        info: "border-primary/20 bg-highlight text-primary",
        success:
          "border-success/25 bg-[color-mix(in_oklch,var(--success)_8%,var(--background))] text-success",
        warning:
          "border-warning/25 bg-[color-mix(in_oklch,var(--warning)_8%,var(--background))] text-warning",
        destructive:
          "border-destructive/25 bg-[color-mix(in_oklch,var(--destructive)_6%,var(--background))] text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  role,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const urgent = variant === "destructive" || variant === "warning"
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      role={role ?? (urgent ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "leading-snug font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm leading-relaxed text-pretty text-foreground/80 group-data-[variant=default]/alert:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-current [&_a]:underline [&_a]:underline-offset-4 [&_p:not(:last-child)]:mb-3",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-2.5", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
