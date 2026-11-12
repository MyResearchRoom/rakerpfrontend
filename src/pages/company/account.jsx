import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount } from '../../store/actions/accountAction';
import { Oval } from 'react-loader-spinner';
import PageHeader from '../../components/comman/PageHeader';
import SummaryCard from '../../components/comman/SummaryCard';
import Pagination from '../../components/comman/Pagination';
import TableComponent from '../../components/comman/TableComponent';
import InputField from '../../components/comman/InputField';
import SelectField from '../../components/comman/SelectField';
import FilterBar from '../../components/comman/FilterBar';
import { formatCurrency } from '../../components/comman/formateCurrency';
import { useNavigate } from 'react-router-dom';
import { fetchCount } from '../../store/actions/countAction';
import { Eye } from 'lucide-react';
import ReceiptPreviewModal from '../../components/comman/ReceiptPreviewModal';
import ButtonComponent from '../../components/comman/ButtonComponent';
import AddReceiptModal from "../../models/admin/receipts/AddReceiptModal";
import AddExpenseModal from '../../models/admin/expense/AddExpenseModal';

const FilterTypes = [
  { label: "Expense", value: "expense" },
  { label: "Receipt", value: "receipt" },
];

export default function CompanyAccount() {
  const { companyId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [date, setDate] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [type, setType] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const navigate = useNavigate();

  const { counts, error: countError, loading: countLoading, } = useSelector((state) => state.counts);

  const { account, totalPages, error, total, loading } = useSelector(
    (state) => state.account
  );

  useEffect(() => {
    dispatch(fetchCount());
  }, [dispatch]);

  useEffect(() => {
    const selectedFY = financialYearOptions.find(
      (fy) => fy.value === financialYear
    );

    dispatch(
      fetchAccount({
        searchTerm,
        companyId,
        type,
        financialYear:financialYear,
        date:date,
        page: currentPage,
      })
    );
  }, [
    searchTerm,
    companyId,
    type,
    date,
    financialYear,
    currentPage,
    dispatch,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const openReceiptPreview = (receiptId) => {
    setSelectedReceipt(receiptId);
    setIsPreviewOpen(true);
  };

  const closeReceiptPreview = () => {
    setSelectedReceipt(null);
    setIsPreviewOpen(false);
  };

  const tableColumns = [
    {
      label: "Date",
      className: "pr-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.date || "—"}</p>
      )
    },
    {
      label: "Transaction ID",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.transactionId || "—"}</p>
      )
    },
    {
      label: "Description",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.description || "—"}</p>
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
      headerClassName: "font-semibold text-black text-[15px]",
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
              navigate(`/company-expense-details/${item?.id}`);
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

  if (loading 
    // || countLoading
  ) {
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
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <PageHeader
        title="My Accounts"
        subTitle="View your company account transactions"
      >
        <ButtonComponent
          handleButtonClick={() => setIsReceiptModalOpen(true)}
          className="bg-green-600 px-4 py-2 rounded text-sm font-semibold shadow hover:bg-green-700"
        >
          Record Payment
        </ButtonComponent>

        <ButtonComponent
          handleButtonClick={() => setIsExpenseModalOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700"
        >
          Add Expense
        </ButtonComponent>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-2">
          <SummaryCard
            title="Total Amount Received"
            value={(formatCurrency(counts.totalAmountRecieved)) || "0"}
            color="text-emerald-600" titleColor='text-emerald-600'
          />
          <SummaryCard
            title="Total Expenses"
            value={(counts.totalExpenses) || "0"}
            color="text-pink-600" titleColor='text-pink-600'
          />
          <SummaryCard
            title="Current Balance"
            value={(formatCurrency(counts.totalBalance)) || "0"}
            color="text-blue-600" titleColor='text-blue-600'
          />
          <SummaryCard
            title="Monthly Transactions"
            value={(counts.totalTransactionPerMonth) || "0"}
            color="text-purple-600" titleColor="text-purple-600"
          />
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search by receipt or invoice number..."
          noWrap
        >
          <div className="min-w-[200px]">
            <SelectField
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={FilterTypes}
              labelKey='label'
              valueKey='value'
              optionLabel="All types"
            />
          </div>

        <div className="min-w-[200px] flex flex-row items-center gap-1">
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

        {error && <p>Receipts get : <span className="text-red-500">{error}</span></p>}

        {countError && <p>Count get : <span className="text-red-500">{countError}</span></p>}

        {account &&
          <>
            <div className="">
              <TableComponent
                columns={tableColumns}
                data={account}
              />
            </div>
          </>
        }
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

        <div className='ml-auto p-5 flex flex-row items-center justify-end gap-5'>
          <div className=' p-2 flex flex-col gap-2'>
            <p className='text-gray-800 text-sm'>Total Debit</p>
            <p className='text-red-500 font-bold text-2xl'>{formatCurrency(total.totalDebit) || "0"}</p>
          </div>

          <div className=' p-2 flex flex-col gap-2'>
            <p className='text-gray-800 text-sm'>Total Credit</p>
            <p className='text-green-500 font-bold text-2xl'>{formatCurrency(total.totalCredit) || "0"}</p>
          </div>

          <div className=' p-2 flex flex-col gap-2'>
            <p className='text-gray-800 text-sm'>Total Balance</p>
            <p className='text-blue-500 font-bold text-2xl'>{formatCurrency(total.totalBalance) || "0"}</p>
          </div>
        </div>

      </div>

      {/* Receipt Preview Modal — was missing from original */}
      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={closeReceiptPreview}
        receiptId={selectedReceipt}
      />
      <AddReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        companyId={companyId}
        // onSuccess={() => {
        //   dispatch(fetchCount());

        //   dispatch(
        //     fetchAccount({
        //       searchTerm,
        //       companyId,
        //       type,
        //       fromDate: startDate,
        //       toDate: endDate,
        //       page: currentPage,
        //     })
        //   );
        // }}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        companyId={companyId}
        onSuccess={() => {
          dispatch(fetchCount());

          dispatch(
            fetchAccount({
              searchTerm,
              companyId,
              type,
              fromDate: startDate,
              toDate: endDate,
              page: currentPage,
            })
          );
        }}
      />

    </div>
  )
}
