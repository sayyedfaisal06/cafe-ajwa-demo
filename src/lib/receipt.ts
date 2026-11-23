/*
 * Order receipts: the bill maths shared by the on screen receipt and the PDF, and the PDF builder.
 * The current site builds receipts in the browser with jsPDF and autotable, so this does the same.
 * Both libraries load only when a receipt is downloaded, which keeps them out of the main bundle.
 */

export type ReceiptLine = {
  name: string
  quantity: number
  /** Price of one unit in rupees. */
  price: number
  /** Portion, size or add ons, such as "Full, with Tandoori Roti". */
  options?: string
}

export type Receipt = {
  orderNumber: string
  placedAt: Date
  orderType: 'Delivery' | 'Pickup'
  payment: string
  customer: { name: string; phone: string; address?: string }
  lines: ReceiptLine[]
  deliveryFee: number
  /** GST rate on food, such as 0.05. It is split equally into CGST and SGST. */
  gstRate: number
  discount?: { label: string; amount: number }
}

export const restaurant = {
  name: 'Cafe Ajwa',
  branch: 'Malwani',
  address: 'Gate 8, Gaikwad Nagar Bus Depot, Malwani Colony, Malad West, Mumbai, Maharashtra 400095',
  phone: '+91 91675 92758',
  email: 'cafeajwa08@gmail.com',
}

const round2 = (value: number) => Math.round(value * 100) / 100

export function receiptTotals(receipt: Receipt) {
  const subtotal = round2(receipt.lines.reduce((sum, line) => sum + line.price * line.quantity, 0))
  const discount = round2(receipt.discount?.amount ?? 0)
  const taxable = round2(subtotal - discount)
  const halfTax = round2((taxable * receipt.gstRate) / 2)
  const beforeRounding = round2(taxable + halfTax * 2 + receipt.deliveryFee)
  const total = Math.round(beforeRounding)
  return {
    subtotal,
    discount,
    taxable,
    cgst: halfTax,
    sgst: halfTax,
    deliveryFee: receipt.deliveryFee,
    roundOff: round2(total - beforeRounding),
    total,
  }
}

export function formatRupees(value: number, { symbol = '₹', decimals = true } = {}) {
  const sign = value < 0 ? '-' : ''
  const amount = Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return `${sign}${symbol}${amount}`
}

export function formatReceiptDate(date: Date) {
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/* The standard PDF fonts have no rupee sign, so the PDF writes amounts as Rs. */
const pdfRupees = (value: number) => formatRupees(value, { symbol: 'Rs. ' })

const GREEN: [number, number, number] = [15, 61, 46]
const CREAM: [number, number, number] = [248, 246, 241]
const INK: [number, number, number] = [26, 26, 26]
const MUTED: [number, number, number] = [95, 90, 80]

export async function downloadReceiptPdf(receipt: Receipt) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const totals = receiptTotals(receipt)
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 12
  const right = pageWidth - margin
  let y = 0

  // Header band with the restaurant name and receipt number.
  doc.setFillColor(...GREEN)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(...CREAM)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(restaurant.name, margin, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(restaurant.branch, margin, 20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Receipt', right, 14, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Order ${receipt.orderNumber}`, right, 20, { align: 'right' })

  // Restaurant contact details.
  y = 38
  doc.setTextColor(...MUTED)
  doc.setFontSize(8)
  const addressLines = doc.splitTextToSize(restaurant.address, pageWidth - margin * 2)
  doc.text(addressLines, margin, y)
  y += addressLines.length * 3.6
  doc.text(`${restaurant.phone}   ${restaurant.email}`, margin, y)

  // Order details in two columns.
  y += 9
  const details: [string, string][] = [
    ['Placed on', formatReceiptDate(receipt.placedAt)],
    ['Order type', receipt.orderType],
    ['Payment', receipt.payment],
    ['Customer', `${receipt.customer.name}, ${receipt.customer.phone}`],
  ]
  if (receipt.customer.address) details.push(['Deliver to', receipt.customer.address])
  doc.setFontSize(9)
  for (const [label, value] of details) {
    doc.setTextColor(...MUTED)
    doc.text(label, margin, y)
    doc.setTextColor(...INK)
    const valueLines = doc.splitTextToSize(value, pageWidth - margin * 2 - 28)
    doc.text(valueLines, margin + 28, y)
    y += valueLines.length * 4.4
  }

  // Items table.
  autoTable(doc, {
    startY: y + 4,
    margin: { left: margin, right: margin },
    head: [['Item', 'Qty', 'Price', 'Amount']],
    body: receipt.lines.map((line) => [
      line.options ? `${line.name}\n${line.options}` : line.name,
      String(line.quantity),
      pdfRupees(line.price),
      pdfRupees(line.price * line.quantity),
    ]),
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 9, textColor: INK, cellPadding: { top: 2.4, bottom: 2.4, left: 2, right: 2 } },
    headStyles: { fillColor: GREEN, textColor: CREAM, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CREAM },
    columnStyles: {
      1: { halign: 'center', cellWidth: 12 },
      2: { halign: 'right', cellWidth: 26 },
      3: { halign: 'right', cellWidth: 28 },
    },
  })

  // Totals, right aligned under the table. Start a new page if they would not fit.
  const tableEnd = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
  const rows: [string, string][] = [['Subtotal', pdfRupees(totals.subtotal)]]
  if (totals.discount > 0 && receipt.discount) rows.push([receipt.discount.label, pdfRupees(-totals.discount)])
  rows.push(
    ['Delivery fee', totals.deliveryFee ? pdfRupees(totals.deliveryFee) : 'Free'],
    [`CGST ${(receipt.gstRate * 50).toFixed(1)}%`, pdfRupees(totals.cgst)],
    [`SGST ${(receipt.gstRate * 50).toFixed(1)}%`, pdfRupees(totals.sgst)],
    ['Round off', pdfRupees(totals.roundOff)],
  )
  const needed = rows.length * 5.2 + 24
  y = tableEnd + 6
  if (y + needed > pageHeight - margin) {
    doc.addPage()
    y = margin + 4
  }
  doc.setFontSize(9)
  const labelX = pageWidth - margin - 60
  for (const [label, value] of rows) {
    doc.setTextColor(...MUTED)
    doc.text(label, labelX, y)
    doc.setTextColor(...INK)
    doc.text(value, right, y, { align: 'right' })
    y += 5.2
  }
  doc.setDrawColor(...GREEN)
  doc.setLineWidth(0.4)
  doc.line(labelX, y - 2, right, y - 2)
  y += 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...GREEN)
  doc.text('Total', labelX, y)
  doc.text(pdfRupees(totals.total), right, y, { align: 'right' })

  // Footer note.
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('Thank you for ordering from Cafe Ajwa.', pageWidth / 2, pageHeight - 10, { align: 'center' })

  doc.save(`cafe-ajwa-receipt-${receipt.orderNumber}.pdf`)
}
