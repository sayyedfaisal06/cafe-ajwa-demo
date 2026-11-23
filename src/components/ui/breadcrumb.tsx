import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "cn"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

/*
 * Links get an invisible tap area so each one is about 44px tall on touch screens. The current
 * page truncates instead of wrapping. On small screens, pair a full trail hidden with
 * max-sm:hidden and a BreadcrumbBack link to the parent page shown with sm:hidden.
 */
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={cn("min-w-0", className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex min-w-0 items-center gap-1", className)}
      {...props}
    />
  )
}

const breadcrumbLinkClassName = cn(
  "relative inline-flex items-center gap-1.5 rounded-sm font-medium underline-offset-4 outline-none",
  "transition-colors duration-150 motion-reduce:transition-none",
  "after:absolute after:-inset-x-1.5 after:-inset-y-3.5",
  "hover:text-primary hover:underline",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "[&>svg]:size-4 [&>svg]:shrink-0"
)

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(breadcrumbLinkClassName, className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("max-w-[28ch] truncate font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("text-input [&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

/* Stands in for hidden middle pages. Put it inside a DropdownMenuTrigger to list them. */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
      {...props}
    >
      <MoreHorizontalIcon />
    </span>
  )
}

/* A single link back to the parent page, for small screens. */
function BreadcrumbBack({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(breadcrumbLinkClassName, "-ml-1 gap-1 text-sm text-muted-foreground", className),
        children: (
          <>
            <ChevronLeftIcon />
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-back",
    },
  })
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbBack,
}
