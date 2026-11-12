import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { fetchCompliance } from "../../../store/actions/compliance";
import { deleteCompliance } from "../../../services/compliance"; 

const DeleteComplianceModal = ({
  isOpen,
  compliance,
  onClose,
}) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleDelete = async () => {
    const complianceId = compliance?.id;

    if (!complianceId) {
      toast.error("Compliance document information missing.");
      return;
    }

    try {
      

      toast.success(
        `Compliance document "${compliance?.docName || "Document"}" deleted successfully`
      );

      dispatch(
        fetchCompliance({
          searchTerm: "",
          companyId: "",
          page: 1,
          limit: 10,
        })
      );

      onClose?.();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete compliance document");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Delete
            </h3>

            <p className="text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <b>{compliance?.docName || "this compliance document"}</b>?
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteComplianceModal;