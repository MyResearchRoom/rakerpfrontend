import React, { useEffect, useMemo, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Plus, Upload, FileSpreadsheet, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import debounce from "lodash.debounce";

import Pagination from "../../components/comman/Pagination";
import PageHeader from "../../components/comman/PageHeader";
import TableComponent from "../../components/comman/TableComponent";
import ButtonComponent from "../../components/comman/ButtonComponent";
import FilterBar from "../../components/comman/FilterBar";

import FarmerDetailsModal from "../../models/admin/farmerMembersDetails";
import AddFarmerMembersModal from "../../models/admin/addCompanyFarmerMembers";
import AddBulkFarmerMemberModal from "../../models/admin/addBulkFarmerMembers";

import { fetchFarmerMemebrs, fetchFMForExcel } from "../../store/actions/farmerMember";

const CompanyFarmerMembers = () => {
  const { companyId } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const [farmerId, setFarmerId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [editFarmerId, setEditFarmerId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { farmerMember, totalPages, error, loading } = useSelector(
    (state) => state.farmerMember
  );

  const { farmerMemberForExcel, loadingForExcel } = useSelector(
    (state) => state.FMForExcel
  );

  const debouncedFetch = useMemo(
    () =>
      debounce((id, searchTerm, page) => {
        dispatch(fetchFarmerMemebrs({ id, searchTerm, page }));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(companyId, searchTerm, currentPage);
    return () => debouncedFetch.cancel();
  }, [companyId, searchTerm, currentPage]);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchFMForExcel({ id: companyId }));
    }
  }, [companyId, dispatch]);

  const handlePageChange = (page) => setCurrentPage(page);

  const refreshList = () => {
    dispatch(fetchFarmerMemebrs({ id: companyId, searchTerm: "", page: "" }));
  };

  const exportToExcel = () => {
    if (!farmerMemberForExcel || farmerMemberForExcel.length === 0) {
      toast.error("No farmer members data available");
      return;
    }

    const companyData = farmerMemberForExcel[0]?.companyData;

    const tableData = farmerMemberForExcel.map((item, index) => [
      index + 1,
      item?.fullName || "-",
      item?.age || "-",
      item?.gender || "-",
      item?.category || "-",
      item?.qualification || "-",
      item?.mobileNumber || "-",
      item?.pan || "-",
      item?.aadhaar || "-",
      item?.shareDate || "-",
      item?.faceValue || "-",
      item?.noOfShareAlloted || "-",
      item?.shareConstribution || "-",
      item?.folioNumber || "-",
      item?.shareholding || "-",
      item?.landHolding || "-",
      item?.landRecordNumber || "-",
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
        "Sr No",
        "Name of Shareholder Farmer",
        "Age (in Years)",
        "Gender (Male/ Female)",
        "Social Category (Gen/ OBC/ SC/ ST)",
        "Educational Qualification",
        "Mobile number",
        "Pan",
        "Aadhaar no.",
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

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `${(companyData?.name || "Company").replace(/\s+/g, "_")}_Farmer-Member_List.xlsx`;
    saveAs(data, fileName);
  };

  const columns = [
    {
      label: "Name",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => (
        <span className="text-gray-900">{item.fullName || "—"}</span>
      ),
    },
    {
      label: "Age",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.age ?? "—",
    },
    {
      label: "Category",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.category || "—",
    },
    {
      label: "Village",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => item.village || "—",
    },
    {
      label: "Shareholding",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) =>
        item.shareholding !== undefined && item.shareholding !== null
          ? `${Number(item.shareholding)}%`
          : "—",
    },
    {
      label: "Action",
      className: "text-center",
      render: (item) => (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFarmerId(item?.id);
              setIsViewModalOpen(true);
            }}
            aria-label={`View details for ${item.fullName}`}
            className="inline-flex items-center justify-center text-green-500 hover:bg-green-50 rounded p-1"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditFarmerId(item?.id);
              setIsEditModalOpen(true);
            }}
            aria-label={`Edit details for ${item.fullName}`}
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
        <p className="text-gray-500 animate-pulse">Loading farmer members list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">

      <div className="flex flex-col md:flex-row items-start gap-4 md:items-center justify-between border-b border-gray-300 pb-2">
        <PageHeader
          title="Members/Shareholders Details"
          subTitle="Manage members and shareholders tied to your company. Add or export records."
        />

        <div className="flex flex-row items-center gap-3 md:gap-5 whitespace-nowrap">
          <ButtonComponent
            handleButtonClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <p>Members/Shareholders</p>
            </div>
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={() => setIsBulkModalOpen(true)}
            className="bg-green-600 p-2 rounded-md"
          >
            <div className="flex flex-row items-center space-x-1 text-xs md:text-sm lg:text-base">
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              <p>Add Bulk</p>
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
          placeholer={"Search by name or mobile number, pan, aadhaar number"}
        />

        {error && (
          <p>Farmer member error: <span className="text-red-500">{error}</span></p>
        )}

        {farmerMember && (
          <>
            <TableComponent columns={columns} data={farmerMember} />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      <FarmerDetailsModal
        farmerId={farmerId}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Add Modal */}
      <AddFarmerMembersModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          refreshList();
        }}
        id={companyId}
      />

      <AddFarmerMembersModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditFarmerId(null);
          refreshList();
        }}
        id={companyId}
        farmerId={editFarmerId}
      />

      {/* Bulk Add Modal */}
      <AddBulkFarmerMemberModal
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

export default CompanyFarmerMembers;
