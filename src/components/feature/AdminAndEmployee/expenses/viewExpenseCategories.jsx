import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenseCategory } from '../../../../store/actions/expenseCatgeory';
import { Edit, Trash2 } from 'lucide-react';
import { Oval } from 'react-loader-spinner';
import SearchComponent from '../../../comman/SearchComponent'; // ← updated import
import TableComponent from '../../../comman/TableComponent';
import Pagination from '../../../comman/Pagination';
import DeletExpenseCategory from '../../../../models/admin/expense/deleteExpenseCatgeory';
import SelectField from "../../../comman/SelectField";
import { fetchCompanyDropdownList } from "../../../../store/actions/companyAction";

export default function ViewExpenseCategories({ onEdit, companyIdFromParent }) {
  const { role } = useSelector((state) => state.auth);

  console.log("companyIdFromParent",companyIdFromParent);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [companyId, setCompanyId] = useState(companyIdFromParent||"");

  // useEffect(() => {
  //     setCompanyId(companyIdFromParent || "");
  // }, [companyIdFromParent]);

  const { companies } = useSelector((state) => state.companyDropdownData);
  const { categories, error, loading, totalPages } = useSelector((state) => state.expenseCategories);

  const dispatch = useDispatch();
  const [expenseCategory, setExpenseCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch categories whenever search, company, or page changes
  // useEffect(() => {
  //   dispatch(
  //     fetchExpenseCategory({
  //       searchTerm,
  //       companyId,
  //       page: currentPage,
  //     })
  //   );
  // }, [currentPage, searchTerm, companyId, dispatch]);

  useEffect(() => {
  console.log("Fetching categories", {
    searchTerm,
    companyId,
    currentPage,
  });

  dispatch(
    fetchExpenseCategory({
      searchTerm,
      companyId,
      page: currentPage,
    })
  );
}, [currentPage, searchTerm, companyId]);

  // Reset to page 1 when search or company filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, companyId]);

  useEffect(() => {
    if (!companyId) {
      dispatch(fetchCompanyDropdownList());
    }
  }, [dispatch, companyId]);

  const column = [
    {
      label: "Name",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <p className="capitalize">{item?.name ?? "-"}</p>
      ),
    },
    ...(role !== "COMPANY"
      ? [
          {
            label: "Company",
            className: "p-2 text-sm whitespace-normal break-words",
            render: (item) => (
              <p className="capitalize break-all min-w-0 max-w-sm">
                {item?.company?.name ||
                  item?.CompanyData?.name ||
                  item?.companyName ||
                  "-"}
              </p>
            ),
          },
        ]
      : []),
    {
      label: "Description",
      field: "",
      className: "p-2 text-sm whitespace-normal break-words",
      render: (item) => (
        <p className="capitalize">{item?.description ?? "-"}</p>
      ),
    },
    ...(role !== "COMPANY"
      ? [
        {
          label: "Actions",
          field: "status",
          className: "p-2 text-sm whitespace-normal break-words",
          render: (item) => (
            <div className="flex flex-row items-center gap-2">
              <button onClick={() => onEdit(item?.id)}>
                <Edit className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => {
                  setExpenseCategory(item?.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ),
        },
      ]
      : []),
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
        <p className="text-gray-500 animate-pulse">Loading expense categories list...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-2 md:p-3 lg:p-4 rounded-md border border-gray-300 space-y-4 mt-3">

        {/* Search + Company filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholer="Search by category or description"
            />
          </div>

          {role !== "COMPANY" && (
            <div className="min-w-[220px]">
              <SelectField
                name="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                options={companies}
                optionLabel="Select Company"
                valueKey="id"
                labelKey="name"
              />
            </div>
          )}
        </div>

        {error && (
          <p>
            Expense Category get: <span className="text-red-500">{error}</span>
          </p>
        )}

        {categories && (
          <div>
            <TableComponent columns={column} data={categories} />
          </div>
        )}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      <DeletExpenseCategory
        categoryId={expenseCategory}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}