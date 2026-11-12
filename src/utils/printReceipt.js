export const printReceiptDocument = async (receiptData) => {
  if (!receiptData) return;

  const receipt = receiptData;
  const company = receiptData.company;
  const invoice = receiptData.invoice;
  const customer =receiptData.invoice.customer?.[0];

  if (!receiptData) {
    console.error("Receipt not found");
    return;
  }

   const html = `
  <html>
    <head>
      <style>
        @page { size: A4; margin: 0; }
        body {
          font-family: "Inter", system-ui, sans-serif;
          margin: 0;
          background: #e5e7eb;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          background: #fff;
          margin: auto;
          padding: 28px 32px;
          box-sizing: border-box;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
        }

        .logo-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logo {
          height: 60px;
          object-fit: contain;
        }

        .company-info {
          font-size: 12px;
          color: #475569;
        }

        .invoice-title { text-align: right; }
        .invoice-title h1 { margin: 0; font-size: 34px; font-weight: 700; }

        .receipt-box {
          background: #dcfce7;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: center;
          font-size: 12px;
        }

        .section {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px;
          background: #f9fafb;
          font-size: 13px;
        }

        .table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }

        .table th, .table td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          font-size: 13px;
        }

        .table th {
          background: #f1f5f9;
          text-transform: uppercase;
          font-size: 11px;
        }

        .text-right {
          text-align: right;
        }

        .totals {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }

        .totals-box {
          width: 260px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #e5e7eb;
        }

        .totals-row:last-child {
          background: #facc15;
          font-weight: bold;
        }

        .status {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #16a34a;
        }

        .textDesign{
          text-transform: uppercase;
        }

        .capitalizeText{
          text-transform: capitalize;
        }

        .footer {
          position: absolute;
          bottom: 20px;
          left: 32px;
          right: 32px;
          font-size: 11px;
          color: #6b7280;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
      </style>
    </head>

    <body>
      <div class="page">

        <!-- HEADER -->
        <div class="header">
          <div class="company-block">
            ${company?.logo ? `<img src="${company?.logo}" class="logo" />` : ""}

            <div class="company-info">
              <strong class="capitalizeText">${company.name}</strong><br/>
              <strong class="capitalizeText">${company?.address || "—"}, ${company.city}, ${company.state}, ${company.pincode} </span> <br/>
              GSTIN: ${company.gstin || "—"}<br/>
              PAN: ${company.pan || "—"}<br/>
              Contact: ${company.contactPerson || "—"} | ${company.email || "—"}<br/>
              Mobile No.:  ${company.mobileNumber || "—"}
            </div>
          </div>

          <div class="invoice-title">
            <h1>RECEIPT</h1>
    
          </div>
          </div>

        <!-- DETAILS -->
        <div class="section">
          <div class="card">
            <strong>Bill To</strong><br/>
            <span class="capitalizeText">${customer?.name || "—"}</span><br/>
            <span class="capitalizeText">${customer?.address || "—"}, ${customer?.city || ""}, ${customer?.state || ""}, ${customer?.pincode || ""}</span>
            <br/>
            Phone: ${customer?.phone || "—"}<br/>
            Email: ${customer?.email || "—"} <br/>
            GSTIN: ${customer.gstin || "—"} <br/>
            PAN: ${customer.pan || "—"}
          </div>

          <div class="card">
            <strong>Details</strong><br/>
            <strong>Receipt : ${receipt.receiptNumber}</strong><br/>

             Payment Mode: ${receipt?.paymentMethod || "-"}<br/>

            Transaction Ref: ${receipt.transactionReference || "—"}<br/>
            
            Date: ${new Date(receipt.createdAt).toLocaleDateString()}<br/><br/>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Payment received against Invoice ${invoice.invoiceNumber || ""}</td>
              <td class="text-right">₹${Number(receipt.amount) || "0"}</td>
            </tr>
          </tbody>
        </table>

        <!-- TOTAL -->
        <div class="total">
          <span>Total Amount Received</span>
          <span>₹${Number(receipt.amount) || "0"}</span>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <span>This is a computer-generated receipt.</span>
          <span>RAK ERP © ${new Date().getFullYear()}</span>
        </div>

      </div>
    </body>
  </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
