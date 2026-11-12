import React, { useEffect, useState } from "react";
import PageHeader from "../../components/comman/PageHeader";
import ButtonComponent from "../../components/comman/ButtonComponent";
import FilterBar from "../../components/comman/FilterBar";
import TableComponent from "../../components/comman/TableComponent";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaterials } from "../../store/actions/materials";
import { Oval } from "react-loader-spinner";
import Pagination from "../../components/comman/Pagination";
import AddMaterialModal from '../../models/admin/materials/AddMaterialModal';
import DeleteMaterialModal from '../../models/admin/materials/DeleteMaterialModal';
import SelectField from "../../components/comman/SelectField";

const gstOptions = [
  { label: "0 %", value: "0" },
  { label: "5 %", value: "5" },
  { label: "12 %", value: "12" },
  { label: "18 %", value: "18" },
  { label: "28 %", value: "28" },
];

const unitOptions = [
  { label: "Kg", value: "kg" },
  { label: "Gram", value: "gram" },
  { label: "Quintal", value: "quintal" },
  { label: "Ton", value: "ton" },
  { label: "Liter", value: "liter" },
  { label: "Mililiter", value: "mililiter" },
  { label: "Packet", value: "packet" },
  { label: "Bag", value: "bag" },
  { label: "Box", value: "box" },
  { label: "Dozen", value: "dozen" },
  { label: "Piece", value: "piece" },
];

export default function MyMaterials() {
  const { companyId } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [unit, setUnit] = useState("");
  const [gstRate, setGstRate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialId, setMaterialId] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  const {
    materials,
    totalPages,
    error,
    loading,
  } = useSelector((state) => state.materials);

  useEffect(() => {
    dispatch(
      fetchMaterials({
        searchTerm,
        companyId,
        unit,
        gstRate,
        page: currentPage,
      })
    );
  }, [
    searchTerm,
    companyId,
    unit,
    gstRate,
    currentPage,
    dispatch,
  ]);

  const materialColumns = [
    {
      label: "Item Name",
      field: "itemName",
      className: "px-4 py-3 text-gray-900 min-w-0 max-w-xs",
      headerClassName: "px-4 py-3 text-xs uppercase text-black",
      render: (item) => (
        <span className="capitalize">
          {item?.itemName || "-"}
        </span>
      ),
    },
    {
      label: "HSN Code",
      field: "hsnCode",
      className: "px-4 py-3",
      headerClassName: "px-4 py-3 text-xs uppercase text-black",
      render: (item) => item?.hsnCode || "-",
    },
    {
      label: "UNIT",
      field: "unit",
      className: "px-4 py-3 capitalize",
      headerClassName: "px-4 py-3 text-xs uppercase text-black",
      render: (item) => item?.unit || "-",
    },
    {
      label: "GST Rate",
      className: "px-4 py-3",
      headerClassName: "px-4 py-3 text-xs uppercase text-black",
      render: (item) => (
        <span className="inline-flex rounded-full text-xs font-semibold text-blue-600">
          {Number(item?.gstRate || 0)} %
        </span>
      ),
    },
    {
      label: "Price",
      field: "price",
      className: "px-4 py-3",
      headerClassName: "px-4 py-3 text-xs uppercase text-black",
      render: (item) => (
        <span>
          ₹ {Number(item?.price || 0)}
        </span>
      ),
    },
    {
      label:"ACTION",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-center",
      render :(item)=>(
        <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setMaterialId(item?.id);
                      setEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setMaterialId(item?.id);
                      setDeleteModalOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
        </div>
      )
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
        <p className="text-gray-500 animate-pulse">
          Loading materials list...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <PageHeader
        title="My Materials"
        subTitle="Manage your company materials for invoicing"
      >
        <ButtonComponent
          handleButtonClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold shadow-md hover:bg-blue-700"
        >
          <Plus size={18} strokeWidth={3} />
          Add Material
        </ButtonComponent>
      </PageHeader>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search materials by name or HSN code..."
          noWrap
        >
          <div className="w-full sm:w-[200px]">
            <SelectField
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              options={unitOptions}
              optionLabel="Select Unit"
              valueKey="value"
              labelKey="label"
            />
          </div>

          <div className="w-full sm:w-[200px]">
            <SelectField
              name="gstRate"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              options={gstOptions}
              optionLabel="Select GST Rate"
              valueKey="value"
              labelKey="label"
            />
          </div>
        </FilterBar>

        {error && (
          <p>
            Material get :
            <span className="text-red-500"> {error}</span>
          </p>
        )}

        {materials && (
          <div>
            <TableComponent
              columns={materialColumns}
              data={materials}             
            />
          </div>
        )}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AddMaterialModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        materialId={materialId}
      />

      <DeleteMaterialModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        materialId={materialId}
      />
    </div>
  );
}