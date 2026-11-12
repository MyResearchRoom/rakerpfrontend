import React from 'react'
import { useParams } from 'react-router-dom';
import { invoiceData } from '../../../../data/invoiceData';
import TableComponent from '../../../comman/TableComponent';
import { formatCurrency } from '../../../comman/formateCurrency';

export default function Inovices() {
  const {id}=useParams();

  const companyInvoices = invoiceData.filter(
    (inv) => inv.companyId === parseInt(id)
  );

  const column =[
    {
      label: "Invoice Number",
      field: "invoiceNumber",
      className: "p-2 text-sm whitespace-normal break-words",
    },
    {
      label: "Date",
      field: "date",
      className: "p-2 text-sm whitespace-normal break-words",
    },
    {
      label: "Due Date",
      field: "dueDate",
      className: "p-2 text-sm whitespace-normal break-words",
    },
    {
      label: "Amount",
      field: "total",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => <span>{formatCurrency(item?.total)}</span>,
    },
    {
      label: "Status",
      field: "status",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize
            ${item?.status === "paid"
              ? "bg-green-100 text-green-700"
              : item?.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : item?.status === "not paid"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
            }`}
        >
          {item?.status}
        </span>
      ),
    },
		
  ]

  return (
    <div className='pb-10 '>
      
      <TableComponent columns={column} data={companyInvoices} />

      

    </div>
  )
}
