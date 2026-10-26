import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChangePasswordModal from "../models/changePassword";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate=useNavigate();

  const [showModal, setShowModal] = useState(false);

  return (
  <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>

        <div className="space-y-2 text-sm ">
          <p><span className="font-medium capitalize">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Mobile:</span> {user?.mobileNumber}</p>
          <p><span className="font-medium">Role:</span> {role}</p>
        </div>


        <div className="flex flex-row flex-wrap gap-x-5 gap-y-3">
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>

          {role==="COMPANY" && 
            <button
              onClick={() => navigate("/company-profile")}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View complete profile 
            </button>
          }
        </div>
      </div>

      {showModal && (
        <ChangePasswordModal onClose={() => setShowModal(false)} />
      )}
   </div>
  );
}