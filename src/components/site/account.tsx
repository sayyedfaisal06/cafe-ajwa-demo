import { BellIcon, GiftIcon, HeartIcon, LogOutIcon, MapPinIcon, PackageIcon, UserIcon, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { useAuth } from '@/components/site/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'

/* The account sections, shared by the account layout and the header's account menu. */
export const accountSections: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/account/orders', label: 'Orders', icon: PackageIcon },
  { to: '/account/favourites', label: 'Favourites', icon: HeartIcon },
  { to: '/account/loyalty', label: 'Rewards and referrals', icon: GiftIcon },
  { to: '/account/addresses', label: 'Addresses', icon: MapPinIcon },
  { to: '/account/notifications', label: 'Notifications', icon: BellIcon },
  { to: '/account/profile', label: 'Profile', icon: UserIcon },
]

/*
 * Asks before logging out, from the header's account menu or the profile page. Nothing is sent to
 * the API yet, so logging out clears the flag kept in this browser and goes to the home page.
 */
export function LogOutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate()
  const { logOut: endSession } = useAuth()
  const logOut = () => {
    endSession({ to: '/' })
    navigate('/')
    toast.add({ title: 'You are logged out', description: 'Log in again to order or track an order.', type: 'success' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <span className="flex size-11 items-center justify-center rounded-full bg-highlight text-primary">
            <LogOutIcon aria-hidden="true" className="size-5" />
          </span>
          <DialogTitle>Log out of Cafe Ajwa?</DialogTitle>
          <DialogDescription>You will need to log in again to place an order or track one.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Stay logged in</DialogClose>
          <DialogClose render={<Button onClick={logOut} />}>Log out</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
