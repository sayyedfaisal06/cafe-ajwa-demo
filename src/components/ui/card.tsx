import * as React from "react"
import { cn } from "cn"

/*
 * Cards sit on the card colour with a hairline border. Start a card with CardMedia for a photo
 * that runs to the edges. Set interactive when the whole card is a link or button, so the border
 * lifts on hover and the focus ring shows. Spacing comes from --card-spacing, so the sm size
 * tightens every part at once.
 */
function Card({
  className,
  size = "default",
  interactive = false,
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; interactive?: boolean }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-interactive={interactive || undefined}
      className={cn(
        "group/card relative flex flex-col gap-(--card-spacing) overflow-hidden rounded-2xl border bg-card py-(--card-spacing) text-sm text-card-foreground",
        "[--card-spacing:--spacing(5)] data-[size=sm]:[--card-spacing:--spacing(4)]",
        "has-[>[data-slot=card-media]:first-child]:pt-0",
        "data-interactive:transition-[border-color,box-shadow] data-interactive:duration-150 data-interactive:hover:border-input/60 data-interactive:hover:shadow-[0_6px_20px_-10px_rgb(26_26_26/0.25)] motion-reduce:transition-none",
        "has-focus-visible:data-interactive:ring-2 has-focus-visible:data-interactive:ring-ring has-focus-visible:data-interactive:ring-offset-2 has-focus-visible:data-interactive:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

/* A photo area that runs to the card edges. Overlay badges or buttons by positioning children. */
function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "relative aspect-[4/3] overflow-hidden bg-secondary *:[img]:size-full *:[img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-[0.9375rem]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-3 px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardMedia,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
