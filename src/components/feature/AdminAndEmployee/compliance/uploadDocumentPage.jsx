import React, { useEffect, useMemo, useState } from "react";
import { Upload, Eye, Download, Check, Plus, Trash2, Pencil, FolderOpen } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ButtonComponent from "../../../../components/comman/ButtonComponent";

import {
  addCompliance,
  editCompliance,
  getComplianceById,
  getFinancialYearOptions,
} from "../../../../services/compliance";
import { fetchCompanyDropdownList } from "../../../../store/actions/companyAction";
import CompanyDocumentRow from "./companyComplianceDoc";
import AdminDocumentRow from "./adminComplianceDoc";

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
  { label: "Maintenance of Registers", name: "maintenanceOfRegisters", dueDate: "30th Sept", required: false },
  { label: "Income Tax Audit", name: "incomeTaxAudit", dueDate: "30th Sept", required: false },
];

const createEmptyOtherDocument = (financialYear = "") => ({
  id: null,
  docName: "",
  dueDate: "",
  financialYear,
  file: null,
});

const getIndianFYOptionsFallback = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const fyStart = month >= 4 ? year : year - 1;
  return [
    { label: `${fyStart - 1}-${fyStart}`, value: `${fyStart - 1}-${fyStart}`, tag: "Previous Year" },
    { label: `${fyStart}-${fyStart + 1}`, value: `${fyStart}-${fyStart + 1}`, tag: "Current Year" },
    { label: `${fyStart + 1}-${fyStart + 2}`, value: `${fyStart + 1}-${fyStart + 2}`, tag: "Next Year" },
  ];
};

