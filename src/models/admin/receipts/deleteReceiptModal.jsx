import React, { useState } from "react";
import ButtonComponent from "../../../components/comman/ButtonComponent";
import { deleteReceipt } from "../../../services/receipt";
import { useDispatch } from "react-redux";
import { fetchReceipts } from "../../../store/actions/receiptsActions";
import { toast } from "react-toastify";

const DeleteReceiptModal = ({ receiptId, isOpen, onClose }) => {
  if (!isOpen || !receiptId) return null;

  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();
  
      const handleDelete = async() => {
          if (!receiptId) return;
               
          try {
              setLoading(true);
               
              const response = await deleteReceipt(receiptId);
               
              if (response) {
                  toast.success(response||"Receipt deleted successfully");
                  onClose();
                       
                  dispatch(fetchReceipts({ searchTerm:"",page:1}));
              } else {
                  toast.error("Failed to delete receipt");
              }
          } catch (error) {
              toast.error(error || "Something went wrong");
          } finally {
              setLoading(false);
          }
      };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Receipt
        </h3>

        <p className="text-sm text-gray-500">
          Are you sure you want to delete this receipt? This action cannot be undone.
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <ButtonComponent
            handleButtonClick={onClose}
            className="bg-gray-100 text-gray-700 px-4 py-2"
          >
            Cancel
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={handleDelete}
            className="bg-red-600 px-4 py-2 text-white"
          >
            Delete
          </ButtonComponent>
        </div>

      </div>
    </div>
  );
};

export default DeleteReceiptModal;