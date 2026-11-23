import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

/*
 * A thin track with green fill and round thumbs. The control is 44px tall and each thumb has a
 * larger invisible grab area for touch. Pass thumbLabels so screen readers can tell the thumbs of
 * a range apart, such as ["Minimum price", "Maximum price"].
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  ...props
}: SliderPrimitive.Root.Props & { thumbLabels?: string[] }) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-45 data-horizontal:h-11 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-11 data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-accent select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={thumbLabels?.[index]}
            className={cn(
              "relative block size-5 shrink-0 rounded-full border-2 border-primary bg-card shadow-[0_1px_3px_rgb(0_0_0/0.2)] select-none",
              "transition-[box-shadow,scale] duration-150 motion-reduce:transition-none",
              "after:absolute after:-inset-3",
              "hover:ring-4 hover:ring-primary/15 active:scale-110 active:ring-4 active:ring-primary/20 motion-reduce:active:scale-100",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden",
              "disabled:pointer-events-none"
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
