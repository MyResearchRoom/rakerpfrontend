import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { fetchExpenses } from '../../store/actions/expense';
import { fetchCompanyDropdownList } from '../../store/actions/companyAction';
import { fetchExpenseCategory } from '../../store/actions/expenseCatgeory';
import { fetchCount } from '../../store/actions/countAction';
import { Eye, MoveLeft, Trash2 } from 'lucide-react';
import { Oval } from 'react-loader-spinner';
import PageHeader from '../../components/comman/PageHeader';
import ButtonComponent from '../../components/comman/ButtonComponent';
import SummaryCard from '../../components/comman/SummaryCard';
import SelectField from '../../components/comman/SelectField';
import Pagination from '../../components/comman/Pagination';
import DeleteExpenseModal from '../../models/admin/expense/deleteExpenseModal';
import AddCategories from '../../models/admin/expense/AddCategories';
import AddExpenseModal from '../../models/admin/expense/AddExpenseModal';
import TableComponent from '../../components/comman/TableComponent';
import FilterBar from '../../components/comman/FilterBar';

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

export default function AllCompnayExpenses() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [paymentMethod, setPayemntMethod] = useState("");
    const [financialYear, setFinancialYear] = useState("");
    const [selectedExpenseId, setSelectedExpenseId] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
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

      const handleAddExpense = () => {
        setIsAddModalOpen(true);       
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
        label: "Company",
        className: "p-2",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
            <p className="text-[13px] capitalize max-w-xs">
            {item?.company?.name || "-"}
            </p>
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
        label: "Payment Method",
        className: "p-2",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[13px]",
        render: (item) => (
            <p className="text-[13px] capitalize">{item?.paymentMethod}</p>
        ),
        },
        {
        label: "Description",
        field: "description",
        className: "p-3",
        headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
        render: (item) => (
            <p className="text-[13px] max-w-xs">{item.description || "-"}</p>
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
          onClick={() => navigate("/expenses")}
        />
        <PageHeader
          title="Expenses Management"
          subTitle="Track and manage all business expenses"
          showLeftArrow={false}
        >
          <ButtonComponent
            handleButtonClick={() => handleAddExpense()}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Total Expenses"
          value={counts.totalExpenses}
          color="text-emerald-600"
        />
        <SummaryCard
          title="Monthly Expenses"
          value={`Rs ${counts.totalExpensePerMonth || "0"}`}
          color="text-blue-600"
        />
        <SummaryCard
          title="Expenses Category"
          value={counts.totalExpensesCategory}
          color="text-purple-600"
        />
      </div>
   

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

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">

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

        {expenses &&
            <>
                <div className="pb-5">
                    <TableComponent
                        columns={columns}
                        data={expenses}
                    />
                </div>

                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        
            </>
        }

      </div>

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
  )
}
