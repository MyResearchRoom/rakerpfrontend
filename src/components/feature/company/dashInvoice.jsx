// import React, { useEffect, useState } from 'react'
// import { fetchInvoices } from '../../../store/actions/invoiceActions';
// import { Oval } from 'react-loader-spinner';
// import { useDispatch, useSelector } from 'react-redux';
// import { Download, Eye, Printer } from 'lucide-react';
// import { getInvoiceById } from '../../../services/invoice';
// import { downloadInvoiceDocument } from '../../../utils/downloadInvoice';
// import { printInvoiceDocument } from '../../../utils/printInvoice';
// import TableComponent from '../../comman/TableComponent';
// import getStatusStyle from '../../comman/invoiceSttausStyle';
// import InvoicePreviewModal from '../../comman/InvoicePreviewModal';

// export default function DashInvoice() {
//     const{ companyId }=useSelector((state) => state.auth);
//     const { invoices, totalPages, error, loading } = useSelector(
//       (state) => state.invoices
//     );
//     const dispatch=useDispatch();
  
//     useEffect(() => {
//       dispatch(
//         fetchInvoices({
//           searchTerm:"",
//           date:"",
//           companyId:companyId,
//           status:"",
//           page:"",
//         })
//       );
//     }, [companyId, dispatch]);

//     const [previewInvoice, setPreviewInvoice] = useState(null);
//     const [invoiceToDounload,setInvoiceToDownload]=useState({});
//     const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

//     const openInvoicePreview = (invoice) => {
//       setPreviewInvoice(invoice?.id);
//       setIsInvoiceModalOpen(true);
//     };
  
//     const closeInvoicePreview = () => {
//         setPreviewInvoice(null);
//         setIsInvoiceModalOpen(false);
//     };
  
//     const handleDownload = async(invoiceId) => {
//       if (!invoiceId) return;
//       const response= await getInvoiceById(invoiceId);
//       if(!response){
//         return;
//       }
//       downloadInvoiceDocument(response);
//     };
  
//     const handlePrint = async (invoiceId) => {
//       if (!invoiceId) return;
//       const response= await getInvoiceById(invoiceId);
//       if(!response){
//         return;
//       }
//       printInvoiceDocument(response);
//     };
  
//     const columns = [
//       {
//         label: "Invoice",
//         // className:"text-[13px]",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//         render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>{item.invoiceNumber || "—"}</p>
//         ) 
//       },
//       {
//         label: "Date",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>{item.invoiceDate || "—"}</p>
//         ) 
//       },
//       {
//         label: "Due Date",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>{item.overDueDate || "—"}</p>
//         ) 
//       },
//       {
//         label: "Sub total",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.subTotal) || 0}</p>
//         ) 
//       },
//       {
//         label: "GST",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalGSTAmount || 0)} 
//           {/* ({Number(item.totalCGSTPercent || 0) + Number(item.totalSGSTPercent || 0)}%) */}
//           </p>
//         ) 
//       },
//       {
//         label: "Total",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//           <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalAmount || 0)}</p>
//         ) 
//       },
//       {
//         label: "Status",
//         className:"p-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//          render: (item) =>(
//          <p
//           className={`text-[11px] lg:text-[13px] capitalize px-2 py-0.5 rounded-md w-fit ${getStatusStyle(item.status)}`}
//         >
//           {item.status || "—"}
//         </p>
//         ) 
//       },
  
//       {
//         label: "View",
//         className:"p-4",
//         className: "text-center",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//         render: (item) => (
//           <button
//             type="button"
//             onClick={() => openInvoicePreview(item)}
//             className="text-blue-600 hover:text-blue-800"
//           >
//             <Eye size={18} />
//           </button>
//         ),
//       },
  
//       {
//         label: "Actions",
//         className:"pl-4",
//         headerClassName:"font-semibold text-black text-[13px] lg:text-[15px]",
//         render: (item) => (
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={() => handleDownload(item?.id)}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               <Download size={18} />
//             </button>
  
