import React, { useEffect, useState } from "react";
import InputField from "../../components/comman/InputField";
import ButtonComponent from "../../components/comman/ButtonComponent";
import { X, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { getFarmerMemberById } from "../../services/farmerMember";
import { Oval } from "react-loader-spinner";
import { viewComplianceDocument } from "../../utils/complianceDocuments";

const getFarmerDetailBlocks = (farmer) => [
  {
    title: "Personal & Contact Info",
    columns: [
      { label: "Name of Shareholder Farmer", value: farmer.fullName },
      { label: "Age", value: farmer.age },
      { label: "Gender", value: farmer.gender },
      { label: "Social Category", value: farmer.category },
      { label: "Educational Qualification", value: farmer.qualification },
      { label: "Mobile Number", value: farmer.mobileNumber },
       { label: "Email", value: farmer.email},
      { label: "PAN Number", value: farmer.pan },
      { label: "Aadhaar Number", value: farmer.aadhaar },
    ],
  },
  {
    title: "Share & Land",
    columns: [
      { label: "Date of Share Capital Contribution / Date of Membership", value: farmer.shareDate },
      { label: "Face value of each share (in Rs.)", value: Number(farmer.faceValue) },
      { label: "No. of Shares Allotted (Nos.)", value: Number(farmer.noOfShareAlloted) },
      { label: "Contribution to Share Capital (Rs.)", value: Number(farmer.shareConstribution) },
      {
        label: "% Shareholding in FPC",
        value: farmer.shareholding ? `${Number(farmer.shareholding)}%` : "",
      },
      { label: "Total Landholding (Acres)", value: Number(farmer.landHolding) },
      { label: "Land Record No. (Survey No. / Khsara No.)", value: farmer.landRecordNumber },
      { label: "Distinctive Folio Number", value: farmer.folioNumber },
    ],
  },
  {
    title: "Location",
    columns: [
      { label: "Name of Village where Farmer resides", value: farmer.village },
      { label: "Block", value: farmer.block },
      { label: "Tehsil", value: farmer.tehsil },
      { label: "District", value: farmer.district },
      { label: "State", value: farmer.state },
      { label: "Pincode", value: farmer.pincode },
    ],
  },
];

const FarmerDetailsModal = ({ farmerId, isOpen, onClose }) => {
  if (!farmerId) return null;
  if (!isOpen) return null;

  const [farmer, setFarmer] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFarmerMemberById = async () => {
    try {
      setLoading(true);
      const res = await getFarmerMemberById(farmerId);
      if (res) {
        setFarmer(res);
      }
      else {
        toast.error("Somethig went wrong")
      }
    }
    catch (error) {
      toast.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (farmerId) {
      fetchFarmerMemberById();
    }
  }, [farmerId]);

  const blocks = getFarmerDetailBlocks(farmer);

  const documents = [
    {
      label: "Aadhaar Card",
      value: farmer?.aadhaarCard,
      type: farmer?.aadhaarCardContentType,
    },
    {
      label: "7/12 Document",
      value: farmer?.sevenTwelve,
      type: farmer?.sevenTwelveContentType,
    },
    {
      label: "Pan Card Document",
      value: farmer?.panCard,
      type: farmer?.panCardContentType,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-40">
        <Oval
          height={60}
          width={60}
          color="#2563eb"
          secondaryColor="#93c5fd"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
        <p className="text-gray-500 animate-pulse">Loading Farmer details...</p>
      </div>
    );
  }

  if (!farmer) return (<p className="text-red-600">Farer details ot found</p>)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Farmer Member Details
            </p>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{farmer.fullName}</h3>
            <p className="text-sm text-gray-500 capitalize">
              Village: {farmer.village} · Category: {farmer.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">

          {/* FARMER DETAILS */}
          {blocks.map((block) => (
            <section key={block.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {block.title}
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                {block.columns.map((col) => (
                  <InputField
                    key={`${block.title}-${col.label}`}
                    label={col.label}
                    name={`${block.title}-${col.label}`}
                    value={col.value || "—"}
                    readOnly
                    className="capitalize"
                  />
                ))}
              </div>
            </section>
          ))}

          {/* DOCUMENTS SECTION */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Uploaded Documents
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Aadhaar */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Aadhaar Card
                  </p>

                  <p className="text-xs text-gray-400">
                    {farmer?.aadhaarCard
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {farmer?.aadhaarCard && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: farmer.aadhaarCard,
                        docName: "Aadhaar Card",
                        docContentType:
                          farmer.aadhaarCardContentType ||
                          "application/pdf",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

              {/* 7/12 */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    7/12 Document
                  </p>

                  <p className="text-xs text-gray-400">
                    {farmer?.sevenTwelve
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {farmer?.sevenTwelve && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: farmer.sevenTwelve,
                        docName: "7/12 Document",
                        docContentType:
                          farmer.sevenTwelveContentType ||
                          "application/pdf",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

              
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    PAN Card
                  </p>

                  <p className="text-xs text-gray-400">
                    {farmer?.panCard
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {farmer?.panCard && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: farmer.panCard,
                        docName: "PAN Card",
                        docContentType:
                          farmer.panCardContentType ||
                          "application/pdf",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

            </div>
          </section>
        </div>
        <div className="flex justify-end border-t px-6 py-3">
          <ButtonComponent
            handleButtonClick={onClose}
            className="rounded-full bg-gray-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
          >
            Close
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};


export default FarmerDetailsModal;
