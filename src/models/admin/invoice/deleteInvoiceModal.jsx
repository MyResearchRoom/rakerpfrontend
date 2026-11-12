import React, { useState } from "react";
import ButtonComponent from "../../../components/comman/ButtonComponent";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../../../services/invoice";
import { toast } from "react-toastify";
import { fetchInvoices } from "../../../store/actions/invoiceActions";

const DeleteInvoiceModal = ({ invoiceId, isOpen, onClose }) => {
    if (!isOpen || !invoiceId) return null;

    const [loading, setLoading] = useState(false);
    const dispatch=useDispatch();

    const handleDelete = async() => {
        if (!invoiceId) return;
             
        try {
            setLoading(true);
             
            const response = await deleteInvoice(invoiceId);
             
            if (response) {
                toast.success(response||"Invoice deleted successfully");
                onClose();
                     
                dispatch(   
                    fetchInvoices({
                        page: 1,
                    })
                );
            } else {
                toast.error("Failed to delete invoices");
            }
        } catch (error) {
            toast.error(error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Invoice
                </h3>

                <p className="text-sm text-gray-500">
                    Are you sure you want to delete this invoice? This action cannot be undone.
                </p>

                <div className="mt-4 flex justify-end gap-3">
                    <ButtonComponent
                        handleButtonClick={onClose}
                        className="bg-gray-100 text-gray-700 rounded-md"
                    >
                        <p className="text-black border border-gray-200 px-4 py-2 rounded-md">Cancel</p>
                    </ButtonComponent>

                    <ButtonComponent
                        handleButtonClick={handleDelete}
                        className="bg-red-600 px-4 py-2 text-white"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
};

export default DeleteInvoiceModal;