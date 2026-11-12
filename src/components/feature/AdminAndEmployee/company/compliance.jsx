import React from 'react'
import { complianceData } from '../../../../data/complianceData';
import TableComponent from '../../../comman/TableComponent';
import { useParams } from 'react-router-dom';

export default function Compliance() {
  const {id}=useParams();

  const ComplianceData = complianceData.filter(
    (doc) => doc.companyId === parseInt(id)
  );

  const column =[
      {
        label: "Document Type",
        field: "documentType",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "File Name",
        field: "fileName",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "Issue Date",
        field: "issueDate",
        className: "p-2 text-sm whitespace-normal break-words",
      },
      {
        label: "Expiry Date",
        field: "",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => <span>{item?.expiryDate || "-"}</span>,
      },
      {
        label: "Status",
        field: "status",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium capitalize border
              ${item?.status === "valid"
                ? "bg-green-100 text-green-700 border-green-500"
                : item?.status === "expiring"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                  : item?.status === "expired"
                    ? "bg-red-100 text-red-700 border-red-500"
                    : "bg-gray-100 text-gray-700 border-gray-500"
              }`}
          >
            {item?.status}
          </span>
        ),
      },
      
  ]
  return (
    <div className='pb-10'>
          
      <TableComponent columns={column} data={ComplianceData} />
    
    </div>
  )
}
