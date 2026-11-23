"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-3 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

/*
 * default: a bordered track where a solid green pill slides to the active tab, matching the
 * segment toggle. line: plain text tabs over a divider with a green underline that slides to the active
 * tab. The slide is skipped when the visitor asks for reduced motion. Wrap a long line list in
 * ScrollRow so it scrolls on small screens.
 */
const tabsListVariants = cva(
  "group/tabs-list relative isolate inline-flex w-fit items-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "gap-1 rounded-full border border-input/50 bg-card p-[3px] group-data-horizontal/tabs:h-11 group-data-vertical/tabs:rounded-2xl",
        line: "gap-6 border-border group-data-horizontal/tabs:h-11 group-data-horizontal/tabs:border-b group-data-vertical/tabs:gap-1 group-data-vertical/tabs:border-l",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className={cn(
          "absolute -z-10 transition-[left,top,width,height] duration-200 ease-out motion-reduce:transition-none",
          // default: a solid green pill behind the active tab
          "group-data-[variant=default]/tabs-list:top-(--active-tab-top) group-data-[variant=default]/tabs-list:left-(--active-tab-left) group-data-[variant=default]/tabs-list:h-(--active-tab-height) group-data-[variant=default]/tabs-list:w-(--active-tab-width)",
          "group-data-[variant=default]/tabs-list:rounded-full group-data-[variant=default]/tabs-list:bg-primary group-data-[variant=default]/tabs-list:shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.28)]",
          // line: a green bar on the divider
          "group-data-[variant=line]/tabs-list:rounded-full group-data-[variant=line]/tabs-list:bg-primary",
          "group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:-bottom-px group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:left-(--active-tab-left) group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:w-(--active-tab-width)",
          "group-data-vertical/tabs:group-data-[variant=line]/tabs-list:-left-px group-data-vertical/tabs:group-data-[variant=line]/tabs-list:top-(--active-tab-top) group-data-vertical/tabs:group-data-[variant=line]/tabs-list:h-(--active-tab-height) group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5"
        )}
      />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 text-sm font-semibold whitespace-nowrap outline-none select-none",
        "transition-colors duration-150 motion-reduce:transition-none",
        "hover:text-foreground data-active:text-primary group-data-[variant=default]/tabs-list:not-data-active:hover:text-primary group-data-[variant=default]/tabs-list:data-active:text-primary-foreground",
        // A count badge inside the active green tab flips to cream so it stays readable.
        "group-data-[variant=default]/tabs-list:data-active:[&_[data-slot=badge]]:bg-primary-foreground group-data-[variant=default]/tabs-list:data-active:[&_[data-slot=badge]]:text-primary",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=default]/tabs-list:rounded-full group-data-[variant=default]/tabs-list:px-4 group-data-vertical/tabs:group-data-[variant=default]/tabs-list:h-9 group-data-vertical/tabs:group-data-[variant=default]/tabs-list:justify-start",
        "group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:rounded-sm group-data-vertical/tabs:group-data-[variant=line]/tabs-list:justify-start group-data-vertical/tabs:group-data-[variant=line]/tabs-list:py-2 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:pl-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
