import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInvoices } from '../../store/actions/invoiceActions';
import PageHeader from '../../components/comman/PageHeader';
import ButtonComponent from '../../components/comman/ButtonComponent';
import SummaryCard from '../../components/comman/SummaryCard';
import SelectField from '../../components/comman/SelectField';
import InputField from '../../components/comman/InputField';
import FilterBar from '../../components/comman/FilterBar';
import { Oval } from 'react-loader-spinner';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import { Download, Eye, Printer, Trash2, Plus } from 'lucide-react';
import { printInvoiceDocument } from '../../utils/printInvoice';
import { getInvoiceById } from '../../services/invoice';
import { downloadInvoiceDocument } from '../../utils/downloadInvoice';
import InvoicePreviewModal from '../../components/comman/InvoicePreviewModal';
import getStatusStyle from '../../components/comman/invoiceSttausStyle';
import { fetchCount } from '../../store/actions/countAction';

const statusOptions = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Partially Paid", value: "partially paid" },
  { label: "Overdue", value: "overdue" },
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

export default function CompanyInvoices() {
  const { companyId } = useSelector((state) => state.auth);
  console.log("company id on invoice page compNY Side",companyId);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [financialYear, setFinancialYear] = useState("");

  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToDounload, setInvoiceToDownload] = useState({});

  const { invoices, totalPages, error, loading } = useSelector(
    (state) => state.invoices
  );

  useEffect(() => {
    dispatch(
      fetchInvoices({
        searchTerm,
        date,
        companyId,
        status,
        page: currentPage,
        financialYear,
      })
    );
  }, [
    searchTerm,
    date,
    companyId,
    status,
    financialYear,
    currentPage,
    dispatch,
  ]);
  const { counts, error: countError, loading: countLoading, } = useSelector(
    (state) => state.counts
  );

  useEffect(() => {
    dispatch(
      fetchCount()
    );
  }, [dispatch]);

  const openInvoicePreview = (invoice) => {
    setPreviewInvoice(invoice?.id);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoicePreview = () => {
    setPreviewInvoice(null);
    setIsInvoiceModalOpen(false);
  };

  const handleDownload = async (invoiceId) => {
    if (!invoiceId) return;
    const response = await getInvoiceById(invoiceId);
    if (!response) {
      return;
    }
    downloadInvoiceDocument(response);
  };

  const handlePrint = async (invoiceId) => {
    if (!invoiceId) return;
    const response = await getInvoiceById(invoiceId);
    if (!response) {
      return;
    }
    printInvoiceDocument(response);
  };

  const columns = [
    {
      label: "Invoice",
      // className:"text-[13px]",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.invoiceNumber || "—"}</p>
      )
    },
    {
      label: "Date",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.invoiceDate || "—"}</p>
      )
    },
    {
      label: "Due Date",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>{item.overDueDate || "—"}</p>
      )
    },
    {
      label: "Sub total",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>₹{Math.ceil(item.subTotal) || 0}</p>
      )
    },
    {
      label: "GST",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>₹{Math.ceil(item.totalGSTAmount || 0)}
          {/* ({Number(item.totalCGSTPercent || 0) + Number(item.totalSGSTPercent || 0)}%) */}
        </p>
      )
    },
    {
      label: "Total",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[13px]'>₹{Math.ceil(item.totalAmount || 0)}</p>
      )
    },
    {
      label: "Status",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p
          className={`text-[11px] lg:text-[13px] capitalize px-2 py-0.5 rounded-md w-fit ${getStatusStyle(item.status)}`}
        >
          {item.status || "—"}
        </p>
      )
    },

    {
      label: "View",
      className: "p-4",
      className: "text-center",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <button
          type="button"
          onClick={() => openInvoicePreview(item)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye size={18} />
        </button>
      ),
    },

    {
      label: "Actions",
      className: "pl-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <div className="flex  gap-3">
          <button
            type="button"
            onClick={() => handleDownload(item?.id)}
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
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

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
        <p className="text-gray-500 animate-pulse">Loading Invoices list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <PageHeader
        title="Invoices"
        subTitle="Manage all invoices across companies"
      >
        <ButtonComponent
          handleButtonClick={() =>
            navigate("/create-invoice", {
              state: {
                companyId: companyId,
              },
            })
          }
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Plus size={18} strokeWidth={3} />
          Create Invoice
        </ButtonComponent>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-2">
        <SummaryCard title="Total Invoices" value={counts.totalInvoices} color="text-blue-600" titleColor="text-blue-600"/>
        
        <SummaryCard title="Paid" value={counts.totalPaidInvoices} color="text-green-600" titleColor="text-green-600"/>
                  
        <SummaryCard title="Partially Paid" value={counts.totalPartiallyPaidInvoices} color="text-cyan-500"
                      titleColor="text-cyan-500"/>
                  
        <SummaryCard title="Pending" value={counts.totalPendingInvoices} color="text-lime-700"
                      titleColor="text-lime-700"/>
                  
        <SummaryCard title="Overdue" value={counts.totalOverdueInvoices} color="text-red-500" titleColor='text-red-500'/>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search by incoice number ort status..."
          noWrap
        >
          <div className="w-full sm:w-[200px]">
            <SelectField
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              optionLabel="Select Status"
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

        {error && <p>Invoice get : <span className="text-red-500">{error}</span></p>}

        {invoices &&
          <>
            <div className="">
              <TableComponent
                columns={columns}
                data={invoices}
              />
            </div>

          </>
        }
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

      </div>

      <InvoicePreviewModal
        isOpen={isInvoiceModalOpen}
        onClose={closeInvoicePreview}
        invoiceId={previewInvoice}
      />

    </div>
  )
}
