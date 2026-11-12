import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Stepper from "./Stepper";
import FormNavigation from "./FormNavigation";
import CompanyProfileStep from "./steps/CompanyProfileStep";
import FPOIdentificationStep from "./steps/FPOIdentificationStep";
import FinancialComplianceStep from "./steps/FinancialComplianceStep";
import FPOOfficialsStep from "./steps/FPOOfficialsStep";
import MembershipDetailsStep from "./steps/MembershipDetailsStep";
import ShareCapitalStep from "./steps/ShareCapitalStep";
import InputShopDetailsStep from "./steps/InputShopDetailsStep";
import LicensesStep from "./steps/LicensesStep";
import OutputPurchaseCentreStep from "./steps/OutputPurchaseCentreStep";
import InfrastructureStep from "./steps/InfrastructureStep";
import ITInfrastructureStep from "./steps/ITInfrastructureStep";
import BusinessPlanStep, {
  businessPlanDocuments,
} from "./steps/BusinessPlanStep";
import { stepSchemas } from "./schema";
import { fpoProfileFormStructure, getEmptyForm } from "./formData";
import { toast } from "react-toastify";
import { completeCompanyProfile, editCompanyProfile, getCompanyProfileByCompanyId } from "../../../services/companyService";

import { fetchCompanies } from "../../../store/actions/companyAction";
import { useDispatch } from "react-redux";


const TOTAL_STEPS = 12;
const knownBusinessDocNames = new Set(
  businessPlanDocuments.map((doc) => doc.name)
);

const mapApiToFormData = (data) => {
  const mapped = {
    fpoUniqueCode: data.fpoUniqueCode || "",

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

    bankName: data.bankName || "",
    accountNumber: data.accountNumber || "",
    ifscCode: data.ifscCode || "",
    accountOpeningDate: data.accountOpeningDate || "",
    bankAccounts: Array.isArray(data.bankAccounts) ? data.bankAccounts : [],
    inc20aSubmission: data.inc20aSubmission || "",
    firstAgmConducted: data.firstAgmConducted == null ? "" : String(data.firstAgmConducted),
    stationeryPrepared: data.stationeryPrepared == null ? "" : String(data.stationeryPrepared),
    caAuditorName: data.caAuditorName || "",
    caContactNumber: data.caContactNumber || "",
    caEmail: data.caEmail || "",

    ceoName: data.ceoName || "",
    ceoContact: data.ceoContact || "",
    ceoEmail: data.ceoEmail || "",
    ceoAppointmentDate: data.ceoAppointmentDate || "",
    accountantName: data.accountantName || "",
    accountantContact: data.accountantContact || "",
    accountantEmail: data.accountantEmail || "",
    accountantAppointmentDate: data.accountantAppointmentDate || "",

    totalShareholderFarmers: data.totalShareholderFarmers || "",
    totalLandholdingAcres: data.totalLandholdingAcres || "",
    maleMembers: data.maleMembers || "",
    femaleMembers: data.femaleMembers || "",
    marginalFarmers: data.marginalFarmers || "",
    smallFarmers: data.smallFarmers || "",
    semiMediumFarmers: data.semiMediumFarmers || "",
    mediumFarmers: data.mediumFarmers || "",
    largeFarmers: data.largeFarmers || "",

    authorizedShareCapital: data.authorizedShareCapital || "",
    totalShareCapitalRaised: data.totalShareCapitalRaised || "",
    totalPaidUpCapital: data.totalPaidUpCapital || "",

    shopLocation: data.shopLocation || "",
    tehsil: data.tehsil || "",
    district: data.district || "",
    shopPincode: data.shopPincode || "",
    areaOfShopSqFt: data.areaOfShopSqFt || "",
    distanceFromCompetitionKm: data.distanceFromCompetitionKm || "",
    latitude: data.latitude || "",
    longitude: data.longitude || "",

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

    digitalMoistureMeter: data.digitalMoistureMeter == null ? "" : String(data.digitalMoistureMeter),
    hlMeter: data.hlMeter == null ? "" : String(data.hlMeter),
    bambooSampler: data.bambooSampler == null ? "" : String(data.bambooSampler),
    weighingScale100kg: data.weighingScale100kg == null ? "" : String(data.weighingScale100kg),
    weighingScale500g: data.weighingScale500g == null ? "" : String(data.weighingScale500g),
    otherEquipment: data.otherEquipment || "",

    laptopDesktopAvailable: data.laptopDesktopAvailable == null ? "" : String(data.laptopDesktopAvailable),
    internetConnectivity: data.internetConnectivity == null ? "" : String(data.internetConnectivity),
    printerAvailable: data.printerAvailable == null ? "" : String(data.printerAvailable),

    businessPlanPrepared: data.businessPlanPrepared == null ? "" : String(data.businessPlanPrepared),
    vendorRegistered: data.vendorRegistered == null ? "" : String(data.vendorRegistered),
    otherDocuments: [],

  };

  if (Array.isArray(data.documents)) {
    const otherDocuments = [];

    data.documents.forEach((doc) => {
      const extension = doc.docContentType?.split("/")[1] || "file";
      const normalizedFile = {
        name: `${doc.docName}.${extension}`,
        type: doc.docContentType,
        base64: doc.file,
        doc: doc,
        isExisting: true,
      };

      if (knownBusinessDocNames.has(doc.docName)) {
        mapped[`${doc.docName}_status`] = "Yes";
        mapped[`${doc.docName}_file`] = normalizedFile;
      } else {
        otherDocuments.push({
          docName: doc.docName || "",
          file: normalizedFile,
        });
      }
    });

    mapped.otherDocuments = otherDocuments;
  }

  return mapped;
};