//             <button
//               type="button"
//               onClick={() => handlePrint(item?.id)}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               <Printer size={18} />
//             </button>

//           </div>
//         ),
//       }
//     ];

//     if (loading) {
//         return(
//         <div className="flex flex-col gap-2 justify-center items-center h-40">
//             <Oval
//                 height={60}
//                 width={60}
//                 color="#2563eb"
//                 secondaryColor="#93c5fd"
//                 strokeWidth={4}
//                 strokeWidthSecondary={4}
//             />
//             <p className="text-gray-500 animate-pulse">Loading Invoices list...</p>
//         </div>
//         );
//     }
//   return (
//     <div>
//         {error && <p>Invoice get : <span className="text-red-500">{error}</span></p>}
        
//         {invoices && 
//         <>
//         <div className="">
//             <TableComponent
//                 columns={columns}
//                 data={invoices.slice(0, 2)} 
//             />
//         </div>
        
//         </>
//         }

//         <InvoicePreviewModal
//             isOpen={isInvoiceModalOpen}
//             onClose={closeInvoicePreview}
//             invoiceId={previewInvoice}
//         />
//     </div>
//   )
// }








import React, { useEffect, useState } from 'react'
import { fetchInvoices } from '../../../store/actions/invoiceActions';
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Eye, Printer, Calendar, FileText } from 'lucide-react';
import { getInvoiceById } from '../../../services/invoice';
import { downloadInvoiceDocument } from '../../../utils/downloadInvoice';
import { printInvoiceDocument } from '../../../utils/printInvoice';
import TableComponent from '../../comman/TableComponent';
import getStatusStyle from '../../comman/invoiceSttausStyle';
import InvoicePreviewModal from '../../comman/InvoicePreviewModal';

