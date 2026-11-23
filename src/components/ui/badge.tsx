import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

/*
 * Badges are small tags with soft corners, so they never read as pill shaped buttons. Tinted
 * variants carry a hairline border in the same colour. Put a BadgeDot first for live status,
 * and use the count shape for numbers such as the cart count.
 */
const badgeVariants = cva(
  [
    "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-md border font-semibold whitespace-nowrap tabular-nums",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a]:hover:bg-[color-mix(in_oklch,var(--primary),white_10%)]",
        secondary: "border-border bg-secondary text-secondary-foreground [a]:hover:bg-accent",
        outline: "border-input/60 bg-transparent text-foreground [a]:hover:bg-secondary",
        success:
          "border-success/25 bg-[color-mix(in_oklch,var(--success)_10%,var(--background))] text-success",
        warning:
          "border-warning/25 bg-[color-mix(in_oklch,var(--warning)_10%,var(--background))] text-warning",
        destructive:
          "border-destructive/25 bg-[color-mix(in_oklch,var(--destructive)_8%,var(--background))] text-destructive",
      },
      size: {
        sm: "h-5 gap-1 px-1.5 text-[0.6875rem] [&>svg]:size-3",
        default: "h-6 gap-1 px-2 text-xs [&>svg]:size-3.5",
        lg: "h-7 gap-1.5 px-2.5 text-sm [&>svg]:size-4",
      },
      shape: {
        tag: "",
        count: "rounded-full px-1.5 leading-none",
      },
    },
    compoundVariants: [
      { shape: "count", size: "sm", className: "min-w-5" },
      { shape: "count", size: "default", className: "min-w-6" },
      { shape: "count", size: "lg", className: "min-w-7" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "tag",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "tag",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size, shape }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

function BadgeDot({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="badge-dot"
      aria-hidden="true"
      className={cn("size-1.5 shrink-0 rounded-full bg-current", className)}
      {...props}
    />
  )
}

export { Badge, BadgeDot, badgeVariants }
