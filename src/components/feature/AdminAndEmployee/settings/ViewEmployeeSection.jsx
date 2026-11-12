import React, { act, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { employeeList as defaultEmployees } from "../../../../data/employeeData";
import { Edit, Eye, Pencil, Trash2 } from "lucide-react";
import FilterBar from "../../../comman/FilterBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployee } from "../../../../store/actions/employeeList";
import { Oval } from "react-loader-spinner";
import Pagination from "../../../comman/Pagination";
import TableComponent from "../../../comman/TableComponent";
import EmployeeDeleteModal from "../../../../models/admin/deleteEmployeeModel";


const ViewEmployeeSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage,setCurrentPage]=useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState(null);
  const [selectedEmployeeId,setSelectedEmployeeId]=useState(null);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const { employees, error,loading,totalPages } = useSelector(
    (state) => state.empployeeData
  );

  useEffect(() => {
          dispatch(
          fetchEmployee({
              searchTerm:searchTerm,
              page: currentPage,
            })
          );
  }, [currentPage,searchTerm]);


  const handleEdit = (id) => {
    navigate(`/setting/addemployee?employeeId=${id}`);
  };


  const column = [
    {
      label: "Name",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <p className="">{item?.name ?? "-"}</p>
      ),
    },
    {
      label: "Email",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <p className="">{item?.email ?? "-"}</p>
      ),
    },
    {
      label: "Mobile Number",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <p className="">{item?.mobileNumber ?? "-"}</p>
      ),
    },
    {
      label: "Status",
      field: "status",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize
            ${item?.isBlock
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
            }`}
        >
          {item?.isBlock ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      label: "Actions",
      field: "status",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <div className='flex flex-row items-center gap-2'>
            <button 
              className=''
              onClick={() => handleEdit(item?.id)}
            >
              <Edit className='text-blue-500 w-5 h-5'/>
            </button>
            <button 
              className=''
              onClick={() => {
                setSelectedEmployeeId(item?.id);
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2 className='text-red-500 w-5 h-5'/>
            </button>
        </div>
      ),
    },
  ];

  const handlePageChange=(page)=>{
    setCurrentPage(page)
  }

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
    <div >
      <div className="bg-white p-2 md:p-3 lg:p-4 rounded-md border border-gray-300 space-y-4">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholer={"Search by name or email"}
          >
          </FilterBar>

          {error && <p>Employee get : <span className="text-red-500">{error}</span></p>}

          {employees &&
          <>
            <div className="">
              <TableComponent columns={column} data={employees} />
            </div>
          </>
          }
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} /> 

      </div>


      <EmployeeDeleteModal
        isOpen={isDeleteModalOpen}
        employeeId={selectedEmployeeId}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
};

export default ViewEmployeeSection;
