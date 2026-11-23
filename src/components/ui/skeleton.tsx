import { cn } from "cn"

/* Warm placeholder blocks that pulse while content loads, and stay still with reduced motion. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-accent motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
