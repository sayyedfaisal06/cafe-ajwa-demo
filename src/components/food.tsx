import { UtensilsCrossedIcon } from 'lucide-react'

/* The Indian food mark: a square with a circle for veg and a triangle for non veg. */
export function FoodMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={
        veg
          ? 'flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-success'
          : 'flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-destructive'
      }
    >
      {veg ? (
        <span className="size-1.5 rounded-full bg-success" />
      ) : (
        <span className="size-1.5 bg-destructive [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
      )}
      <span className="sr-only">{veg ? 'Veg' : 'Non veg'}</span>
    </span>
  )
}

/* Square image slot. Shows a plate icon until the dish has a photo. */
export function DishThumb({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" loading="lazy" />
      ) : (
        <UtensilsCrossedIcon aria-hidden="true" className="size-6 text-muted-foreground/60" />
      )}
    </div>
  )
}
