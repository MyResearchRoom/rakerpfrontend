import React from "react";
import { toast } from "react-toastify";
import { fetchCompanies } from "../../store/actions/companyAction";
import { useDispatch } from "react-redux";

const DeleteConfirmationModal = ({
  isOpen,
  company,
  onClose,
  // setCompanies, // ✅ receive setter
}) => {
  const dispatch=useDispatch();
  if (!isOpen) return null;

  const handleDelete = async () => {
    const companyId = company?.id;

    if (!companyId) {
      toast.error("Company information missing.");
      return;
    }

    try {
      // 🔥 API CALL (when backend ready)
      // await deleteCompany(companyId);

      // ✅ Update UI directly
      // setCompanies((prev) =>
      //   prev.filter((c) => c.id !== companyId)
      // );

      toast.success(`Company "${company.name}" deleted successfully`);
      dispatch(fetchCompanies({ searchTerm:"", status:"", employeeId:"", page:""}));

      onClose?.();
    } catch (error) {
      toast.error("Failed to delete company");
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
              <b>{company?.name || "this company"}</b>?
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
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;