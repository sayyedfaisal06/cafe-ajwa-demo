import {
  ArrowRightIcon,
  ArrowUpDownIcon,
  AwardIcon,
  BikeIcon,
  CircleCheckIcon,
  ClockIcon,
  DrumstickIcon,
  FlameIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  LayoutGridIcon,
  LeafIcon,
  ListIcon,
  LogOutIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  ShoppingBagIcon,
  StoreIcon,
  TagIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserIcon,
  XIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import logo from '@/assets/logo.png'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { Badge, BadgeDot } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbBack,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
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
import { ScrollRow } from '@/components/ui/scroll-row'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AddressFormDemo,
  AnnouncementBar,
  BannerCarousel,
  CartSheetDemo,
  CateringBanner,
  CategoryCard,
  CategoryGrid,
  ComboOfferCard,
  CouponStrip,
  DishCard,
  DishCardSkeleton,
  DetailsFormDemo,
  DishRow,
  FestiveBanner,
  FestiveOfferCard,
  FilterBarDemo,
  HeroBanner,
  OfferCard,
  OrderCard,
  ReferralCard,
  ScrollAreaDemo,
  SearchDemo,
  VerifyPhoneDemo,
  cardDishes,
  coupons,
  menuCategories,
} from '@/pages/ui-preview-demos'

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

const colorTokens = [
  { name: 'background', value: '#f8f6f1', use: 'Page background' },
  { name: 'card', value: '#fffdf9', use: 'Cards, popovers, fields' },
  { name: 'secondary', value: '#f1ede4', use: 'Secondary buttons, muted areas' },
  { name: 'accent', value: '#e9e3d7', use: 'Hover and selected rows' },
  { name: 'border', value: '#e9e3d7', use: 'Dividers and card edges' },
  { name: 'input', value: '#8e8574', use: 'Field and control borders' },
  { name: 'primary', value: '#0f3d2e', use: 'Brand, main actions, focus ring' },
  { name: 'foreground', value: '#1a1a1a', use: 'Body text' },
  { name: 'muted-foreground', value: '#5f5a50', use: 'Secondary text' },
  { name: 'destructive', value: '#b42318', use: 'Errors and removal' },
  { name: 'success', value: '#1e6b45', use: 'Confirmations, open now' },
  { name: 'warning', value: '#8a4b08', use: 'Delays, paused delivery' },
]

const typeScale = [
  { label: 'Display, 36px', className: 'text-4xl font-semibold tracking-tight' },
  { label: 'Heading 1, 30px', className: 'text-3xl font-semibold tracking-tight' },
  { label: 'Heading 2, 24px', className: 'text-2xl font-semibold' },
  { label: 'Heading 3, 20px', className: 'text-xl font-semibold' },
  { label: 'Body, 16px', className: 'text-base' },
  { label: 'Small, 14px', className: 'text-sm' },
  { label: 'Caption, 12px', className: 'text-xs text-muted-foreground' },
]

function formatPrice(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function meta() {
  return [
    { title: 'UI elements, Cafe Ajwa' },
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'The Cafe Ajwa design system: colours, type and every UI element with real menu content.' },
  ]
}

