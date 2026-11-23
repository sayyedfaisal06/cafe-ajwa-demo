"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

/*
 * A selected radio stays light: the ring turns green and a green dot appears, so it reads
 * differently from a filled checkbox.
 */
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-input bg-card outline-none",
        "transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2.5",
        "hover:not-data-checked:border-primary/70 data-checked:border-primary",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-has-focus-visible/field-label:ring-0",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 aria-invalid:data-checked:border-primary",
        "data-disabled:cursor-not-allowed data-disabled:border-input/50 data-disabled:bg-muted",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-2.5 rounded-full bg-primary transition-transform duration-150 data-starting-style:scale-0 group-data-disabled/radio-group-item:bg-primary/40 motion-reduce:transition-none"
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
