import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCount } from '../../store/actions/countAction';
import { fetchAccount } from '../../store/actions/accountAction';
import { fetchCompanyDropdownList } from '../../store/actions/companyAction';
import { Oval } from 'react-loader-spinner';
import SummaryCard from '../../components/comman/SummaryCard';
import FilterBar from '../../components/comman/FilterBar';
import SelectField from '../../components/comman/SelectField';
import InputField from '../../components/comman/InputField';
import ButtonComponent from '../../components/comman/ButtonComponent';
import PageHeader from '../../components/comman/PageHeader';
import { Eye, MoveLeft } from 'lucide-react';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import LedgerExportModel from '../../models/admin/account/ledgerExportModel';
import AddExpenseModal from '../../models/admin/expense/AddExpenseModal';
import AddReceiptModal from '../../models/admin/receipts/AddReceiptModal';
import ReceiptPreviewModal from '../../components/comman/ReceiptPreviewModal';
import { formatCurrency } from '../../components/comman/formateCurrency';


const FilterTypes = [
  { label: "Expense", value: "expense" },
  { label: "Receipt", value: "receipt" },
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

export default function AllCompanyAccount() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const [addReceiprtModelOpen, setAddReceiprtModelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const { counts, error: countError, loading: countLoading } = useSelector((state) => state.counts);

  const { companies, error: companyError, loading: companyLoading } = useSelector(
    (state) => state.companyDropdownData
  );

  const { account, totalPages, error, total, loading } = useSelector(
    (state) => state.account
  );

  useEffect(() => {
      dispatch(fetchCount());
    }, [dispatch]);
  
    useEffect(() => {
      dispatch(fetchCompanyDropdownList());
    }, [dispatch]);
  
  
    const refreshAccount = useCallback(() => {
      dispatch(
        fetchAccount({
          searchTerm: searchTerm,
          companyId: selectedCompany,
          type: type,
          financialYear:financialYear,
          date:date,
          page: currentPage,
        })
      );
    }, [
      dispatch,
      searchTerm,
      selectedCompany,
      type,
      date,
      financialYear,
      currentPage,
    ]);
  
    useEffect(() => {
      refreshAccount();
    }, [refreshAccount]);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const openReceiptPreview = (receiptId) => {
      setSelectedReceipt(receiptId);
      setIsPreviewOpen(true);
    };
  
    const closeReceiptPreview = () => {
      setSelectedReceipt(null);
      setIsPreviewOpen(false);
    };
  
    const handleOpenAddExpenseModal = (company = null) => {
      setSelectedCompanyData(company);
      setIsAddModalOpen(true);
    };
  
    const handleCloseAddExpenseModal = () => {
      setSelectedCompanyData(null);
      setIsAddModalOpen(false);
    };
  
    const handleCloseReceiptModel = () => {
      setAddReceiprtModelOpen(false);
      refreshAccount();
      dispatch(fetchCount());
    };
  
    const handleExpenseAdded = () => {
      refreshAccount();
      dispatch(fetchCount());
    };

    const columns  = [
    {
      label: "Date",
      className: "pr-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.date || "-"}</p>
      )
    },
    {
      label: "company",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] max-w-xs'>{item?.company || "-"}</p>
      )
    },
    {
      label: "Transaction ID",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.transactionId || "-"}</p>
      )
    },
    {
      label: "Description",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] max-w-xs'>{item.description || "-"}</p>
      )
    },
    {
      label: "Debit",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] text-red-500 font-semibold'>{formatCurrency(item.debit) || "0"}</p>
      )
    },
    {
      label: "Credit",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] text-green-500 font-semibold'>{formatCurrency(item.credit) || "0"}</p>
      )
    },
    {
      label: "Balance",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] text-blue-500 font-semibold'>{formatCurrency(item.balance) || "0"}</p>
      )
    },
    {
      label: "Reference",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.reference || "0"}</p>
      )
    },
    {
      label: "View",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <button
          className='text-[11px] lg:text-[13px] text-blue-500'
          onClick={() => {
            if (item?.type === "expense") {
              navigate(`/expense-details/${item?.id}`);
              return;
            }
            if (item?.type === "receipt") {
              openReceiptPreview(item?.id);
              return;
            }
          }}
        >
          <Eye size={18} />
        </button>
      ),
    }
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
            <p className="text-gray-500 animate-pulse ">Loading acount list...</p>
        </div>
        );
    }



  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <div className='flex flex-row items-start gap-2 w-full'>
        <MoveLeft className='text-gray-900 mt-2' onClick={() => navigate(-1)} />

        <PageHeader
          title="Accounts Ledger"
          subTitle="Financial transactions and balance sheet"
          showLeftArrow={false}
        >
          <ButtonComponent
            handleButtonClick={() => setAddReceiprtModelOpen(true)}
            className="bg-blue-500 px-4 py-2 rounded shadow"
          >
            Record Payment
          </ButtonComponent>
          <ButtonComponent
            handleButtonClick={() => handleOpenAddExpenseModal()}
            className="bg-blue-500 border border-gray-200 rounded px-4 py-2 text-sm "
          >
            Add Expense
          </ButtonComponent>
          <ButtonComponent
            handleButtonClick={() => setIsExportModalOpen(true)}
            className="bg-blue-500 border border-gray-200 rounded px-4 py-2 text-sm "
          >
            Export Ledger
          </ButtonComponent>
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Total Amount Received"
          value={(formatCurrency(counts.totalAmountRecieved)) || "0"}
          color="text-emerald-600"
        />
        <SummaryCard
          title="Total Expenses"
          value={(counts.totalExpenses) || "0"}
          color="text-red-600"
        />
        <SummaryCard
          title="Current Balance"
          value={(formatCurrency(counts.totalBalance)) || "0"}
          color="text-blue-600"
        />
        <SummaryCard
          title="Monthly Transactions"
          value={(counts.totalTransactionPerMonth) || "0"}
          color="text-purple-600"
        />
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search by receipt or invoice number..."
          setCurrentPage={setCurrentPage}
          noWrap
        >
          <div className="min-w-[200px]">
            <SelectField
              name="company"
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              options={companies}
              labelKey='name'
              valueKey='id'
              optionLabel="Select company"
            />
          </div>

          <div className="min-w-[200px]">
            <SelectField
              name="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCurrentPage(1);
              }}
              options={FilterTypes}
              labelKey='label'
              valueKey='value'
              optionLabel="All types"
            />
          </div>

          {/* Dynamic Financial Year Filter */}
          <div className="min-w-[200px]">
            <SelectField
              name="financialYear"
              value={financialYear}
              onChange={(e) => {
                setFinancialYear(e.target.value);
                setCurrentPage(1);
              }}
              options={financialYearOptions}
              labelKey='label'
              valueKey='value'
              optionLabel="Select Financial Year"
            />
          </div>

          <div className="min-w-[200px] flex flex-row items-center gap-1">
            <p className='text-sm font-semibold'>From :</p>
            <InputField
              type="date"
              name="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCurrentPage(1);
                setFinancialYear("");
              }}
            />
          </div>

        </FilterBar>

        {error && <p>Receipts get : <span className="text-red-500">{error}</span></p>}
        {companyError && <p>Company get : <span className="text-red-500">{companyError}</span></p>}
        {countError && <p>Count get : <span className="text-red-500">{countError}</span></p>}
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        {account &&
            <>
                <div className="pb-5">
                    <TableComponent
                        columns={columns}
                        data={account}
                    />
                </div>

                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        
            </>
        }

      </div>

      <div className='ml-auto p-5 flex flex-row items-center justify-end gap-5'>
        <div className='p-2 flex flex-col gap-2'>
          <p className='text-gray-800 text-sm'>Total Debit</p>
          <p className='text-red-500 font-bold text-2xl'>{formatCurrency(total.totalDebit) || "0"}</p>
        </div>

        <div className='p-2 flex flex-col gap-2'>
          <p className='text-gray-800 text-sm'>Total Credit</p>
          <p className='text-green-500 font-bold text-2xl'>{formatCurrency(total.totalCredit) || "0"}</p>
        </div>

        <div className='p-2 flex flex-col gap-2'>
          <p className='text-gray-800 text-sm'>Total Balance</p>
          <p className='text-blue-500 font-bold text-2xl'>{formatCurrency(total.totalBalance) || "0"}</p>
        </div>
      </div>

      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={closeReceiptPreview}
        receiptId={selectedReceipt}
      />

      <AddReceiptModal
        isOpen={addReceiprtModelOpen}
        onClose={handleCloseReceiptModel}
        companyId={selectedCompany}
      />

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddExpenseModal}
        onSuccess={handleExpenseAdded}
        companyId={selectedCompany}
      />

      <LedgerExportModel
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        companyId={selectedCompany}
      />

        
    </div>
  )
}
