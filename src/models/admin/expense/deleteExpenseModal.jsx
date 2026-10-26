import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import ButtonComponent from "../../../components/comman/ButtonComponent";
import { deleteExpense } from "../../../services/expense";
import { fetchExpenses } from "../../../store/actions/expense";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteExpenseModal = ({ isOpen, onClose, expenseId,companyId ,isCall}) => {
  if (!isOpen || !expenseId) return null;
  const [loading, setLoading] = useState(false);

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleDelete = async() => {
      if (!expenseId) return;
        
            try {
              setLoading(true);
        
              const response = await deleteExpense(expenseId);
        
              if (response) {
                toast.success(response|| "Expense deleted successfully....");
  
                dispatch(
                  fetchExpenses({
                    categoryId:"",
                    companyId:companyId,
                    page:""
                }));

                if(isCall) {
                  onClose();
                }

                navigate("/expenses", {
                  state: {
                    companyId: companyId,
                    showModal: false,
                  },
                });

              } else {
                toast.error("Failed to delete expense");
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

        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <Trash2 size={16} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Expense
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-1 text-gray-500 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <ButtonComponent
            handleButtonClick={onClose}
            className="bg-gray-100 text-gray-700 rounded-md"
          >
            <p className="text-black border border-gray-200 px-4 py-2 rounded-md">Cancel</p>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={handleDelete}
            className="bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpenseModal;