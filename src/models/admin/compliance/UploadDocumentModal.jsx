import React, { useEffect, useMemo, useState } from "react";
import { X, Upload, Eye, Download, Check, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import ButtonComponent from "../../../components/comman/ButtonComponent";
import SelectField from "../../../components/comman/SelectField";

import {
  addCompliance,
  editCompliance,
  getComplianceById,
} from "../../../services/compliance";
import { viewComplianceDocument } from "../../../utils/complianceDocuments";
import { fetchCompanyDropdownList } from "../../../store/actions/companyAction";

// ---------------------------------------------------------------------------
// Compliance document definitions (from client requirements)
// ---------------------------------------------------------------------------
const complianceDocuments = [
  { label: "Statutory Audit", name: "statutoryAudit", dueDate: "30th Sept", required: true },
  { label: "Income Tax Return", name: "incomeTaxReturn", dueDate: "31st Oct", required: true },
  { label: "Accounts Writing Charges", name: "accountsWritingCharges", dueDate: "30th Sept", required: true },
  { label: "TDS Returns and Payments (Quarterly compliance)", name: "tdsReturns", dueDate: "", required: false },
  { label: "ADT 1 (ROC)", name: "adt1", dueDate: "Within 15 days from AGM", required: true },
  { label: "INC 20A (ROC)", name: "inc20A", dueDate: "Within 180 days from Incorporation", required: false },
  { label: "MGT 7 (ROC)", name: "mgt7", dueDate: "Within 60 days from AGM", required: true },
  { label: "AOC 4 (ROC)", name: "aoc4", dueDate: "Within 30 days from AGM", required: true },
  { label: "DPT 3 (ROC)", name: "dpt3", dueDate: "30th June", required: true },
  { label: "DIR KYC (ROC)", name: "dirKyc", dueDate: "30th Sept", required: true },
  { label: "Drafting of Minutes of Meetings and Resolutions", name: "minutesDrafting", dueDate: "30th Sept", required: false },
  { label: "Maintenance of Registers", name: "maintenanceOfRegisters", dueDate: "", required: false },
  { label: "Income Tax Audit", name: "incomeTaxAudit", dueDate: "30th Sept", required: false },
];

const createEmptyOtherDocument = () => ({
  docName: "",
  dueDate: "",
  financialYear: "",
  file: null,
});

const getFinancialYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [
    { label: `${currentYear - 2}-${currentYear - 1}`, value: `${currentYear - 2}-${currentYear - 1}` },
    { label: `${currentYear - 1}-${currentYear}`, value: `${currentYear - 1}-${currentYear}` },
    { label: `${currentYear}-${currentYear + 1}`, value: `${currentYear}-${currentYear + 1}` },
  ];
};

