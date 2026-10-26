import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/comman/PageHeader";
import ButtonComponent from "../../components/comman/ButtonComponent";
import { Lock, MapPin, Plus, Unlock } from "lucide-react";
import { companyData as initialData } from "../../data/companyData";
import TableComponent from "../../components/comman/TableComponent";
import FilterBar from "../../components/comman/FilterBar";
import useDebounce from "../../hooks/useDebounce";
import ConnectCompany from "../../models/connectCompany";

import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuFilePen } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FPOProfileModal from "../../models/admin/profile-modal/FPOProfileModal";
import DeleteConfirmationModal from "../../models/admin/DeleteConfirmationModal";
import { chnageStatusOfCompany, getCompaniesList } from "../../services/companyService";

import Pagination from "../../components/comman/Pagination";
import SelectField from "../../components/comman/SelectField";
import { getAllEmployees } from "../../services/user";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../store/actions/companyAction";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { ADMIN, EMPLOYEE } from "../../constants/role";

const companyTypes = [
    { label: "Private Ltd", value: "private_ltd" },
    { label: "Public Ltd", value: "public_ltd" },
    { label: "LLP", value: "llp" },
    { label: "OPC", value: "opc" },
    { label: "Partnership", value: "partnership" },
    { label: "Proprietorship", value: "proprietorship" },
    { label: "Producer Company", value: "producer_company" },
    { label: "Section 8 Company", value: "section8" },
    { label: "Trust", value: "trust" },
    { label: "Society", value: "society" },
    { label: "Cooperative", value: "cooperative" },
    { label: "Government", value: "government" },
    { label: "Producer Organisation", value: "producer_organisation" },
    { label: "Other", value: "other" }
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user,role } = useSelector((state) => state.auth);
  const [currentPage,setCurrentPage]=useState(1)
  // const [totalPages,setTotalPages]=useState(null);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // const [companies, setCompanies] = useState(initialData);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyType,setCompanyType]=useState("");
  const [companyConnectModel, setCompanyConnectModel] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileCompanyId, setProfileCompanyId] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [status,setStatus]=useState("");
  const [employeeId,setEmployeeId]=useState("");
  const [employees, setEmployees] = useState([]);
  const dropdownRef = useRef(null);
  const { companies, totalPages, error, loading } = useSelector(
    (state) => state.companyData
  );

  useEffect(() => {
    dispatch(
      fetchCompanies({
        searchTerm,
        companyType:companyType,
        status,
        employeeId,
        page: currentPage,
      })
    );
  }, [searchTerm, currentPage, status, employeeId,companyType, dispatch]);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(()=>{
    
  // },[status,employeeId,companyType]);

  const handlePageChange=(page)=>{
    setCurrentPage(page)
  }

  const fetchEmployee=async()=>{
        try {
          const response=await getAllEmployees({page:"",limit:"all"});
          // console.log("Employee list",response);
          
          if(response){
            setEmployees(response?.employees);
          }
        } catch (error) {
          toast.error(error)
        }
  }
          
    useEffect(()=>{
      // console.log("role:", role);
      if( role === ADMIN && employees.length === 0) fetchEmployee();
    },[role,employees.length ])

  const handleToggleBlock = async (companyId) => {
  if(!companyId) return;
  try {
    const res=await chnageStatusOfCompany(companyId);
    if(res){
      toast.success(res || "Company status chnaged");
        dispatch(fetchCompanies({
          searchTerm: '',
          status: '',
          employeeId: '',
          page: '',
        }));
        setOpenDropdownId(null);
    }
    else{
      toast.warn("Something went wrong");
    }

  } catch (error) {
    console.log(error);
  }
};

  const column = [
    {
      label: "Company name",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <div className="flex flex-row items-center gap-2 min-w-0 max-w-md">
          <div className="bg-blue-100 h-8 w-8 text-[#35a8eb] rounded-full text-sm font-medium flex justify-center items-center">
            {item?.name
              ?.split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="font-medium capitalize break-all">
              {item?.name}{" "}
              {/* <span className="font-medium text-sm uppercase">{item?.companyType}</span> */}
            </p>
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-sm text-gray-500 break-words min-w-0">
                {item?.address}
              </span>
            </div>
            
          </div>
        </div>
      ),
    },
    {
      label: "Type",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
          <span className="font-medium uppercase">{item?.companyType}</span>
      ),
    },
    // {
    //   label: "GSTIN",
    //   field: "gstin",
    //   className: "p-2 text-sm whitespace-normal break-words",
    // },
    {
      label: "Contact Person",
      field: "estimatedBidValue",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium capitalize">{item?.contactPerson}</span>
          <span className="text-sm text-gray-500 break-all">{item?.email}</span>
        </div>
      ),
    },
    {
      label: "Assigned Employee",
      field: "assignedEmployee",
      className: "p-2 text-sm whitespace-normal break-words capitalize",
      render: (item) => <span>{item?.assignEmployeeData?.name || "----"}</span>,
    },
    {
      label: "Status",
      field: "status",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize border
            ${item?.status === "active"
              ? "bg-green-100 text-green-700 border-green-300"
              : item?.status === "pending"
                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                : item?.status === "inactive"
                  ? "bg-red-100 text-red-700 border-red-300" 
                  : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
        >
          {item?.status}
        </span>
      ),
    },
    {
      label: "Actions",
      field: "status",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item, index) => (
        <div className="relative">

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(openDropdownId === index ? null : index);
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <BsThreeDotsVertical />
          </button>

          {openDropdownId === index && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/companies/${item?.id}`, { state: item });
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
              >
                <IoEyeOutline /> View Details
              </button>

              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileCompanyId(item?.id);
                  setIsProfileModalOpen(true);
                  setOpenDropdownId(null);
                }}
              >
                <AiOutlineFileDone /> Complete Profile
              </button>

              <div className="">
              {item?.status !== "pending" && (
                <button
                  onClick={() => handleToggleBlock(item?.id)}
                  className="flex items-center gap-2 w-full text-sm"
                >
                  {item?.status === "inactive" ? (
                    <div className="flex flex-row items-center gap-1 border border-green-500 w-full px-3 py-2 hover:bg-green-50 text-green-600 rounded-md hover:font-semibold">
                       <Unlock size={16} /> 
                      <p>Unblock</p>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-1 border border-red-500 w-full px-3 py-2 hover:bg-red-50 text-red-500 rounded-md hover:font-semibold">
                      <Lock size={16} />
                      <p>Block</p>
                    </div>
                  )}
                </button>
              )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCompany(item?.id);
                  setCompanyConnectModel(true);
                  setOpenDropdownId(null);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
              >
                <LuFilePen /> Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCompanyToDelete(item);
                  setIsDeleteModalOpen(true);
                  setOpenDropdownId(null);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <MdDelete /> Delete
              </button>

            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return(
    <div className="flex flex-col gap-2 justify-center items-center h-40">
        <Oval
            height={60}
            width={60}
            color="#2563eb"
            secondaryColor="#93c5fd"
            strokeWidth={4}
            strokeWidthSecondary={4}
        />
        <p className="text-gray-500 animate-pulse">Loading companies list...</p>
    </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
        <PageHeader
          title="Companies"
          subTitle="Manage all connected companies"
        >
          <div className="flex flex-row flex-wrap gap-2">
            <ButtonComponent
              handleButtonClick={handleButtonClick}
              className="bg-blue-600 p-2 rounded-md"
            >
              <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                <p>Connect Company</p>
              </div>
            </ButtonComponent>
          </div>
        </PageHeader>

        <div className="bg-white p-2 md:p-3 lg:p-4 rounded-md border border-gray-300 space-y-4">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholer={"Search by company name or GSTIN number"}
            setCurrentPage={setCurrentPage}
          >
            {role!== EMPLOYEE &&
            <div className="w-full sm:w-[200px]">
              
                <SelectField
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    setCurrentPage(1);
                  }}
                  name="employeeId"
                  value={employeeId}
                  optionLabel={"Select assign employee"}
                  options={employees}
                  labelKey="name" 
                  valueKey={"id"}
                />
              
            </div>
            }

            <div className="w-full sm:w-[200px]">
              <SelectField
                name="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                optionLabel='Select status' 
                options={[
                {value:'pending',label:"Pending"},
                {value:'active',label:"Active"},
                {value:'inactive',label:"Inactive"},
                ]}
                labelKey="label"
                valueKey="value"
            />
            </div>

            <div className="w-full sm:w-[200px]">
              <SelectField
                name="companyType"
                options={companyTypes} 
                optionLabel='Select company type' 
                value={companyType}
                onChange={(e) =>{ 
                  setCompanyType(e.target.value); 
                  setCurrentPage(1);
                }}
                labelKey="label" 
                valueKey="value"
              />
            </div>

          </FilterBar>

          {error && <p>Companies get : <span className="text-red-500">{error}</span></p>}

          {companies &&
          <>
          <div className="hidden md:block">
            <TableComponent columns={column} data={companies} />
          </div>
          <div className="md:hidden mt-4 space-y-4">
            {companies.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
                <div className="flex flex-col justify-between items-start space-y-3">
                  <div>
                    <p className="text-sm font-medium break-all">{item.name}</p>
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs text-gray-500 break-words min-w-0">
                        {item?.address}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === "active"
                        ? "text-green-700 bg-green-100"
                        : item.status === "pending"
                          ? "text-yellow-700 bg-yellow-100"
                          : "text-red-700 bg-red-100"
                      }`}
                  >
                    Status: {item.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">GSTIN</div>
                <div className="text-sm font-medium text-gray-800">{item.gstin}</div>
                <div className="text-xs text-gray-400">Contact Person</div>
                <div className="text-sm font-medium text-gray-800">{item.contactPerson}</div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/companies/${item?.id}`, { state: item })}
                    className="text-xs font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-2 text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setProfileCompanyId(item?.id);
                      setIsProfileModalOpen(true);
                    }}
                    className="text-xs font-semibold text-white bg-blue-600 rounded-full px-3 py-2 text-center"
                  >
                    Complete Profile
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCompany(item);
                      setCompanyConnectModel(true);
                    }}
                    className="flex-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-full px-3 py-1 text-center"
                  >
                    <LuFilePen className="inline-block mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setCompanyToDelete(item);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex-1 text-xs font-semibold text-red-600 border border-red-200 rounded-full px-3 py-1 text-center"
                  >
                    <MdDelete className="inline-block mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
          }
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> 
        </div>
      </div>

      <ConnectCompany
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConnectCompany
        isOpen={companyConnectModel}
        onClose={() => setCompanyConnectModel(false)}
        initialData={selectedCompany}
        // employeeId={ role===EMPLOYEE ? user.id : null}
      />

      <FPOProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setProfileCompanyId(null);
        }}
        companyId={profileCompanyId}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        company={companyToDelete}  // ✅ pass state updater
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
      />
    </>
  );
};

export default Companies;