const FPOProfileModal = ({ isOpen, onClose, companyId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isComplateProfile, setComplateProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const companyDraftsRef = useRef({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const activeSchema = stepSchemas[currentStep] || stepSchemas[1];

  const methods = useForm({
    resolver: zodResolver(activeSchema),
    mode: "onTouched",
  });

  const { getValues, reset } = methods;

  const markStepComplete = (step) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  };

  const fetchCompanyProfileById = async () => {
    try {
      const response = await getCompanyProfileByCompanyId(companyId);
      console.log("Response", response);


      if (response) {
        const mappedData = mapApiToFormData(response);
        setIsEditMode(false);
        reset(mappedData);
        setComplateProfile(true);
        setCompletedSteps(Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1));
      } else {
        setIsEditMode(true);
        reset(getEmptyForm());
        setComplateProfile(false);
      }

    } catch (error) {
      setIsEditMode(true);
      reset(getEmptyForm());
      setComplateProfile(false);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyProfileById();
    }
  }, [companyId]);

  const isStepComplete = (step) => completedSteps.includes(step);

  const collectBusinessPlanUploads = (sourceData) => {
    const checklistUploads = businessPlanDocuments
      .map((doc) => {
        const status = sourceData[`${doc.name}_status`];
        const file = sourceData[`${doc.name}_file`];

        return {
          id: doc.name,
          label: doc.label,
          status,
          file,
          fileName: file?.name ?? null,
          fileType: file?.type ?? null,
        };
      })
      .filter((entry) => entry.file);

    const otherUploads = (Array.isArray(sourceData.otherDocuments)
      ? sourceData.otherDocuments
      : []
    )
      .map((doc) => ({
        id: doc.docName?.trim(),
        label: doc.docName?.trim(),
        status: "Yes",
        file: doc.file,
        fileName: doc.file?.name ?? null,
        fileType: doc.file?.type ?? null,
      }))
      .filter((entry) => entry.id && entry.file);

    return [...checklistUploads, ...otherUploads];
  };

  const shapeSubmissionData = (data) => {
    const formData = new FormData();

    Object.values(fpoProfileFormStructure).forEach((fields) => {
      Object.keys(fields).forEach((fieldName) => {

        if (fieldName === "bankAccounts") return;

        let value = data[fieldName];

        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          value === "Invalid date";

        if (!isEmpty) {
          formData.append(fieldName, value);
        }
      });
    });

    if (Array.isArray(data.businessPlanDocuments)) {
      data.businessPlanDocuments.forEach((item) => {
        if (item.file instanceof File) {
          formData.append("documents", item.file);
          formData.append("docIds", item.id);
        }
      });
    }

    if (Array.isArray(data.bankAccounts)) {
      formData.append(
        "bankAccounts",
        JSON.stringify(data.bankAccounts)
      );
    }

    return formData;
  };

  const handleNext = async () => {
    if (isComplateProfile && !isEditMode && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const isValid = await methods.trigger();
    if (!isValid) return;

    const data = getValues();
    const updatedData = { ...formData, ...data };

    if (currentStep === TOTAL_STEPS) {
      updatedData.businessPlanDocuments = collectBusinessPlanUploads(data);
    }

    setFormData(updatedData);
    markStepComplete(currentStep);

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const structuredPayload = shapeSubmissionData(updatedData,);
      console.log("Final Form Submitted:");

      for (let pair of structuredPayload.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], pair[1]);
        } else {
          console.log(pair[0], pair[1]);
        }
      }
      try {
        setLoading(true);
        const response = (isEditMode && isComplateProfile) ? await editCompanyProfile(structuredPayload, companyId) : await completeCompanyProfile(structuredPayload, companyId);
        if (response) {
          toast.success(response || (isEditMode ? "company profile updated successfully...." : "company profile complated successfully...."));
          onClose();
          dispatch(fetchCompanies({ searchTerm: "", status: "", employeeId: "", page: "", }));
        }
        else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.error("ERROR:", err);
        toast.error(err);
      } finally {
        setLoading(false);
      }


    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setFormData((prev) => ({ ...prev, ...getValues() }));
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepClick = (step) => {
    if (step === currentStep) return;
    setFormData((prev) => ({ ...prev, ...getValues() }));
    setCurrentStep(step);
  };

  const handleSaveDraft = () => {
    if (!companyId) {
      console.warn("No companyId provided for draft saving");
      return;
    }

    const currentData = getValues();
    const draftData = { ...formData, ...currentData };
    localStorage.setItem(`fpoDraft_${companyId}`, JSON.stringify(draftData));
    console.log(`Draft saved for company ${companyId}`, draftData);
  };

  // useEffect(() => {
  //   if (!isOpen) return;

  //   let savedData = {};

  //   if (companyId) {
  //     const stored = localStorage.getItem(`fpoDraft_${companyId}`);
  //     savedData = stored ? JSON.parse(stored) : {};
  //   }

  //   setCurrentStep(1);
  //   setCompletedSteps([]);

  //   if (Object.keys(savedData).length > 0) {
  //     setFormData(savedData);
  //     reset(savedData);
  //   } else if (companyId) {
  //     fetchCompanyProfileById(); 
  //   }

  // }, [isOpen, companyId]);

  // useEffect(() => {
  //   if (!isOpen) return;
  //   let savedData = {};
  //   if (companyId) {
  //     const stored = localStorage.getItem(`fpoDraft_${companyId}`);
  //     savedData = stored ? JSON.parse(stored) : {};
  //   }
  //   setCurrentStep(1);
  //   setFormData(savedData);
  //   setCompletedSteps([]);
  //   reset(savedData);
  // }, [isOpen, companyId, reset]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyProfileStep isEditMode={isEditMode} />;
      case 2:
        return <FPOIdentificationStep isEditMode={isEditMode} />;
      case 3:
        return <FinancialComplianceStep isEditMode={isEditMode} />;
      case 4:
        return <FPOOfficialsStep isEditMode={isEditMode} />;
      case 5:
        return <MembershipDetailsStep isEditMode={isEditMode} />;
      case 6:
        return <ShareCapitalStep isEditMode={isEditMode} />;
      case 7:
        return <InputShopDetailsStep isEditMode={isEditMode} />;
      case 8:
        return <LicensesStep isEditMode={isEditMode} />;
      case 9:
        return <OutputPurchaseCentreStep isEditMode={isEditMode} />;
      case 10:
        return <InfrastructureStep isEditMode={isEditMode} />;
      case 11:
        return <ITInfrastructureStep isEditMode={isEditMode} />;
      case 12:
        return <BusinessPlanStep isEditMode={isEditMode} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const progressPercentage = Math.round((completedSteps.length / TOTAL_STEPS) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-full md:max-w-5xl max-h-[95vh] min-h-[80vh] flex flex-col overflow-hidden py-2">
        <div className="flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Company Profile</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {TOTAL_STEPS}:{" "}
              {currentStep === 1 ? "Company Profile" : `Step ${currentStep}`}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">{progressPercentage}% Complete</span>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center pb-2">
          <div className="w-[95%] overflow-hidden relative">
            <div className="overflow-x-auto no-scrollbar">
              <Stepper
                currentStep={currentStep}
                onStepClick={handleStepClick}
                isStepComplete={isStepComplete}
              />
            </div>
          </div>
        </div>

        <FormProvider {...methods} >
          <form id="fpo-profile-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {renderStep()}
            </div>
            <div className="px-8 pb-0">
              <FormNavigation
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={handleBack}
                isComplete={isComplateProfile}
                loading={loading}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default FPOProfileModal;
