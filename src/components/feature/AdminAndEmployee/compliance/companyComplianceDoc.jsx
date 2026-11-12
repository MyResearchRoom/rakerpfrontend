import { Check, Download, Eye, FolderOpen, Upload } from "lucide-react";

const COMPANY_COL = {
  num: "col-span-1",
  doc: "col-span-2",
  date: "col-span-2",
  fy: "col-span-2",
  select: "col-span-2",
  view: "col-span-2",
  upload: "col-span-1",
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

const CompanyDocumentRow = ({
  index,
  doc,
  rowData,
  onChange,
  onRowUpload,
  financialYearOptions,
  error,
  disabledFY,
  isUploading,
}) => {
  const { dueDate, financialYear, file } = rowData;
  const hasPendingFile = file instanceof File;
  const hasExistingFile = typeof file === "string" && !!file;
  const canSaveRow = hasPendingFile || hasExistingFile;

  return (
    <div className="grid grid-cols-12 items-start gap-x-3 py-3 border-b last:border-none ">

      <div className={`${COMPANY_COL.num} flex items-center h-9 text-base text-gray-600`}>
        {index + 1}
      </div>

      <div className={`${COMPANY_COL.doc} flex flex-col justify-center min-h-[36px]`}>
        <span className="text-sm lg:text-base font-semibold text-gray-800 leading-snug">
          {doc.label}
          {doc.required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
        {error && <span className="text-[11px] text-red-500 mt-0.5">{error}</span>}
      </div>

      <div className={`${COMPANY_COL.date} flex flex-col gap-0.5`}>
        <input
          type="date"
          value={dueDate}
          disabled={disabledFY}
          onChange={(e) => onChange("dueDate", e.target.value)}
          title={doc.dueDate ? `Reference: ${doc.dueDate}` : ""}
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
        />
        {doc.dueDate && (
          <p className="text-xs text-gray-500 leading-tight truncate" title={doc.dueDate}>
            Valid: {doc.dueDate}
          </p>
        )}
      </div>

      <div className={`${COMPANY_COL.fy}`}>
        <select
          value={financialYear}
          onChange={(e) => onChange("financialYear", e.target.value)}
          disabled={disabledFY}
          className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 cursor-pointer disabled:cursor-not-allowed"
        >
          <option value="">Select FY</option>
          {financialYearOptions.map((fy) => (
            <option key={fy.value} value={fy.value}>
              {fy.label}{fy.tag ? ` (${fy.tag})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className={`${COMPANY_COL.select} flex flex-col gap-1`}>
        <label className={`inline-flex items-center gap-1.5 h-10 px-3 rounded-md border border-gray-300  text-gray-600 hover:bg-gray-50  text-sm w-full whitespace-nowrap ${disabledFY ?"cursor-not-allowed bg-gray-100 " : "cursor-pointer bg-white hover:bg-gray-50"}`}>
          <FolderOpen size={13} />
          Select File
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            disabled={disabledFY}
            onChange={(e) => onChange("file", e.target.files[0] ?? null)}
          />
        </label>
        {hasPendingFile && (
          <span className="text-xs text-amber-600 flex items-center gap-1 max-w-full truncate" title={file.name}>
            <span className="truncate">{file.name}</span>
          </span>
        )}
        {hasExistingFile && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <Check size={10} className="shrink-0" /> Saved
          </span>
        )}
      </div>

      <div className={`${COMPANY_COL.view} flex items-center justify-center gap-1 h-9`}>
        {file ? (
          <>
            <button
              type="button"
              onClick={() => handleDocumentAction(file, doc.label ?? "document", "", "view")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 shrink-0"
              aria-label="View"
            >
              <Eye size={13} />
            </button>
            <button
              type="button"
              onClick={() => handleDocumentAction(file, doc.label ?? "document", "", "download")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 shrink-0"
              aria-label="Download"
            >
              <Download size={13} />
            </button>
          </>
        ) : (
          <span className="text-[10px] text-gray-400">—</span>
        )}
      </div>

      <div className={`${COMPANY_COL.upload} flex items-center h-9`}>
        <button
          type="button"
          onClick={() => onRowUpload(doc.name)}
          disabled={hasExistingFile}
          title={!canSaveRow ? "Select a file first" : "Save this document"}
          className={`inline-flex items-center gap-1 h-9 px-1.5 lg:px-3 rounded-md text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${!hasExistingFile
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          <Upload size={13} className="hidden lg:block"/>
          {isUploading ? "Saving…" : "Upload"}
        </button>
      </div>

    </div>
  );
};

export default CompanyDocumentRow;