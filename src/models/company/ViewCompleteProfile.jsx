import React, { useEffect, useState } from "react";
import { X, Eye, Download } from "lucide-react";
import ButtonComponent from "../../components/comman/ButtonComponent";
import InputField from "../../components/comman/InputField";
import { getCompanyProfileByCompanyId } from "../../services/companyService";
import { toast } from "react-toastify";

const mapApiToFormData = (data) => {
  return {
    companyProfile: {
      fpoUniqueCode: data.fpoUniqueCode || "",
    },

    fpoIdentification: {
      dateOfStartActivities: data.dateOfStartActivities || "",
      nameApprovalDate: data.nameApprovalDate || "",
      moaAoAPrepDate: data.moaAoAPrepDate || "",
      registrationDate: data.registrationDate || "",
      incorporationDate: data.incorporationDate || "",
      cinNumber: data.cinNumber || "",
      panNumber: data.panNumber || "",
      tanNumber: data.tanNumber || "",
      gstApplicationDate: data.gstApplicationDate || "",
      gstNumber: data.gstNumber || "",
      gstCertificateIssueDate: data.gstCertificateIssueDate || "",
    },

    financialCompliance: {
      bankName: data.bankName || "",
      accountNumber: data.accountNumber || "",
      ifscCode: data.ifscCode || "",
      accountOpeningDate: data.accountOpeningDate || "",
      inc20aSubmission: data.inc20aSubmission || "",
      firstAgmConducted: data.firstAgmConducted ? "Yes" : "No",
      stationeryPrepared: data.stationeryPrepared ? "Yes" : "No",
      caAuditorName: data.caAuditorName || "",
      caContactNumber: data.caContactNumber || "",
      caEmail: data.caEmail || "",
    },

    fpoOfficials: {
      ceoName: data.ceoName || "",
      ceoContact: data.ceoContact || "",
      ceoEmail: data.ceoEmail || "",
      ceoAppointmentDate: data.ceoAppointmentDate || "",
      accountantName: data.accountantName || "",
      accountantContact: data.accountantContact || "",
      accountantEmail: data.accountantEmail || "",
      accountantAppointmentDate: data.accountantAppointmentDate || "",
    },

    membershipDetails: {
      totalShareholderFarmers: data.totalShareholderFarmers || "",
      totalLandholdingAcres: data.totalLandholdingAcres || "",
      maleMembers: data.maleMembers || "",
      femaleMembers: data.femaleMembers || "",
      marginalFarmers: data.marginalFarmers || "",
      smallFarmers: data.smallFarmers || "",
      semiMediumFarmers: data.semiMediumFarmers || "",
      mediumFarmers: data.mediumFarmers || "",
      largeFarmers: data.largeFarmers || "",
    },

    shareCapital: {
      authorizedShareCapital: data.authorizedShareCapital || "",
      totalShareCapitalRaised: data.totalShareCapitalRaised || "",
      totalPaidUpCapital: data.totalPaidUpCapital || "",
    },

    inputShopDetails: {
      shopLocation: data.shopLocation || "",
      tehsil: data.tehsil || "",
      district: data.district || "",
      shopPincode: data.shopPincode || "",
      areaOfShopSqFt: data.areaOfShopSqFt || "",
      distanceFromCompetitionKm: data.distanceFromCompetitionKm || "",
      latitude: data.latitude || "",
      longitude: data.longitude || "",
    },

    licenses: {
      seedLicenseNumber: data.seedLicenseNumber || "",
      seedValidity: data.seedValidity || "",
      fertilizerValidity: data.fertilizerValidity || "",
      fertilizerLicenseNumber: data.fertilizerLicenseNumber || "",
      pesticideLicenseNumber: data.pesticideLicenseNumber || "",
      mandiLicenseNumber: data.mandiLicenseNumber || "",
      pesticideValidity: data.pesticideValidity || "",
      mandiValidity: data.mandiValidity || "",
      udyamAadhaarNumber: data.udyamAadhaarNumber || "",
      udyamIssueDate: data.udyamIssueDate || "",
    },

    outputPurchaseCentre: {
      mandiName: data.mandiName || "",
      mandiLocation: data.mandiLocation || "",
      mandiDistrict: data.mandiDistrict || "",
      mandiLatitude: data.mandiLatitude || "",
      mandiLongitude: data.mandiLongitude || "",
      purchaseCentreLocation: data.purchaseCentreLocation || "",
      purchaseCentreAreaSqFt: data.purchaseCentreAreaSqFt || "",
      purchaseCentreDistanceFromMandiKm:
        data.purchaseCentreDistanceFromMandiKm || "",
      warehouseLocation: data.warehouseLocation || "",
      warehouseAreaSqFt: data.warehouseAreaSqFt || "",
    },

    infrastructure: {
      digitalMoistureMeter: data.digitalMoistureMeter ? "Yes" : "No",
      hlMeter: data.hlMeter ? "Yes" : "No",
      bambooSampler: data.bambooSampler ? "Yes" : "No",
      weighingScale100kg: data.weighingScale100kg ? "Yes" : "No",
      weighingScale500g: data.weighingScale500g ? "Yes" : "No",
      otherEquipment: data.otherEquipment || "",
    },

    itInfrastructure: {
      laptopDesktopAvailable: data.laptopDesktopAvailable ? "Yes" : "No",
      internetConnectivity: data.internetConnectivity ? "Yes" : "No",
      printerAvailable: data.printerAvailable ? "Yes" : "No",
    },

    businessPlan: {
      businessPlanPrepared: data.businessPlanPrepared ? "Yes" : "No",
      vendorRegistered: data.vendorRegistered ? "Yes" : "No",
    },
  };
};

