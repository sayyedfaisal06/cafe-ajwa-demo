import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "cn"

/*
 * A scroll box with a slim custom scrollbar. The thumb fades in while hovering or scrolling,
 * widens under the pointer and fades out when idle. A soft inner shadow shows at the top or bottom
 * edge while content continues past it, so a list still reads as scrollable with the thumb hidden.
 */
function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        // Clip the box so the horizontal scrollbar parts never widen the page on phones.
        "relative overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-3 before:rounded-t-[inherit] before:shadow-[inset_0_8px_8px_-8px_rgb(26_26_26/0.22)] before:opacity-0 before:transition-opacity data-overflow-y-start:before:opacity-100 motion-reduce:before:transition-none",
        "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-3 after:rounded-b-[inherit] after:shadow-[inset_0_-8px_8px_-8px_rgb(26_26_26/0.22)] after:opacity-0 after:transition-opacity data-overflow-y-end:after:opacity-100 motion-reduce:after:transition-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar z-20 flex touch-none rounded-full p-0.5 select-none",
        "opacity-0 transition-[opacity,width,height,background-color] delay-300 duration-200 motion-reduce:transition-none",
        "data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-75",
        "hover:bg-foreground/5",
        "data-vertical:my-1 data-vertical:mr-0.5 data-vertical:w-2.5 data-vertical:hover:w-3.5",
        "data-horizontal:mx-1 data-horizontal:mb-0.5 data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:hover:h-3.5",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-input/60 transition-colors group-hover/scrollbar:bg-input active:bg-primary motion-reduce:transition-none"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
