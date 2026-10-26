import React from 'react'
import { receiptData } from '../../../../data/receiptData';
import { formatCurrency } from '../../../comman/formateCurrency';
import TableComponent from '../../../comman/TableComponent';
import { useParams } from 'react-router-dom';

export default function Receipts() {
  const {id}=useParams();

  const companyReceipts = receiptData.filter(
    (rec) => rec.companyId ===  parseInt(id)
  );

  const column =[
      {
        label: "Receipt  Number",
        field: "receiptNumber",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "Invoice",
        field: "invoiceNumber",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "Payment Date",
        field: "paymentDate",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "Amount",
        field: "",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => <span>{formatCurrency(item?.amount)}</span>,
      },
      {
        label: "Method",
        field: "paymentMethod",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      
  ]
  return (
    <div className='pb-10'>
          
      <TableComponent columns={column} data={companyReceipts} />
    
    </div>
  )
}
