import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/comman/PageHeader";
import ButtonComponent from "../../components/comman/ButtonComponent";
import SummaryCard from "../../components/comman/SummaryCard";
import FilterBar from "../../components/comman/FilterBar";
import SelectField from "../../components/comman/SelectField";
import InputField from "../../components/comman/InputField";
import Pagination from "../../components/comman/Pagination";
import TableComponent from "../../components/comman/TableComponent";

import { Eye, FileText, MoveLeft, Trash2, Upload } from "lucide-react";
import { Oval } from "react-loader-spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCount } from "../../store/actions/countAction";
import { fetchCompanyDropdownList } from "../../store/actions/companyAction";
import { fetchExpenseCategory } from "../../store/actions/expenseCatgeory";
import { fetchExpenses } from "../../store/actions/expense";

import AddExpenseModal from "../../models/admin/expense/AddExpenseModal";
import AddCategories from "../../models/admin/expense/AddCategories";
import ExpensePortal from "../../components/feature/AdminAndEmployee/expenses/expensesPortal";
import DeleteExpenseModal from "../../models/admin/expense/deleteExpenseModal";
import { toast } from "react-toastify";

const statusOptions = [
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const paymentOptions = [
  { label: "Bank Transfer", value: "bank transfer" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
];

const getFinancialYearOptions = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-indexed
  const year = today.getFullYear();

  // If current month is April (4) or later, FY started this year; otherwise it started last year
  const baseYear = month >= 4 ? year : year - 1;

  return [
    {
      label: `${baseYear - 1}-${baseYear}`,
      value: `${baseYear - 1}-${baseYear}`,
    },
    {
      label: `${baseYear}-${baseYear + 1}`,
      value: `${baseYear}-${baseYear + 1}`,
    },
    {
      label: `${baseYear + 1}-${baseYear + 2}`,
      value: `${baseYear + 1}-${baseYear + 2}`,
    },
  ];
};

const financialYearOptions = getFinancialYearOptions();

export default function Expense() {
  const location = useLocation();

  const companyId = location.state?.companyId;
  const showModal = location.state?.showModal;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentMethod, setPayemntMethod] = useState("");
  const [showPortal, setShowPortal] = useState(true);
  const [financialYear, setFinancialYear] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { expenses,totalPages, error, loading } = useSelector((state) => state.expenses);

  const { counts, error: countError } = useSelector((state) => state.counts);

  const { categories, error: categoryError } = useSelector(
    (state) => state.expenseCategories
  );

  const { companies, error: companyError } = useSelector(
    (state) => state.companyDropdownData
  );

  const refreshExpenses = useCallback(() => {
    dispatch(
      fetchExpenses({
        searchTerm,
        categoryId: selectedCategory,
        companyId: selectedCompany,
        paymentMethod,
        financialYear,
        page: currentPage,
      })
    );
  }, [
    dispatch,
    searchTerm,
    selectedCategory,
    selectedCompany,
    paymentMethod,
    financialYear,
    currentPage,
  ]);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  useEffect(() => {
    dispatch(fetchCompanyDropdownList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExpenseCategory({ searchTerm: "", page: "", limit: "ALL" ,companyId:selectedCompany}));
  }, [dispatch,selectedCompany]);

  useEffect(() => {
    dispatch(fetchCount());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddExpense = (companyId) => {
    if (companyId) {
      setSelectedCompany(companyId);
      setIsAddModalOpen(true);
    } else{
      toast.error("Company id is required");
    }
    
  };

  const handleCloseAddExpenseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleExpenseAdded = () => {
    dispatch(fetchCount());
  };

  const columns = [
    {
      label: "Expense Number",
      field: "expenseNumber",
      className: "pr-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px]">{item.expenseNumber || "-"}</p>
      ),
    },
    {
      label: "Date",
      className: "p-2",
      field: "date",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px]">{item.date || "-"}</p>
      ),
    },
    {
      label: "Category",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px] capitalize">
          {item?.expenseCategory?.name || "-"}
        </p>
      ),
    },
    {
      label: "Amount",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px]">Rs {Math.ceil(item.amount || 0)}</p>
      ),
    },
    {
      label: "Description",
      field: "description",
      className: "p-3",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px]">{item.description || "-"}</p>
      ),
    },
    {
      label: "Payment Method",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className="text-[13px] capitalize">{item?.paymentMethod}</p>
      ),
    },
    {
      label: "Action",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <div className="flex flex-row gap-2 items-center">
          <button
            className="text-[13px] text-blue-500"
            onClick={() => navigate(`/expense-details/${item?.id}`)}
          >
            <Eye size={18} />
          </button>
          <button
            className="text-[13px] text-red-500"
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedExpenseId(item?.id);
              setSelectedCompany(item?.companyId);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (showPortal) {
    return (
      <ExpensePortal
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        financialYearOptions={financialYearOptions}
        // onViewAll={() => {
        //   setSelectedCompany("");
        //   setShowPortal(false);
        // }}
        onContinue={() => setShowPortal(false)}
      />
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
        <p className="text-gray-500 animate-pulse">Loading Expense list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <div className="flex flex-row items-start gap-2 w-full">
        <MoveLeft
          className="text-gray-900 mt-2"
          onClick={() => setShowPortal(true)}
        />
        <PageHeader
          title="Expenses Management"
          subTitle="Track and manage all business expenses"
          showLeftArrow={false}
        >
          <ButtonComponent
            handleButtonClick={() => handleAddExpense(selectedCompany)}
            className="bg-blue-600 px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700"
          >
            Add Expense
          </ButtonComponent>

          <ButtonComponent
            handleButtonClick={() => setIsAddCategoryModalOpen(true)}
            className="bg-blue-600 px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700"
          >
            Add Category
          </ButtonComponent>
        </PageHeader>
      </div>

      <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
        <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-3">All Companies Overall Expenses</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-2">
          <SummaryCard
            title="Total Expenses"
            value={counts.totalExpenses}
            color="text-blue-600" titleColor="text-blue-600"
          />
          <SummaryCard
            title="Monthly Expenses"
            value={`Rs ${counts.totalExpensePerMonth || "0"}`}
            color="text-green-600" titleColor="text-green-600"
          />
          <SummaryCard
            title="Expenses Category"
            value={counts.totalExpensesCategory}
            color="text-cyan-500" titleColor="text-cyan-500"
          />
        </div>
      </section>

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search expenses..."
          setCurrentPage={setCurrentPage}
          noWrap
        >
          <div className="min-w-[220px]">
            <SelectField
              name="selectedCategory"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              options={categories}
              valueKey="id"
              labelKey="name"
              optionLabel="All Categories"
            />
          </div>

          <div className="min-w-[220px]">
            <SelectField
              name="selectedCompany"
              value={selectedCompany}
              onChange={(e) =>{
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              options={companies}
              optionLabel="Select Companies"
              valueKey="id"
              labelKey="name"
            />
          </div>


          <div className="min-w-[220px]">
            <SelectField
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => {
                setPayemntMethod(e.target.value);
                setCurrentPage(1);
              }}
              options={paymentOptions}
              valueKey="value"
              labelKey="label"
              optionLabel="Select payment method"
            />
          </div>

          {/* Dynamic Financial Year Filter */}
          <div className="min-w-[220px]">
            <SelectField
              name="financialYear"
              value={financialYear}
              onChange={(e) => {
                setFinancialYear(e.target.value);
                setCurrentPage(1);
              }}
              options={financialYearOptions}
              valueKey="value"
              labelKey="label"
              optionLabel="Select Financial Year"
            />
          </div>

      
        </FilterBar>
      </div>

      {error && (
        <p>Expense get : <span className="text-red-500">{error}</span></p>
      )}
      {companyError && (
        <p>Company get : <span className="text-red-500">{companyError}</span></p>
      )}
      {categoryError && (
        <p>Category get : <span className="text-red-500">{categoryError}</span></p>
      )}
      {countError && (
        <p>Count get : <span className="text-red-500">{countError}</span></p>
      )}

      {expenses.length > 0 ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-3xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">

              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  {expenses[0]?.company?.logo ? (
                    <img
                      src={expenses[0]?.company?.logo}
                      alt={expenses[0]?.company?.name}
                      className="h-24 w-24 object-cover rounded"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50">
                      <span className="text-2xl font-bold text-blue-600">
                        {expenses[0]?.company?.name?.charAt(0) || "C"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 items-start gap-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Company Status
                          </p>
                          <span
                            className={`capitalize inline-flex rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${(expenses[0]?.company?.status || "").toLowerCase() === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                              }`}
                          >
                            {expenses[0]?.company?.status || "Pending"}
                          </span>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Connected Date
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {expenses[0]?.company?.connectedDate || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            GSTIN Number
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {expenses[0]?.company?.gstin || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            PAN Number
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {expenses[0]?.company?.pan || "N/A"}
                          </p>
                        </div>
                      </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-2 w-fit">
                  <h2>{expenses[0]?.company?.name}</h2>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Expenses overview and status for this company
                </p>
              </div>

            </div>

          </div>

          <TableComponent columns={columns} data={expenses} />

          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          No expenses found.
        </div>
      )}

      

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddExpenseModal}
        onSuccess={handleExpenseAdded}
        companyId={selectedCompany}
      />

      <AddCategories
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        companyId={selectedCompany}
      />

      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        expenseId={selectedExpenseId}
        companyId={selectedCompany}
        isCall={true}
      />
    </div>
  );
}
