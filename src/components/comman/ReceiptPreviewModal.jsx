import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ButtonComponent from "./ButtonComponent";
import { companyData } from "../../data/companyData";
import { downloadReceiptDocument } from "../../utils/downloadReceipt";
import { toast } from "react-toastify";
import { getReceiptById } from "../../services/receipt";
import { Oval } from "react-loader-spinner";

const ReceiptPreviewModal = ({
  isOpen,
  onClose,
  receiptId,
}) => {
    if (!isOpen || !receiptId) return null;

    const [loading,setLoading]=useState(false);
  
    const [company,setCompany]=useState({});
    const [receipt,setReceipts]=useState({});
    const [invoice,setInvoice]=useState({});
    const [customer,setCustomer]=useState({});
  
    const fetchReceiptById=async()=>{
      try {
        setLoading(true);  
        const response=await getReceiptById(receiptId);
        if(response){
          setReceipts(response);
          setCompany(response?.company);
          setInvoice(response?.invoice);
          setCustomer(response?.invoice?.customer?.[0] || {});
        }
      } catch (error) {
        toast.error(error)
      }finally {
        setLoading(false); 
      }
    }
        
    useEffect(() => {
      if(receiptId){
        fetchReceiptById();
      }
    }, [receiptId]);

  const handleDownload = () => {
    downloadReceiptDocument(receipt);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl ">

        {/* <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
        >
          <X size={20} />
        </button> */}
        <div className="flex flex-row items-start gap-3 mb-2">
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-bold text-xl">Invoice Receipt</h1>
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
            <p className="text-gray-500 animate-pulse">Loading Receipt Data...</p>
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
                    <p className="text-sm text-gray-500  capitalize">
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

          <hr />

          <div className="grid md:grid-cols-2 gap-4">

            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-950 uppercase">
                Received From
              </p>

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
                    <p className="text-sm text-gray-500  capitalize">
                      Email: {customer.email || "—"} | {customer.phone || "—"}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">
                    Customer not found
                  </p>
                )}
            </div>


            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-950 uppercase">
                Receipt Details
              </p>

              <p className="text-base font-semibold text-gray-900">
                  RECEIPT : {receipt.receiptNumber}
                </p>

              <p className="text-sm text-gray-600">
                Date: {receipt.paymentDate || "—"}
              </p>

              <p className="text-sm text-gray-600 ">
                Payment Mode: <span className="uppercase">{receipt.paymentMethod || "—"}</span>
              </p>

              <p className="text-sm text-gray-600">
                Transaction Ref: {receipt.transactionReference || "—"}
              </p>

              <p className="text-sm text-gray-600">
                Invoice: {invoice.invoiceNumber || "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase">
              <span>Description</span>
              <span>Amount (₹)</span>
            </div>

            <div className="flex justify-between mt-2 text-sm text-gray-700">
              <span>
                Payment received against Invoice {invoice.invoiceNumber}
              </span>
              <span>
                ₹{Number(receipt.amount) || "0"}
              </span>
            </div>
          </div>

   
          <div className="flex justify-between items-center border-t pt-4">
            <p className="font-semibold text-gray-800">
              Total Amount Received
            </p>
            <p className="text-lg font-bold text-green-600">
              ₹{Number(receipt.amount) || "0"}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
            <p>
              Payment Mode:{" "}
              <span className="font-medium uppercase">
                {receipt.paymentMethod || "—"}
              </span>
            </p>

            <p>
              Transaction Ref:{" "}
              <span className="font-medium">
                {receipt.transactionReference || "—"}
              </span>
            </p>

            <p>
              Status:{" "}
              <span className="text-green-600 font-semibold">
                Received
              </span>
            </p>
          </div>

          <div className="flex justify-between items-end pt-4 border-t">

            <div className="text-xs text-gray-500 space-y-1">
              <p>This is a computer-generated receipt.</p>
              <p>No signature required.</p>
            </div>

          </div>

          <div className="flex justify-end">
            <ButtonComponent
              handleButtonClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </ButtonComponent>
          </div>

        </div>
        )
        } 
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;