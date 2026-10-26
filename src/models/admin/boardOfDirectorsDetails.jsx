import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import InputField from "../../components/comman/InputField";
import SelectField from "../../components/comman/SelectField";
import ButtonComponent from "../../components/comman/ButtonComponent";
import FilterBar from "../../components/comman/FilterBar";
import PageHeader from "../../components/comman/PageHeader";
import { boardOfDirectorMembers } from "../../data/companyBoardOfDirector";
import { viewComplianceDocument } from "../../utils/complianceDocuments";
import { companyData } from "../../data/companyData";
import { Eye, X } from "lucide-react";
import { getBoardOfDirectorById } from "../../services/boardOfDirector";
import { Oval } from "react-loader-spinner";

const getDirectorDetailBlocks = (director) => [
  {
    title: "Personal & Role Info",
    columns: [
      { label: "Role", value: director.role },
      { label: "Holding Position Since", value: director.holdingSince },
      { label: "Full Name of BoD", value: director.fullName },
      { label: "Age", value: director.age },
      { label: "Gender", value: director.gender },
      { label: "Social Category", value: director.category },
      { label: "Educational Qualification", value: director.qualification },
      { label: "Key Skill of this BoD", value: director.skill },
      { label: "Does this BoD have B.Sc. Agri or B.Sc. Chemistry background?", value: director.background ? "Yes" : "No" },
    ],
  },
  {
    title: "Identifiers & Authorizations",
    columns: [
      // { label: "Is DIN issued to the BoD?", value: director.dinIssued ? "Yes" : "No" },
      { label: "DIN Number", value: director.dinNumber },
      // { label: "Is DSC issued to the BoD?", value: director.dsc ? "Yes" : "No" },
      { label: "Farmer/ Producer Certificate collected?", value: director.farmerCert ? "Yes" : "No" },
      // { label: "Is Sanchalak/ Sahayyak", value: director.isSanchalak ? "Yes" : "No" },
      { label: "Distinctive Folio Number", value: director.folioNumber },
      { label: "PAN Number", value: director.pan },
      { label: "Aadhaar Number", value: director.aadhaar },
    ],
  },
  {
    title: "Shareholding & Capital",
    columns: [
      { label: "Date of Share Capital Contribution / Date of Membership", value: director.shareDate },
      { label: "Face value of each share (in Rs.)", value: Number(director.faceValue) },
      { label: "No. of Shares Allotted", value: Number(director.shares) },
      { label: "Contribution to Share Capital", value: Number(director.capital) },
      { label: "% Shareholding in FPC", value: Number(director.shareholding) },
      { label: "Total Landholding (Acres)", value: Number(director.land) },
      { label: "Land Record No. (Survey No. / Khsara No.)", value: director.landRecord },
    ],
  },
  {
    title: "Contact & Location",
    columns: [
      { label: "Mobile Number", value: director.mobile },
      { label: "E-mail ID", value: director.email },
      { label: "Name of Village where this BoD Farmer resides", value: director.village },
      { label: "Block", value: director.block },
      { label: "Tehsil/ Taluka", value: director.tehsil },
      { label: "District", value: director.district },
      { label: "State", value: director.state },
      { label: "Pincode", value: director.pincode },
    ],
  },
];

const DirectorDetailsModal = ({ directorID, isOpen, onClose }) => {
  if (!directorID) return null;
  if (!isOpen) return null;

  const [director, setDirector] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchBoardOfDircetor = async () => {
    try {
      setLoading(true);
      const res = await getBoardOfDirectorById(directorID);
      if (res) {
        setDirector(res);
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
    if (directorID) {
      fetchBoardOfDircetor();
    }
  }, [directorID]);

  const blocks = getDirectorDetailBlocks(director);

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

  if (!director) return (<p className="text-red-600">Director details not found</p>)

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
              Board Member Details
            </p>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{director.fullName}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {director.role} · {director.village}
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

          {/* DETAILS BLOCKS */}
          {blocks.map((block) => (
            <section key={block.title} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {block.title}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                {block.columns.map((col) => (
                  <InputField
                    key={`${block.title}-${col.label}`}
                    label={col.label}
                    name={`${block.title}-${col.label}`}
                    value={col.value || "—"}
                    readOnly
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

            <div className="grid gap-4 md:grid-cols-2">

              {/* Director Picture */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Director Picture
                  </p>

                  <p className="text-xs text-gray-400">
                    {director?.kycDocument
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {director?.kycDocument && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: director.kycDocument,
                        docName: "Director Picture",
                        docContentType:
                          director.kycDocumentContentType || "image/jpeg",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

              {/* Aadhaar */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Aadhaar Card
                  </p>

                  <p className="text-xs text-gray-400">
                    {director?.aadhaarCard
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {director?.aadhaarCard && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: director.aadhaarCard,
                        docName: "Aadhaar Card",
                        docContentType:
                          director.aadhaarCardContentType || "application/pdf",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

              {/* PAN */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    PAN Card
                  </p>

                  <p className="text-xs text-gray-400">
                    {director?.panCard
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {director?.panCard && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: director.panCard,
                        docName: "PAN Card",
                        docContentType:
                          director.panCardContentType || "application/pdf",
                      })
                    }
                    className="rounded-full bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>

              {/* Bank Statement */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Bank Statement
                  </p>

                  <p className="text-xs text-gray-400">
                    {director?.bankStatement
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {director?.bankStatement && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: director.bankStatement,
                        docName: "Bank Statement",
                        docContentType:
                          director.bankStatementContentType ||
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
                    {director?.sevenTwelve
                      ? "Document uploaded"
                      : "No document uploaded"}
                  </p>
                </div>

                {director?.sevenTwelve && (
                  <button
                    type="button"
                    onClick={() =>
                      viewComplianceDocument({
                        doc: director.sevenTwelve,
                        docName: "7/12 Document",
                        docContentType:
                          director.sevenTwelveContentType ||
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

export default DirectorDetailsModal;
