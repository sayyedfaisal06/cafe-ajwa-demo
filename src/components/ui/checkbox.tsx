import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon, MinusIcon } from "lucide-react"

/*
 * A soft square box on the card colour that fills with the brand green when checked. Pass
 * indeterminate for a partly selected group, such as a "select all" row.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] border-input bg-card text-primary-foreground outline-none",
        "transition-[background-color,border-color,box-shadow] duration-150 motion-reduce:transition-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2.5",
        "hover:not-data-checked:not-data-indeterminate:border-primary/70",
        "data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-has-focus-visible/field-label:ring-0",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25 aria-invalid:data-checked:border-primary",
        "data-disabled:cursor-not-allowed data-disabled:border-input/50 data-disabled:bg-muted data-disabled:data-checked:bg-primary/40 data-disabled:data-checked:border-transparent",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-transform duration-150 data-starting-style:scale-50 motion-reduce:transition-none [&>svg]:size-3.5"
      >
        <CheckIcon strokeWidth={3.25} className="group-data-indeterminate/checkbox:hidden" />
        <MinusIcon
          strokeWidth={3.25}
          className="hidden group-data-indeterminate/checkbox:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