// ---------------------------------------------------------------------------
// Helper – view / download a file (File object or base64 string)
// ---------------------------------------------------------------------------
const handleDocumentAction = (fileObj, docName = "document", docContentType = "", action = "view") => {
  if (!fileObj) return;

  let blob;

  if (typeof fileObj === "string") {
    // base64 string from server
    const base64Data = fileObj.startsWith("data:")
      ? fileObj
      : `data:${docContentType || "application/octet-stream"};base64,${fileObj}`;
    const byteString = atob(base64Data.split(",")[1]);
    const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    blob = new Blob([ab], { type: mimeType });
  } else if (fileObj instanceof File) {
    blob = fileObj;
  }

  if (!blob) return;

  const url = URL.createObjectURL(blob);

  if (action === "view") {
    window.open(url, "_blank");
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileObj?.name || docName || "document";
    link.click();
  }

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ---------------------------------------------------------------------------
// Sub-component – a single document row
// ---------------------------------------------------------------------------
const DocumentRow = ({ index, doc, rowData, onChange, financialYearOptions, isRequired }) => {
  const { dueDate, financialYear, file } = rowData;

  const handleFileChange = (e) => {
    onChange("file", e.target.files[0] ?? null);
  };

  return (
    <div className="grid grid-cols-12 items-center gap-2 py-3 border-b last:border-none">
      {/* # */}
      <div className="col-span-1 text-sm text-gray-500">{index + 1}</div>

      {/* Document Name */}
      <div className="col-span-3 text-sm font-medium text-gray-700 flex items-center gap-1">
        {doc.label}
        {isRequired && <span className="text-red-500 text-xs">*</span>}
      </div>

      {/* Due / Expiry Date */}
      <div className="col-span-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => onChange("dueDate", e.target.value)}
          placeholder={doc.dueDate || "DD/MM/YYYY"}
          title={doc.dueDate ? `Default: ${doc.dueDate}` : ""}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {doc.dueDate && (
          <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={doc.dueDate}>
            Ref: {doc.dueDate}
          </p>
        )}
      </div>

      {/* Financial Year */}
      <div className="col-span-2">
        <select
          value={financialYear}
          onChange={(e) => onChange("financialYear", e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select FY</option>
          {financialYearOptions.map((fy) => (
            <option key={fy.value} value={fy.value}>{fy.label}</option>
          ))}
        </select>
      </div>

      {/* Upload */}
      <div className="col-span-2 flex flex-col gap-1">
        <label className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer text-xs w-fit">
          <Upload size={12} />
          Upload
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file instanceof File && (
          <span className="text-[10px] text-green-600 flex items-center gap-1 truncate max-w-[120px]" title={file.name}>
            <Check size={10} /> {file.name}
          </span>
        )}
      </div>

      {/* View / Download */}
      <div className="col-span-2 flex items-center gap-1.5">
        {file ? (
          <>
            <button
              type="button"
              onClick={() => handleDocumentAction(file, file?.name, "", "view")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
              aria-label="View"
            >
              <Eye size={13} />
            </button>
            <button
              type="button"
              onClick={() => handleDocumentAction(file, file?.name, "", "download")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
              aria-label="Download"
            >
              <Download size={13} />
            </button>
          </>
        ) : (
          <span className="text-[10px] text-gray-400">No file</span>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Modal
// ---------------------------------------------------------------------------
const UploadDocumentModal = ({
  isOpen,
  modalMode = "add",
  initialData,
  onClose,
  companyId,
}) => {
  const dispatch = useDispatch();
  const { companies, loading, error } = useSelector((state) => state.companyDropdownData);
  const companyOptions = useMemo(() => companies || [], [companies]);
  const financialYearOptions = useMemo(() => getFinancialYearOptions(), []);

  // Per-document row state: { [docName]: { dueDate, financialYear, file } }
  const [docRows, setDocRows] = useState(() =>
    Object.fromEntries(
      complianceDocuments.map((d) => [d.name, { dueDate: "", financialYear: "", file: null }])
    )
  );

  // Other documents
  const [otherDocuments, setOtherDocuments] = useState([]);

  // Top-level fields
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId || "");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;
    if (!companies || companies.length === 0) dispatch(fetchCompanyDropdownList());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedCompanyId(companyId || "");
    setFormErrors({});

    if (modalMode === "edit" && initialData) {
      fetchAndPopulate();
    } else {
      resetDocRows();
      setOtherDocuments([]);
    }
  }, [isOpen, modalMode, initialData, companyId]);

  const resetDocRows = () => {
    setDocRows(
      Object.fromEntries(
        complianceDocuments.map((d) => [d.name, { dueDate: "", financialYear: "", file: null }])
      )
    );
  };

  const fetchAndPopulate = async () => {
    try {
      setIsSubmitting(true);
      const response = await getComplianceById(initialData?.id);
      if (response) {
        setSelectedCompanyId(String(response.companyId || response.CompanyData?.id || ""));
        // Populate doc rows if server returns per-doc data
        if (response.documents) {
          const populated = { ...docRows };
          response.documents.forEach((d) => {
            if (populated[d.name]) {
              populated[d.name] = {
                dueDate: d.dueDate ? String(d.dueDate).split("T")[0] : "",
                financialYear: d.financialYear || "",
                file: d.doc || null,
              };
            }
          });
          setDocRows(populated);
        }
        if (response.otherDocuments) {
          setOtherDocuments(response.otherDocuments.map((od) => ({
            docName: od.docName || "",
            dueDate: od.dueDate ? String(od.dueDate).split("T")[0] : "",
            financialYear: od.financialYear || "",
            file: od.doc || null,
          })));
        }
      }
    } catch (err) {
      toast.error("Failed to fetch compliance details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Row change handlers
  // -------------------------------------------------------------------------
  const handleDocRowChange = (docName, field, value) => {
    setDocRows((prev) => ({
      ...prev,
      [docName]: { ...prev[docName], [field]: value },
    }));
    setFormErrors((prev) => ({ ...prev, [docName]: "" }));
  };

  const handleOtherDocChange = (index, field, value) => {
    setOtherDocuments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOtherDocument = () => setOtherDocuments((prev) => [...prev, createEmptyOtherDocument()]);
  const removeOtherDocument = (index) =>
    setOtherDocuments((prev) => prev.filter((_, i) => i !== index));

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------
  const validate = () => {
    const nextErrors = {};

    if (!selectedCompanyId) nextErrors.companyId = "Select company";

    // Compulsory docs must have a file uploaded
    complianceDocuments
      .filter((d) => d.required)
      .forEach((d) => {
        if (!docRows[d.name]?.file) {
          nextErrors[d.name] = "Required";
        }
      });

    // Other documents – both name and file required together
    otherDocuments.forEach((od, i) => {
      if (od.docName?.trim() && !od.file) nextErrors[`other_${i}_file`] = "Upload file";
      if (!od.docName?.trim() && od.file) nextErrors[`other_${i}_name`] = "Enter name";
    });

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("companyId", selectedCompanyId);

      // Append each compliance doc
      complianceDocuments.forEach((doc) => {
        const row = docRows[doc.name];
        if (row.file instanceof File) payload.append(`${doc.name}_file`, row.file);
        if (row.dueDate) payload.append(`${doc.name}_dueDate`, row.dueDate);
        if (row.financialYear) payload.append(`${doc.name}_financialYear`, row.financialYear);
      });

      // Append other documents
      otherDocuments.forEach((od, i) => {
        if (od.docName?.trim()) payload.append(`otherDoc_${i}_name`, od.docName.trim());
        if (od.dueDate) payload.append(`otherDoc_${i}_dueDate`, od.dueDate);
        if (od.financialYear) payload.append(`otherDoc_${i}_financialYear`, od.financialYear);
        if (od.file instanceof File) payload.append(`otherDoc_${i}_file`, od.file);
      });

      const response =
        modalMode === "edit" && initialData?.id
          ? await editCompliance(payload, initialData.id)
          : await addCompliance(payload);

      toast.success(
        response ||
          (modalMode === "edit" ? "Compliance updated successfully" : "Compliance created successfully")
      );
      handleClose();
    } catch (submitError) {
      toast.error(submitError?.message || submitError || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetDocRows();
    setOtherDocuments([]);
    setFormErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              {modalMode === "edit" ? "Edit Compliance Documents" : "Upload Compliance Documents"}
            </h3>
            <p className="text-sm text-gray-500">Add company compliance document details</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        {/* Company Selector */}
        <div className="mb-5">
          <SelectField
            label="Select Company"
            name="companyId"
            required
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              setFormErrors((prev) => ({ ...prev, companyId: "" }));
            }}
            options={companyOptions}
            optionLabel={loading ? "Loading companies..." : "Choose company"}
            valueKey="id"
            labelKey="name"
            errorMessage={formErrors.companyId}
            disabled={loading || !!companyId}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Compliance Document Checklist                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white border rounded-xl shadow-sm p-4 mb-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Compliance Document Checklist
          </h3>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 border-b pb-2 mb-1">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Document</div>
            <div className="col-span-2">Expiry / Due Date</div>
            <div className="col-span-2">Financial Year</div>
            <div className="col-span-2">Upload</div>
            <div className="col-span-2">View / Download</div>
          </div>

          {/* Document Rows */}
          {complianceDocuments.map((doc, index) => (
            <div key={doc.name}>
              <DocumentRow
                index={index}
                doc={doc}
                rowData={docRows[doc.name]}
                onChange={(field, value) => handleDocRowChange(doc.name, field, value)}
                financialYearOptions={financialYearOptions}
                isRequired={doc.required}
              />
              {formErrors[doc.name] && (
                <p className="text-xs text-red-500 pb-1 pl-[calc(8.33%+0.5rem)]">
                  {formErrors[doc.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Other Documents                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4 mb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Other Documents</h3>
            <button
              type="button"
              onClick={addOtherDocument}
              className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
            >
              <Plus size={14} />
              Add Document
            </button>
          </div>

          {otherDocuments.length === 0 && (
            <p className="text-xs text-gray-500">No other documents added.</p>
          )}

          {otherDocuments.map((od, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border rounded-lg p-3 bg-gray-50"
            >
              {/* Document Name */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Document Name</label>
                <input
                  type="text"
                  value={od.docName}
                  onChange={(e) => handleOtherDocChange(index, "docName", e.target.value)}
                  placeholder="Enter document name"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors[`other_${index}_name`] && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors[`other_${index}_name`]}</p>
                )}
              </div>

              {/* Due Date */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry / Due Date</label>
                <input
                  type="date"
                  value={od.dueDate}
                  onChange={(e) => handleOtherDocChange(index, "dueDate", e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Financial Year */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Financial Year</label>
                <select
                  value={od.financialYear}
                  onChange={(e) => handleOtherDocChange(index, "financialYear", e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select FY</option>
                  {financialYearOptions.map((fy) => (
                    <option key={fy.value} value={fy.value}>{fy.label}</option>
                  ))}
                </select>
              </div>

              {/* Upload */}
              <div className="md:col-span-3 flex flex-col gap-1 pt-5">
                <label className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-100 cursor-pointer">
                  <Upload size={14} />
                  Upload
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleOtherDocChange(index, "file", e.target.files[0] ?? null)}
                  />
                </label>
                {formErrors[`other_${index}_file`] && (
                  <p className="text-xs text-red-500">{formErrors[`other_${index}_file`]}</p>
                )}
                {od.file instanceof File && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check size={12} /> {od.file.name}
                  </span>
                )}
              </div>

              {/* View / Download + Remove */}
              <div className="md:col-span-2 flex items-center gap-2 pt-5">
                {od.file ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(od.file, od.file?.name, "", "view")}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
                      aria-label="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(od.file, od.file?.name, "", "download")}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100"
                      aria-label="Download"
                    >
                      <Download size={15} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">No file</span>
                )}
                <button
                  type="button"
                  onClick={() => removeOtherDocument(index)}
                  className="rounded-md p-1 text-red-600 hover:bg-red-50 ml-auto"
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3">
          <ButtonComponent
            handleButtonClick={handleClose}
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-gray-700"
          >
            Cancel
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            <div className="flex items-center gap-2">
              <Upload size={16} />
              {isSubmitting
                ? modalMode === "edit" ? "Updating..." : "Uploading..."
                : modalMode === "edit" ? "Update Documents" : "Upload Documents"}
            </div>
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
