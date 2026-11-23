"use client"

import { cn } from "cn"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

/*
 * A pill with minus, count and plus. When one more tap on minus would remove the item, minus
 * turns into a delete icon so the result is clear before the tap. The count is announced to
 * screen readers when it changes.
 */
function QuantityStepper({
  value,
  onValueChange,
  min = 0,
  max = 20,
  itemName,
  size = "default",
  className,
  ...props
}: Omit<ComponentProps<"div">, "onChange"> & {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  /** Used in the button labels, such as "Remove Chicken Kolhapuri". */
  itemName: string
  size?: "sm" | "default"
}) {
  const removes = min === 0 && value <= 1
  const buttonSize = size === "sm" ? "icon-xs" : "icon-sm"

  return (
    <div
      role="group"
      aria-label={`Quantity of ${itemName}`}
      data-slot="quantity-stepper"
      data-size={size}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-input/60 bg-card p-0.5",
        "data-[size=default]:h-11 data-[size=sm]:h-9",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size={buttonSize}
        aria-label={removes ? `Remove ${itemName}` : `One less ${itemName}`}
        disabled={value <= min}
        onClick={() => onValueChange(Math.max(min, value - 1))}
        className={cn("text-primary", removes && "hover:bg-[color-mix(in_oklch,var(--destructive)_8%,var(--background))] hover:text-destructive")}
      >
        {removes ? <Trash2Icon /> : <MinusIcon />}
      </Button>
      <span
        aria-live="polite"
        className="min-w-7 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size={buttonSize}
        aria-label={`One more ${itemName}`}
        disabled={value >= max}
        onClick={() => onValueChange(Math.min(max, value + 1))}
        className="text-primary"
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

export { QuantityStepper }
