import { Edit, Eye, FileSpreadsheet, Plus, Trash2, Upload, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ButtonComponent from '../../../comman/ButtonComponent';
import AddFarmerMembersModal from '../../../../models/admin/addCompanyFarmerMembers';
import { useParams } from 'react-router-dom';
import TableComponent from '../../../comman/TableComponent';
import FarmerViewModal from '../../../../models/admin/companyFarmerView';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmerMemebrs, fetchFMForExcel } from '../../../../store/actions/farmerMember';
import { Oval } from 'react-loader-spinner';
import FilterBar from '../../../comman/FilterBar';
import Pagination from '../../../comman/Pagination';
import debounce from 'lodash.debounce';
import DeleteFarmerMemberModal from '../../../../models/admin/deleteFarmerMember';
import FarmerDetailsModal from '../../../../models/admin/farmerMembersDetails';
import AddBulkFarmerMemberModal from '../../../../models/admin/addBulkFarmerMembers';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';

export default function FarmerMembers() {
   const {id}=useParams();

  const [farmerMemeberModalOpen, setFarmerMemeberModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage,setCurrentPage]=useState(1)
  const dispatch = useDispatch();

  const [farmerId,setFarmerId] =useState(null);
  const [editModelOpen, setEditModalOpen] = useState(false);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  const { farmerMember, totalPages, error,loading  } = useSelector(
    (state) => state.farmerMember
  );

  const debouncedFetch = useMemo(
    () =>
      debounce((id, searchTerm, currentPage) => {
        dispatch(
          fetchFarmerMemebrs({
            id,
            searchTerm,
            page: currentPage,
          })
        );
      }, 500), 
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(id, searchTerm, currentPage);
    return () => debouncedFetch.cancel();
  }, [id, searchTerm, currentPage]);


  const { farmerMemberForExcel,errorForExcel,loadingForExcel  } = useSelector(
    (state) => state.FMForExcel
  );

  const debouncedFetchForExcel = useMemo(
    () =>
      debounce((id) => {
        dispatch(
          fetchFMForExcel({
            id,
          })
        );
      }, 500), 
    [dispatch]
  );

  useEffect(() => {
    debouncedFetchForExcel(id);
    return () => debouncedFetchForExcel.cancel();
  }, [id]);

  const handleButtonClick = () => {
    setFarmerMemeberModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const[addBuldFarmerModel,setAddBuldFarmerModel] = useState(false);

  const column =[
      {
        label: "Name",
        field: "fullName",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.fullName ?? "-"}</p>
        )
      },
      {
        label: "Mobile",
        field: "mobileNumber",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.mobileNumber ?? "-"}</p>
        )
      },
      {
        label: "Aadhar number",
        field: "aadhaar",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.aadhaar ?? "-"}</p>
        )
      },
      {
        label: "Qualification",
        field: "qualification",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.qualification ?? "-"}</p>
        )
      },
      {
        label: "Folio Number",
        field: "folioNumber",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.folioNumber ?? "-"}</p>
        )
      },
      {
        label: "Village",
        field: "village",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.village ?? "-"}</p>
        )
      },
      {
        label: "View",
        field: "",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <button 
            className=''
            onClick={() => {
              setFarmerId(item?.id);
              setIsModalOpen(true);
            }}
          >
            <Eye className='text-green-500 w-5 h-5'/>
          </button>
        )
      },
      {
        label: "Actions",
        field: "",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
        <div className='flex flex-row items-center gap-2'>
            <button 
              className=''
              onClick={() => {
                setFarmerId(item?.id);
                setEditModalOpen(true);
              }}
            >
              <Edit className='text-blue-500 w-5 h-5'/>
            </button>
            <button 
              className=''
              onClick={() => {
                setFarmerId(item?.id);
                setDeleteModalOpen(true);
              }}
            >
              <Trash2 className='text-red-500 w-5 h-5'/>
            </button>
        </div>
          
        )
      },
  ]

  const handlePageChange=(page)=>{
    setCurrentPage(page)
  };

  const exportToExcel = () => {
      if (!farmerMemberForExcel || farmerMemberForExcel.length === 0) {
        toast.error("No farmer members data available");
        return;
      }
  
      const companyData = farmerMemberForExcel[0]?.companyData;
  
      const tableData = farmerMemberForExcel.map((item, index) => [
        index + 1,

        item?.fullName || "",
        item?.age || "",
        item?.gender || "",
        item?.category || "",
        item?.qualification || "",

        item?.mobileNumber || "",
        item?.pan || "",
        item?.aadhaar || "",
        item?.shareDate || "", 
        item?.faceValue || "",

        item?.noOfShareAlloted || "",
        item?.shareConstribution || "",
        item?.folioNumber || "",
        item?.shareholding || "",
        item?.landHolding || "",

        item?.landRecordNumber || "",      
        item?.village || "",
        item?.block || "",
        item?.tehsil || "",
        item?.district || "",
  
        item?.state || "",
        item?.pincode || "",
      ]);
  
      const worksheet = XLSX.utils.aoa_to_sheet([
        ["Company Name:", companyData?.name || "-"],
        ["Company Type:", companyData?.companyType || "-"],
        ["Email:", companyData?.email || "-"],
        ["Contact No:", companyData?.contactPerson || "-"],
        ["Mobile Number:", companyData?.mobileNumber || "-"],
        [],
        [],
        [
              "Sr No",
              "Name of Shareholder Farmer",
              "Age (in Years)",
              "Gender (Male/ Female)",
              "Social Category (Gen/ OBC/ SC/ ST)",
              "Educational Qualification",

              "Mobile number",
              "Pan",
              "Aadhaar no. (DDDD DDDD DDDD)",
              "Date of Share Capital Contribution / Date of Membership (DD/MM/YYYY)",
              "Face value of each share (in Rs.)",

              "No. of Shares Allotted (Nos.)",
              "Contribution to Share Capital (Rs.)",
              "Distinctive Folio Number",
              "% Shareholding in FPC",
              "Total Landholding (Acres)",

              `Land Record No. (Survey No. / Khsara No.) (If doesn't have land, mention "Landless")`,
              "Name of Village where Farmer resides",
              "Block",
              "Tehsil/ Taluka",
              "District",
              
              "State",
              "PIN Code",
  
        ],
        ...tableData,
      ]);
  
      worksheet["!cols"] = new Array(35).fill({ wch: 18 });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Farmer Member");
  
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      const fileName = `${(companyData?.name || "Company")
        .replace(/\s+/g, "_")}_Farmer-Member_List.xlsx`;
  
      saveAs(data, fileName);
  };

  const handleUploadBulkClick = () => {
    setAddBuldFarmerModel(true);
  };

  if (loading || loadingForExcel) {
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
        <p className="text-gray-500 animate-pulse">Loading Board of director list...</p>
    </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 pb-5'>

      <div className='flex flex-col md:flex-row items-start gap-4 md:items-center justify-between border-b border-gray-300 pb-2'>

        <div className='flex flex-row gap-2 items-center '>
          <Users className="w-5 h-5 text-green-500" />
          <p className='font-semibold'>Members/Shareholders Details</p>
        </div>

        <div className='flex flex-row flex-wrap gap-3 md:gap-5 items-center '>

          <ButtonComponent
            handleButtonClick={handleButtonClick}
            className="bg-blue-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <p>Members/Shareholders</p>
            </div>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={handleUploadBulkClick}
            className="bg-green-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              <p>Add Bulk </p>
            </div>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={exportToExcel}
            className="p-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
          >
                <FileSpreadsheet size={18} /> Export
          </ButtonComponent>
        </div>

      </div>

      {error || errorForExcel && <p>Farmer member get : <span className="text-red-500">
        {error || errorForExcel}</span></p>}

      <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholer={"Search by name or mobile number, pan ,adhar number"}
          >

      </FilterBar>

      {farmerMember &&
      <>
        <div className=''>          
          <TableComponent columns={column} data={farmerMember} />
        </div>

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> 

      </>
      }
      
      <FarmerDetailsModal
        farmerId={farmerId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AddFarmerMembersModal
        isOpen={farmerMemeberModalOpen}
        onClose={() => setFarmerMemeberModalOpen(false)}
        id={id}
      />

      <DeleteFarmerMemberModal
        isOpen={deleteModelOpen}
        onClose={() => setDeleteModalOpen(false)}
        farmerId={farmerId}
        companyId={id}
      />

      <AddBulkFarmerMemberModal
        isOpen={addBuldFarmerModel}
        onClose={() => setAddBuldFarmerModel(false)}
        id={id}
      />

      <AddFarmerMembersModal
        isOpen={editModelOpen}
        onClose={() => setEditModalOpen(false)}
        id={id}
        farmerId={farmerId}
      />
    </div>
  )
}