const handleDocumentAction = (fileObj, docName = "document", docContentType = "", action = "view") => {
  if (!fileObj) return;

  if (typeof fileObj === "string" && (fileObj.startsWith("http://") || fileObj.startsWith("https://") || fileObj.startsWith("/"))) {
    if (action === "view") {
      window.open(fileObj, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = fileObj;
      link.download = docName || "document";
      link.target = "_blank";
      link.click();
    }
    return;
  }

  let blob;

  if (typeof fileObj === "string") {
    try {
      const base64Data = fileObj.startsWith("data:")
        ? fileObj
        : `data:${docContentType || "application/octet-stream"};base64,${fileObj}`;
      const byteString = atob(base64Data.split(",")[1]);
      const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      blob = new Blob([ab], { type: mimeType });
    } catch (e) {
      console.error("Failed to decode base64 string:", e);
      toast.error("Unable to open document. Invalid file format.");
      return;
    }
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

const COL = {
  num: "col-span-1",
  doc: "col-span-2",
  date: "col-span-2",
  fy: "col-span-2",
  select: "col-span-2",
  view: "col-span-2",
  upload: "col-span-1",
};

const COMPANY_COL = {
  num: "col-span-1",
  doc: "col-span-2",
  date: "col-span-2",
  fy: "col-span-2",
  select: "col-span-2",
  view: "col-span-2",
  upload: "col-span-1",
};

const UploadDocumentPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { companyId: authCompanyId, role } = useSelector((state) => state.auth);
  const isCompanyRole = role === "COMPANY";

  const routeCompanyId = location?.state?.companyId || "";
  const routeFinancialYear = location?.state?.financialYear || "";
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(routeFinancialYear);

  const { companies, loading, error } = useSelector((state) => state.companyDropdownData);
  const companyOptions = useMemo(() => companies || [], [companies]);

  const [financialYearOptions, setFinancialYearOptions] = useState([]);

  useEffect(() => {
    const fetchFYOptions = async () => {
      try {
        const data = await getFinancialYearOptions();
        setFinancialYearOptions(data);
      } catch {
        setFinancialYearOptions(getIndianFYOptionsFallback());
      }
    };
    fetchFYOptions();
  }, []);

  const effectiveCompanyId = isCompanyRole ? authCompanyId : routeCompanyId;

  const [companySelectedFY, setCompanySelectedFY] = useState("");


  const initDocRows = () =>
    Object.fromEntries(
      complianceDocuments.map((d) => [
        d.name,
        { id: null, dueDate: "", financialYear: "", file: null },
      ])
    );

  const [docRows, setDocRows] = useState(initDocRows);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(effectiveCompanyId);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadingRow, setUploadingRow] = useState(null);

  const [existingFYRows, setExistingFYRows] = useState({});
  const [editingRows, setEditingRows] = useState({});
  const [editingOtherRows, setEditingOtherRows] = useState({});

  const [hasExistingRecord, setHasExistingRecord] = useState(false);

  const isRowLocked = (docName) => !!existingFYRows[docName] && !editingRows[docName];

  const toggleEditRow = (docName) => {
    if (!existingFYRows[docName]) return;
    setEditingRows((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  const toggleEditOtherRow = (index) => {
    const od = activeOtherDocuments[index];
    if (!od?.file || od.file instanceof File) return;
    setEditingOtherRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const [allDocRows, setAllDocRows] = useState(initDocRows);
  const [allOtherDocuments, setAllOtherDocuments] = useState([]);

  const activeDocRows = isCompanyRole ? allDocRows : docRows;
  const activeOtherDocuments = isCompanyRole ? allOtherDocuments : otherDocuments;

  const selectedCompany = useMemo(
    () => companyOptions.find((company) => String(company.id) === String(selectedCompanyId)),
    [companyOptions, selectedCompanyId]
  );

  useEffect(() => {
    if (!companies || companies.length === 0) dispatch(fetchCompanyDropdownList());
  }, [dispatch]);

  useEffect(() => {
    if (!isCompanyRole && (!routeCompanyId || !routeFinancialYear)) {
      navigate("/compliance", { replace: true });
    }
  }, [isCompanyRole, navigate, routeCompanyId, routeFinancialYear]);

  useEffect(() => {
    setSelectedCompanyId(effectiveCompanyId);
  }, [effectiveCompanyId]);

  useEffect(() => {
    if (isCompanyRole) return;

    if (selectedCompanyId && selectedFinancialYear) {
      fetchAndPopulate(selectedCompanyId, selectedFinancialYear);
    } else {
      setDocRows(initDocRows());
      setOtherDocuments([]);
      setExistingFYRows({});
      setEditingRows({});
      setHasExistingRecord(false);
    }
  }, [isCompanyRole, selectedCompanyId, selectedFinancialYear]);

  useEffect(() => {
    if (!isCompanyRole) return;
    if (!effectiveCompanyId) return;
    fetchCompanyDocs(effectiveCompanyId, companySelectedFY);
  }, [isCompanyRole, effectiveCompanyId, companySelectedFY]);

  const fetchCompanyDocs = async (companyIdToFetch, fyFilter = "") => {
    try {
      setIsSubmitting(true);
      const response = await getComplianceById(companyIdToFetch, fyFilter);
      if (response) {
        const populated = initDocRows();

        if (response.documents) {
          const docs = fyFilter
            ? response.documents.filter((d) => (d.financialYear || "") === fyFilter)
            : response.documents;

          docs.forEach((d) => {
            const rowName = d.name || d.docName;
            if (populated[rowName]) {
              populated[rowName] = {
                id: d.id ?? null,
                dueDate: d.dueDate ? String(d.dueDate).split("T")[0] : "",
                financialYear: d.financialYear || "",
                file: d.doc || null,
              };
            }
          });
        }

        setAllDocRows(populated);

        if (response.otherDocuments) {
          const others = fyFilter
            ? response.otherDocuments.filter((od) => (od.financialYear || "") === fyFilter)
            : response.otherDocuments;

          setAllOtherDocuments(
            others.map((od) => ({
              id: od.id ?? null,
              docName: od.docName || "",
              dueDate: od.dueDate ? String(od.dueDate).split("T")[0] : "",
              financialYear: od.financialYear || "",
              file: od.doc || null,
            }))
          );
        } else {
          setAllOtherDocuments([]);
        }
      }
    } catch {
      toast.error("Failed to fetch compliance details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAndPopulate = async (companyIdToFetch, financialYearToFetch) => {
    try {
      setIsSubmitting(true);
      const response = await getComplianceById(companyIdToFetch, financialYearToFetch);
      if (response) {
        setSelectedCompanyId(String(response.companyId || response.CompanyData?.id || ""));

        if (response.documents) {
          const populated = initDocRows();
          const lockMap = {};

          const filteredDocs = financialYearToFetch
            ? response.documents.filter((d) => (d.financialYear || "") === financialYearToFetch)
            : response.documents;

          filteredDocs.forEach((d) => {
            const rowName = d.name || d.docName;
            if (populated[rowName]) {
              populated[rowName] = {
                id: d.id ?? null,
                dueDate: d.dueDate ? String(d.dueDate).split("T")[0] : "",
                financialYear: d.financialYear || financialYearToFetch || "",
                file: d.doc || null,
              };
              if (d.doc) lockMap[rowName] = true;
            }
          });

          setDocRows(populated);
          setExistingFYRows(lockMap);
          setEditingRows({});
          setHasExistingRecord(
            Object.keys(lockMap).length > 0 || (response.otherDocuments?.length || 0) > 0
          );
        } else {
          setDocRows(initDocRows());
          setExistingFYRows({});
          setEditingRows({});
          setHasExistingRecord(false);
        }

        if (response.otherDocuments) {
          const filteredOthers = financialYearToFetch
            ? response.otherDocuments.filter((od) => (od.financialYear || "") === financialYearToFetch)
            : response.otherDocuments;

          setOtherDocuments(
            filteredOthers.map((od) => ({
              id: od.id ?? null,
              docName: od.docName || "",
              dueDate: od.dueDate ? String(od.dueDate).split("T")[0] : "",
              financialYear: od.financialYear || financialYearToFetch || "",
              file: od.doc || null,
            }))
          );
        }
      }
    } catch {
      toast.error("Failed to fetch compliance details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocRowChange = (docName, field, value) => {
    if (isCompanyRole) {
      setAllDocRows((prev) => ({ ...prev, [docName]: { ...prev[docName], [field]: value } }));
    } else {
      setDocRows((prev) => ({ ...prev, [docName]: { ...prev[docName], [field]: value } }));
    }
    setFormErrors((prev) => ({ ...prev, [docName]: "" }));
  };

  const handleOtherDocChange = (index, field, value) => {
    const setter = isCompanyRole ? setAllOtherDocuments : setOtherDocuments;
    setter((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOtherDocument = () => {
    const fy = isCompanyRole ? companySelectedFY : selectedFinancialYear;
    const setter = isCompanyRole ? setAllOtherDocuments : setOtherDocuments;
    setter((prev) => [...prev, createEmptyOtherDocument(fy)]);
  };

  const removeOtherDocument = (i) => {
    const setter = isCompanyRole ? setAllOtherDocuments : setOtherDocuments;
    setter((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleOtherDocUpload = async (index) => {
    const od = activeOtherDocuments[index];
    if (!selectedCompanyId) {
      toast.error("No company selected");
      return;
    }

    const hasNewFile = od?.file instanceof File;
    const hasExistingFile = typeof od?.file === "string" && !!od.file;

    if (!hasNewFile && !hasExistingFile) {
      toast.error("Please select a file first");
      return;
    }

    
    if (!od.financialYear) {
      toast.error("Please select a financial year");
      return;
    }

    try {
      setUploadingRow(`other_${index}`);

      const payload = new FormData();
      payload.append("companyId", selectedCompanyId);
      if (od.id) payload.append(`otherDoc_${index}_id`, od.id);
      if (od.docName?.trim()) payload.append(`otherDoc_${index}_name`, od.docName.trim());
      if (od.dueDate) payload.append(`otherDoc_${index}_dueDate`, od.dueDate);
      if (od.financialYear) payload.append(`otherDoc_${index}_financialYear`, od.financialYear);
      if (hasNewFile) payload.append(`otherDoc_${index}_file`, od.file);

      const response = hasExistingRecord
        ? await editCompliance(payload)
        : await addCompliance(payload);

      toast.success(response?.message || response || "Document uploaded successfully");

      if (isCompanyRole) {
        fetchCompanyDocs(selectedCompanyId, selectedFinancialYear);
      } else {
        fetchAndPopulate(selectedCompanyId, selectedFinancialYear);
      }

      setHasExistingRecord(true);

      if (!isCompanyRole) {
        setEditingOtherRows((prev) => ({ ...prev, [index]: false }));
      }
    } catch (err) {
      toast.error(err?.message || err || "Upload failed");
    } finally {
      setUploadingRow(null);
    }
  };

  const handleRowUpload = async (docName) => {
    if (!selectedCompanyId) {
      toast.error("No company selected");
      return;
    }

    const row = activeDocRows[docName];
    const hasNewFile = row?.file instanceof File;
    const hasExistingFile = typeof row?.file === "string" && !!row.file;


    if (!hasNewFile && !hasExistingFile) {
      toast.error("Please select a file first");
      return;
    }
    
    if (!row.financialYear) {
      toast.error("Please select a financial year");
      return;
    }

    try {
      setUploadingRow(docName);

      const payload = new FormData();
      payload.append("companyId", selectedCompanyId);
      if (row.id) payload.append(`${docName}_id`, row.id);
      if (hasNewFile) payload.append(`${docName}_file`, row.file);
      if (row.dueDate) payload.append(`${docName}_dueDate`, row.dueDate);
      if (row.financialYear) payload.append(`${docName}_financialYear`, row.financialYear);

      const response = hasExistingRecord
        ? await editCompliance(payload, selectedCompanyId)
        : await addCompliance(payload);

      toast.success(response?.message || response || "Document uploaded successfully");

      if (isCompanyRole) {
        fetchCompanyDocs(selectedCompanyId, selectedFinancialYear);
      } else {
        fetchAndPopulate(selectedCompanyId, selectedFinancialYear);
      }

      setHasExistingRecord(true);
    } catch (err) {
      toast.error(err?.message || err || "Upload failed");
    } finally {
      setUploadingRow(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-2 animate-in fade-in duration-300">

      <div className="flex flex-row gap-4 items-start">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-fit p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {hasExistingRecord
              ? "Edit Compliance Documents"
              : "Upload Compliance Documents"}
          </h2>

          <p className="text-base text-gray-600 mt-1">
            Manage company compliance documents
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <div className="grid gap-4 md:grid-cols-2">

          {!isCompanyRole &&
          <div>
            <p className="mb-1 text-sm font-semibold text-gray-700">Selected Company</p>
            <div className="h-10 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-base font-medium text-gray-800">
              {selectedCompany?.name || (loading ? "Loading company..." : "Selected company")}
            </div>
            {formErrors.companyId && (
              <p className="mt-1 text-xs text-red-500">{formErrors.companyId}</p>
            )}
          </div>
          }

          <div>
            <p className="mb-1 text-sm font-semibold text-gray-700">Financial Year</p>

            {isCompanyRole ? (
              <select
                value={companySelectedFY}
                onChange={(e) => setCompanySelectedFY(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Financial Years</option>
                {financialYearOptions.map((fy) => (
                  <option key={fy.value} value={fy.value}>
                    {fy.label}{fy.tag ? ` (${fy.tag})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedFinancialYear}
                onChange={(e) => setSelectedFinancialYear(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Financial Year</option>
                {financialYearOptions.map((fy) => (
                  <option key={fy.value} value={fy.value}>
                    {fy.label}{fy.tag ? ` (${fy.tag})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Compliance Document Checklist
        </h3>

        {isCompanyRole ? (
          <>
            <div className="grid grid-cols-12 gap-x-3 text-sm font-semibold text-gray-700 border-b pb-2 mb-1">
              <div className={COMPANY_COL.num}>#</div>
              <div className={COMPANY_COL.doc}>Document</div>
              <div className={COMPANY_COL.date}>Expiry / Due Date</div>
              <div className={COMPANY_COL.fy}>Financial Year</div>
              <div className={COMPANY_COL.select}>Select File</div>
              <div className={`${COMPANY_COL.view} text-center`}>View</div>
              <div className={COMPANY_COL.upload}>Upload</div>
            </div>

            {complianceDocuments.map((doc, index) => (
              <CompanyDocumentRow
                key={doc.name}
                index={index}
                doc={doc}
                rowData={allDocRows[doc.name]}
                onChange={(field, value) => handleDocRowChange(doc.name, field, value)}
                onRowUpload={handleRowUpload}
                financialYearOptions={financialYearOptions}
                error={formErrors[doc.name]}
                disabledFY={typeof allDocRows[doc.name]?.file === "string" && !!allDocRows[doc.name]?.file}
                isUploading={uploadingRow === doc.name}
              />
            ))}
          </>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-x-3 text-sm font-semibold text-gray-700 border-b pb-2 mb-1">
              <div className={COL.num}>#</div>
              <div className={COL.doc}>Document</div>
              <div className={COL.date}>Expiry / Due Date</div>
              <div className={COL.fy}>Financial Year</div>
              <div className={COL.select}>Select File</div>
              <div className={`${COL.view} text-center`}>View</div>
              <div className={COL.upload}>Upload</div>
            </div>

            {complianceDocuments.map((doc, index) => (
              <AdminDocumentRow
                key={doc.name}
                index={index}
                doc={doc}
                rowData={docRows[doc.name]}
                onChange={(field, value) => handleDocRowChange(doc.name, field, value)}
                onRowUpload={handleRowUpload}
                financialYearOptions={financialYearOptions}
                error={formErrors[doc.name]}
                disabledFY={isRowLocked(doc.name)}
                canEdit={!!existingFYRows[doc.name]}
                isEditing={!!editingRows[doc.name]}
                onToggleEdit={() => toggleEditRow(doc.name)}
                isUploading={uploadingRow === doc.name}
              />
            ))}
          </>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Other Documents</h3>
          <button
            type="button"
            onClick={addOtherDocument}
            className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
          >
            <Plus size={14} />
            Add Document
          </button>
        </div>

        {activeOtherDocuments.length === 0 && (
          <p className="text-xs text-gray-500">No other documents added.</p>
        )}

        {activeOtherDocuments.length > 0 && (
          <div className="grid grid-cols-12 gap-x-3 text-sm font-semibold text-gray-700 border-b pb-2">
            <div className="col-span-3">Document Name</div>
            <div className="col-span-2">Expiry / Due Date</div>
            <div className="col-span-2">Financial Year</div>
            <div className="col-span-3">Select File</div>
            <div className="col-span-2">Actions</div>
          </div>
        )}

        {activeOtherDocuments.map((od, index) => {
          const isOtherSaved = typeof od.file === "string" && !!od.file;
          const isOtherEditing = !!editingOtherRows[index];
          const canEditOther = isOtherSaved;
          const canSaveOther = od.file instanceof File || isOtherSaved;

          return (
            <div
              key={index}
              className="grid grid-cols-12 gap-x-3 items-start border rounded-lg p-3 bg-gray-50"
            >
              <div className="col-span-3 flex flex-col gap-1">
                <input
                  type="text"
                  value={od.docName}
                  onChange={(e) => handleOtherDocChange(index, "docName", e.target.value)}
                  placeholder="Enter document name"
                  disabled={isOtherSaved && !isOtherEditing}
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-1.5 lg:px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                />
                {formErrors[`other_${index}_name`] && (
                  <p className="text-[11px] text-red-500">{formErrors[`other_${index}_name`]}</p>
                )}
              </div>

              <div className="col-span-2">
                <input
                  type="date"
                  value={od.dueDate}
                  onChange={(e) => handleOtherDocChange(index, "dueDate", e.target.value)}
                  disabled={isOtherSaved && !isOtherEditing}
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-1.5 lg:px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              <div className="col-span-2">
                <select
                  value={od.financialYear}
                  onChange={(e) => handleOtherDocChange(index, "financialYear", e.target.value)}
                  disabled={(isOtherSaved && !isOtherEditing) || (!isCompanyRole && !!selectedFinancialYear && !isOtherEditing)}
                  className="w-full h-9 rounded-md border border-gray-300 bg-white px-1.5 lg:px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="">Select FY</option>
                  {financialYearOptions.map((fy) => (
                    <option key={fy.value} value={fy.value}>
                      {fy.label}{fy.tag ? ` (${fy.tag})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                
                <label
                  className={`inline-flex w-full items-center gap-2 h-9 px-1.5 lg:px-3 rounded-md border border-gray-300 text-gray-600 text-xs whitespace-nowrap ${isOtherSaved && !isOtherEditing
                    ? "cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-50 cursor-pointer bg-white"
                    }`}
                >
                  <FolderOpen size={13} />
                  Select File
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={isOtherSaved && !isOtherEditing}
                    onChange={(e) => handleOtherDocChange(index, "file", e.target.files[0] ?? null)}
                  />
                </label>
                {formErrors[`other_${index}_file`] && (
                  <p className="text-[11px] text-red-500">{formErrors[`other_${index}_file`]}</p>
                )}
                {od.file instanceof File && (
                  <span className="text-[11px] text-amber-600 flex items-center gap-1 max-w-full truncate" title={od.file.name}>
                    <span className="truncate">{od.file.name}</span>
                  </span>
                )}
                {isOtherSaved && (
                  <span className="text-[11px] text-green-600 flex items-center gap-1">
                    <Check size={10} className="shrink-0" /> Saved
                  </span>
                )}
              </div>

              <div className="col-span-1 flex items-center gap-1 h-9 -ml-2">
                {od.file ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(od.file, od.docName, "", "view")}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 shrink-0"
                      aria-label="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(od.file, od.docName, "", "download")}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 shrink-0"
                      aria-label="Download"
                    >
                      <Download size={14} />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400">—</span>
                )}
              </div>

              <div className="col-span-2 flex items-center gap-2 h-9">

                <button
                  type="button"
                  onClick={() => handleOtherDocUpload(index)}
                  disabled={!canSaveOther || uploadingRow === `other_${index}` || (isOtherSaved && !isOtherEditing)}
                  title={!canSaveOther ? "Select a file first" : "Save this document"}
                  className={`inline-flex items-center gap-1 h-9 px-1.5 lg:px-3 rounded-md text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${canSaveOther && uploadingRow !== `other_${index}` && !isOtherSaved || isOtherEditing
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <Upload size={13} />
                  {uploadingRow === `other_${index}` ? "Saving…" : "Upload"}
                </button>


                {!isCompanyRole && (
                  <button
                    type="button"
                    onClick={() => toggleEditOtherRow(index)}
                    disabled={!canEditOther}
                    title={
                      !canEditOther
                        ? "Upload a document first"
                        : isOtherEditing
                          ? "Editing enabled — click to lock"
                          : "Edit this row"
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm shrink-0 ${!canEditOther
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : isOtherEditing
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    aria-label="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                )}

                {!isOtherSaved && (
                  <button
                    type="button"
                    onClick={() => removeOtherDocument(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50 shrink-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default UploadDocumentPage;
