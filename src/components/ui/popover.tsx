import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"

/*
 * Panels anchored to their trigger, such as the menu filters, so the page stays in view. Lay
 * content out as PopoverHeader, PopoverBody and PopoverFooter. The panel never grows past the
 * space left on screen: the body scrolls and the footer stays visible.
 */
function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex max-h-[min(var(--available-height),40rem)] w-80 max-w-[calc(100vw-1rem)] origin-(--transform-origin) flex-col overflow-hidden rounded-2xl bg-popover text-sm text-popover-foreground shadow-overlay ring-1 ring-foreground/8 outline-hidden transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-opacity motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex shrink-0 flex-col gap-1 px-4 pt-4 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-heading text-base font-semibold", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

function PopoverBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-body"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4", className)}
      {...props}
    />
  )
}

function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn("flex shrink-0 gap-2 border-t px-4 py-3", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverBody,
  PopoverClose,
  PopoverFooter,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
