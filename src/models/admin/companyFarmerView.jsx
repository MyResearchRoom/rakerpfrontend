const FarmerViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] md:w-[650px] rounded-lg p-5 shadow-lg relative max-h-[90vh] overflow-y-auto no-scrollbar" 
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="absolute top-2 right-3 text-black text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-black">
          Farmer Member Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

          <p><b>Name:</b> {data.fullName}</p>
          <p><b>Age:</b> {data.age}</p>

          <p><b>Mobile:</b> {data.mobileNumber}</p>
          <p><b>Gender:</b> {data.gender}</p>

          <p><b>Social Category:</b> {data.category}</p>
          <p><b>Qualification:</b> {data.qualification}</p>


          <p><b>PAN:</b> {data.pan}</p>
          <p><b>Aadhar:</b> {data.aadhar}</p> 

          <p><b>Date of share capital contribution:</b> {data.shareDate}%</p>
          <p><b>Face value for each share:</b> ₹{data.faceValue}</p>
          
          <p><b>Numbers of shares allotted:</b> {data.noOfShareAlloted}</p>
          <p><b>Shareholding:</b> {data.shareholding}%</p>
          
          <p><b>contribution to Share Capital:</b> ₹{data.shareConstribution}</p>
          <p><b>Distintive Folio Number:</b> {data.folioNumber}</p>

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

export default FarmerViewModal;