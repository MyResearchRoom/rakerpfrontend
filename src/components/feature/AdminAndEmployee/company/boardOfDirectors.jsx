import { Circle, Download, Edit, Eye, FileSpreadsheet, Plus, Sheet, Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom';
import { boardOfDirectorMembers } from '../../../../data/companyBoardOfDirector';
import TableComponent from '../../../comman/TableComponent';
import DirectorViewModal from '../../../../models/admin/companyDirectorView';
import ButtonComponent from '../../../comman/ButtonComponent';
import AddBoardDirectorModal from '../../../../models/admin/addCompanyBoardDirectors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoardOfDirectors, fetchBoardOfDirectorsForExcel } from '../../../../store/actions/boardOfDirector';
import { fetchFarmerMemebrs } from '../../../../store/actions/farmerMember'; 
import Pagination from '../../../comman/Pagination';
import FilterBar from '../../../comman/FilterBar';
import SelectField from '../../../comman/SelectField';
import { Oval } from 'react-loader-spinner';
import DeleteDirectorModal from '../../../../models/admin/deleteBoardOfDirector';
import DirectorDetailsModal from '../../../../models/admin/boardOfDirectorsDetails';
import AddBulkBoardDirectorModal from '../../../../models/admin/addBulkBOD';

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';

export default function BoardOfDirectorsManagement() {

  const {id}=useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage,setCurrentPage]=useState(1)
  const dispatch = useDispatch();
  const [role,setRole]=useState("");

  const { boardOfDirectors, totalPages, error,loading  } = useSelector(
    (state) => state.boardOfDirector
  );

  useEffect(() => {
      dispatch(
        fetchBoardOfDirectors({
          id,
          role,
          searchTerm,
          page: currentPage,
        })
      );
  }, [id,searchTerm,role,currentPage,dispatch]);

   const {boardOfDirectorsForExcel,errorForExcel,loadingForExcel} = useSelector(
    (state) => state.BODForExcel
  );

  useEffect(() => {
      dispatch(
        fetchBoardOfDirectorsForExcel({
          id,
        })
      );
  }, [id,dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directorId,setDirectorId] =useState(null);
  const [editModelOpen, setEditModalOpen] = useState(false);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  const[addBuldBODModel,setAddBuldBODModel] = useState(false);

  const column =[
      {
        label: "Role",
        field: "role",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className='capitalize'>{item?.role ?? "-"}</p>
        )
      },
      {
        label: "Holding Since",
        field: "holdingSince",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.holdingSince ?? "-"}</p>
        )
      },
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
        field: "mobile",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.mobile ?? "-"}</p>
        )
      },
      {
        label: "Email",
        field: "email",
        className: "p-2 text-sm whitespace-normal break-words",
        render: (item) => (
          <p className=''>{item?.email ?? "-"}</p>
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
              setDirectorId(item?.id);
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
                setDirectorId(item?.id);
                setEditModalOpen(true);
              }}
            >
              <Edit className='text-blue-500 w-5 h-5'/>
            </button>
            <button 
              className=''
              onClick={() => {
                setDirectorId(item?.id);
                setDeleteModalOpen(true);
              }}
            >
              <Trash2 className='text-red-500 w-5 h-5'/>
            </button>
        </div>
          
        )
      },
      
  ]

  const [directorModalOpen, setDirectorModalOpen] = useState(false);

  const handleButtonClick = () => {
    setDirectorModalOpen(true);
  };
  const handleUploadBulkClick = () => {
    setAddBuldBODModel(true);
  };

  const handlePageChange=(page)=>{
    setCurrentPage(page)
  };

  const exportToExcel = () => {
    if (!boardOfDirectorsForExcel || boardOfDirectorsForExcel.length === 0) {
      toast.error("No Board Of Directors data available");
      return;
    }

    console.log("boardOfDirectorsForExcel",boardOfDirectorsForExcel);
    

    const companyData = boardOfDirectorsForExcel[0]?.companyData;

    const tableData = boardOfDirectorsForExcel.map((item, index) => [
      index + 1,
      item?.role || "",
      item?.holdingSince || "",
      item?.fullName || "",
      item?.age || "",
      item?.gender || "",

      item?.category || "",
      item?.qualification || "",
      item?.background || "",
      item?.mobile || "",
      item?.email || "",

      item?.skill || "",
      item?.dsc || "",
      // item?.dinIssued || "",
      item?.dinNumber || "",
      item?.farmerCert || "",

      // item?.isSanchalak || "",
      item?.folioNumber || "",
      item?.pan || "",
      item?.aadhaar || "",
      item?.shareDate || "",

      item?.faceValue || "",
      item?.shares || "",
      item?.capital || "",
      item?.shareholding || "",
      item?.land || "",

      item?.landRecord || "",
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
            "Role (Director/Chairman)",
            "Holding Position Since (Date - DD/MM/YYYY)",
            "Full Name of BoD",
            "Age (in Years)",
            "Gender (Male/ Female)",

            "Social Category (Gen/ OBC/ SC/ ST)",
            "Educational Qualification",
            "Does this BoD have B.Sc. Agri or B.Sc. Chemistry background?",
            "Mobile Number",

            "E-mail ID",
            "Key Skill of this BoD",
            "Is DSC issued to the BoD",
            // "Is DIN issued to the BoD?",
            "DIN Number",

            "Farmer/ Producer Certificate collected?",
            // "Is Sanchalak/ Sahayyak (Yes/No)",
            "Distinctive Folio Number",
            "PAN",
            "Aadhaar no. (if available) (DDDD DDDD DDDD)",

            "Date of Share Capital Contribution / Date of Membership (DD/MM/YYYY)",
            "Face value of each share (in Rs.)",
            "No. of Shares Allotted (Nos.)",
            "Contribution to Share Capital (Rs.)",

            "% Shareholding in FPC",
            "Total Landholding (Acres)",
            `Land Record No. (Survey No. / Khsara No.) (If doesn't have land, mention "Landless)`,
            "Name of Village where this BoD Farmer resides",

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Board Of Directors");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${(companyData?.name || "Company")
      .replace(/\s+/g, "_")}_BOD_List.xlsx`;

    saveAs(data, fileName);
  };
  const handleCloseModal = () => {
    setDirectorModalOpen(false);

    dispatch(fetchBoardOfDirectors({
      id,
      searchTerm: "",
      page: "",
    }));
  };

  const handleCloseBulkModal = () => {
    setAddBuldBODModel(false)

    dispatch(fetchBoardOfDirectors({
      id,
      searchTerm: "",
      page: "",
    }));
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
        
        <div className='flex flex-row items-center '>
          <div className="relative bg-white/20 text-[#4A7C59] rounded-full p-4 flex items-center justify-center text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-bold">
            <Circle className="absolute w-6 h-6 text-blue-500" />

            <Circle className="absolute w-4 h-4 text-blue-500" />

            <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
          </div>
          <p className='font-semibold'>Board Of Directors management</p>
        </div>


        <div className='flex flex-row flex-wrap gap-3 md:gap-5 items-center '>
          <ButtonComponent
            handleButtonClick={handleButtonClick}
            className="bg-blue-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <p>Board of Directors</p>
            </div>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={handleUploadBulkClick}
            className="bg-green-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              <p>Add Bulk BOD</p>
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

      {error || errorForExcel && <p>Board of director get : <span className="text-red-500">{error || errorForExcel}</span></p>}

      <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholer={"Search by name or mobile number"}
          >

            <div className="w-full sm:w-[200px]">
              <SelectField
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                optionLabel='Select role' 
                options={[
                {value:'director',label:"Director"},
                {value:'chairman',label:"Chairman"},
                ]}
                labelKey="label"
                valueKey="value"
            />
            </div>

      </FilterBar>

      {boardOfDirectors &&
      <>
        <div className=''>          
          <TableComponent columns={column} data={boardOfDirectors} />
        </div>

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> 
      </>
      }

      <DirectorDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        directorID={directorId}
      />

      <AddBoardDirectorModal
        isOpen={directorModalOpen}
        onClose={handleCloseModal}
        id={id}
      />

      <DeleteDirectorModal
        isOpen={deleteModelOpen}
        onClose={() => setDeleteModalOpen(false)}
        directorId={directorId}
        companyId={id}
      />

      <AddBulkBoardDirectorModal
        isOpen={addBuldBODModel}
        onClose={handleCloseBulkModal}
        id={id}
      />

      <AddBoardDirectorModal
        isOpen={editModelOpen}
        onClose={() => setEditModalOpen(false)}
        id={id}
        directorID={directorId}
      />


    </div>
  )
}
