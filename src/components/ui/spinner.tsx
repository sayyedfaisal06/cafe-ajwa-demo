import { cn } from "cn"

/*
 * A ring with a faint track and a spinning arc in the current text colour. With reduced motion it
 * spins slowly instead of stopping, so loading is still visible.
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "size-4 animate-spin motion-reduce:animate-[spin_2.5s_linear_infinite]",
        className
      )}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export { Spinner }
