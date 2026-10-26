import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { changeStatusOfExpense } from "../../../services/expense";

export default function ExpenseActionModal({ expenseId, isOpen, onClose }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!status) {
      toast.error("Please select an action");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        status, 
      };

      const response = await changeStatusOfExpense(expenseId, payload);
      if(response){
        toast.success(response|| "Expense status change successfulyy..");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 h-64 flex flex-col">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Expense Status</h2>
          <X className="cursor-pointer" size={18} onClick={onClose} />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Select Action</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mt-1 border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">-- Select --</option>
            <option value="approved">Approve</option>
            <option value="rejected">Reject</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}