import html2pdf from "html2pdf.js";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  return date.toLocaleDateString("en-GB").replace(/\//g, "-");
};

const numberToWords = (amount) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (num) => {
    if (num < 20) return ones[num];

    if (num < 100) {
      return `${tens[Math.floor(num / 10)]} ${
        ones[num % 10]
      }`.trim();
    }

    if (num < 1000) {
      return `${ones[Math.floor(num / 100)]} Hundred ${convert(
        num % 100
      )}`.trim();
    }

    if (num < 100000) {
      return `${convert(Math.floor(num / 1000))} Thousand ${convert(
        num % 1000
      )}`.trim();
    }

    if (num < 10000000) {
      return `${convert(Math.floor(num / 100000))} Lakh ${convert(
        num % 100000
      )}`.trim();
    }

    return `${convert(Math.floor(num / 10000000))} Crore ${convert(
      num % 10000000
    )}`.trim();
  };

  const whole = Math.floor(Number(amount || 0));
  const decimal = Math.round((Number(amount || 0) - whole) * 100);

  let words = `INR ${convert(whole)}`;

  if (decimal > 0) {
    words += ` and ${convert(decimal)} Paise`;
  }

  return `${words} Only`;
};

export const downloadReceiptDocument = async (receiptData) => {
  if (!receiptData) return;

  const receipt = receiptData;
  const company = receiptData.company || {};
  const invoice = receiptData.invoice || {};
  const customer = invoice.customer?.[0] || {};

  const html = `
  <html>
    <head>
      <style>
        @page {
          size: A4;
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
          color: #000;
        }

        .page {
  width: 210mm;
  height: 297mm;
  padding: 10mm;
  background: #fff;
}

        
.receipt-container {
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  position: relative;
}

        .header {
          padding: 12px 14px;
          border-bottom: 1px solid #000;
          position: relative;
        }

        .logo {
          height: 55px;
          max-width: 120px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .company-name {
          font-size: 22px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .company-details {
          margin-top: 5px;
          font-size: 12px;
          line-height: 1.5;
        }

        .voucher-block {
          position: absolute;
          top: 14px;
          right: 14px;
          text-align: right;
        }

        .voucher-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .voucher-info {
          font-size: 12px;
          line-height: 1.7;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        .details-table td {
          border-right: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 10px;
          font-size: 12px;
          vertical-align: top;
        }

        .details-table tr td:last-child {
          border-right: 0;
        }

        .label {
          width: 180px;
          font-weight: 700;
          background: #f5f5f5;
        }

        .particular-table th {
          border-right: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 10px;
          font-size: 12px;
          text-align: left;
          background: #f5f5f5;
        }

        .particular-table th:last-child {
          border-right: 0;
        }

        .particular-table td {
          border-right: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 12px 10px;
          font-size: 12px;
          height: 110px;
          vertical-align: top;
        }

        .particular-table td:last-child {
          border-right: 0;
        }

       .amount-section {
  padding: 14px;
  border-bottom: 1px solid #000;
  position: relative;
  min-height: 85px;
}

.amount-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}

.amount-words {
  font-size: 12px;
  line-height: 1.7;
}

.amount-value {
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;
  text-align: right;
}

        .footer {
  position: absolute;
  bottom: 18mm;
  right: 10mm;
  width: 45%;
  padding: 0;
}

.footer-table {
  width: 100%;
  border-collapse: collapse;
}

.footer-table td {
  padding: 0;
  font-size: 12px;
  vertical-align: bottom;
}

.signature {
  height: 30mm;
  text-align: right;
  vertical-align: bottom;
  font-weight: 700;
  padding-bottom: 5px !important;
}

.generated {
  position: absolute;
  bottom: 3mm;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
}

        .text-right {
          text-align: right;
        }
      </style>
    </head>

    <body>
      <div class="page">

        <div class="receipt-container">

          <div class="header">

            ${
              company?.logo
                ? `<img src="${company.logo}" class="logo" />`
                : ""
            }

            <div class="company-name">
              ${company?.name || "-"}
            </div>

            <div class="company-details">
              ${company?.address || "-"},
              ${company?.city || "-"},
              ${company?.state || "-"} -
              ${company?.pincode || "-"}
              <br/>

              GSTIN : ${company?.gstin || "-"}
              &nbsp;&nbsp;&nbsp;&nbsp;

              PAN : ${company?.pan || "-"}
              <br/>

              Email : ${company?.email || "-"}
              &nbsp;&nbsp;&nbsp;&nbsp;

              Mobile : ${company?.mobileNumber || "-"}
            </div>

            <div class="voucher-block">

              <div class="voucher-title">
                RECEIPT VOUCHER
              </div>

              <div class="voucher-info">
                <strong>No :</strong>
                ${receipt?.receiptNumber || "-"}
                <br/>

                <strong>Dated :</strong>
                ${formatDate(receipt?.createdAt)}
              </div>

            </div>

          </div>

          <table class="details-table">
            <tr>
              <td class="label">Account</td>

              <td>
                ${customer?.name || "-"}
              </td>
            </tr>

            <tr>
              <td class="label">Through</td>

              <td>
                ${receipt?.paymentMethod || "-"}
              </td>
            </tr>

            <tr>
              <td class="label">On Account Of</td>

              <td>
                Payment received against Invoice
                <strong>${invoice?.invoiceNumber || "-"}</strong>

                <br/><br/>

                Transaction Ref :
                ${receipt?.transactionReference || "-"}
              </td>
            </tr>
          </table>

          <table class="particular-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th width="180">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  Receipt against Invoice
                  <strong>${invoice?.invoiceNumber || "-"}</strong>
                </td>

                <td class="text-right">
                  ₹ ${money(receipt?.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="amount-section">

            <div class="amount-title">
              Amount (in words)
            </div>

            <div class="amount-words">
              ${numberToWords(receipt?.amount)}
            </div>

            <div class="amount-value">
              ₹ ${money(receipt?.amount)}
            </div>

          </div>

         <div class="footer">
  <table class="footer-table">
    <tr>
      <td class="signature">
        Authorised Signatory
      </td>
    </tr>
  </table>
</div>

<div class="generated">
  This is a computer generated receipt.
</div>
        </div>

      </div>
    </body>
  </html>
  `;

  const element = document.createElement("div");

  element.innerHTML = html;

  const opt = {
    margin: 0,
    filename: `${receipt?.receiptNumber || "receipt"}.pdf`,
    image: {
      type: "jpeg",
      quality: 1,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  await html2pdf().set(opt).from(element).save();
};