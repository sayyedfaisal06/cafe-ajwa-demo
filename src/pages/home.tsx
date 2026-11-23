import {
  ArrowRightIcon,
  HeartIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
  TriangleAlertIcon,
  UserIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import logo from '@/assets/logo.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const categories = [
  'Combos',
  'Tandoor and Kebabs',
  'Chicken Starters',
  'Indo Chinese Starters',
  'Chicken Curries',
  'Indo Chinese Mains',
  'Paneer and Veg',
  'Biryani and Pulao',
  'Fried Rice and Noodles',
  'Rice and Dal',
  'Breads',
  'Soups',
]

const dishes = [
  {
    name: 'Chicken Kolhapuri',
    description: 'Spicy Kolhapuri gravy with roasted coconut and red chilli.',
    price: 240,
    veg: false,
  },
  {
    name: 'Paneer Butter Garlic',
    description: 'Paneer cubes tossed in butter, garlic and herbs.',
    price: 320,
    veg: true,
  },
  {
    name: 'Chicken Kung Pao',
    description: 'Chicken with peanuts, dried chillies and a sweet soy glaze.',
    price: 290,
    veg: false,
  },
]

const sizeItems = [
  { label: 'Half', value: 'half' },
  { label: 'Full', value: 'full' },
]

const cityItems = [
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Thane', value: 'thane' },
  { label: 'Navi Mumbai', value: 'navi-mumbai' },
]

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {children}
    </div>
  )
}

function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

