import React from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Upload, Check, Eye, Download, Plus, Trash2 } from "lucide-react";
import SelectField from "../../../../components/comman/SelectField";

export const businessPlanDocuments = [
  { label: "Certificate of Incorporation/ Registered Document", name: "incorporationCert" },
  { label: "PAN Card", name: "panCard" },
  { label: "GST Certificate", name: "gstCert" },
  { label: "TAN", name: "tan" },
  { label: "Articles of Association (AOA)", name: "aoa" },
  { label: "Memorandum of Association (MOA)", name: "moa" },
  { label: "Udyam Certificate", name: "udyamCert" },
  { label: "Cancelled Cheque", name: "cancelledCheque" }, // Existing Cancelled Cheque
  { label: "Seed License", name: "seedLicense" },
  // { label: "ID Proof of CEO", name: "ceoIdProof" },
  { label: "Fertilizer License", name: "fertilizerLicense" },
  { label: "Pesticide License", name: "pesticideLicense" },
  { label: "Mandi License (DML)", name: "mandiLicense" },
  { label: "Office Picture (with Gps Coordinates)", name: "officePic"},
  { label: "INC-20A Form & Challan", name: "inc20AForm"},
  { label: "Startup India Certificate", name: "startupCertificate"},
  { label: "Import Export Certificate", name: "importExportCertificate"},
];


const yesNoOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const createEmptyOtherDocument = () => ({
  docName: "",
  file: null,
});

