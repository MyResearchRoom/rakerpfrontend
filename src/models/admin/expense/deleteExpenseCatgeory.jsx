import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteMaterial } from "../../../services/material";
import { toast } from "react-toastify";
import { fetchMaterials } from "../../../store/actions/materials";
import ButtonComponent from "../../../components/comman/ButtonComponent";
import { deletExpenseCategory } from "../../../services/expense";
import { fetchExpenseCategory } from "../../../store/actions/expenseCatgeory";

const DeletExpenseCategory = ({
  categoryId,
  isOpen,
  onClose,
}) => {

  if (!isOpen || !categoryId) return null;

  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();

  const handleDelete = async() => {
    if (!categoryId) return;
      
          try {
            setLoading(true);
      
            const response = await deletExpenseCategory(categoryId);
      
            if (response) {
              toast.success(response|| "Category deleted successfully");
              
              dispatch(
                fetchExpenseCategory({
                  searchTerm:"",
                  page: "",
                })
              );
              
              onClose();
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this category? This action cannot be undone.
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
            className="bg-red-600 px-4 py-2 rounded-md  "
          >
            {loading ? "Deleting..." : "Delete"}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default DeletExpenseCategory;