export const businessPlanDocuments = [
  { label: "Certificate of Incorporation/ Registered Document", name: "incorporationCert" },
  { label: "PAN Card", name: "panCard" },
  { label: "GST Certificate", name: "gstCert" },
  { label: "TAN", name: "tan" },
  { label: "Articles of Association (AOA)", name: "aoa" },
  { label: "Memorandum of Association (MOA)", name: "moa" },
  { label: "Udyam Certificate", name: "udyamCert" },
  { label: "Cancelled Cheque", name: "cancelledCheque" },
  { label: "Seed License", name: "seedLicense" },
  { label: "Fertilizer License", name: "fertilizerLicense" },
  { label: "Pesticide License", name: "pesticideLicense" },
  { label: "Mandi License (DML)", name: "mandiLicense" },
  { label: "Office Picture (with Gps Coordinates)", name: "officePic" },
  { label: "INC-20A Form & Challan", name: "inc20AForm" },
  { label: "Startup India Certificate", name: "startupCertificate" },
  { label: "Import Export Certificate", name: "importExportCertificate" },
];

const getDocumentLabel = (docName) => {
  const matchedDoc = businessPlanDocuments.find(
    (item) => item.name === docName
  );

  return matchedDoc?.label || docName;
};
const getSectionValue = (profileData, section, key) => {
  return profileData?.[section]?.[key] ?? "";
};

