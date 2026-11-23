import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full px-3.5 py-3 text-base leading-relaxed placeholder:text-muted-foreground md:text-[0.9375rem] rounded-xl border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 outline-none motion-reduce:transition-none hover:border-[color-mix(in_oklch,var(--input),black_25%)] focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:border-input/40 disabled:bg-muted disabled:text-muted-foreground read-only:bg-secondary",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
