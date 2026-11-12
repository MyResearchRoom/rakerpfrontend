import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getExpenseById } from '../../../../services/expense';
import {
  CalendarDays,
  FileText,
  User,
  Building2,
  Tag,
  CreditCard,
  Hash,
  ReceiptText,
  Pencil,
  Download,
  Trash2,
  Eye,
  ArrowLeft,
  CheckCheck,
  BadgeCheck,
  IndianRupee
} from "lucide-react";

import ButtonComponent from "../../../comman/ButtonComponent"
import DeleteExpenseModal from '../../../../models/admin/expense/deleteExpenseModal';
import ExpenseActionModal from '../../../../models/admin/expense/acceptOrRejectAction';
import { formatCurrency } from '../../../comman/formateCurrency';
import AddExpenseModal from '../../../../models/admin/expense/AddExpenseModal';

export default function ExpenseDeytails() {
    const {id}=useParams();
    const navigate = useNavigate();
    const [expenseData,setExpenseData]=useState({});
    const [actionModelOpen,setActionModelOpen]=useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchExpenseById=async()=>{
        try {  
            const response=await getExpenseById(id);
            if(response){
                setExpenseData(response);
            }          
        } catch (error) {
            toast.error(error)
        }
    }
          
    useEffect(() => {
        if(id){
            fetchExpenseById();
        }
    }, [id]);

    const handleDocumentAction = (base64Data, action = "view") => {
        if (!base64Data) return;

        try {
            const parts = base64Data.split(",");
            if (parts.length < 2) return;

            const byteString = atob(parts[1]);
            const mimeType = parts[0].split(":")[1].split(";")[0];

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeType });
            const url = URL.createObjectURL(blob);

            if (action === "view") {
            window.open(url, "_blank");
            } else if (action === "download") {
            const extension = mimeType.split("/")[1] || "file";

            const link = document.createElement("a");
            link.href = url;
            link.download = `receipt.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            }

            setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (err) {
            console.error("File error:", err);
        }
    };

    if (!expenseData) {
        return (
        <div className="p-6 text-red-500">
            Expense not found.
        </div>
        );
    }


  return (
    <div className="min-h-screen pb-4 px-2">

      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xl text-blue-600  mb-2 flex flex-row items-center gap-2"
          >
            <ArrowLeft  size={18}/> Back to Expenses
          </button>

          <div className="flex items-center gap-2">
            <ReceiptText className="text-blue-600" size={24} />
            <h1 className="text-2xl font-semibold text-gray-900">
              {expenseData.expenseNumber}
            </h1>
          </div>

        </div>

        <p
            className={`inline-flex items-center rounded-md px-3 py-1 text-base font-semibold capitalize border
              ${expenseData.status === "approved"
              ? "bg-emerald-50 text-emerald-600 border-emerald-600"
              : expenseData.status === "rejected" 
              ? "bg-red-50 text-red-600 border-red-600"
              :  "bg-yellow-50 text-yellow-500 border-yellow-500"}`}
          >
            {expenseData.status}
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

        <div className="md:col-span-2 space-y-6">

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Expense Information
            </h2>

            <div className="grid grid-cols-2 gap-6 text-sm">

              <div className="flex items-start gap-2">
                <Hash className="text-blue-500 mt-1" size={16} />
                <div>
                  <p className="text-gray-500">Expense </p>
                  <p className="font-semibold">
                    {expenseData.expenseNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CalendarDays className="text-green-500 mt-1" size={16} />
                <div>
                  <p className="text-gray-500">Expense Date</p>
                  <p className="font-semibold">
                    {new Date(expenseData.date).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="text-purple-500 mt-1" size={16} />
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-semibold capitalize">
                    {expenseData?.company?.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Tag className="text-orange-500 mt-1" size={16} />
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-semibold capitalize">
                    {expenseData?.expenseCategory?.name || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Description</p>
              <p className="text-gray-700 capitalize">
                {expenseData.description}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 border p-4 flex justify-between items-center">
              <p className="text-blue-600 font-medium flex items-center gap-1">
                <IndianRupee size={16} />
                Total Amount
              </p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(expenseData.amount)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              Payment Information
            </h2>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-semibold uppercase">
                  {expenseData.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Reference Number</p>
                <p className="font-semibold capitalize">
                  {expenseData.reference}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Additional Notes
            </h2>
            <p className="text-sm text-gray-600">
              {expenseData?.notes || "-"}
            </p>
          </div>

        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              Uploaded Bill/Receipt
            </h2>

            {expenseData?.receipt ?
            <div className="flex  gap-3 border rounded-lg p-3 flex-col items-start">
              <div className='border p-2 w-full rounded-md'>
                <p className="text-sm font-medium">
                  expense_receipt.pdf
                </p>
                <p className="text-xs text-gray-500">
                  {expenseData?.receiptContentType}
                </p>
              </div>

              {/* <ButtonComponent className="bg-blue-600 w-full py-2 rounded text-white flex items-center justify-center gap-2">
                <Eye size={16} />
                View Document
              </ButtonComponent> */}

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => handleDocumentAction(expenseData?.receipt, "view")}
                    aria-label="View document"
                    className="flex flex-row items-center justify-center rounded-md bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 px-3 py-1 text-sm gap-2"
                    >
                        <Eye size={16} />  View
                </button>
                <button
                    type="button"
                    onClick={() => handleDocumentAction(expenseData?.receipt, "download")}
                    aria-label="Download document"
                    className="flex flex-row items-center justify-center rounded-md bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100 px-3 py-1 text-sm gap-2"
                >
                    <Download size={16} /> Download
                </button>
              </div>
            </div> 
            : (
                <p className=''>No Receipt uploded</p>
            ) }

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-800">
              Actions
            </h2>

            {/* {expenseData?.status==="pending" && (
                <ButtonComponent
                    handleButtonClick={() => setActionModelOpen(true)}
                    className="bg-green-600 w-full py-2 text-white rounded flex items-center justify-center gap-2"
                >
                    <CheckCheck size={16} />
                    Accept/Reject
                </ButtonComponent>
            )} */}

            {/* <ButtonComponent
              handleButtonClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 w-full py-2 text-white rounded flex items-center justify-center gap-2"
            >
              <Pencil size={16} />
              Edit Expense
            </ButtonComponent> */}

            <ButtonComponent 
                handleButtonClick={() => handleDocumentAction(expenseData?.receipt, "download")}
                className="bg-gray-600 w-full py-2 text-white rounded flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Receipt
            </ButtonComponent>

            <ButtonComponent
              handleButtonClick={() => setIsDeleteModalOpen(true)}
              className=" bg-red-600 w-full py-2 text-white rounded flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Expense
            </ButtonComponent>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-2">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 pb-2">
              Created By
            </h2>

            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-500" />
              <p className="text-sm font-medium">
                {expenseData?.createdByUser ?.name ?? "-"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <BadgeCheck size={18} className="text-gray-500" />
              <p className="text-sm font-medium text-gray-500">
                {expenseData?.createdByUser ?.role ?? "-"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-gray-500" />
              <p className="text-sm text-gray-600">
                {new Date(expenseData.date).toDateString()}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* <AddExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // initialValues={editInitialValues}
        companyId={expenseData.companyId}
        expenseId={expenseData.id} 
      />  */}

      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        expenseId={expenseData.id} 
        companyId={expenseData.companyId}
        
      /> 

      <ExpenseActionModal
        isOpen={actionModelOpen}
        onClose={() => {
          setActionModelOpen(false);
          fetchExpenseById();
        }}
        expenseId={expenseData.id} 
      /> 
    </div>
  )
}
