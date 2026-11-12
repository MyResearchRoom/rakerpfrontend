import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {getInvoiceById} from "../../services//invoice"
import { Oval } from "react-loader-spinner";
import TableComponent from "./TableComponent";
import ButtonComponent from "./ButtonComponent";
import { downloadInvoiceDocument } from "../../utils/downloadInvoice";

const InvoicePreviewModal = ({
  isOpen,
  onClose,
  invoiceId,
}) => {
  if (!isOpen || !invoiceId) return null;

  const [loading,setLoading]=useState(false);

  const [company,setCompany]=useState({});
  const [items,setItems]=useState([]);
  const [invoice,setInvoice]=useState({});
  const [customer,setCustomer]=useState({});

  const fetchInvoiceById=async()=>{
    try {
      setLoading(true);  
      const response=await getInvoiceById(invoiceId);
      if(response){
        setInvoice(response);
        setCompany(response?.company);
        setItems(response?.invoiceItems);
        setCustomer(response?.customer?.[0] || {});
      }
    } catch (error) {
      toast.error(error)
    }finally {
      setLoading(false); 
    }
  }
      
    useEffect(() => {
      if(invoiceId){
        fetchInvoiceById();
      }
    }, [invoiceId]);

  const handleDownload = () => {
    downloadInvoiceDocument(invoice);
  };

  const columns = [
    {
      label: "Sr. No.",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item, index) => (
        <p className='text-[13px]'>{index + 1}</p>
      )
    },
    {
      label: "Item Name",
      // className:"text-[13px]",
      headerClassName:"font-semibold text-black text-[14px] ",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{item?.material?.itemName|| "—"}</p>
      ) 
    },
    {
      label: "Quantity",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.quantity) || "—"}</p>
      ) 
    },
    {
      label: "HSN code",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{item?.material?.hsnCode|| "—"}</p>
      ) 
    },
    {
      label: "Rate",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.rate) || "—"}</p>
      ) 
    },
    {
      label: "CGST (%)",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.cgstPercent) || "—"}</p>
      ) 
    },
    {
      label: "SGST (%)",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.sgstPercent) || "—"}</p>
      ) 
    },
    {
      label: "Sub Total",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.subTotal) || "—"}</p>
      ) 
    },
    {
      label: "Total",
      // className:"capitalize text-[13px]",
      headerClassName:"font-semibold text-black text-[14px]",
      render: (item) =>(
        <p className='text-[13px] capitalize'>{Number(item?.totalAmount) || "—"}</p>
      ) 
    },
  ];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 shadow-xl flex flex-col gap-2 max-h-[90vh] overflow-y-auto">

        <div className="flex flex-row items-start gap-3 mb-2">
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-bold text-xl">Invoice</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full text-gray-600 hover:bg-gray-200 ml-auto"
          >
            <X size={20} />
          </button>
        </div>    

        {loading ? (
          <div className="flex flex-col gap-2 justify-center items-center h-40">
            <Oval
                height={60}
                width={60}
                color="#2563eb"
                secondaryColor="#93c5fd"
                strokeWidth={4}
                strokeWidthSecondary={4}
            />
            <p className="text-gray-500 animate-pulse">Loading Invoices Data...</p>
          </div>
        ) : (
          <div className="space-y-6">

            <div className="grid md:grid-cols-2 items-start gap-3">
              <div className="flex flex-col items-start">
                  <img
                    src={company?.logo}
                    alt="logo"
                    className="h-20 w-auto object-contain  rounded p-1 bg-white"
                  />
              </div>
              

              <div>
                {company ? (
                  <>
                    <p className="text-base font-semibold text-gray-900 capitalize break-all">
                      {company?.name || "-"}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {company?.address || "—"}, {company.city}, {company.state}, {company.pincode}, 
                    </p>
                    <p className="text-sm text-gray-500">
                      GSTIN: {company.gstin || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      PAN: {company.pan || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {company.email || "—"} | {company.mobileNumber || "—"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">
                    Company not found
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">

              <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-950">Bill To</p>

                {customer ? (
                  <>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {customer?.name || "-"}
                    </p>
                    <p className="text-sm text-gray-500 capitalize break-words whitespace-normal">
                      {customer?.address || "—"} {customer.city}, {customer.state}
                    </p>
                    {customer.gstin &&
                      <p className="text-sm text-gray-500">
                        GSTIN: {customer.gstin || "—"}
                      </p>
                    }
                    <p className="text-sm text-gray-500">
                      PAN: {customer.pan || "—"}
                    </p>
                    <p className="text-sm text-gray-500 ">
                      Email: {customer.email || "—"} | {customer.phone || "—"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">
                    Customer not found
                  </p>
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase text-gray-950">Invoice Details</p>
                <p className="text-base font-semibold text-gray-900">
                  Invoice : {invoice.invoiceNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Invoice Date: {invoice.invoiceDate}
                </p>
                <p className="text-sm text-gray-500">
                  Due Date: {invoice.overDueDate}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Status: {invoice.status}
                </p>
                <p className="text-sm text-gray-500">
                  Amount: ₹ {Number(invoice.totalAmount)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-300 bg-white p-4">
                <TableComponent
                  columns={columns}
                  data={items}
                />     
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="text-sm text-gray-700 border border-gray-200 p-3 rounded-xl bg-gray-100 flex flex-col gap-1">
                <p className="">Subtotal: ₹{Number(invoice.subTotal) || "0"}</p>
              
                <p className="">GST: ₹{Number(invoice.totalGSTAmount) || "0"}</p>
    
                <p className="font-semibold text-gray-900">
                  Total: ₹{Number(invoice.totalAmount) || "0" }
                </p>
              </div>      

              <div className="text-sm md:text-base font-normal border border-gray-200 p-3 rounded-xl bg-gray-100 flex flex-col gap-1">
                <p className="text-gray-900">Remaining amount: ₹ {Math.ceil(invoice.totalRemaining) || "0 "}</p>
              
                <p className="text-gray-900">Total Paid: ₹ {Math.ceil(invoice.totalPaid) || "0"}</p>
    
              </div>  

              <div className="flex flex-wrap gap-3">
                <ButtonComponent
                  handleButtonClick={handleDownload}
                  className="bg-blue-500 rounded px-4 py-2 text-white"
                >
                  Download PDF
                </ButtonComponent>
              </div>

            </div>
          </div>
        )
        }   

        
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
