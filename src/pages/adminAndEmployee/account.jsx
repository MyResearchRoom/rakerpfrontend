import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/comman/PageHeader'
import ButtonComponent from '../../components/comman/ButtonComponent'
import SummaryCard from '../../components/comman/SummaryCard'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCount } from '../../store/actions/countAction';
import { fetchCompanyDropdownList } from '../../store/actions/companyAction';
import FilterBar from '../../components/comman/FilterBar';
import SelectField from '../../components/comman/SelectField';
import InputField from '../../components/comman/InputField';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import { fetchAccount } from '../../store/actions/accountAction';
import { Eye, FileText, MoveLeft, Upload } from 'lucide-react';
import { formatCurrency } from '../../components/comman/formateCurrency';
import ReceiptPreviewModal from '../../components/comman/ReceiptPreviewModal';
import AddReceiptModal from '../../models/admin/receipts/AddReceiptModal';
import AddExpenseModal from '../../models/admin/expense/AddExpenseModal';
import LedgerExportModel from '../../models/admin/account/ledgerExportModel';
import AccountsPortal from "../../components/feature/AdminAndEmployee/accounts/accountsPortal";

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

export default function Account() {

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
  const [showPortal, setShowPortal] = useState(true);
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

  const tableColumns = [
    {
      label: "Date",
      className: "pr-2",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.date || "-"}</p>
      )
    },
    // {
    //   label: "company",
    //   className: "p-2",
    //   headerClassName: "font-semibold text-black text-[15px]",
    //   render: (item) => (
    //     <p className='text-[13px]'>{item?.company || "-"}</p>
    //   )
    // },
    {
      label: "Transaction ID",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.transactionId || "-"}</p>
      )
    },
    {
      label: "Description",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.description || "-"}</p>
      )
    },
    {
      label: "Debit",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px] text-red-500 font-semibold'>{formatCurrency(item.debit) || "0"}</p>
      )
    },
    {
      label: "Credit",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px] text-green-500 font-semibold'>{formatCurrency(item.credit) || "0"}</p>
      )
    },
    // {
    //   label: "Balance",
    //   className: "p-2",
    //   headerClassName: "font-semibold text-black text-[15px]",
    //   render: (item) => (
    //     <p className='text-[13px] text-blue-500 font-semibold'>{formatCurrency(item.balance) || "0"}</p>
    //   )
    // },
    {
      label: "Reference",
      field: "",
      className: "p-2",
      headerClassName: "font-semibold text-black text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.reference || "0"}</p>
      )
    },
    {
      label: "View",
      render: (item) => (
        <button
          className='text-[13px] text-blue-500'
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

  if (showPortal) {
    return (
      <AccountsPortal
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        financialYearOptions={financialYearOptions}
        onViewAll={() => {
          setSelectedCompany("");
          setFinancialYear("");
          setShowPortal(false);
        }}
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
        <p className="text-gray-500 animate-pulse ">Loading account list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">

      <div className='flex flex-row items-start gap-2 w-full'>
        <MoveLeft className='text-gray-900 mt-2' onClick={() => setShowPortal(true)} />

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

      <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
        <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-3">All Companies Overall Account</h2>
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
      </section>

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

      <div className="space-y-4">
        {account.length > 0 ? (
          <div
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-6 rounded-3xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      {account[0]?.logo ? (
                        <img
                          src={account[0]?.logo}
                          alt={account[0]?.name}
                          className="h-24 w-24 object-cover rounded"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl">
                          <span className="text-2xl font-bold text-blue-600">
                            {account[0]?.name?.charAt(0) || "C"}
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
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${(account[0]?.status || "").toLowerCase() === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                              }`}
                          >
                            {account[0]?.status
                              ? account[0]?.status.charAt(0).toUpperCase() + account[0]?.status.slice(1).toLowerCase()
                              : "Pending"}
                          </span>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Connected Date
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {account[0]?.connectedDate || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            GSTIN Number
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {account[0]?.gstin || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            PAN Number
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {account[0]?.pan || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-2 w-fit">
                      <h2 className="text-xl lg:text-2xl font-bold leading-tight text-gray-900">
                        {account[0]?.name}
                      </h2>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Accounts overview and ledger details for this company
                    </p>
                  </div>
                </div>
              </div>
         

              <TableComponent
                columns={tableColumns}
                data={account}
              />

              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            No account entries found.
          </div>
        )}
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
  );
}