export default function DashInvoice() {
    const { companyId } = useSelector((state) => state.auth);
    const { invoices, totalPages, error, loading } = useSelector(
      (state) => state.invoices
    );
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(
        fetchInvoices({
          searchTerm: "",
          date: "",
          companyId: companyId,
          status: "",
          page: "",
        })
      );
    }, [companyId, dispatch]);

    const [previewInvoice, setPreviewInvoice] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const openInvoicePreview = (invoice) => {
      setPreviewInvoice(invoice?.id);
      setIsInvoiceModalOpen(true);
    };
  
    const closeInvoicePreview = () => {
        setPreviewInvoice(null);
        setIsInvoiceModalOpen(false);
    };
  
    const handleDownload = async (invoiceId) => {
      if (!invoiceId) return;
      const response = await getInvoiceById(invoiceId);
      if (!response) return;
      downloadInvoiceDocument(response);
    };
  
    const handlePrint = async (invoiceId) => {
      if (!invoiceId) return;
      const response = await getInvoiceById(invoiceId);
      if (!response) return;
      printInvoiceDocument(response);
    };
  
    const columns = [
      {
        label: "Invoice",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>{item.invoiceNumber || "—"}</p>
        ) 
      },
      {
        label: "Date",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>{item.invoiceDate || "—"}</p>
        ) 
      },
      {
        label: "Due Date",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>{item.overDueDate || "—"}</p>
        ) 
      },
      {
        label: "Sub total",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.subTotal) || 0}</p>
        ) 
      },
      {
        label: "GST",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalGSTAmount || 0)}</p>
        ) 
      },
      {
        label: "Total",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalAmount || 0)}</p>
        ) 
      },
      {
        label: "Status",
        className: "p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <p className={`text-[11px] lg:text-[13px] capitalize px-2 py-0.5 rounded-md w-fit ${getStatusStyle(item.status)}`}>
            {item.status || "—"}
          </p>
        ) 
      },
      {
        label: "View",
        className: "text-center p-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <button
            type="button"
            onClick={() => openInvoicePreview(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </button>
        ),
      },
      {
        label: "Actions",
        className: "pl-4",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDownload(item?.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={() => handlePrint(item?.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Printer size={18} />
            </button>
          </div>
        ),
      }
    ];

    if (loading) {
        return (
          <div className="flex flex-col gap-2 justify-center items-center h-40">
              <Oval
                  height={60}
                  width={60}
                  color="#2563eb"
                  secondaryColor="#93c5fd"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
              />
              <p className="text-gray-500 animate-pulse text-sm font-semibold">Loading Invoices list...</p>
          </div>
        );
    }

    return (
      <div className="w-full">
          {error && <p className="mb-4 text-sm font-semibold">Invoice error: <span className="text-red-500">{error}</span></p>}
          
          {invoices && invoices.length > 0 && (
            <>
              {/* DESKTOP VIEW: STANDARD TABLE */}
              <div className="hidden lg:block w-full">
                  <TableComponent
                      columns={columns}
                      data={invoices.slice(0, 2)} 
                  />
              </div>

              {/* MOBILE & TABLET VIEW: CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden w-full">
                  {invoices.slice(0, 2).map((invoice, index) => (
                      <div 
                        key={invoice.id || index} 
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
                      >
                          {/* Card Top Block */}
                          <div className="flex items-start justify-between gap-3 border-b border-slate-50 pb-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                      <FileText size={18} strokeWidth={2.2} />
                                  </div>
                                  <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice No</p>
                                      <p className="text-sm font-black text-slate-900 truncate mt-0.5">{invoice.invoiceNumber || "—"}</p>
                                  </div>
                              </div>
                              <span className={`text-xs font-bold capitalize px-2.5 py-1 rounded-lg ${getStatusStyle(invoice.status)}`}>
                                  {invoice.status || "—"}
                              </span>
                          </div>

                          {/* Card Middle Dates Block */}
                          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-50 text-slate-700">
                              <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                      <Calendar size={12} /> Invoice Date
                                  </span>
                                  <p className="text-xs font-bold text-slate-800 mt-1">{invoice.invoiceDate || "—"}</p>
                              </div>
                              <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                      <Calendar size={12} /> Due Date
                                  </span>
                                  <p className="text-xs font-bold text-slate-800 mt-1">{invoice.overDueDate || "—"}</p>
                              </div>
                          </div>

                          {/* Card Financial Totals Block */}
                          <div className="grid grid-cols-3 gap-2 py-4 text-slate-700 bg-slate-50/50 px-3 rounded-xl mt-3">
                              <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtotal</span>
                                  <p className="text-xs font-black text-slate-800 mt-0.5">₹{Math.ceil(invoice.subTotal) || 0}</p>
                              </div>
                              <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST</span>
                                  <p className="text-xs font-black text-slate-800 mt-0.5">₹{Math.ceil(invoice.totalGSTAmount || 0)}</p>
                              </div>
                              <div>
                                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Total</span>
                                  <p className="text-sm font-black text-blue-600 mt-0.5">₹{Math.ceil(invoice.totalAmount || 0)}</p>
                              </div>
                          </div>

                          {/* Card Bottom Actions Triggers */}
                          <div className="flex items-center justify-between mt-4 pt-1">
                              <button
                                type="button"
                                onClick={() => openInvoicePreview(invoice)}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/70 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                              >
                                  <Eye size={14} strokeWidth={2.5} />
                                  <span>View Invoice</span>
                              </button>

                              <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleDownload(invoice?.id)}
                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-100"
                                    title="Download PDF"
                                  >
                                      <Download size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePrint(invoice?.id)}
                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-100"
                                    title="Print Invoice"
                                  >
                                      <Printer size={15} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </>
          )}

          <InvoicePreviewModal
              isOpen={isInvoiceModalOpen}
              onClose={closeInvoicePreview}
              invoiceId={previewInvoice}
          />
      </div>
    )
}

