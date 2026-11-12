import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Plus, Upload, FileSpreadsheet, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import DirectorDetailsModal from '../../models/admin/boardOfDirectorsDetails';
import AddBoardDirectorModal from '../../models/admin/addCompanyBoardDirectors';
import AddBulkBoardDirectorModal from '../../models/admin/addBulkBOD';

import SelectField from "../../components/comman/SelectField";
import TableComponent from "../../components/comman/TableComponent";
import ButtonComponent from "../../components/comman/ButtonComponent";
import Pagination from "../../components/comman/Pagination";
import PageHeader from "../../components/comman/PageHeader";
import FilterBar from "../../components/comman/FilterBar";

import { fetchBoardOfDirectors, fetchBoardOfDirectorsForExcel } from "../../store/actions/boardOfDirector";
import { Oval } from "react-loader-spinner";

const BoardOfDirectors = () => {
  const { companyId } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRole, setActiveRole] = useState("");
  const dispatch = useDispatch();

  const [editDirectorId, setEditDirectorId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { boardOfDirectors, totalPages, error, loading } = useSelector(
    (state) => state.boardOfDirector
  );

  const { boardOfDirectorsForExcel, loadingForExcel } = useSelector(
    (state) => state.BODForExcel
  );

  useEffect(() => {
    dispatch(
      fetchBoardOfDirectors({
        id: companyId,
        role: activeRole,
        searchTerm,
        page: currentPage,
      })
    );
  }, [companyId, searchTerm, activeRole, currentPage, dispatch]);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchBoardOfDirectorsForExcel({ id: companyId }));
    }
  }, [companyId, dispatch]);

  const [directorId, setDirectorId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const roles = [
    { label: "Director", value: "director" },
    { label: "Chairman", value: "chairman" },
  ];

  const handlePageChange = (page) => setCurrentPage(page);

  const refreshList = () => {
    dispatch(fetchBoardOfDirectors({ id: companyId, searchTerm: "", page: "" }));
  };

  const exportToExcel = () => {
    if (!boardOfDirectorsForExcel || boardOfDirectorsForExcel.length === 0) {
      toast.error("No Board Of Directors data available");
      return;
    }

    const companyData = boardOfDirectorsForExcel[0]?.companyData;

    const tableData = boardOfDirectorsForExcel.map((item, index) => [
      index + 1,
      item?.role || "-",
      item?.holdingSince || "-",
      item?.fullName || "-",
      item?.age || "-",
      item?.gender || "-",
      item?.category || "-",
      item?.qualification || "-",
      item?.background || "-",
      item?.mobile || "-",
      item?.email || "-",
      item?.skill || "-",
      item?.dsc || "-",
      item?.dinIssued || "-",
      item?.dinNumber || "-",
      item?.farmerCert || "-",
      item?.isSanchalak || "-",
      item?.folioNumber || "-",
      item?.pan || "-",
      item?.aadhaar || "-",
      item?.shareDate || "-",
      item?.faceValue || "-",
      item?.shares || "-",
      item?.capital || "-",
      item?.shareholding || "-",
      item?.land || "-",
      item?.landRecord || "-",
      item?.village || "-",
      item?.block || "-",
      item?.tehsil || "-",
      item?.district || "-",
      item?.state || "-",
      item?.pincode || "-",
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
        "Sr No", "Role (Director/Chairman)", "Holding Position Since (Date - DD/MM/YYYY)",
        "Full Name of BoD", "Age (in Years)", "Gender (Male/ Female)",
        "Social Category (Gen/ OBC/ SC/ ST)", "Educational Qualification",
        "Does this BoD have B.Sc. Agri or B.Sc. Chemistry background?",
        "Mobile Number", "E-mail ID", "Key Skill of this BoD",
        "Is DSC issued to the BoD", "Is DIN issued to the BoD?", "If yes, provide DIN no.",
        "Farmer/ Producer Certificate collected?", "Is Sanchalak/ Sahayyak (Yes/No)",
        "Distinctive Folio Number", "PAN", "Aadhaar no. (if available) (DDDD DDDD DDDD)",
        "Date of Share Capital Contribution / Date of Membership (DD/MM/YYYY)",
        "Face value of each share (in Rs.)", "No. of Shares Allotted (Nos.)",
        "Contribution to Share Capital (Rs.)", "% Shareholding in FPC",
        "Total Landholding (Acres)",
        `Land Record No. (Survey No. / Khsara No.) (If doesn't have land, mention "Landless)`,
        "Name of Village where this BoD Farmer resides",
        "Block", "Tehsil/ Taluka", "District", "State", "PIN Code",
      ],
      ...tableData,
    ]);

    worksheet["!cols"] = new Array(35).fill({ wch: 18 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Board Of Directors");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${(companyData?.name || "Company").replace(/\s+/g, "_")}_BOD_List.xlsx`;
    saveAs(data, fileName);
  };

  const columns = [
    {
      label: "Role",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => (
        <span className="text-gray-800 capitalize">{item.role || "—"}</span>
      ),
    },
    {
      label: "Holding Since",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.holdingSince || "—",
    },
    {
      label: "Name",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => (
        <span className="text-gray-900">{item.fullName || "—"}</span>
      ),
    },
    {
      label: "Mobile",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.mobile || "—",
    },
    {
      label: "Email",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.email || "—",
    },
    {
      label: "Village",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.village || "—",
    },
    {
      label: "Action",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-center",
      render: (item) => (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDirectorId(item?.id);
              setIsViewModalOpen(true);
            }}
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-50 rounded p-1"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditDirectorId(item?.id);
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded p-1"
          >
            <Pencil size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Company details are not available.
      </div>
    );
  }

  if (loading || loadingForExcel) {
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
        <p className="text-gray-500 animate-pulse">Loading Board of Directors list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">

      <div className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between border-b border-gray-300 pb-2">
        <PageHeader
          title="Board of Directors Management"
          subTitle="Manage board members for your company. Add or export director records."
        />

        <div className="flex flex-row items-center gap-3 md:gap-5 whitespace-nowrap">
          <ButtonComponent
            handleButtonClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <p>Board of Directors</p>
            </div>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={() => setIsBulkModalOpen(true)}
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

      <div className="bg-white p-2 md:p-3 lg:p-4 rounded-md border border-gray-300 space-y-4">

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer={"Search by name or mobile number"}
        >
          <div className="w-full sm:w-[200px]">
            <SelectField
              name="activeRole"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              optionLabel="Select role"
              options={roles}
              labelKey="label"
              valueKey="value"
            />
          </div>
        </FilterBar>

        {error && (
          <p>Board of director error: <span className="text-red-500">{error}</span></p>
        )}

        {boardOfDirectors && (
          <>
            <TableComponent columns={columns} data={boardOfDirectors} />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      <DirectorDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        directorID={directorId}
      />

      {/* Add Modal */}
      <AddBoardDirectorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          refreshList();
        }}
        id={companyId}
      />

      <AddBoardDirectorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditDirectorId(null);
          refreshList();
        }}
        id={companyId}
        directorID={editDirectorId}
      />

      {/* Bulk Add Modal */}
      <AddBulkBoardDirectorModal
        isOpen={isBulkModalOpen}
        onClose={() => {
          setIsBulkModalOpen(false);
          refreshList();
        }}
        id={companyId}
      />
    </div>
  );
};

export default BoardOfDirectors;