const ViewCompleteProfile = ({ isOpen, onClose, companyId, companyName }) => {
  if (!isOpen || !companyId) return null;
  const [profileData, setProfileData] = useState({});

  const fetchCompanyProfileById = async () => {
    try {
      const response = await getCompanyProfileByCompanyId(companyId);
      if (response) {
        console.log("response", response);
        const mappedData = mapApiToFormData(response);
        setProfileData({
          ...mappedData,
          documents: response.documents || [],
        });
      }
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    if (companyId) {
      fetchCompanyProfileById();
    }
  }, [companyId]);


  const handleDocumentAction = (doc, action = "view") => {
    if (!doc?.file) return;

    const base64Data = doc.file;
    const fileName = doc.docName || "document";

    const byteString = atob(base64Data.split(",")[1]);
    const mimeType = base64Data.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    const url = URL.createObjectURL(blob);

    if (action === "view") {
      window.open(url, "_blank");
    } else if (action === "download") {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getFileDisplayName = (doc) => {
    if (!doc?.docContentType) return doc.docName || "File";

    if (doc.docContentType.includes("pdf")) return "PDF";
    if (doc.docContentType.includes("image")) return "Image";

    return doc.docName || "File";
  };

  const camelToNormal = (text) => {
    if (!text) return "";

    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4">
      <div className="flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Complete Profile
            </h2>
            <p className="text-sm text-gray-500">
              {companyName
                ? `Viewing the saved data for ${companyName}.`
                : "View the submitted details for this company."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Company Profile */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Company Profile
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Company Unique Code"
                name="view-companyProfile-fpoUniqueCode"
                value={getSectionValue(profileData, "companyProfile", "fpoUniqueCode")}
                readOnly
                placeholder="—"
              />
            </div>
          </section>

          {/* FPO Identification */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Company Identification
            </h3>
            <div className="mt-4 space-y-4">
              {[
                // [
                //   { label: "Date of Start Activities", key: "dateOfStartActivities" },
                //   { label: "Name Approval Date", key: "nameApprovalDate" },
                //   { label: "MoA/AoA Prep Date", key: "moaAoAPrepDate" },
                //   { label: "Registration Date", key: "registrationDate" },
                // ],
                [
                  { label: "Incorporation Date", key: "incorporationDate" },
                  { label: "CIN Number", key: "cinNumber" },
                  { label: "PAN Number", key: "panNumber" },
                  { label: "TAN Number", key: "tanNumber" },
                ],
                [
                  { label: "GST Application Date", key: "gstApplicationDate" },
                  { label: "GST Number", key: "gstNumber" },
                  { label: "GST Certificate Issue Date", key: "gstCertificateIssueDate" },
                ],
              ].map((row, rowIndex) => (
                <div
                  key={`fpoIdentification-row-${rowIndex}`}
                  className={`grid grid-cols-1 md:grid-cols-${row.length} gap-4`}
                >
                  {row.map((item) => (
                    <InputField
                      key={`view-fpoIdentification-${item.key}`}
                      label={item.label}
                      name={`view-fpoIdentification-${item.key}`}
                      value={getSectionValue(profileData, "fpoIdentification", item.key)}
                      readOnly
                      placeholder="—"
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Financial Compliance */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Financial Compliance
            </h3>
            <div className="mt-4 space-y-4">
              {[
                [
                  { label: "Bank Name", key: "bankName" },
                  { label: "Account Number", key: "accountNumber" },
                  { label: "IFSC Code", key: "ifscCode" },
                  { label: "Account Opening Date", key: "accountOpeningDate" },
                ],
                [
                  { label: "INC-20A Submission", key: "inc20aSubmission" },
                  { label: "First AGM Conducted", key: "firstAgmConducted" },
                  { label: "Stationery Prepared", key: "stationeryPrepared" },
                ],
                [
                  { label: "CA/Auditor Name", key: "caAuditorName" },
                  { label: "CA Contact Number", key: "caContactNumber" },
                  { label: "CA Email", key: "caEmail" },
                ],
              ].map((row, rowIndex) => (
                <div
                  key={`financialCompliance-row-${rowIndex}`}
                  className={`grid grid-cols-1 md:grid-cols-${row.length} gap-4`}
                >
                  {row.map((item) => (
                    <InputField
                      key={`view-financialCompliance-${item.key}`}
                      label={item.label}
                      name={`view-financialCompliance-${item.key}`}
                      value={getSectionValue(profileData, "financialCompliance", item.key)}
                      readOnly
                      placeholder="—"
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* FPO Officials */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Company Officials
            </h3>

            <div className="space-y-4">
              <div className="bg-blue-50 py-2 px-4 rounded-md">
                <h4 className="text-sm font-semibold text-gray-800">CEO Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "CEO Name", key: "ceoName" },
                  { label: "CEO Contact", key: "ceoContact" },
                  { label: "CEO Email", key: "ceoEmail" },
                  { label: "Appointment Date", key: "ceoAppointmentDate" },
                ].map((item) => (
                  <InputField
                    key={`view-ceo-${item.key}`}
                    label={item.label}
                    name={`view-ceo-${item.key}`}
                    value={getSectionValue(profileData, "fpoOfficials", item.key)}
                    readOnly
                    placeholder="—"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 py-2 px-4 rounded-md">
                <h4 className="text-sm font-semibold text-gray-800">Accountant Information</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Accountant Name", key: "accountantName" },
                  { label: "Contact", key: "accountantContact" },
                  { label: "Email", key: "accountantEmail" },
                  { label: "Appointment Date", key: "accountantAppointmentDate" },
                ].map((item) => (
                  <InputField
                    key={`view-accountant-${item.key}`}
                    label={item.label}
                    name={`view-accountant-${item.key}`}
                    value={getSectionValue(profileData, "fpoOfficials", item.key)}
                    readOnly
                    placeholder="—"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Membership Details */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Membership Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {
                [
                  { label: "Total Shareholder Farmers", key: "totalShareholderFarmers" },
                  { label: "Total Landholding (acres)", key: "totalLandholdingAcres" },
                  { label: "Male Members", key: "maleMembers" },
                  { label: "Female Members", key: "femaleMembers" },
                ].map((item) => (
                  <InputField
                    key={`view-membership-${item.key}`}
                    label={item.label}
                    name={`view-membership-${item.key}`}
                    value={getSectionValue(profileData, "membershipDetails", item.key)}
                    readOnly
                    placeholder="—"
                  />
                ))
              }
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 py-2 px-4 rounded-md inline-block w-full">
                <h4 className="text-sm font-semibold text-gray-800">Farmer Categories</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {
                  [
                    { label: "Marginal", key: "marginalFarmers" },
                    { label: "Small", key: "smallFarmers" },
                    // { label: "Semi-Medium", key: "semiMediumFarmers" },
                    { label: "Medium", key: "mediumFarmers" },
                    { label: "Large", key: "largeFarmers" },
                  ].map((item) => (
                    <InputField
                      key={`view-farmer-${item.key}`}
                      label={item.label}
                      name={`view-farmer-${item.key}`}
                      value={getSectionValue(profileData, "membershipDetails", item.key)}
                      readOnly
                      placeholder="—"
                    />
                  ))
                }
              </div>
            </div>
          </section>

          {/* Share Capital */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Share Capital
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                [
                  { label: "Authorized Share Capital (₹)", key: "authorizedShareCapital" },
                  { label: "Total Share Capital Raised (₹)", key: "totalShareCapitalRaised" },
                  { label: "Total Paid-Up Capital (₹)", key: "totalPaidUpCapital" },
                ].map((item) => (
                  <InputField
                    key={`view-share-${item.key}`}
                    label={item.label}
                    name={`view-share-${item.key}`}
                    value={getSectionValue(profileData, "shareCapital", item.key)}
                    readOnly
                    placeholder="—"
                  />
                ))
              }
            </div>
          </section>

          {/* Input Shop Details */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Input Shop Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Shop Location", key: "shopLocation" },
                { label: "Tehsil", key: "tehsil" },
                { label: "District", key: "district" },
                { label: "Pincode", key: "shopPincode" },
              ].map((item) => (
                <InputField
                  key={`view-shop-${item.key}`}
                  label={item.label}
                  name={`view-shop-${item.key}`}
                  value={getSectionValue(profileData, "inputShopDetails", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Area of Shop (sq ft)", key: "areaOfShopSqFt" },
                { label: "Distance from Competition (km)", key: "distanceFromCompetitionKm" },
                { label: "Latitude", key: "latitude" },
                { label: "Longitude", key: "longitude" },
              ].map((item) => (
                <InputField
                  key={`view-shop2-${item.key}`}
                  label={item.label}
                  name={`view-shop2-${item.key}`}
                  value={getSectionValue(profileData, "inputShopDetails", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>
          </section>

          {/* Licenses */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Licenses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Seed License Number"
                  name="view-licenses-seedLicenseNumber"
                  value={getSectionValue(profileData, "licenses", "seedLicenseNumber")}
                  readOnly
                  placeholder="—"
                />
              </div>
              <InputField
                label="Seed Validity"
                name="view-licenses-seedValidity"
                value={getSectionValue(profileData, "licenses", "seedValidity")}
                readOnly
                placeholder="—"
              />
              <InputField
                label="Fertilizer Validity"
                name="view-licenses-fertilizerValidity"
                value={getSectionValue(profileData, "licenses", "fertilizerValidity")}
                readOnly
                placeholder="—"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Fertilizer License Number"
                  name="view-licenses-fertilizerLicenseNumber"
                  value={getSectionValue(profileData, "licenses", "fertilizerLicenseNumber")}
                  readOnly
                  placeholder="—"
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Pesticide License Number"
                  name="view-licenses-pesticideLicenseNumber"
                  value={getSectionValue(profileData, "licenses", "pesticideLicenseNumber")}
                  readOnly
                  placeholder="—"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Direct Marketing/Mandi License"
                  name="view-licenses-mandiLicenseNumber"
                  value={getSectionValue(profileData, "licenses", "mandiLicenseNumber")}
                  readOnly
                  placeholder="—"
                />
              </div>
              <InputField
                label="Pesticide Validity"
                name="view-licenses-pesticideValidity"
                value={getSectionValue(profileData, "licenses", "pesticideValidity")}
                readOnly
                placeholder="—"
              />
              <InputField
                label="Mandi Validity"
                name="view-licenses-mandiValidity"
                value={getSectionValue(profileData, "licenses", "mandiValidity")}
                readOnly
                placeholder="—"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <InputField
                  label="Udhyam Registration number"
                  name="view-licenses-udyamAadhaarNumber"
                  value={getSectionValue(profileData, "licenses", "udyamAadhaarNumber")}
                  readOnly
                  placeholder="—"
                />
              </div>
              <InputField
                label="Udyam Issue Date"
                name="view-licenses-udyamIssueDate"
                value={getSectionValue(profileData, "licenses", "udyamIssueDate")}
                readOnly
                placeholder="—"
              />
            </div>
          </section>

          {/* Output Purchase Centre */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Output Purchase Centre
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Mandi Details</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Mandi Name"
                    name="view-output-mandiName"
                    value={getSectionValue(profileData, "outputPurchaseCentre", "mandiName")}
                    readOnly
                    placeholder="—"
                  />
                </div>
                <InputField
                  label="Location"
                  name="view-output-mandiLocation"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "mandiLocation")}
                  readOnly
                  placeholder="—"
                />
                <InputField
                  label="District"
                  name="view-output-mandiDistrict"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "mandiDistrict")}
                  readOnly
                  placeholder="—"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField
                  label="Latitude"
                  name="view-output-mandiLatitude"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "mandiLatitude")}
                  readOnly
                  placeholder="—"
                />
                <InputField
                  label="Longitude"
                  name="view-output-mandiLongitude"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "mandiLongitude")}
                  readOnly
                  placeholder="—"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Purchase Centre</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Location"
                  name="view-output-purchaseCentreLocation"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "purchaseCentreLocation")}
                  readOnly
                  placeholder="—"
                />
                <InputField
                  label="Area (sq ft)"
                  name="view-output-purchaseCentreAreaSqFt"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "purchaseCentreAreaSqFt")}
                  readOnly
                  placeholder="—"
                />
                <InputField
                  label="Distance from Mandi (km)"
                  name="view-output-purchaseCentreDistanceFromMandiKm"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "purchaseCentreDistanceFromMandiKm")}
                  readOnly
                  placeholder="—"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Warehouse</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-1/2">
                <InputField
                  label="Warehouse Location"
                  name="view-output-warehouseLocation"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "warehouseLocation")}
                  readOnly
                  placeholder="—"
                />
                <InputField
                  label="Warehouse Area (sq ft)"
                  name="view-output-warehouseAreaSqFt"
                  value={getSectionValue(profileData, "outputPurchaseCentre", "warehouseAreaSqFt")}
                  readOnly
                  placeholder="—"
                />
              </div>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Digital Moisture Meter", key: "digitalMoistureMeter" },
                { label: "HL Meter", key: "hlMeter" },
                { label: "Bamboo Sampler", key: "bambooSampler" },
              ].map((item) => (
                <InputField
                  key={`view-infra-${item.key}`}
                  label={item.label}
                  name={`view-infra-${item.key}`}
                  value={getSectionValue(profileData, "infrastructure", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "100kg Weighing Scale", key: "weighingScale100kg" },
                { label: "500g Weighing Scale", key: "weighingScale500g" },
                { label: "Other Equipment", key: "otherEquipment" },
              ].map((item) => (
                <InputField
                  key={`view-infra2-${item.key}`}
                  label={item.label}
                  name={`view-infra2-${item.key}`}
                  value={getSectionValue(profileData, "infrastructure", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>
          </section>

          {/* IT Infrastructure */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              IT Infrastructure
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Laptop/Desktop Available", key: "laptopDesktopAvailable" },
                { label: "Internet Connectivity", key: "internetConnectivity" },
                { label: "Printer Available", key: "printerAvailable" },
              ].map((item) => (
                <InputField
                  key={`view-it-${item.key}`}
                  label={item.label}
                  name={`view-it-${item.key}`}
                  value={getSectionValue(profileData, "itInfrastructure", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>
          </section>

          {/* Business Plan */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Business Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Business Plan Prepared", key: "businessPlanPrepared" },
                { label: "Vendor Registered", key: "vendorRegistered" },
              ].map((item) => (
                <InputField
                  key={`view-business-${item.key}`}
                  label={item.label}
                  name={`view-business-${item.key}`}
                  value={getSectionValue(profileData, "businessPlan", item.key)}
                  readOnly
                  placeholder="—"
                />
              ))}
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-4">
                Document Collection Checklist
              </h4>
              <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 border-b pb-2 mb-2">
                <div className="col-span-1">Sr. No.</div>
                <div className="col-span-4">Document Name</div>
                <div className="col-span-3 text-center">Document Type</div>
                <div className="col-span-4 text-center">Action</div>
              </div>
              {profileData?.documents?.map((doc, index) => {
                return (
                  <div
                    key={doc.docName}
                    className="grid grid-cols-12 items-center gap-2 py-3 border-b last:border-none"
                  >
                    <div className="col-span-1 text-sm">{index + 1}</div>

                    <div className="col-span-4 text-sm font-medium text-gray-700">
                      {getDocumentLabel(doc.docName)}
                    </div>

                    <div className="col-span-3 text-center text-sm text-gray-700">
                      {getFileDisplayName(doc)}
                    </div>

                    <div className="col-span-4 text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDocumentAction(doc, "view")}
                          aria-label="View document"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDocumentAction(doc, "download")}
                          aria-label="Download document"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm transition hover:bg-blue-100"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <ButtonComponent
            handleButtonClick={onClose}
            className="rounded-full bg-gray-600 px-5 py-2 text-sm"
          >
            Close
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default ViewCompleteProfile;
