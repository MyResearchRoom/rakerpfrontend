import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, MapPin, User, Edit } from "lucide-react";
import NestedTabHeader from "../../components/comman/NestedTabHeader";
import ConnectCompany from "../../models/connectCompany";
import { getCompanyById } from "../../services/companyService";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { fetchCompanyDataById } from "../../store/actions/companyAction";
import { useDispatch, useSelector } from "react-redux";

const CompanyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //   const [company,setCompany] =useState({});
    const [openModal, setOpenModal] = useState(false);
    //   const [loading,setLoading]=useState(false);

    const { company, error, loading } = useSelector(
        (state) => state.companyById
    );

    useEffect(() => {
        console.log("Company Data:", company);
    }, [company]);

    useEffect(() => {
        dispatch(
            fetchCompanyDataById(id)
        );
    }, [id]);

    const handleEdit = () => {
        setOpenModal(true);
    };

    //     const fetchCompanyById=async()=>{
    //     try {
    //         setLoading(true);  
    //         const response=await getCompanyById(id);
    //         if(response){
    //             setCompany(response);
    //         }
    //     } catch (error) {
    //       toast.error(error)
    //     }finally {
    //         setLoading(false); 
    //     }
    //   }

    //   useEffect(() => {
    //     if(id){
    //       fetchCompanyById();
    //     }
    //   }, [id]);

    const tabs = [
        { label: 'Board of directors Management', path: 'boardOfDirectors', isIndex: true },
        { label: 'Members/Shareholders Details', path: 'farmerMemebrs' },
        // { label: 'Compliance', path: 'compliance' },
        //   {label:'Invoices',path:'invoices'},
        //   {label:'Receipts',path:'receipts'},
    ]

    const formatStatusLabel = (value) => {
        const normalized = (value || "inactive").toLowerCase();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    };

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
        <div className="min-h-screen px-4 font-sans">

            <div className="md:hidden mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 transition"
                >
                    ← Back
                </button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-5">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">

                        {/* Company Logo */}
                        <div className="w-16 h-16 flex  justify-center rounded-lg ">
                            {company?.logo ? (
                                <img
                                    src={company?.logo}
                                    alt={`${company?.name} logo`}
                                    className="h-16 w-16 object-contain"
                                />
                            ) : (
                                <div className="bg-blue-100 text-blue-700 w-full h-full flex items-center justify-center font-bold text-xl">
                                    {company?.name
                                        ?.split(" ")
                                        .map((word) => word[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Company Name */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">
                                {company.name}
                            </h1>

                            <p className="text-gray-500 text-sm">
                                Complete company profile and documents
                            </p>
                        </div>
                    </div>

                    {/* Mobile Edit Button */}
                    <div className="md:hidden">
                        <button
                            onClick={handleEdit}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
                        >
                            <Edit size={16} />
                            Edit Company
                        </button>
                    </div>
                </div>

                {/* Desktop Edit Button */}
                <button
                    onClick={handleEdit}
                    className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    <Edit size={16} />
                    Edit Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Company Information</h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">

                            <span
                                className={`inline-block px-3 py-1 text-xs font-medium capitalize rounded 
                                    ${company.status?.toLowerCase() === 'active'
                                        ? 'text-green-700 bg-green-100'
                                        : company.status?.toLowerCase() === 'pending'
                                            ? 'text-yellow-700 bg-yellow-100'
                                            : 'text-red-700 bg-red-100'
                                    }`}
                            >
                                {company.status || "Inactive"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">GSTIN</p>
                                <p className="text-sm font-medium text-gray-800">{company.gstin}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">PAN</p>
                                <p className="text-sm font-medium text-gray-800">{company.pan}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Connected Date</p>
                                <p className="text-sm font-medium text-gray-800">{company.connectedDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Assigned Employee</p>
                                <p className="text-sm font-medium text-gray-800 capitalize">
                                    {company?.assignEmployeeData?.name}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold">Company Type</p>
                                <p className="text-sm font-medium text-gray-800 capitalize">{company.companyType}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Details Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-6">Contact Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                        <div className="flex gap-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 h-fit"><User size={20} /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold">Contact Person</p>
                                <p className="text-sm font-medium text-gray-800 capitalize">{company.contactPerson}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600 h-fit"><Mail size={20} /></div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-semibold">Email</p>
                                <p className="text-sm font-medium text-gray-800 break-all">
                                    {company.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600 h-fit"><Phone size={20} /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold">Phone</p>
                                <p className="text-sm font-medium text-gray-800">{company.mobileNumber}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 h-fit"><MapPin size={20} /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold">Address</p>
                                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                    {company?.address}, {company?.city}, {company?.state}. {company?.pincode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border rounded-lg px-5 py-2 mb-10 space-y-4">
                <div className="sm:hidden">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                        <NestedTabHeader tabs={tabs} basePath={`companies/${company?.id}`} useRoutes={true} />
                    </div>
                </div>
                <div className="hidden sm:block">
                    <NestedTabHeader tabs={tabs} basePath={`companies/${company?.id}`} useRoutes={true} />
                </div>

                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:border-none sm:shadow-none sm:p-0">
                    <Outlet />
                </div>
            </div>

            <ConnectCompany
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                initialData={company?.id}
            />
        </div>
    );

};

export default CompanyDetails;
