import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Pill shaped buttons with semibold text. The solid variants have a darker bottom edge that
 * flattens when pressed. Disabled buttons turn muted. A loading button keeps its colours: set
 * aria-busy together with disabled and put a Spinner inside.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-semibold tracking-[-0.005em] whitespace-nowrap outline-none select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none",
    "active:not-aria-[haspopup]:translate-y-px motion-reduce:active:not-aria-[haspopup]:translate-y-0",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:not-aria-busy:border-transparent disabled:not-aria-busy:bg-muted disabled:not-aria-busy:text-muted-foreground disabled:not-aria-busy:shadow-none aria-busy:opacity-85",
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125rem]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.28)] hover:bg-[color-mix(in_oklch,var(--primary),white_10%)] active:shadow-none",
        secondary:
          "bg-[color-mix(in_oklch,var(--primary)_9%,var(--background))] text-primary hover:bg-[color-mix(in_oklch,var(--primary)_15%,var(--background))] aria-expanded:bg-[color-mix(in_oklch,var(--primary)_15%,var(--background))]",
        outline:
          "border-primary/70 bg-transparent text-primary hover:border-primary hover:bg-[color-mix(in_oklch,var(--primary)_6%,var(--background))] aria-expanded:border-primary aria-expanded:bg-[color-mix(in_oklch,var(--primary)_6%,var(--background))]",
        ghost:
          "text-foreground hover:bg-[color-mix(in_oklch,var(--primary)_7%,var(--background))] hover:text-primary aria-expanded:bg-[color-mix(in_oklch,var(--primary)_7%,var(--background))] aria-expanded:text-primary",
        destructive:
          "bg-destructive text-primary-foreground shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.25)] hover:bg-[color-mix(in_oklch,var(--destructive),white_10%)] focus-visible:ring-destructive active:shadow-none",
        link: "h-auto! rounded-sm px-0! text-primary underline decoration-primary/35 decoration-2 underline-offset-4 hover:decoration-primary",
      },
      size: {
        default:
          "h-11 gap-2 px-5 text-[0.9375rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-8 gap-1 px-3 text-xs has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const classes = cn(buttonVariants({ variant, size, className }))
  // A button that renders a link stays a link. The button primitive would add role="button" and
  // tabindex, so screen readers would announce a link that navigates as a button.
  if (props.nativeButton === false) return <ButtonLink {...props} className={classes} />
  return <ButtonPrimitive data-slot="button" className={classes} {...props} />
}

function ButtonLink({
  render,
  ref,
  nativeButton: _nativeButton,
  focusableWhenDisabled: _focusableWhenDisabled,
  ...props
}: ButtonPrimitive.Props & { className: string }) {
  return useRender({
    render: render as useRender.RenderProp,
    ref,
    defaultTagName: "a",
    props: { "data-slot": "button", ...props },
  })
}

export { Button, buttonVariants }
