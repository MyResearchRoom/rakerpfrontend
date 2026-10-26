import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchExpenses } from '../../store/actions/expense';
import { fetchExpenseCategory } from '../../store/actions/expenseCatgeory';
import { fetchCount } from '../../store/actions/countAction';
import { Oval } from 'react-loader-spinner';
import PageHeader from '../../components/comman/PageHeader';
import SummaryCard from '../../components/comman/SummaryCard';
import InputField from '../../components/comman/InputField';
import SelectField from '../../components/comman/SelectField';
import FilterBar from '../../components/comman/FilterBar';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import { Eye } from 'lucide-react';
import ButtonComponent from '../../components/comman/ButtonComponent';
import AddExpenseModal from '../../models/admin/expense/AddExpenseModal';
import AddCategories from '../../models/admin/expense/AddCategories';

const paymentOptions = [
  { label: "Bank Transfer", value: "bank transfer" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
];

const getFinancialYearOptions = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

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
export default function CompanyExpenses() {
  const { companyId } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentMethod, setPayemntMethod] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const navigte = useNavigate();

  const dispatch = useDispatch();

  const { expenses, error, loading, totalPages } = useSelector(
    (state) => state.expenses
  );

  const { counts, error: countError, loading: countLoading, } = useSelector(
    (state) => state.counts
  );

  const { categories, error: categoryError, loading: categoryLoading } = useSelector(
    (state) => state.expenseCategories
  );

  useEffect(() => {

    dispatch(
      fetchExpenses({
        searchTerm,
        categoryId: selectedCategory,
        companyId,
        paymentMethod,
        financialYear,
        page: currentPage,
      })
    );
  }, [
    searchTerm,
    selectedCategory,
    companyId,
    paymentMethod,
    financialYear,
    currentPage,
    dispatch
  ]);

  useEffect(() => {
    dispatch(
      fetchExpenseCategory({
        searchTerm: "",
        companyId,
        page: "",
        limit: "ALL"
      })
    );
  }, [dispatch,companyId]);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCount(companyId));
    }
  }, [dispatch, companyId]);

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const columns = [
    {
      label: "Expense Number",
      field: "expenseNumber",
      className: "pr-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.expenseNumber || "—"}</p>
      )
    },
    {
      label: "Date",
      className: "p-2",
      field: "date",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.date || "—"}</p>
      )
    },
    {
      label: "Category",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] capitalize'>{item?.expenseCategory?.name || "—"}</p>
      )
    },
    {
      label: "Amount",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.amount || 0)}</p>
      )
    },
    {
      label: "Description",
      field: "description",
      className: "p-3",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.description || "—"}</p>
      )
    },
    
    {
      label: "Payment Method",
      field: "paymentMethod",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] capitalize'>{item?.paymentMethod}</p>
      )
    },
    // {
    //   label: "Status",
    //   className: "p-2",
    //   headerClassName: "font-semibold text-black text-[15px]",
    //   render: (entry) => (
    //     <span
    //       className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold capitalize
    //           ${entry.status === "approved"
    //           ? "bg-emerald-50 text-emerald-600"
    //           : entry.status === "rejected"
    //             ? "bg-red-50 text-red-600"
    //             : "bg-yellow-50 text-yellow-500"}`}
    //     >
    //       {entry.status}
    //     </span>
    //   ),
    // },
    {
      label: "View",
      render: (item) => (
        <button
          className='text-[13px] text-blue-500'
          onClick={() => navigte(`/company-expense-details/${item?.id}`)}
        >
          <Eye size={18} />
        </button>
      ),
    }
  ];

  if (
    // categoryLoading || 
    loading) {
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
      <PageHeader
        title="My Expenses"
        subTitle="View and track your company expenses"
      >
        <ButtonComponent
          handleButtonClick={() => setIsAddModalOpen(true)}
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

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search expenses..."
          noWrap
        >

          <div className="min-w-[220px]">
            <SelectField
              name="selectedCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
              valueKey="id"
              labelKey="name"
              optionLabel="All Categories"
            />
          </div>

          <div className="min-w-[220px]">
            <SelectField
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPayemntMethod(e.target.value)}
              options={paymentOptions}
              valueKey="value"
              labelKey="label"
              optionLabel="Select payment method"
            />
          </div>


          <div className="min-w-[220px]">
            <SelectField
              name="financialYear"
              value={financialYear}
              onChange={(e) => {
                setFinancialYear(e.target.value);
                setCurrentPage(1);
              }}
              options={financialYearOptions}
              optionLabel="Select Financial Year"
              valueKey="value"
              labelKey="label"
            />
          </div>
        </FilterBar>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        {error && <p>Invoice get : <span className="text-red-500">{error}</span></p>}

        {categoryError && <p>Category get : <span className="text-red-500">{categoryError}</span></p>}

        {countError && <p>Count get : <span className="text-red-500">{countError}</span></p>}

        {expenses &&
          <>
            <div className="">
              <TableComponent
                columns={columns}
                data={expenses}
              />
            </div>

          </>
        }
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
      />

      <AddCategories
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        companyId={companyId}
      />

    </div>
  )
}
