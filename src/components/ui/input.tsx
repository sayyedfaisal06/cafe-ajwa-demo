import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 px-3.5 text-base placeholder:text-muted-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-[0.9375rem] rounded-xl border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 outline-none motion-reduce:transition-none hover:border-[color-mix(in_oklch,var(--input),black_25%)] focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:border-input/40 disabled:bg-muted disabled:text-muted-foreground read-only:bg-secondary",
        className
      )}
      {...props}
    />
  )
}

export { Input }
