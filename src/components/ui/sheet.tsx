"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/*
 * Panels that slide in from an edge. Side panels leave a strip of backdrop on phones so they can
 * be tapped closed. Lay content out as SheetHeader, SheetBody and SheetFooter: the body scrolls
 * while the header and footer stay put, which suits the cart drawer.
 */
function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-foreground/45 transition-opacity duration-250 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-popover text-sm text-popover-foreground shadow-overlay outline-none",
          "transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:w-[calc(100%-2.5rem)] data-[side=right]:sm:max-w-md",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:w-[calc(100%-2.5rem)] data-[side=left]:sm:max-w-md",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:max-h-[90svh] data-[side=bottom]:pb-[env(safe-area-inset-bottom)]",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:max-h-[90svh]",
          "data-[side=right]:data-ending-style:translate-x-full data-[side=right]:data-starting-style:translate-x-full",
          "data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-starting-style:-translate-x-full",
          "data-[side=bottom]:data-ending-style:translate-y-full data-[side=bottom]:data-starting-style:translate-y-full",
          "data-[side=top]:data-ending-style:-translate-y-full data-[side=top]:data-starting-style:-translate-y-full",
          // Reduced motion: fade in place instead of sliding.
          "motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-none motion-reduce:data-starting-style:translate-none motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="secondary"
                className="absolute top-4 right-4"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 flex-col gap-1 border-b px-5 pt-5 pb-4 pr-16", className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-3 border-t px-5 pt-4 pb-5", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-xl leading-tight font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
