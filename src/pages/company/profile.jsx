import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Mail,
  Phone,
  User,
  UserStar,
  UserPen,
} from "lucide-react";
import ConnectCompany from "../../models/connectCompany";
import ButtonComponent from "../../components/comman/ButtonComponent"; // adjust path if needed
import { fetchCompanyDataById } from "../../store/actions/companyAction";
import { Oval } from "react-loader-spinner";
import PageHeader from "../../components/comman/PageHeader";
import ViewCompleteProfile from "../../models/company/ViewCompleteProfile";
import FPOProfileModal from "../../models/admin/profile-modal/FPOProfileModal";

import { updateUser } from "../../store/slices/authSlice";

const infoFields = [
  { label: "Company Name", valueKey: "name" },
  { label: "PAN Number", valueKey: "pan" },
  { label: "GSTIN", valueKey: "gstin" },
  { label: "Connected Since", valueKey: "connectedDate" },
  { label: "Address", valueKey: "address" },
  { label: "City", valueKey: "city" },
  { label: "State", valueKey: "state" },
  { label: "Pincode", valueKey: "pincode" },
];

const contactFields = [
  { label: "Contact Person", valueKey: "contactPerson", icon: <User size={18} /> },
  { label: "Email Address", valueKey: "email", icon: <Mail size={18} /> },
  { label: "Phone Number", valueKey: "mobileNumber", icon: <Phone size={18} /> },
  { label: "Assigned Employee", valueKey: `assignEmployeeData.name`, icon: <MapPin size={18} /> },
];

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const CompanyProfile = () => {
  const { companyId } = useSelector((state) => state.auth);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [isEditCompleteProfileOpen, setIsEditCompleteProfileOpen] =
    useState(false);

  const dispatch = useDispatch();

  const { company, error, loading } = useSelector(
    (state) => state.companyById
  );

  useEffect(() => {
    if (company?.name) {
        dispatch(updateUser({ name: company.name }));
    }
}, [company?.name, dispatch]);

  useEffect(() => {
    dispatch(
      fetchCompanyDataById(companyId)
    );
  }, [companyId]);

  const closeCompleteProfileModel= () => {
    setIsEditCompleteProfileOpen(false);
    dispatch(fetchCompanyDataById(companyId));
  }
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const companyInitials = useMemo(() => {
    if (!company) return "";
    return company?.name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [company]);

  if (!company) {
    return (
      <div className="min-h-screen px-4 font-sans flex items-center justify-center">
        <p className="text-gray-500">Company not found.</p>
      </div>
    );
  }

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
        <p className="text-gray-500 animate-pulse">Loading company data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ConnectCompany
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={company}
      />
      <div className="w-full space-y-6">

        <PageHeader
          title="Company Profile"
          subTitle="View and manage your company information"
        >
          <div className="flex flex-wrap gap-3">
            {/* <ButtonComponent
              handleButtonClick={() => setIsCompleteProfileOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
            >
              <UserStar size={16} />
              View Complete Profile
            </ButtonComponent> */}

            {company?.status?.toLowerCase() === "pending" ? (
              <ButtonComponent
                handleButtonClick={() => setIsEditCompleteProfileOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-green-700"
              >
                <UserPen size={16} />
                Complete Profile
              </ButtonComponent>
            ) : (
              // <button
              //   disabled
              //   className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed"
              // >
              //   <UserPen size={16} />
              //   Already Completed • Use View Profile
              // </button>
              <ButtonComponent
              handleButtonClick={() => setIsCompleteProfileOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
            >
              <UserStar size={16} />
              View Complete Profile
            </ButtonComponent>
            )}
          </div>
        </PageHeader>

        <div className="grid gap-6 md:grid-cols-[1fr,1.25fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm space-y-2">
            {company?.logo ? (
              <img
                src={company?.logo}
                alt={`${company.name} logo`}
                className="mx-auto h-20 w-20 md:h-32 md:w-32 rounded-2xl object-contain"
              />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-700">
                {companyInitials}
              </div>
            )}
            <p className="mt-4 text-xl font-bold text-gray-900 capitalize">{company.name}</p>
            <h1 className="text-lg font-semibold text-gray-900 capitalize">Company type: {company?.companyType}</h1>
            <p className="text-sm text-gray-500">{company.location}</p>
            <p className="text-sm font-medium text-gray-800 leading-relaxed">Address : {company?.address}, {company?.state}, {company?.pincode}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-600 capitalize" />
              {company.status?.charAt(0).toUpperCase() + company.status?.slice(1)}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {infoFields.map((field) => (
                <div key={field.valueKey} className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    {field.label}
                  </p>
                  <div className="rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow-inner capitalize">
                    {company[field.valueKey] || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {contactFields.map((field) => (
              <div
                key={field.valueKey}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="rounded-2xl bg-white/60 p-2 text-blue-600">
                  {field.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 ">
                    {getNestedValue(company, field.valueKey) || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <ViewCompleteProfile
        isOpen={isCompleteProfileOpen}
        onClose={() => setIsCompleteProfileOpen(false)}
        companyId={companyId}
        companyName={company.name}
      />
      <FPOProfileModal
        isOpen={isEditCompleteProfileOpen}
        onClose={closeCompleteProfileModel}
        companyId={companyId}
      />
    </div>
  );
};

export default CompanyProfile;
