import React from "react";

const DirectorViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] md:w-[650px] rounded-lg p-5 shadow-lg relative h-[90vh] overflow-y-auto no-scrollbar" 
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="absolute top-2 right-3 text-black text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-black">
          Board of Director Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

          <p><b>Name:</b> {data.fullName}</p>
          <p><b>Role:</b> {data.role}</p>

          <p><b>Holding position since:</b> {data.holdingSince}</p>
          <p><b>Age:</b> {data.age}</p>

          <p><b>Mobile:</b> {data.mobile}</p>
          <p><b>Email:</b> {data.email}</p>

          <p><b>Gender:</b> {data.gender}</p>
          <p><b>Social Category:</b> {data.category}</p>

          <p><b>Qualification:</b> {data.qualification}</p>
          <p><b>B.Sc Agri / Chemistry Background:</b> {data.background ? "Yes" : "No"}</p>


          <p><b>PAN:</b> {data.pan}</p>
          <p><b>Aadhar:</b> {data.aadhar}</p>

          <p><b>Is Sanchalak / Sahayyak:</b> {data.isSanchalak ? "Yes" : "No"}</p>
          <p><b>DIN:</b> {data.dinNumber}</p>

          <p><b>DIN issued:</b> {data.dinIssued ? "Yes" : "No"}</p>
          <p><b>Distinctive Folio Number:</b> {data.folioNumber}</p>

          <p><b>DSC issued:</b> {data.dsc ? "Yes" : "No"}</p>
          <p><b>Farmer certificate collected issued:</b> {data.farmerCert ? "Yes" : "No"}</p>

          <p><b>Date of share capital contribution:</b> {data.shareDate}%</p>
          <p><b>Face value of share:</b> ₹{data.faceValue}</p>
          
          <p><b>Numbers of shares:</b> {data.shares}</p>
          <p><b>Shareholding:</b> {data.shareholding}%</p>
          
          <p><b>Share Capital contribution:</b> ₹{data.capital}</p>
          <p><b>Key skill:</b> {data.skill}</p>

          <p><b>Total Landholding (Acres):</b> {data.land}</p>
          <p><b>Land record number:</b> {data.landRecord}</p>

          <p></p>

          <p className="md:col-span-2 font-bold text-black text-lg">Address :-</p>

          <p><b>Block:</b> {data.block}</p>
          <p><b>Village:</b> {data.village}</p>

          <p><b>District:</b> {data.district}</p>
          <p><b>Tehsil:</b> {data.tehsil}</p>

          <p><b>State:</b> {data.state}</p>
          <p><b>Pincode:</b> {data.pincode}</p>

        </div>
      </div>
    </div>
  );
};

export default DirectorViewModal;