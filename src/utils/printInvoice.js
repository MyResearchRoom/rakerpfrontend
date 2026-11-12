import { buildInvoiceHtml } from "./downloadInvoice";

export const printInvoiceDocument = async (invoiceData) => {
  if (!invoiceData) {
    console.error("Invoice not found");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(buildInvoiceHtml(invoiceData));
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 500);
};
