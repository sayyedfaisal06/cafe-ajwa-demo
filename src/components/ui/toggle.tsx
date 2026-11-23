"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/*
 * Pill shaped toggles that match the buttons.
 * default: plain text, a green tint when pressed. Use for toolbar style options.
 * outline: bordered chips that turn solid green when pressed. Use for menu filters.
 * segment: options inside a bordered track, the pressed one becomes a solid green pill. Use inside
 * a ToggleGroup for choices such as Delivery or Pickup, and Half or Full.
 */
const toggleVariants = cva(
  [
    "group/toggle inline-flex items-center justify-center gap-1.5 rounded-full border border-transparent font-semibold whitespace-nowrap outline-none select-none",
    "transition-[background-color,border-color,color,box-shadow] duration-150 motion-reduce:transition-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-foreground hover:bg-[color-mix(in_oklch,var(--primary)_7%,var(--background))] hover:text-primary aria-pressed:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))] aria-pressed:text-primary",
        outline:
          "border-input/60 bg-card text-foreground hover:border-primary/70 hover:text-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        segment:
          "bg-transparent text-muted-foreground hover:bg-highlight hover:text-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.28)] aria-pressed:hover:bg-[color-mix(in_oklch,var(--primary),white_10%)]",
      },
      size: {
        default:
          "h-11 min-w-11 px-4 text-[0.9375rem] has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        sm: "h-9 min-w-9 px-3.5 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-12 min-w-12 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      // Segments sit inside a track with 4px padding, so the whole control keeps the size height.
      { variant: "segment", size: "default", className: "h-9 min-w-9 flex-1" },
      { variant: "segment", size: "sm", className: "h-7 min-w-7 flex-1" },
      { variant: "segment", size: "lg", className: "h-10 min-w-10 flex-1" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
