import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteBoardOfDirector } from "../../services/boardOfDirector";
import { fetchBoardOfDirectors } from "../../store/actions/boardOfDirector";
import { useDispatch } from "react-redux";
import { deleteFarmerMember } from "../../services/farmerMember";
import { fetchFarmerMemebrs } from "../../store/actions/farmerMember";

const DeleteFarmerMemberModal = ({ isOpen, onClose, farmerId ,companyId}) => {
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!farmerId) return;

    try {
      setLoading(true);

      const response = await deleteFarmerMember(farmerId);

      if (response) {
        toast.success(response||"Farmer deleted successfully");
        onClose();
        // console.log("Company id is",companyId);
        
        // refresh list
        dispatch(
            fetchFarmerMemebrs({
                id:companyId,
                searchTerm:"",
                page:"",
            })
        );
      } else {
        toast.error("Failed to delete farmer");
      }
    } catch (error) {
       toast.error(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Delete Farmer Member</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this farmer? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded-md"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFarmerMemberModal;