import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

/*
 * The thumb sits inside a padded track and shows a check mark when on, so the state is not
 * shown by colour alone.
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent px-0.5 outline-none",
        "transition-colors duration-200 motion-reduce:transition-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "data-[size=default]:h-7 data-[size=default]:w-12 data-[size=sm]:h-6 data-[size=sm]:w-10",
        "data-unchecked:bg-input hover:data-unchecked:bg-[color-mix(in_oklch,var(--input),black_8%)] data-checked:bg-primary hover:data-checked:bg-[color-mix(in_oklch,var(--primary),white_10%)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group-has-focus-visible/field-label:ring-0",
        "aria-invalid:ring-2 aria-invalid:ring-destructive/40",
        "data-disabled:cursor-not-allowed data-disabled:opacity-45",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none flex items-center justify-center rounded-full bg-card text-primary shadow-[0_1px_2px_rgb(0_0_0/0.25)]",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "group-data-[size=default]/switch:size-5.5 group-data-[size=sm]/switch:size-4.5",
          "data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0"
        )}
      >
        <CheckIcon
          strokeWidth={3.5}
          aria-hidden="true"
          className="size-3 opacity-0 transition-opacity duration-150 group-data-checked/switch:opacity-100 group-data-[size=sm]/switch:size-2.5 motion-reduce:transition-none"
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
