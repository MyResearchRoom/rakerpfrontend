import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteEmployee } from "../../services/user";
import { fetchEmployee } from "../../store/actions/employeeList";

const EmployeeDeleteModal = ({ isOpen, employeeId, onClose }) => {
  if (!isOpen || !employeeId) return null;

  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();


  const handleDelete = async () => {
      if (!employeeId) return;
  
      try {
        setLoading(true);
  
        const response = await deleteEmployee(employeeId);
  
        if (response) {
          toast.success(response||"Employee deleted successfully");
          onClose();
          
          dispatch(   
            fetchEmployee({
                searchTerm:"",
                page: "",
            })
          );
        } else {
          toast.error("Failed to delete employee");
        }
      } catch (error) {
         toast.error(err || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this employee?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X className=""/>
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDeleteModal;
