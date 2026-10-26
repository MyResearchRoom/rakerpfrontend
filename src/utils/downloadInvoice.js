  import html2pdf from "html2pdf.js";

  const COPY_LABEL = "ORIGINAL FOR BUYER";

  const BORDER = "#000";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const text = (value, fallback = "-") => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    return escapeHtml(value);
  };

  const toNumber = (value) => Number(value || 0);

  const money = (value) =>
    toNumber(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return text(value);
    }

    return date
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
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

    const twoDigits = (num) => {
      if (num < 20) return ones[num];

      return `${tens[Math.floor(num / 10)]} ${ones[num % 10]
        }`.trim();
    };

    const threeDigits = (num) => {
      const hundred = Math.floor(num / 100);

      const rest = num % 100;

      return `${hundred
          ? `${ones[hundred]} Hundred`
          : ""
        } ${rest ? twoDigits(rest) : ""}`.trim();
    };

    const whole = Math.floor(toNumber(amount));

    const paise = Math.round(
      (toNumber(amount) - whole) * 100
    );

    if (!whole && !paise) {
      return "Zero Rupees Only";
    }

    const crore = Math.floor(whole / 10000000);

    const lakh = Math.floor(
      (whole % 10000000) / 100000
    );

    const thousand = Math.floor(
      (whole % 100000) / 1000
    );

    const hundred = whole % 1000;

    const parts = [
      crore
        ? `${threeDigits(crore)} Crore`
        : "",
      lakh ? `${threeDigits(lakh)} Lakh` : "",
      thousand
        ? `${threeDigits(thousand)} Thousand`
        : "",
      hundred ? threeDigits(hundred) : "",
    ].filter(Boolean);

    return `${parts.join(
      " "
    )} Rupees${paise ? ` ${twoDigits(paise)} Paisa` : ""
      } Only`;
  };

  const addressLine = (entity = {}) =>
    [
      entity.address,
      entity.city,
      entity.state,
      entity.pincode,
    ]
      .filter(Boolean)
      .join(", ");

  const getCompanyBank = (company = {}) => {
    const bank =
      company.bankAccounts?.[0] ||
      company.details?.bankAccounts?.[0] ||
      company.details ||
      company;

    return {
      bankName: bank?.bankName || "",
      accountNumber:
        bank?.accountNumber || "",
      ifscCode: bank?.ifscCode || "",
      // micrNo: bank?.micrNo || "",
      // swiftNo: bank?.swiftNo || "",
    };
  };

  const getItemName = (item = {}) =>
    item.material?.itemName ||
    item.itemName ||
    item.name ||
    item.description ||
    "-";

  const getItemCode = (item = {}) =>
    item.material?.itemCode ||
    item.material?.code ||
    item.itemCode ||
    "";

  const getHsnCode = (item = {}) =>
    item.material?.hsnCode ||
    item.hsnCode ||
    item.hsn ||
    "-";

  const getUnit = (item = {}) =>
    item.unit ||
    item.material?.unit ||
    "NOS";

  const buildBlankRows = (count) =>
    Array.from(
      { length: Math.max(0, count) },
      () => `
        <tr class="blank-row">
          <td>&nbsp;</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      `
    ).join("");

  export const buildInvoiceHtml = (
    invoiceData,
    options = {}
  ) => {
    const invoice = invoiceData || {};

    const company = invoice.company || {};

    const customer =
      invoice.customer?.[0] ||
      invoice.customer ||
      {};

    const items =
      invoice.invoiceItems || [];

    console.log("All company fields:", Object.keys(company));
  console.log("Full company data:", company);

    const bank = getCompanyBank(company);

    const subTotal = toNumber(
      invoice.subTotal
    );

    const totalGst = toNumber(
      invoice.totalGSTAmount
    );

    const cgstTotal = totalGst / 2;

    const sgstTotal = totalGst / 2;

    const totalAmount = toNumber(
      invoice.totalAmount
    );

    const roundedAmount =
      Math.round(totalAmount);

    const roundOff =
      roundedAmount - totalAmount;

    /* THIS CREATES CLEAN SPACE */
    const blankRows = Math.max(0, 12 - items.length);

    const copyLabel =
      options.copyLabel || COPY_LABEL;

    const itemRows = items
      .map((item, index) => {
        const amount = toNumber(
          item.subTotal
        );

        const cgstRate = toNumber(
          item.cgstPercent
        );

        const sgstRate = toNumber(
          item.sgstPercent
        );

        const cgstAmount =
          (amount * cgstRate) / 100;

        const sgstAmount =
          (amount * sgstRate) / 100;

        return `
          <tr class="item-row">

            <td class="center">
              ${index + 1}
            </td>

            <td>

              <div class="item-name">
                ${text(getItemName(item))}
              </div>

              ${getItemCode(item)
            ? `
                  <div class="item-code">
                    Item Code :
                    ${text(
              getItemCode(item)
            )}
                  </div>
                `
            : ""
          }

            </td>

            <td class="center">
              ${text(getHsnCode(item))}
            </td>

         <td class="right quantity-cell">
  <span class="quantity-value">${money(item.quantity)}</span>
  <span class="unit">${text(getUnit(item))}</span>
</td>

            <td class="right">
              ${money(item.rate)}
            </td>

            <td class="right">
              ${money(amount)}
            </td>

            <td class="right">
              ${money(cgstRate)}%
            </td>

            <td class="right">
              ${money(cgstAmount)}
            </td>

            <td class="right">
              ${money(sgstRate)}%
            </td>

            <td class="right">
              ${money(sgstAmount)}
            </td>

            <td class="right bold">
              ${money(item.totalAmount)}
            </td>

          </tr>
        `;
      })
      .join("");

    return `
    <!DOCTYPE html>

    <html>

      <head>

        <meta charset="utf-8" />

        <title>Invoice</title>

        <style>

          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: Arial, Helvetica, sans-serif;
          }

        .sheet {
    width: 210mm;
    min-height: 297mm;
    padding: 8mm;
    background: #fff;
  }

          .invoice-container {
  width: 100%;
  min-height: 281mm;
  border: 1px solid ${BORDER};
  display: flex;
  flex-direction: column;
}

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          td,
          th {
            padding: 4px 6px;
            font-size: 10px;
            vertical-align: middle;
            word-break: break-word;
          }

          .center {
            text-align: center;
          }

          .right {
            text-align: right;
          }

          .bold {
            font-weight: 700;
          }

          /* HEADER */

          .header-table td {
            border-bottom: 1px solid ${BORDER};
            padding: 10px 8px;
            line-height: 1.4;
          }

          .logo-cell {
            width: 90px;
            border-right: 1px solid ${BORDER};
            text-align: center;
            vertical-align: middle;
          }

          .logo-cell img {
            width: 65px;
            height: 45px;
            object-fit: contain;
          }

          .company-cell {
            text-align: center;
          }

          .company-name {
            font-size: 26px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .company-address {
            margin-top: 4px;
            font-size: 11px;
          }

          /* CONTACT */

          .contact-table td {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            font-size: 10px;
            font-weight: 700;
            padding: 8px 6px;
            line-height: 1.4;
          }

          .contact-table td:last-child {
            border-right: none;
          }

          /* TITLE */

          .title-table {
            width: 100%;
            table-layout: fixed;
            border-bottom: 1px solid ${BORDER};
          }

          .title-table td {
            width: 33.33%;
            text-align: center;
            vertical-align: middle;
            padding: 10px 6px;
            line-height: 1.4;
          }

          .invoice-title {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            color: #173ea5;
            letter-spacing: 1px;
          }

          .copy-label {
            width: 180px;
            text-align: center;
            color: #d10000;
            font-size: 8px;
            text-align: right;
            font-weight: 700;
          }

          /* DETAILS */

          .details-table td {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            padding: 7px 8px;
            font-size: 10px;
            line-height: 1.9;
          }

          .details-table td:last-child {
            border-right: none;
          }

          .detail-label {
            font-weight: 400;
          }

          .detail-value {
            font-weight: 700;
          }

          /* PARTY */

          .party-head td {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            text-align: center;
            font-weight: 700;
            font-size: 10px;
            padding: 8px 6px;
            line-height: 1.4;
          }

          .party-head td:last-child {
            border-right: none;
          }

          .party-body td {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            height: 115px;
            line-height: 1.6;
            font-size: 10px;
          }

          .party-body td:last-child {
            border-right: none;
          }

          .party-name {
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 6px;
          }

          /* ITEMS */

       .items-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

          .items-table {
            width: 100%;
          }

          .items-table th {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            background: #f5f5f5;
            text-align: center;
            font-size: 9px;
            font-weight: 700;
            padding: 6px 4px;
          }

          .items-table th:last-child {
            border-right: none;
          }

          /* ONLY ITEM ROWS HAVE BOTTOM BORDER */

          .item-row td {
  border-right: 1px solid ${BORDER};
  border-bottom: 1px solid ${BORDER};
  height: 26px;
  font-size: 9px;
}

          .item-row {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .summary-table,
  .bank-table,
  .bank-signature-section {
    break-inside: avoid;
    page-break-inside: avoid;
  }

          .item-row td:last-child {
            border-right: none;
          }

          /* CLEAN BLANK SPACE */

          .blank-row td {
  height: 26px;
  padding: 0;
  border-right: 1px solid ${BORDER};
  border-bottom: none;
}

.blank-row td:last-child {
  border-right: none;
}

.blank-row:last-child td {
  border-bottom: 1px solid ${BORDER};
}
          .item-name {
            font-weight: 700;
            text-transform: uppercase;
          }

          .item-code {
            font-size: 8px;
            margin-top: 2px;
          }

          .unit {
  font-size: 7px;
  margin-left: 2px;
}
  
           .quantity-cell {
  white-space: nowrap;
  word-break: keep-all;
  padding-left: 2px;
  padding-right: 2px;
  font-size: 8px !important;
}
  .quantity-value,
.unit {
  display: inline;
  white-space: nowrap;
}

          /* SUMMARY */

        .summary-table {
  margin-top: auto;
}

          .summary-table td {
            border-right: 1px solid ${BORDER};
            border-bottom: 1px solid ${BORDER};
            font-size: 9px;
          }

          .summary-table tr:first-child td {
            border-top: 1px solid ${BORDER};
          }

          .summary-table td:last-child {
            border-right: none;
          }

          .terms-box {
            line-height: 1.7;
          }

          .declaration {
            margin-top: 8px;
            text-align: justify;
          }

          /* BANK */

        /* BANK DETAILS */
  .bank-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  .bank-table td {
    border-right: 1px solid ${BORDER};
    font-size: 10px;
    padding: 5px 6px;
    height: 25px;
    vertical-align: middle;
  }

  .bank-table td:last-child {
    border-right: none;
  }

  .bank-table tr {
    border-bottom: 1px solid ${BORDER};
  }

  /* SIGNATURE SECTION */
.bank-signature-section {
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
  min-height: 64px;
  align-items: stretch;
}

.signature-box {
  min-height: 64px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 10px 6px;
  text-align: right;
  align-self: stretch;
}

  .signature-text {
    width: 100%;
    font-size: 11px;
    font-weight: 700;
    text-align: right;
  }

        </style>

      </head>

      <body>

        <div class="sheet">

          <div class="invoice-container">

            <!-- HEADER -->

            <table class="header-table">

              <tr>

                <td class="logo-cell">

                  ${company.logo
        ? `
                      <img
                        src="${company.logo}"
                        alt="logo"
                      />
                    `
        : "LOGO"
      }

                </td>

                <td class="company-cell">

                  <div class="company-name">
                    ${text(
        company.name ||
        company.companyName,
        ""
      )}
                  </div>

                  <div class="company-address">
                    ${text(
        addressLine(company),
        ""
      )}
                  </div>

                </td>

              </tr>

            </table>

            <!-- CONTACT -->

            <table class="contact-table">

              <tr>

                <td>
                  GSTIN :
                  ${text(company.gstin)}
                </td>

                <td>
                  PAN NO :
                  ${text(company.pan)}
                </td>

                <td>
                  EMAIL :
                  ${text(company.email)}
                </td>

                <td>
                  CONTACT :
                  ${text(
        company.mobileNumber ||
        company.contactPerson
      )}
                </td>

              </tr>

            </table>

            <!-- TITLE -->

            <table class="title-table">

              <tr>
                <td></td>

                <td class="invoice-title">
                  TAX INVOICE
                </td>

                <td class="copy-label">
                  ${text(copyLabel)}
                </td>

              </tr>

            </table>

            <!-- DETAILS -->

            <table class="details-table">

              <tr>

                <td>

                  <div>
                    <span class="detail-label">
                      Invoice Number :
                    </span>

                    <span class="detail-value">
                      ${text(
        invoice.invoiceNumber
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      PO. NO :
                    </span>

                    <span class="detail-value">
                      ${text(invoice.poNumber)}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Challan No. :
                    </span>

                    <span class="detail-value">
                      ${text(invoice.challanNo)}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Reverse Charge :
                    </span>

                    <span class="detail-value">
                      ${text(
        invoice.reverseCharge ||
        "No"
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      E-Bill No. :
                    </span>

                    <span class="detail-value">
                      ${text(
        invoice.eBillNo ||
        invoice.ewayBillNo
      )}
                    </span>
                  </div>

                </td>

                <td>

                  <div>
                    <span class="detail-label">
                      Invoice Date :
                    </span>

                    <span class="detail-value">
                      ${formatDate(
        invoice.invoiceDate
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      PO. Date :
                    </span>

                    <span class="detail-value">
                      ${formatDate(
        invoice.poDate
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Challan Date :
                    </span>

                    <span class="detail-value">
                      ${formatDate(
        invoice.challanDate
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Removal Time :
                    </span>

                    <span class="detail-value">
                      ${text(
        invoice.removalTime
      )}
                    </span>
                  </div>

                </td>

                <td>

                  <div>
                    <span class="detail-label">
                      Transportation Mode :
                    </span>

                    <span class="detail-value">
                      ${text(
        customer.transportationMode ||
        "Road"
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Transport Description :
                    </span>

                    <span class="detail-value">
                      ${text(
        customer.transportDescription ||
        invoice.vehicleNumber
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Place of Supply :
                    </span>

                    <span class="detail-value">
                      ${text(
        customer.placeOfSupply ||
        customer.city
      )}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">
                      Date of Supply :
                    </span>

                    <span class="detail-value">
                      ${formatDate(
        customer.dateOfSupply ||
        invoice.invoiceDate
      )}
                    </span>
                  </div>

                </td>

              </tr>

            </table>

            <!-- PARTY -->

            <table class="party-head">

              <tr>

                <td>
                  Details of Receiver/Billed to :
                </td>

                <td>
                  Details of Consignee/Shipped to :
                </td>

              </tr>

            </table>

            <table class="party-body">

              <tr>

                <td>

                  <div class="party-name">
                    ${text(customer.name)}
                  </div>

                  <div>
                    Address :
                    ${text(
        addressLine(customer)
      )}
                  </div>

                  <div>
                    GSTIN :
                    ${text(customer.gstin)}
                  </div>

                  <div>
                    PAN :
                    ${text(customer.pan)}
                  </div>

                  <div>
                    State :
                    ${text(customer.state)}
                  </div>

                </td>

                <td>

                  <div class="party-name">
                    ${text(
        invoice.consigneeName ||
        customer.name
      )}
                  </div>

                  <div>
                    Address :
                    ${text(
        invoice.consigneeAddress ||
        addressLine(customer)
      )}
                  </div>

                  <div>
                    GSTIN :
                    ${text(
        invoice.consigneeGstin ||
        customer.gstin
      )}
                  </div>

                  <div>
                    PAN :
                    ${text(
        invoice.consigneePan ||
        customer.pan
      )}
                  </div>

                  <div>
                    State :
                    ${text(
        invoice.consigneeState ||
        customer.state
      )}
                  </div>

                </td>

              </tr>

            </table>

            <!-- ITEMS -->

            <div class="items-wrapper">

              <table class="items-table">

                <thead>

                  <tr>

                    <th style="width: 5%;">
                      Sr
                    </th>

                    <th style="width: 22%;">
                      Particulars
                    </th>

                    <th style="width: 7%;">
                      HSN
                    </th>

                    <th style="width: 9%;">
                      Qty
                    </th>

                    <th style="width: 9%;">
                      Rate
                    </th>

                    <th style="width: 10%;">
                      Amount
                    </th>

                    <th style="width: 7%;">
                      CGST %
                    </th>

                    <th style="width: 9%;">
                      CGST Amt
                    </th>

                    <th style="width: 7%;">
                      SGST %
                    </th>

                    <th style="width: 9%;">
                      SGST Amt
                    </th>

                    <th style="width: 10%;">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>
  ${itemRows}
  ${buildBlankRows(blankRows)}
</tbody>

              </table>

              <!-- SUMMARY -->

              <table class="summary-table">

                <tr>

                  <td
                    rowspan="5"
                    style="width: 65%;"
                  >

                    <div class="terms-box">

                      <div class="bold">
                        Amount In Words :
                      </div>

                      ${text(
                        numberToWords(
                          roundedAmount
                        )
                      )}

                      <br /><br />

                      <div class="bold">
                        Terms & Conditions
                      </div>

                      Payment Term :
                      ${text(
                          invoice.paymentTerm ||
                          "30 Days"
                        )}

                        <div class="declaration">

                          <span class="bold">
                            Declaration :
                          </span>

                          We hereby certify that the
                          particulars given above are
                          true and correct and the
                          amount indicated represents
                          the actual price of the
                          goods/services described.

                        Subject to ${text(company.city, "the company's registered location")}
  Jurisdiction only.

                        </div>

                    </div>

                  </td>

                  <td>
                    Value Of Supply
                  </td>

                  <td class="right">
                    ${money(subTotal)}
                  </td>

                </tr>

                <tr>

                  <td>CGST</td>

                  <td class="right">
                    ${money(cgstTotal)}
                  </td>

                </tr>

                <tr>

                  <td>SGST</td>

                  <td class="right">
                    ${money(sgstTotal)}
                  </td>

                </tr>

                <tr>

                  <td>Round Off</td>

                  <td class="right">
                    ${money(roundOff)}
                  </td>

                </tr>

                <tr>

                  <td class="bold">
                    Grand Total
                  </td>

                  <td class="right bold">
                    ${money(roundedAmount)}
                  </td>

                </tr>

              </table>

              <!-- BANK -->

            <table class="bank-table">
    <tr>
      <td style="width: 30%;">
        <span class="bold">Bank :</span>
        ${text(bank.bankName)}
      </td>

      <td style="width: 40%;">
        <span class="bold">Account No :</span>
        ${text(bank.accountNumber)}
      </td>

      <td style="width: 30%;">
        <span class="bold">IFSC :</span>
        ${text(bank.ifscCode)}
      </td>
    </tr>
  </table>

  <div class="bank-signature-section">
    <div class="bank-details-continuation">
      <!-- Keep this section aligned with the billing/details block above -->
    </div>

    <div class="signature-box">
      <div class="signature-text">
        Authorised Signature
      </div>
    </div>
  </div>

            </div>

          </div>

        </div>

      </body>

    </html>
    `;
  };

  export const downloadInvoiceDocument =
    async (invoiceData) => {
      if (!invoiceData) return;

      const element =
        document.createElement("div");

      element.innerHTML =
        buildInvoiceHtml(invoiceData);

      const opt = {
        margin: 0,

        filename: `${invoiceData?.invoiceNumber ||
          "invoice"
          }.pdf`,

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

        pagebreak: {
    mode: ["css", "legacy"],
    avoid: [".item-row", ".summary-table", ".bank-table", ".bank-signature-section"],
  },
      };

      await html2pdf()
        .set(opt)
        .from(element)
        .save();
    };