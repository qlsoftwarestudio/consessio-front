import jsPDF from "jspdf";
import { formatARS } from "@/shared/utils/format";
import type { Quotation } from "@/shared/types/domain";

export function generateQuotationPDF(
  quotation: Quotation,
  leadName: string,
  vehicleModel: string,
  orgName?: string,
): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(orgName || "Consessio CRM", margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("COTIZACIÓN", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-AR")}`, margin, y);
  y += 12;

  // Lead & Vehicle info
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Cliente: ${leadName}`, margin, y);
  y += 6;
  doc.text(`Vehículo: ${vehicleModel}`, margin, y);
  y += 10;

  // Pricing table
  const rows: [string, string][] = [
    ["Precio de lista", formatARS(quotation.listPriceArs)],
    ["Descuento", `- ${formatARS(quotation.discountArs)}`],
  ];

  if (quotation.downPaymentArs) {
    rows.push(["Anticipo", formatARS(quotation.downPaymentArs)]);
  }
  if (quotation.installments && quotation.installmentArs) {
    rows.push(["Cuotas", `${quotation.installments} x ${formatARS(quotation.installmentArs)}`]);
  }
  if (quotation.annualRate) {
    rows.push(["TNA", `${quotation.annualRate}%`]);
  }

  rows.push(["TOTAL", formatARS(quotation.totalArs)]);

  // Draw table manually
  const col1 = margin;
  const col2 = pageWidth - margin;
  const rowHeight = 8;

  doc.setFontSize(10);
  rows.forEach(([label, value], i) => {
    const isTotal = label === "TOTAL";
    if (isTotal) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(0, 0, 0);
      doc.line(col1, y - 2, col2, y - 2);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
    }
    doc.text(label, col1, y);
    doc.text(value, col2, y, { align: "right" });
    y += rowHeight;
  });

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Esta cotización tiene validez de 7 días. Sujeta a disponibilidad de stock.", margin, y);

  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