function UiPreview() {
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
          <h1 className="font-heading text-3xl font-semibold tracking-tight">UI elements</h1>
          <p className="max-w-2xl text-muted-foreground">
            The base elements of the Cafe Ajwa design system, shown with real content. Tokens live
            in src/index.css and elements in src/components/ui. Controls are at least 44px tall for
            touch.
          </p>
        </div>

        <Section title="Colour" description="Theme tokens. Text pairs meet WCAG AA contrast.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="flex flex-col overflow-hidden rounded-lg border bg-card">
                <div className="h-16 border-b" style={{ background: `var(--${token.name})` }} />
                <div className="flex flex-col gap-0.5 p-3">
                  <span className="text-sm font-medium">{token.name}</span>
                  <span className="text-xs text-muted-foreground">{token.value}</span>
                  <span className="text-xs text-muted-foreground">{token.use}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        <Section
          title="Typography"
          description="Bricolage Grotesque for headings and body. One variable font file."
        >
          <div className="flex flex-col divide-y rounded-lg border bg-card">
            {typeScale.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-36 shrink-0 text-xs text-muted-foreground">{item.label}</span>
                <span className={item.className}>Freshly made in Malwani since 2001</span>
              </div>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Radius" description="Corner radius scale, based on a 12px base.">
          <div className="flex flex-wrap gap-4">
            {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'].map(
              (radius) => (
                <div key={radius} className="flex flex-col items-center gap-2">
                  <div className={`size-16 border-2 border-primary bg-secondary ${radius}`} />
                  <span className="text-xs text-muted-foreground">{radius}</span>
                </div>
              ),
            )}
          </div>
        </Section>

        <Separator />

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
                <Button size="icon" variant="outline" aria-label="Add one">
                  <PlusIcon />
                </Button>
              </div>
            </Panel>
            <Panel label="With icons">
              <div className="flex flex-wrap items-center gap-3">
                <Button>
                  <ShoppingBagIcon data-icon="inline-start" />
                  Add to cart
                </Button>
                <Button variant="secondary">
                  <PhoneIcon data-icon="inline-start" />
                  Call now
                </Button>
                <Button variant="outline">
                  Full menu
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Search">
                  <SearchIcon />
                </Button>
                <Button variant="secondary" size="icon" aria-label="Save to favourites">
                  <HeartIcon />
                </Button>
              </div>
            </Panel>
            <Panel label="With price">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">
                  Place order
                  <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">
                    {formatPrice(560)}
                  </span>
                </Button>
                <Button>
                  Add to cart
                  <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">
                    {formatPrice(240)}
                  </span>
                </Button>
              </div>
            </Panel>
            <Panel label="States">
              <div className="flex flex-wrap items-center gap-3">
                <Button disabled aria-busy>
                  <Spinner data-icon="inline-start" />
                  Placing order
                </Button>
                <Button disabled>Sold out today</Button>
                <Button disabled variant="outline">
                  Closed, opens at 12 pm
                </Button>
              </div>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section title="Badges" description="Labels for dish type, status and offers.">
          <div className="flex flex-col gap-6">
            <Panel label="Variants">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </Panel>
            <Panel label="Sizes">
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm">Small</Badge>
                <Badge>Default</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </Panel>
            <Panel label="Dish tags">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">
                  <LeafIcon />
                  Veg
                </Badge>
                <Badge variant="destructive">
                  <DrumstickIcon />
                  Non veg
                </Badge>
                <Badge>
                  <AwardIcon />
                  Bestseller
                </Badge>
                <Badge variant="warning">
                  <FlameIcon />
                  Spicy
                </Badge>
                <Badge variant="outline">Serves 2</Badge>
                <Badge variant="outline">4 pcs</Badge>
                <Badge variant="secondary">
                  <TagIcon />
                  20% off
                </Badge>
              </div>
            </Panel>
            <Panel label="Status">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" size="lg">
                  <BadgeDot />
                  Open now
                </Badge>
                <Badge variant="warning" size="lg">
                  <BadgeDot />
                  Delivery paused
                </Badge>
                <Badge variant="secondary" size="lg">
                  <BadgeDot />
                  Closed, opens at 12 pm
                </Badge>
                <Badge variant="destructive">Sold out today</Badge>
                <Badge variant="secondary">Since 2001</Badge>
              </div>
            </Panel>
            <Panel label="Counts">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Button variant="secondary" size="icon" aria-label="Cart, 3 items">
                    <ShoppingBagIcon />
                  </Button>
                  <Badge shape="count" size="sm" className="absolute -top-1 -right-1" aria-hidden>
                    3
                  </Badge>
                </div>
                <Badge shape="count">12</Badge>
                <Badge shape="count" variant="secondary">
                  99+
                </Badge>
              </div>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section
          title="Cards"
          description="Dish cards for desktop, dish rows for phones, and offer, order and category cards."
        >
          <div className="flex flex-col gap-10">
            <Panel label="Dish cards">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cardDishes.map((dish) => (
                  <DishCard key={dish.name} dish={dish} />
                ))}
                <DishCardSkeleton />
              </div>
            </Panel>

            <Panel label="Dish rows">
              <div className="flex max-w-md flex-col divide-y rounded-2xl border bg-card px-4">
                {cardDishes.map((dish) => (
                  <DishRow key={dish.name} dish={dish} />
                ))}
              </div>
            </Panel>

            <Panel label="Category tiles">
              <CategoryGrid categories={menuCategories} />
            </Panel>

            <Panel label="Offer cards">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OfferCard />
                <FestiveOfferCard />
                <ComboOfferCard />
                <ReferralCard />
              </div>
            </Panel>

            <Panel label="Coupon strips">
              <div className="flex max-w-md flex-col gap-3">
                {coupons.map((coupon) => (
                  <CouponStrip key={coupon.code} coupon={coupon} />
                ))}
              </div>
            </Panel>

            <div className="grid gap-6 md:grid-cols-2">
              <Panel label="Order card">
                <OrderCard />
              </Panel>
              <Panel label="Category cards">
                <div className="flex flex-col gap-3">
                  <CategoryCard name="Chicken Curries" count={15} />
                  <CategoryCard name="Tandoor and Kebabs" count={7} />
                  <CategoryCard name="Indo Chinese Starters" count={4} />
                </div>
              </Panel>
            </div>
          </div>
        </Section>

        <Separator />

        <Section
          title="Banners"
          description="Announcement bars, the home hero, wide promo banners and a swipeable offer row."
        >
          <div className="flex flex-col gap-10">
            <Panel label="Announcement bars">
              <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border">
                <AnnouncementBar icon={ClockIcon} linkLabel="Order now">
                  Open now, taking orders until 12 am.
                </AnnouncementBar>
                <AnnouncementBar tone="warning" icon={TriangleAlertIcon} linkLabel="Order for pickup">
                  Delivery is paused right now.
                </AnnouncementBar>
                <AnnouncementBar tone="info" icon={TagIcon} linkLabel="See offer">
                  20% off your first order with AJWA20.
                </AnnouncementBar>
              </div>
            </Panel>

            <Panel label="Hero">
              <div className="flex flex-col gap-4">
                <HeroBanner />
                <HeroBanner tone="cream" />
              </div>
            </Panel>

            <Panel label="Promo banners">
              <div className="flex flex-col gap-4">
                <CateringBanner />
                <FestiveBanner />
              </div>
            </Panel>

            <Panel label="Offer row">
              <BannerCarousel />
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section
          title="Search"
          description="Search with suggestions. Focus shows recent searches and popular dishes. Typing matches dishes and categories, and small typos still match."
        >
          <div className="max-w-xl">
            <SearchDemo />
          </div>
        </Section>

        <Separator />

        <Section
          title="Forms"
          description="Fields share one style: 44px tall, a green focus ring and clear errors. Text stays 16px on phones so iOS does not zoom."
        >
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <AddressFormDemo />
            <div className="flex min-w-0 flex-col gap-6">
              <DetailsFormDemo />
              <VerifyPhoneDemo />
            </div>
          </div>
        </Section>

        <Separator />

        <Section
          title="Selection controls"
          description="Checkbox, radio, switch, toggle group and option cards."
        >
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            <Panel label="Checkbox">
              <FieldGroup className="gap-4">
                <Field orientation="horizontal">
                  <Checkbox id="addons-all" indeterminate />
                  <FieldLabel htmlFor="addons-all">All add ons</FieldLabel>
                </Field>
                <Field orientation="horizontal" className="pl-8">
                  <Checkbox id="addon-raita" defaultChecked />
                  <FieldLabel htmlFor="addon-raita">Extra raita</FieldLabel>
                </Field>
                <Field orientation="horizontal" className="pl-8">
                  <Checkbox id="addon-gravy" />
                  <FieldLabel htmlFor="addon-gravy">Extra gravy</FieldLabel>
                </Field>
                <Field orientation="horizontal" data-disabled>
                  <Checkbox id="cutlery" disabled />
                  <FieldLabel htmlFor="cutlery">Send cutlery, not available for pickup</FieldLabel>
                </Field>
              </FieldGroup>
            </Panel>

            <Panel label="Radio">
              <RadioGroup defaultValue="medium" className="gap-4">
                <Field orientation="horizontal">
                  <RadioGroupItem value="mild" id="spice-mild" />
                  <FieldLabel htmlFor="spice-mild">Mild</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="medium" id="spice-medium" />
                  <FieldLabel htmlFor="spice-medium">Medium</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="hot" id="spice-hot" />
                  <FieldLabel htmlFor="spice-hot">Hot</FieldLabel>
                </Field>
                <Field orientation="horizontal" data-disabled>
                  <RadioGroupItem value="extra-hot" id="spice-extra" disabled />
                  <FieldLabel htmlFor="spice-extra">Extra hot, not for this dish</FieldLabel>
                </Field>
              </RadioGroup>
            </Panel>

            <Panel label="Switch">
              <FieldGroup className="gap-4">
                <Field orientation="horizontal">
                  <Switch id="loyalty" defaultChecked />
                  <FieldLabel htmlFor="loyalty">Use loyalty points</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Switch id="save-address" />
                  <FieldLabel htmlFor="save-address">Save this address</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Switch id="offers" size="sm" defaultChecked />
                  <FieldLabel htmlFor="offers">Send me offers on WhatsApp</FieldLabel>
                </Field>
                <Field orientation="horizontal" data-disabled>
                  <Switch id="paused" disabled />
                  <FieldLabel htmlFor="paused">Schedule for later, coming soon</FieldLabel>
                </Field>
              </FieldGroup>
            </Panel>

            <Panel label="Toggle group">
              <div className="flex flex-col gap-5">
                <ToggleGroup defaultValue={['all']} variant="outline" size="sm" aria-label="Filter dishes">
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                  <ToggleGroupItem value="veg">
                    <LeafIcon data-icon="inline-start" />
                    Veg
                  </ToggleGroupItem>
                  <ToggleGroupItem value="non-veg">
                    <DrumstickIcon data-icon="inline-start" />
                    Non veg
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bestsellers">
                    <AwardIcon data-icon="inline-start" />
                    Bestsellers
                  </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup
                  defaultValue={['delivery']}
                  variant="segment"
                  className="w-full max-w-sm"
                  aria-label="Order type"
                >
                  <ToggleGroupItem value="delivery">
                    <BikeIcon data-icon="inline-start" />
                    Delivery
                  </ToggleGroupItem>
                  <ToggleGroupItem value="pickup">
                    <StoreIcon data-icon="inline-start" />
                    Pickup
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="flex items-center gap-4">
                  <ToggleGroup defaultValue={['full']} variant="segment" size="sm" aria-label="Portion">
                    <ToggleGroupItem value="half">Half</ToggleGroupItem>
                    <ToggleGroupItem value="full">Full</ToggleGroupItem>
                  </ToggleGroup>
                  <ToggleGroup defaultValue={['grid']} aria-label="Menu layout">
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <LayoutGridIcon />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <ListIcon />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </Panel>

            <div className="md:col-span-2">
              <Panel label="Option cards">
                <RadioGroup defaultValue="upi" className="grid gap-3 sm:grid-cols-3">
                  <FieldLabel htmlFor="pay-upi">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>UPI or card</FieldTitle>
                        <FieldDescription>Pay online with Razorpay.</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="upi" id="pay-upi" />
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="pay-cod">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Cash on delivery</FieldTitle>
                        <FieldDescription>Pay the rider when your order arrives.</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="cod" id="pay-cod" />
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="pay-pickup">
                    <Field orientation="horizontal" data-disabled>
                      <FieldContent>
                        <FieldTitle>Pay at pickup</FieldTitle>
                        <FieldDescription>Only for pickup orders.</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="pickup" id="pay-pickup" disabled />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </Panel>
            </div>
          </div>
        </Section>

        <Separator />

        <Section
          title="Navigation"
          description="Category bar, filter bar, breadcrumb, tabs and pagination."
        >
          <div className="flex flex-col gap-8">
            <Panel label="Categories">
              <ScrollRow scrollLabel="categories">
                <ToggleGroup
                  defaultValue={[categories[0]]}
                  variant="outline"
                  size="sm"
                  className="w-max flex-nowrap"
                  aria-label="Menu categories"
                >
                  {categories.map((category) => (
                    <ToggleGroupItem key={category} value={category}>
                      {category}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </ScrollRow>
            </Panel>

            <Panel label="Filter bar">
              <FilterBarDemo />
              <p className="text-xs text-muted-foreground">
                Veg, Non veg and Bestsellers switch in one tap. Cuisine, Price and Spice open a
                short list and apply right away.
              </p>
            </Panel>

            <Panel label="Breadcrumb">
              <div className="flex flex-col gap-5">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#" aria-label="Home">
                        <HomeIcon />
                      </BreadcrumbLink>
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

                <Breadcrumb>
                  <BreadcrumbList className="max-sm:hidden">
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              aria-label="Show hidden pages"
                              className="text-muted-foreground"
                            />
                          }
                        >
                          <BreadcrumbEllipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Menu</DropdownMenuItem>
                            <DropdownMenuItem>Tandoor and Kebabs</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Chicken Barra Tandoori with Mint Chutney and Onion Salad</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                  <BreadcrumbBack href="#" className="sm:hidden">
                    Tandoor and Kebabs
                  </BreadcrumbBack>
                </Breadcrumb>
                <p className="text-xs text-muted-foreground">
                  Long trails collapse into a menu and long names truncate. On phones the trail
                  becomes one link back to the parent page.
                </p>
              </div>
            </Panel>

            <Panel label="Tabs">
              <div className="grid gap-10 md:grid-cols-2">
                <Tabs defaultValue="active">
                  <TabsList className="max-sm:w-full">
                    <TabsTrigger value="active">
                      Active
                      <Badge shape="count" size="sm">
                        1
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="past">Past orders</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="text-muted-foreground">
                    Order 1042 is out for delivery.
                  </TabsContent>
                  <TabsContent value="past" className="text-muted-foreground">
                    You have 6 past orders.
                  </TabsContent>
                </Tabs>

                <Tabs defaultValue="orders" className="min-w-0">
                  <ScrollRow scrollLabel="account sections">
                    <TabsList variant="line" className="w-max">
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="rewards">Rewards</TabsTrigger>
                      <TabsTrigger value="addresses">Addresses</TabsTrigger>
                      <TabsTrigger value="profile">Profile and security</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                  </ScrollRow>
                  <TabsContent value="orders" className="text-muted-foreground">
                    Your active order shows here, then past orders.
                  </TabsContent>
                  <TabsContent value="rewards" className="text-muted-foreground">
                    Points balance and referral code.
                  </TabsContent>
                  <TabsContent value="addresses" className="text-muted-foreground">
                    Saved delivery addresses.
                  </TabsContent>
                  <TabsContent value="profile" className="text-muted-foreground">
                    Name, phone and password.
                  </TabsContent>
                  <TabsContent value="notifications" className="text-muted-foreground">
                    Order updates and offers.
                  </TabsContent>
                </Tabs>

                <Tabs defaultValue="details">
                  <TabsList variant="line">
                    <TabsTrigger value="details">
                      <InfoIcon />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                      <StarIcon />
                      Reviews
                      <Badge shape="count" size="sm" variant="secondary">
                        24
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="allergens">
                      <TriangleAlertIcon />
                      Allergens
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="text-muted-foreground">
                    Serves 2, medium spice.
                  </TabsContent>
                  <TabsContent value="reviews" className="text-muted-foreground">
                    The newest 3 reviews show first.
                  </TabsContent>
                  <TabsContent value="allergens" className="text-muted-foreground">
                    Contains dairy and gluten.
                  </TabsContent>
                </Tabs>

                <Tabs defaultValue="orders" orientation="vertical" className="gap-6">
                  <TabsList variant="line">
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  </TabsList>
                  <TabsContent value="orders" className="text-muted-foreground">
                    Vertical tabs for the account area on desktop.
                  </TabsContent>
                  <TabsContent value="rewards" className="text-muted-foreground">
                    Points balance and referral code.
                  </TabsContent>
                  <TabsContent value="addresses" className="text-muted-foreground">
                    Saved delivery addresses.
                  </TabsContent>
                </Tabs>
              </div>
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
          title="Scrolling"
          description="Boxed lists use a slim scrollbar that fades in on hover or scroll. A soft shadow marks an edge while content continues past it. The page and panels use native scrollbars in the same warm grey."
        >
          <ScrollAreaDemo />
        </Section>

        <Separator />

        <Section
          title="Overlays"
          description="Dialogs, sheets, menus, tooltip and toasts. On phones dialogs open from the bottom."
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Panel label="Dialogs">
              <div className="flex flex-wrap items-center gap-3">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" />}>Customise dish</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chicken Kolhapuri</DialogTitle>
                      <DialogDescription>
                        Spicy Kolhapuri gravy with roasted coconut and red chilli.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">Portion</span>
                        <ToggleGroup
                          defaultValue={['full']}
                          variant="segment"
                          className="w-full"
                          aria-label="Portion"
                        >
                          <ToggleGroupItem value="half">Half, {formatPrice(160)}</ToggleGroupItem>
                          <ToggleGroupItem value="full">Full, {formatPrice(240)}</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <FieldGroup className="gap-4">
                        <span className="text-sm font-semibold">Add ons</span>
                        <Field orientation="horizontal">
                          <Checkbox id="dlg-roti" />
                          <FieldLabel htmlFor="dlg-roti" className="flex-1">
                            Tandoori Roti
                          </FieldLabel>
                          <span className="text-sm text-muted-foreground">{formatPrice(20)}</span>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox id="dlg-rice" />
                          <FieldLabel htmlFor="dlg-rice" className="flex-1">
                            Jeera Rice
                          </FieldLabel>
                          <span className="text-sm text-muted-foreground">{formatPrice(110)}</span>
                        </Field>
                      </FieldGroup>
                    </div>
                    <DialogFooter>
                      <DialogClose render={<Button className="w-full" />}>
                        Add to cart
                        <span className="border-l border-primary-foreground/30 pl-3 tabular-nums">
                          {formatPrice(240)}
                        </span>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger render={<Button variant="outline" />}>
                    <Trash2Icon data-icon="inline-start" />
                    Clear cart
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="sm:max-w-sm">
                    <DialogHeader className="pr-0">
                      <DialogTitle>Clear your cart?</DialogTitle>
                      <DialogDescription>
                        This removes all 3 items. You can add them again from the menu.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>Keep items</DialogClose>
                      <DialogClose render={<Button variant="destructive" />}>Clear cart</DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Panel>

            <Panel label="Sheet">
              <div className="flex flex-wrap items-center gap-3">
                <CartSheetDemo />
              </div>
            </Panel>

            <Panel label="Menus and tooltip">
              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" />}>
                    <UserIcon data-icon="inline-start" />
                    Account
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>My account</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <PackageIcon />
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MapPinIcon />
                        Addresses
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <GiftIcon />
                        Rewards
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem variant="destructive">
                        <LogOutIcon />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" />}>
                    <ArrowUpDownIcon data-icon="inline-start" />
                    Sort
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Sort dishes</DropdownMenuLabel>
                      <DropdownMenuRadioGroup defaultValue="popular">
                        <DropdownMenuRadioItem value="popular">Most popular</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="low">Price, low to high</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="high">Price, high to low</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="secondary" size="icon" aria-label="Save to favourites" />}
                  >
                    <HeartIcon />
                  </TooltipTrigger>
                  <TooltipContent>Save to favourites</TooltipContent>
                </Tooltip>
              </div>
            </Panel>

            <Panel label="Toasts">
              <div className="flex flex-wrap items-center gap-3">
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
                  Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: 'Delivery paused',
                      description: 'You can still order for pickup.',
                      type: 'warning',
                    })
                  }
                >
                  Warning
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: 'Payment failed',
                      description: 'No money was taken. Try again or pick another method.',
                      type: 'error',
                    })
                  }
                >
                  Error
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: 'Coupon applied',
                      description: 'You save 20% on this order.',
                      type: 'info',
                    })
                  }
                >
                  Info
                </Button>
              </div>
            </Panel>
          </div>
        </Section>

        <Separator />

        <Section
          title="Feedback"
          description="Alerts, empty states, loading and avatars."
        >
          <div className="flex flex-col gap-10">
            <Panel label="Alerts">
              <div className="grid gap-3 md:grid-cols-2">
                <Alert>
                  <MapPinIcon />
                  <AlertTitle>Pickup point</AlertTitle>
                  <AlertDescription>Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony.</AlertDescription>
                </Alert>
                <Alert variant="info">
                  <InfoIcon />
                  <AlertTitle>Open every day</AlertTitle>
                  <AlertDescription>The kitchen is open from 12 pm to 12 am, Monday to Sunday.</AlertDescription>
                </Alert>
                <Alert variant="success">
                  <CircleCheckIcon />
                  <AlertTitle>Order placed</AlertTitle>
                  <AlertDescription>Order 1042 will reach you in about 40 minutes.</AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <ClockIcon />
                  <AlertTitle>Delivery paused</AlertTitle>
                  <AlertDescription>Pickup is still available while delivery is paused.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <TriangleAlertIcon />
                  <AlertTitle>Outside delivery area</AlertTitle>
                  <AlertDescription>
                    This address is outside our delivery area. Choose pickup or order on{' '}
                    <a href="#">Swiggy</a> or <a href="#">Zomato</a>.
                  </AlertDescription>
                </Alert>
                <Alert variant="info">
                  <TagIcon />
                  <AlertTitle>New here? Get 20% off</AlertTitle>
                  <AlertDescription>Use code AJWA20 on your first order.</AlertDescription>
                  <AlertAction>
                    <Button variant="ghost" size="icon-sm" aria-label="Dismiss offer">
                      <XIcon />
                    </Button>
                  </AlertAction>
                </Alert>
              </div>
            </Panel>

            <Panel label="Empty states">
              <div className="grid gap-4 md:grid-cols-2">
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
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <SearchIcon />
                    </EmptyMedia>
                    <EmptyTitle>No dishes match "biriyani"</EmptyTitle>
                    <EmptyDescription>Check the spelling or try one of these.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent className="flex-row flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm">Chicken Pulao</Button>
                    <Button variant="outline" size="sm">Veg Biryani</Button>
                    <Button variant="outline" size="sm">Paneer Biryani</Button>
                  </EmptyContent>
                </Empty>
              </div>
            </Panel>

            <Panel label="Loading">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-5 text-primary">
                    <Spinner className="size-4" />
                    <Spinner className="size-6" />
                    <Spinner className="size-8" />
                    <span className="text-sm text-muted-foreground">Loading menu</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button disabled aria-busy>
                      <Spinner data-icon="inline-start" />
                      Placing order
                    </Button>
                    <Button variant="outline" disabled aria-busy>
                      <Spinner data-icon="inline-start" />
                      Checking address
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4">
                  {[0, 1].map((row) => (
                    <div key={row} className="flex gap-3">
                      <Skeleton className="size-18 rounded-xl" />
                      <div className="flex flex-1 flex-col gap-2 py-1">
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-3 w-2/5" />
                        <Skeleton className="mt-auto h-8 w-24 self-end rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel label="Avatars">
              <div className="flex flex-wrap items-center gap-6">
                <Avatar size="sm">
                  <AvatarFallback>FS</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>FS</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="/apple-touch-icon.png" alt="Cafe Ajwa" />
                  <AvatarFallback>CA</AvatarFallback>
                  <AvatarBadge>
                    <span className="sr-only">Open now</span>
                  </AvatarBadge>
                </Avatar>
                <AvatarGroup>
                  <Avatar>
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+12</AvatarGroupCount>
                </AvatarGroup>
              </div>
            </Panel>
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

export default UiPreview