const BusinessPlanStep = ({ isEditMode }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const {
    fields: otherDocumentFields,
    append: appendOtherDocument,
    remove: removeOtherDocument,
  } = useFieldArray({
    control,
    name: "otherDocuments",
    keyName: "fieldId",
  });

  // const handleDocumentAction = (doc, action = "view") => {
  //   console.log("doc",doc);

  //   if (!doc?.file) return;

  //   const base64Data = doc.file;
  //   const fileName = doc.docName || "document";

  //   const byteString = atob(base64Data.split(",")[1]);
  //   const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];

  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   const blob = new Blob([ab], { type: mimeType });
  //   const url = URL.createObjectURL(blob);

  //   if (action === "view") {
  //     window.open(url, "_blank");
  //   } else if (action === "download") {
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = fileName;
  //     link.click();
  //   }

  //   setTimeout(() => URL.revokeObjectURL(url), 1000);
  // };

  const handleDocumentAction = (fileObj, action = "view") => {
    if (!fileObj) return;

    let blob;

    // 🔹 Case 1: Existing file (base64)
    if (fileObj.base64) {
      const base64Data = fileObj.base64.startsWith("data:")
        ? fileObj.base64
        : `data:${fileObj.type || "application/octet-stream"};base64,${fileObj.base64}`;

      const byteString = atob(base64Data.split(",")[1]);
      const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      blob = new Blob([ab], { type: mimeType });
    }

    // 🔹 Case 2: Newly uploaded file
    else if (fileObj instanceof File) {
      blob = fileObj;
    }

    if (!blob) return;

    const url = URL.createObjectURL(blob);

    if (action === "view") {
      window.open(url, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileObj.name || "document";
      link.click();
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-300">

      {/* ---------------- TOP SECTION ---------------- */}
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-pink-50 py-2 px-4 rounded-md inline-block w-full">
          <h3 className="text-sm font-semibold text-gray-800">
            Business Plan & Vendor Registration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <Controller
            name="businessPlanPrepared"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Business Plan Prepared"
                name={field.name}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                options={yesNoOptions}
                optionLabel="Select status"
                errorMessage={errors.businessPlanPrepared?.message}
                disabled={!isEditMode}
              />
            )}
          />

          <Controller
            name="vendorRegistered"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Vendor Registered"
                name={field.name}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                options={yesNoOptions}
                optionLabel="Select status"
                errorMessage={errors.vendorRegistered?.message}
                disabled={!isEditMode}
              />
            )}
          />

        </div>
      </div>

      {/* ---------------- DOCUMENT CHECKLIST ---------------- */}
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Document Collection Checklist
        </h3>

        {/* Header */}
        <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Document</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-3">Upload</div>
          <div className="col-span-2 text-center">View</div>

        </div>

        {/* Rows */}
        {businessPlanDocuments.map((doc, index) => {
          const status = watch(`${doc.name}_status`);
          const file = watch(`${doc.name}_file`);

          return (
            <div
              key={doc.name}
              className="grid grid-cols-12 items-center gap-2 py-3 border-b last:border-none"
            >
              {/* Index */}
              <div className="col-span-1 text-sm">{index + 1}</div>

              {/* Document */}
              <div className="col-span-3 text-sm font-medium text-gray-700">
                {doc.label}
              </div>

              {/* Status */}
              <div className="col-span-3 flex justify-center gap-3">
                {["Yes", "No"].map((val) => (
                  <label
                    key={val}
                    className={`px-3 py-1 text-xs rounded-full border cursor-pointer
                      ${status === val
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      value={val}
                      {...register(`${doc.name}_status`)}
                      className="hidden"
                    />
                    {val}
                  </label>
                ))}
              </div>

              {/* Upload */}
              <div className="col-span-3 flex items-center flex-col sm:flex-row sm:items-center gap-3">
                <Controller
                  control={control}
                  name={`${doc.name}_file`}
                  rules={{
                    validate: (value) => {
                      if (status !== "Yes") return true;
                      if (!value) return "Please upload the document";
                      const allowed =
                        value.type.startsWith("image/") ||
                        value.type === "application/pdf";
                      return allowed ? true : "Only image or PDF allowed";
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col items-start gap-1">
                      <label
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs border
                        ${status !== "Yes"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                          }`}
                      >
                        <Upload size={14} />
                        <span className="inline-block">Upload</span>
                        <input
                          type="file"
                          disabled={status !== "Yes" || !isEditMode}
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            field.onChange(e.target.files[0] ?? null)
                          }
                        />
                      </label>
                      {fieldState.error && (
                        <p className="text-xs text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                      {file && status === "Yes" && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check size={14} /> {file.name}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="col-span-2 text-center text-sm">
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(file, "view")}
                      aria-label="View document"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(file, "download")}
                      aria-label="Download document"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="">No file found</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Other Documents</h3>

          <button
            type="button"
            onClick={() => appendOtherDocument(createEmptyOtherDocument())}
            disabled={!isEditMode}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
              isEditMode
                ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus size={14} />
            Add Document
          </button>
        </div>

        {otherDocumentFields.length === 0 ? (
          <p className="text-xs text-gray-500">No other documents added.</p>
        ) : null}

        {otherDocumentFields.map((fieldItem, index) => {
          const otherFile = watch(`otherDocuments.${index}.file`);
          const otherName = watch(`otherDocuments.${index}.docName`);

          return (
            <div
              key={fieldItem.fieldId}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border rounded-lg p-3 bg-gray-50"
            >
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  {...register(`otherDocuments.${index}.docName`)}
                  disabled={!isEditMode}
                  placeholder="Enter document name"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-4">
                <Controller
                  control={control}
                  name={`otherDocuments.${index}.file`}
                  rules={{
                    validate: (value) => {
                      const hasName = !!otherName?.trim();
                      const hasFile = !!value;

                      if (!hasName && !hasFile) return true;
                      if (hasName && !hasFile) return "Please upload the document";
                      if (!hasName && hasFile) return "Please enter document name";

                      const allowed =
                        value.type?.startsWith("image/") ||
                        value.type === "application/pdf";
                      return allowed ? true : "Only image or PDF allowed";
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                      <label
                        className={`inline-flex w-fit items-center gap-2 rounded-md border px-3 py-1.5 text-xs ${
                          !isEditMode
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                        }`}
                      >
                        <Upload size={14} />
                        Upload
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          disabled={!isEditMode}
                          className="hidden"
                          onChange={(e) =>
                            field.onChange(e.target.files[0] ?? null)
                          }
                        />
                      </label>

                      {fieldState.error ? (
                        <p className="text-xs text-red-500">
                          {fieldState.error.message}
                        </p>
                      ) : null}

                      {otherFile ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check size={14} />
                          {otherFile.name}
                        </span>
                      ) : null}
                    </div>
                  )}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 pt-1">
                {otherFile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(otherFile, "view")}
                      aria-label="View document"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentAction(otherFile, "download")}
                      aria-label="Download document"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                    >
                      <Download size={16} />
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">No file</span>
                )}
              </div>

              <div className="md:col-span-1 flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => removeOtherDocument(index)}
                  disabled={!isEditMode}
                  className={`rounded-md p-1 ${
                    isEditMode
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div className="mt-4 bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start border border-blue-100">
        <div className="bg-blue-600 rounded-full p-2 shrink-0 text-white mt-1">
          <Check size={20} className="stroke-[3]" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">
            Ready to Complete Profile
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            You've reached the final step! Review all the information before submitting.
          </p>
        </div>
      </div>

    </div>
  );
};

export default BusinessPlanStep;
