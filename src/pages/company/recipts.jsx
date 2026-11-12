import { Download, Eye, Printer } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { printReceiptDocument } from '../../utils/printReceipt';
import { getReceiptById } from '../../services/receipt';
import { downloadReceiptDocument } from '../../utils/downloadReceipt';
import { fetchReceipts } from '../../store/actions/receiptsActions';
import { Oval } from 'react-loader-spinner';
import SummaryCard from '../../components/comman/SummaryCard';
import PageHeader from '../../components/comman/PageHeader';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import InputField from '../../components/comman/InputField';
import SelectField from '../../components/comman/SelectField';
import FilterBar from '../../components/comman/FilterBar';
import ReceiptPreviewModal from '../../components/comman/ReceiptPreviewModal';
import { fetchCount } from '../../store/actions/countAction';
import { Plus } from "lucide-react";
import ButtonComponent from "../../components/comman/ButtonComponent";
import AddReceiptModal from "../../models/admin/receipts/AddReceiptModal";


const paymentOptions = [
  { label: "Bank Transfer", value: "bank transfer" },
  { label: "UPI", value: "upi" },
  { label: "Cash", value: "cash" },
  { label: "Cheque", value: "cheque" },
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

export default function CompanyRecipts() {
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [financialYear, setFinancialYear] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [addReceiptModalOpen, setAddReceiptModalOpen] = useState(false);

  const { receipts, totalPages, error, loading } = useSelector(
    (state) => state.receipts
  );

  useEffect(() => {
 
    dispatch(
      fetchReceipts({
        searchTerm,
        date,
        companyId,
        paymentMethod,
        page: currentPage,
        financialYear,
      })
    );
  }, [
    searchTerm,
    date,
    companyId,
    paymentMethod,
    financialYear,
    currentPage,
    dispatch,
  ]);

  const { counts, error: countError, loading: countLoading, } = useSelector(
    (state) => state.counts
  );

  useEffect(() => {
    dispatch(fetchCount());
  }, [dispatch]);

  const handleDownloadReceipt = async (receipt) => {
    if (!receipt?.id) return;
    const response = await getReceiptById(receipt?.id);
    if (!response) {
      return;
    }
    downloadReceiptDocument(response);
  };

  const handlePrint = async (receiptId) => {
    if (!receiptId) return;
    const response = await getReceiptById(receiptId);
    if (!response) {
      return;
    }
    printReceiptDocument(response);
  };

  const columns = [
    {
      label: "Receipt ",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.receiptNumber || "—"}</p>
      )
    },
    {
      label: "Invoice",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[13px]'>{item?.invoice?.invoiceNumber || "—"}</p>
      )
    },
    {
      label: "Company",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[13px] capitalize break-words whitespace-normal'>{item?.company?.name || "—"}</p>
      )
    },
    {
      label: "Payment Date",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[13px]'>{item?.paymentDate || "—"}</p>
      )
    },
    {
      label: "Method",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[13px] capitalize'>{item?.paymentMethod || "—"}</p>
      )
    },
    {
      label: "Amount",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px] p-4",
      render: (item) => (
        <p className='text-[13px] font-semibold text-green-500'>₹{Number(item.amount || 0)}</p>
      )
    },

    {
      label: "Actions",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      className: "text-[11px] lg:text-[13px]",
      render: (item) => (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => openReceiptPreview(item?.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleDownloadReceipt(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            onClick={() => handlePrint(item?.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Printer size={18} />
          </button>

        </div>
      ),
    },
  ];

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

  if (loading || countLoading) {
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
        <p className="text-gray-500 animate-pulse ">Loading receipts list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <PageHeader title="Receipts" subTitle="Track all received payments">
        <ButtonComponent
          handleButtonClick={() => setAddReceiptModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Plus size={18} strokeWidth={3} />
          Add Receipt
        </ButtonComponent>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-2">
        <SummaryCard title="Total Receipts" value={counts.totalReceipt} color="text-blue-600" titleColor="text-blue-600"/>
        <SummaryCard
          title="Total Paid Amount"
          value={`₹ ${counts.totalPaidAmount}`}
          color="text-green-600" titleColor="text-green-600"
        />
        <SummaryCard title="Last Payment" value={counts.lastReceiptPaymentDate} color="text-cyan-500"
                    titleColor="text-cyan-500"/>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search by incoice no. / receipt no...."
          noWrap
        >
          <div className="w-full sm:w-[200px]">
            <SelectField
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={paymentOptions}
              optionLabel="Select payment method"
              valueKey="value"
              labelKey="label"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <InputField
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[220px]">
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

        {receipts &&
          <>
            <div className="">
              <TableComponent
                columns={columns}
                data={receipts}
              />
            </div>

          </>
        }
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={closeReceiptPreview}
        receiptId={selectedReceipt}
      />
      <AddReceiptModal
        isOpen={addReceiptModalOpen}
        onClose={() => setAddReceiptModalOpen(false)}
        companyId={companyId}
      />

    </div>
  )
}
