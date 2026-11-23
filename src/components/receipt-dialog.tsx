import { DownloadIcon } from 'lucide-react'
import { useState, type ReactElement } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import {
  downloadReceiptPdf,
  formatReceiptDate,
  formatRupees,
  receiptTotals,
  restaurant,
  type Receipt,
} from '@/lib/receipt'

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? 'flex justify-between text-base font-semibold' : 'flex justify-between text-sm'}>
      <dt className={strong ? undefined : 'text-muted-foreground'}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

/*
 * Shows the receipt for an order and downloads it as a PDF. Pass the button that opens it as
 * trigger, such as the Receipt button on an order card.
 */
function ReceiptDialog({ receipt, trigger }: { receipt: Receipt; trigger: ReactElement }) {
  const [downloading, setDownloading] = useState(false)
  const totals = receiptTotals(receipt)
  const taxPercent = `${(receipt.gstRate * 50).toFixed(1)}%`

  const download = async () => {
    setDownloading(true)
    try {
      await downloadReceiptPdf(receipt)
      toast.add({ title: 'Receipt downloaded', description: `cafe-ajwa-receipt-${receipt.orderNumber}.pdf`, type: 'success' })
    } catch {
      toast.add({ title: 'Could not create the PDF', description: 'Check your connection and try again.', type: 'error' })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>
            Order {receipt.orderNumber}, {formatReceiptDate(receipt.placedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-input/60 bg-background p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-base font-semibold text-primary">
                {restaurant.name}, {restaurant.branch}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{restaurant.address}</span>
            </div>
            <Badge variant="secondary">{receipt.orderType}</Badge>
          </div>

          <dl className="flex flex-col gap-1.5 border-t border-dashed border-input/60 pt-3">
            <Row label="Customer" value={receipt.customer.name} />
            <Row label="Phone" value={receipt.customer.phone} />
            <Row label="Payment" value={receipt.payment} />
          </dl>

          <ul className="flex flex-col gap-2.5 border-t border-dashed border-input/60 pt-3">
            {receipt.lines.map((line) => (
              <li key={line.name} className="flex items-start justify-between gap-3 text-sm">
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">
                    {line.name} <span className="text-muted-foreground tabular-nums">x{line.quantity}</span>
                  </span>
                  {line.options && <span className="text-xs text-muted-foreground">{line.options}</span>}
                </span>
                <span className="font-medium tabular-nums">{formatRupees(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="flex flex-col gap-1.5 border-t border-dashed border-input/60 pt-3">
            <Row label="Subtotal" value={formatRupees(totals.subtotal)} />
            {totals.discount > 0 && receipt.discount && (
              <Row label={receipt.discount.label} value={formatRupees(-totals.discount)} />
            )}
            <Row label="Delivery fee" value={totals.deliveryFee ? formatRupees(totals.deliveryFee) : 'Free'} />
            <Row label={`CGST ${taxPercent}`} value={formatRupees(totals.cgst)} />
            <Row label={`SGST ${taxPercent}`} value={formatRupees(totals.sgst)} />
            <Row label="Round off" value={formatRupees(totals.roundOff)} />
            <div className="mt-1.5 border-t border-input/60 pt-2.5">
              <Row label="Total paid" value={formatRupees(totals.total)} strong />
            </div>
          </dl>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button onClick={download} disabled={downloading} aria-busy={downloading || undefined}>
            {downloading ? <Spinner data-icon="inline-start" /> : <DownloadIcon data-icon="inline-start" />}
            {downloading ? 'Preparing PDF' : 'Download PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ReceiptDialog }