function Home() {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <img src={logo} alt="Cafe Ajwa" className="h-12 w-auto" />
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Component preview</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold">Components</h1>
          <p className="max-w-2xl text-muted-foreground">
            Every shadcn component in the project, shown with Cafe Ajwa content. Change the theme
            in src/index.css or a component in src/components/ui and the result shows here.
          </p>
        </div>

        <Section title="Buttons" description="Variants, sizes, icons and loading state.">
          <div className="flex flex-col gap-6">
            <Panel label="Variants">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Order now</Button>
                <Button variant="secondary">View menu</Button>
                <Button variant="outline">Catering</Button>
                <Button variant="ghost">About</Button>
                <Button variant="destructive">Remove</Button>
                <Button variant="link">Contact us</Button>
              </div>
            </Panel>
            <Panel label="Sizes">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" variant="outline" aria-label="Add to cart">
                  <PlusIcon />
                </Button>
              </div>
            </Panel>
            <Panel label="With icons and states">
              <div className="flex flex-wrap items-center gap-3">
                <Button>
                  <ShoppingBagIcon data-icon="inline-start" />
                  Add to cart
                </Button>
                <Button variant="outline">
                  Full menu
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button disabled>
                  <Spinner data-icon="inline-start" />
                  Placing order
                </Button>
                <Button disabled variant="outline">
                  Sold out
                </Button>
              </div>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section title="Badges" description="Labels for dish type, status and offers.">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Bestseller</Badge>
            <Badge variant="secondary">Veg</Badge>
            <Badge variant="outline">Non veg</Badge>
            <Badge variant="destructive">Sold out</Badge>
            <Badge variant="secondary">Since 2001</Badge>
          </div>
        </Section>

        <Separator />

        <Section title="Cards" description="Dish cards for the menu, with a loading placeholder.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dishes.map((dish) => (
              <Card key={dish.name}>
                <CardHeader>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardDescription>{dish.description}</CardDescription>
                  <CardAction>
                    <Badge variant={dish.veg ? 'secondary' : 'outline'}>
                      {dish.veg ? 'Veg' : 'Non veg'}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{formatPrice(dish.price)}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className="w-full"
                    onClick={() =>
                      toast.add({
                        title: 'Added to cart',
                        description: `${dish.name}, ${formatPrice(dish.price)}`,
                        type: 'success',
                      })
                    }
                  >
                    <PlusIcon data-icon="inline-start" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-16" />
              </CardContent>
              <CardFooter className="mt-auto">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Separator />

        <Section title="Forms" description="Inputs and fields for checkout and the address form.">
          <div className="grid gap-10 lg:grid-cols-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input id="name" placeholder="Your name" autoComplete="name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input id="phone" type="tel" placeholder="10 digit mobile number" />
                <FieldDescription>We call this number if the rider cannot find you.</FieldDescription>
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
                <Input id="pincode" defaultValue="4000" aria-invalid />
                <FieldError>Pincode must be 6 digits.</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="instructions">Delivery instructions</FieldLabel>
                <Textarea id="instructions" placeholder="Ring the bell, leave at the door" />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="search">Search</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="search" placeholder="Search dishes" />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="coupon">Coupon</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="coupon" placeholder="Enter coupon code" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>Apply</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Size</FieldLabel>
                <Select items={sizeItems} defaultValue="full">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sizeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>City</FieldLabel>
                <Select items={cityItems} defaultValue="mumbai">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cityItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>
        </Section>

        <Separator />

        <Section title="Selection controls" description="Checkbox, radio group, switch and toggle group.">
          <div className="grid gap-10 lg:grid-cols-3">
            <FieldSet>
              <FieldLegend variant="label">Order type</FieldLegend>
              <RadioGroup defaultValue="delivery">
                <Field orientation="horizontal">
                  <RadioGroupItem value="delivery" id="order-delivery" />
                  <FieldLabel htmlFor="order-delivery">Delivery</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="pickup" id="order-pickup" />
                  <FieldLabel htmlFor="order-pickup">Pickup</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>

            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="default-address" defaultChecked />
                <FieldLabel htmlFor="default-address">Set as default address</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="cutlery" />
                <FieldLabel htmlFor="cutlery">Send cutlery</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Switch id="loyalty" defaultChecked />
                <FieldLabel htmlFor="loyalty">Use loyalty points</FieldLabel>
              </Field>
            </FieldGroup>

            <Panel label="Dish filter">
              <ToggleGroup defaultValue={['all']} variant="outline">
                <ToggleGroupItem value="all">All</ToggleGroupItem>
                <ToggleGroupItem value="veg">Veg</ToggleGroupItem>
                <ToggleGroupItem value="non-veg">Non veg</ToggleGroupItem>
              </ToggleGroup>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section
          title="Navigation"
          description="Tabs, breadcrumb, pagination and a scrolling category bar."
        >
          <div className="flex flex-col gap-8">
            <Panel label="Categories">
              <ScrollArea className="w-full">
                <div className="flex w-max gap-2 pb-3">
                  {categories.map((category, index) => (
                    <Button key={category} size="sm" variant={index === 0 ? 'default' : 'outline'}>
                      {category}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Panel>

            <Panel label="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Menu</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Chicken Curries</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Panel>

            <Panel label="Tabs">
              <Tabs defaultValue="active" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="active">Active orders</TabsTrigger>
                  <TabsTrigger value="past">Past orders</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="pt-2 text-sm text-muted-foreground">
                  Order 1042 is out for delivery.
                </TabsContent>
                <TabsContent value="past" className="pt-2 text-sm text-muted-foreground">
                  You have 6 past orders.
                </TabsContent>
              </Tabs>
            </Panel>

            <Panel label="Pagination">
              <Pagination className="justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section
          title="Overlays"
          description="Dialog, sheet, dropdown menu, tooltip and toast. Click each one to open it."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Customise dish</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chicken Kolhapuri</DialogTitle>
                  <DialogDescription>Pick a size before adding it to your cart.</DialogDescription>
                </DialogHeader>
                <RadioGroup defaultValue="full">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="half" id="size-half" />
                    <FieldLabel htmlFor="size-half">Half, {formatPrice(160)}</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <RadioGroupItem value="full" id="size-full" />
                    <FieldLabel htmlFor="size-full">Full, {formatPrice(240)}</FieldLabel>
                  </Field>
                </RadioGroup>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <DialogClose render={<Button />}>Add to cart</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                <ShoppingBagIcon data-icon="inline-start" />
                Cart
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your cart</SheetTitle>
                  <SheetDescription>2 items from Cafe Ajwa</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 px-4">
                  {dishes.slice(0, 2).map((dish) => (
                    <div key={dish.name} className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{dish.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon-sm" variant="outline" aria-label="Remove one">
                          <MinusIcon />
                        </Button>
                        <span className="w-4 text-center text-sm">1</span>
                        <Button size="icon-sm" variant="outline" aria-label="Add one">
                          <PlusIcon />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <SheetFooter>
                  <Button>Checkout, {formatPrice(560)}</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <UserIcon data-icon="inline-start" />
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Addresses</DropdownMenuItem>
                  <DropdownMenuItem>Loyalty points</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline" size="icon" aria-label="Save to favourites" />}
              >
                <HeartIcon />
              </TooltipTrigger>
              <TooltipContent>Save to favourites</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              onClick={() =>
                toast.add({
                  title: 'Order placed',
                  description: 'Order 1042 will reach you in about 40 minutes.',
                  type: 'success',
                })
              }
            >
              Show toast
            </Button>
          </div>
        </Section>

        <Separator />

        <Section title="Feedback" description="Alerts, empty state, spinner and avatar.">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Alert>
                <InfoIcon />
                <AlertTitle>Pickup point</AlertTitle>
                <AlertDescription>
                  Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <TriangleAlertIcon />
                <AlertTitle>Outside delivery area</AlertTitle>
                <AlertDescription>
                  This location is outside our delivery area. Choose pickup instead.
                </AlertDescription>
              </Alert>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  Loading menu
                </div>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/apple-touch-icon.png" alt="Cafe Ajwa" />
                    <AvatarFallback>CA</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingBagIcon />
                </EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDescription>Add dishes from the menu to start an order.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>Browse menu</Button>
              </EmptyContent>
            </Empty>
          </div>
        </Section>

        <Separator />

        <Section title="Accordion" description="Used for FAQs on the about and contact pages.">
          <Accordion defaultValue={['hours']} className="max-w-2xl">
            <AccordionItem value="hours">
              <AccordionTrigger>What are your opening hours?</AccordionTrigger>
              <AccordionContent>We are open every day from 12 pm to 12 am.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Where do you deliver?</AccordionTrigger>
              <AccordionContent>
                We deliver around Malwani. Enter your address at checkout to check.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pickup">
              <AccordionTrigger>Can I pick up an order?</AccordionTrigger>
              <AccordionContent>
                Yes. Choose pickup at checkout and collect it from Gate 8, Gaikwad Nagar Bus
                Depot, Malwani Colony.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>
      </main>
    </div>
  )
}

export default Home
