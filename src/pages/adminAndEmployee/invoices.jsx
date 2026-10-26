import { Download, Eye, MoveLeft, Plus, Printer, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from "../../components/comman/PageHeader";
import ButtonComponent from "../../components/comman/ButtonComponent";
import FilterBar from '../../components/comman/FilterBar';
import TableComponent from '../../components/comman/TableComponent';
import Pagination from '../../components/comman/Pagination';
import SelectField from '../../components/comman/SelectField';
import InputField from '../../components/comman/InputField';
import SummaryCard from "../../components/comman/SummaryCard";
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../../store/actions/invoiceActions';
import getStatusStyle from '../../components/comman/invoiceSttausStyle';
import { fetchCompanyDropdownList } from '../../store/actions/companyAction';
import InvoicePreviewModal from '../../components/comman/InvoicePreviewModal';
import { getInvoiceById } from '../../services/invoice';
import { downloadInvoiceDocument } from '../../utils/downloadInvoice';
import { printInvoiceDocument } from '../../utils/printInvoice';
import DeleteInvoiceModal from '../../models/admin/invoice/deleteInvoiceModal';
import { fetchCount } from '../../store/actions/countAction';
import InvoicePortal from '../../components/feature/AdminAndEmployee/invoice/invoiceProtal';

const statusOptions = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Partially Paid", value: "partially paid" },
  { label: "Overdue", value: "overdue" },
];

// Dynamically generate financial year options (Indian FY: April 1 – March 31)
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

export default function Invoices() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const isShowPortal = location.state?.showPortal;

  const [showPortal, setShowPortal] = useState(true);

  useEffect(() => {
    if(isShowPortal===false) {
      setShowPortal(false);
    } else{
      setShowPortal(true);
    }
  }, [isShowPortal]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // financialYear is now lifted up so InvoicePortal can also use it
  const [financialYear, setFinancialYear] = useState('');

  const { companies, error: companyError, loading: companyLoading } = useSelector(
    (state) => state.companyDropdownData
  );

  useEffect(() => {
    dispatch(fetchCompanyDropdownList());
  }, [dispatch]);

  const { invoices, totalPages, error, loading } = useSelector(
    (state) => state.invoices
  );

  useEffect(() => {
    if (!showPortal) {
      const selectedFY = financialYearOptions.find((fy) => fy.value === financialYear);

      dispatch(
        fetchInvoices({
          searchTerm,
          date,
          companyId,
          status,
          financialYear,
          page: currentPage,
          
        })
      );
    }
  }, [showPortal, searchTerm, date, companyId, status, financialYear, currentPage, dispatch]);

  const { counts, error: countError, loading: countLoading } = useSelector(
    (state) => state.counts
  );

  useEffect(() => {
    dispatch(fetchCount());
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
    if (!response) return;
    downloadInvoiceDocument(response);
  };

  const handlePrint = async (invoiceId) => {
    if (!invoiceId) return;
    const response = await getInvoiceById(invoiceId);
    if (!response) return;
    printInvoiceDocument(response);
  };

  const columns = [
    {
      label: "Invoice",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.invoiceNumber || "—"}</p>
      )
    },
    {
      label: "Company",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px] capitalize break-all'>{item?.company?.name || "—"}</p>
      )
    },
    {
      label: "Date",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>{item.invoiceDate || "—"}</p>
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
        <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.subTotal) || 0}</p>
      )
    },
    {
      label: "GST",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalGSTAmount || 0)}</p>
      )
    },
    {
      label: "Total",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className='text-[11px] lg:text-[13px]'>₹{Math.ceil(item.totalAmount || 0)}</p>
      )
    },
    {
      label: "Status",
      className: "p-4",
      headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
      render: (item) => (
        <p className={`text-[11px] lg:text-[13px] capitalize px-2 py-0.5 rounded-md w-fit ${getStatusStyle(item.status)}`}>
          {item.status || "—"}
        </p>
      )
    },
    {
      label: "View",
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
        <div className="flex gap-2 lg:gap-3">
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
          <button
            type="button"
            onClick={() => {
              setSelectedInvoice(item?.id);
              setIsDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ── Portal (first screen) — now receives financialYear state ──
  if (showPortal) {
    return (
      <InvoicePortal
        companies={companies}
        selectedCompany={companyId}
        setSelectedCompany={setCompanyId}
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        financialYearOptions={financialYearOptions}
        onViewAll={() => {
          setCompanyId("");
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
        <p className="text-gray-500 animate-pulse">Loading Invoices list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <div className='flex flex-row items-start gap-2 w-full'>
        <MoveLeft className='text-gray-900 mt-2' onClick={() => setShowPortal(true)} />
        <PageHeader
          title="Invoices"
          subTitle="Manage all invoices across companies"
          showLeftArrow={false}
        >
          <ButtonComponent
            handleButtonClick={() =>
              navigate("/create-invoice", {
                state: { companyId: companyId },
              })
            }
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Plus size={18} strokeWidth={3} />
            Create Invoice
          </ButtonComponent>
        </PageHeader>
      </div>

      <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
          <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-3">All Companies Overall Invoices</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-2">
          <SummaryCard title="Total Invoices" value={counts.totalInvoices} color="text-blue-600" titleColor="text-blue-600"/>
          <SummaryCard title="Paid" value={counts.totalPaidInvoices} color="text-green-600" titleColor="text-green-600"/>
          <SummaryCard title="Partially Paid" value={counts.totalPartiallyPaidInvoices} color="text-cyan-500"
              titleColor="text-cyan-500"/>
          <SummaryCard title="Pending" value={counts.totalPendingInvoices} color="text-lime-700"
              titleColor="text-lime-700"/>
          <SummaryCard title="Overdue" value={counts.totalOverdueInvoices} color="text-red-500" titleColor='text-red-500'/>
        </div>

      </section>

      <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer="Search by company name or invoice number..."
          setCurrentPage={setCurrentPage}
          noWrap
        >
          <div className="min-w-[200px]">
            <SelectField
              name="companyId"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setCurrentPage(1);
              }}
              options={companies}
              optionLabel="Select Companies"
              valueKey="id"
              labelKey="name"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <SelectField
              name="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={statusOptions}
              optionLabel="Select Status"
              valueKey="value"
              labelKey="label"
            />
          </div>
          {/* Financial Year filter — still available on the inner screen too */}
          <div className="w-full sm:w-[200px]">
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
          <div className="w-full sm:w-[200px]">
            <InputField
              type="date"
              name="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </FilterBar>

        {error && <p>Invoice get : <span className="text-red-500">{error}</span></p>}
        {companyError && <p>Company get : <span className="text-red-500">{companyError}</span></p>}
        {countError && <p>Count get : <span className="text-red-500">{countError}</span></p>}

        {invoices &&
          <div>
            <TableComponent
              columns={columns}
              data={invoices}
            />
          </div>
        }
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      <InvoicePreviewModal
        isOpen={isInvoiceModalOpen}
        onClose={closeInvoicePreview}
        invoiceId={previewInvoice}
      />

      <DeleteInvoiceModal
        isOpen={isDeleteModalOpen}
        invoiceId={selectedInvoice}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
