import { Download, Eye, MoveLeft, Plus, Printer, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
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
import { fetchCompanyDropdownList } from '../../store/actions/companyAction';
import { fetchReceipts } from '../../store/actions/receiptsActions';
import AddReceiptModal from '../../models/admin/receipts/AddReceiptModal';
import DeleteReceiptModal from '../../models/admin/receipts/deleteReceiptModal';
import ReceiptPreviewModal from '../../components/comman/ReceiptPreviewModal';
import { downloadReceiptDocument } from '../../utils/downloadReceipt';
import { getReceiptById } from '../../services/receipt';
import { printReceiptDocument } from '../../utils/printReceipt';
import { fetchCount } from '../../store/actions/countAction';
import ReceiptPortal from '../../components/feature/AdminAndEmployee/receipt/receiptPortal';

const paymentOptions = [
    { label: "Bank Transfer", value: "bank transfer" },
    { label: "UPI", value: "upi" },
    { label: "Cash", value: "cash" },
    { label: "Cheque", value: "cheque" },
    { label: "Card", value: "card" },
];

// Dynamically generate financial year options:
// Always returns [previous FY, current FY, next FY]
// Indian FY runs April 1 – March 31
// e.g. if today is June 2025 → base year = 2025 → options: 2024-2025, 2025-2026, 2026-2027
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

export default function Recipts() {
    const dispatch = useDispatch();
    const [showPortal, setShowPortal] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [companyId, setCompanyId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [date, setDate] = useState('');
    const [financialYear, setFinancialYear] = useState('');

    const [addReceiprtModelOpen, setAddReceiprtModelOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const { companies, error: companyError, loading: companyLoading } = useSelector(
        (state) => state.companyDropdownData
    );

    const openReceiptPreview = (receiptId) => {
        setSelectedReceipt(receiptId);
        setIsPreviewOpen(true);
    };

    const closeReceiptPreview = () => {
        setSelectedReceipt(null);
        setIsPreviewOpen(false);
    };

    useEffect(() => {
        dispatch(fetchCompanyDropdownList());
    }, [dispatch]);

    const { receipts, totalPages, error, loading } = useSelector(
        (state) => state.receipts
    );

    useEffect(() => {
        if (!showPortal) {

            dispatch(
                fetchReceipts({
                    searchTerm,
                    date,
                    companyId,
                    paymentMethod,
                    financialYear,
                    page: currentPage,
                })
            );
        }
    }, [showPortal, searchTerm, date, companyId, paymentMethod, financialYear, currentPage, dispatch]);

    const { counts, error: countError, loading: countLoading } = useSelector(
        (state) => state.counts
    );

    useEffect(() => {
        dispatch(fetchCount());
    }, [dispatch]);

    const handleDownloadReceipt = async (receipt) => {
        if (!receipt?.id) return;
        const response = await getReceiptById(receipt?.id);
        if (!response) return;
        downloadReceiptDocument(response);
    };

    const handlePrint = async (receiptId) => {
        if (!receiptId) return;
        const response = await getReceiptById(receiptId);
        if (!response) return;
        printReceiptDocument(response);
    };

    const columns = [
        {
            label: "Receipt ",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <p className='text-[13px]'>{item.receiptNumber || "—"}</p>
            )
        },
        {
            label: "Invoice",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <p className='text-[13px]'>{item?.invoice?.invoiceNumber || "—"}</p>
            )
        },
        {
            label: "Company",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px] break-all",
            render: (item) => (
                <p className='text-[13px] capitalize break-all whitespace-normal'>{item?.company?.name || "—"}</p>
            )
        },
        {
            label: "Payment Date",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <p className='text-[13px]'>{item?.paymentDate || "—"}</p>
            )
        },
        {
            label: "Method",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <p className='text-[13px] capitalize'>{item?.paymentMethod || "—"}</p>
            )
        },
        {
            label: "Amount",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <p className='text-[13px] font-semibold text-green-500'>₹{Number(item.amount || 0)}</p>
            )
        },
        {
            label: "View",
            className: "p-4",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            render: (item) => (
                <button
                    type="button"
                    onClick={() => openReceiptPreview(item?.id)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Eye size={18} />
                </button>
            ),
        },
        {
            label: "Actions",
            headerClassName: "font-semibold text-black text-[13px] lg:text-[15px]",
            className: "whitespa",
            render: (item) => (
                <div className="flex gap-2 lg:gap-3">
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
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedReceipt(item?.id);
                            setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    const handleButtonClick = () => {
        setAddReceiprtModelOpen(true);
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
                <p className="text-gray-500 animate-pulse ">Loading receipts list...</p>
            </div>
        );
    }

    if (showPortal) {
        return (
            <ReceiptPortal
                companies={companies}
                selectedCompany={companyId}
                setSelectedCompany={setCompanyId}
                financialYear={financialYear}
                setFinancialYear={setFinancialYear}
                financialYearOptions={financialYearOptions}
                onViewAll={() => {
                    setCompanyId("");
                    setFinancialYear("");
                    setShowPortal(false);
                }}
                onContinue={() => setShowPortal(false)}
            />
        );
    }

    return (
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
            <div className='flex flex-row items-start gap-2 w-full'>
                <MoveLeft className='text-gray-900 mt-2' onClick={() => setShowPortal(true)} />
                <PageHeader title="Receipts" subTitle="Track all received payments" showLeftArrow={false}>
                    <ButtonComponent
                        handleButtonClick={handleButtonClick}
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-4 py-2 rounded-lg"
                    >
                        <Plus size={18} strokeWidth={3} />
                        Add Receipt
                    </ButtonComponent>
                </PageHeader>
            </div>

            <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
                <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-3">All Companies Overall Recipts</h2>

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

            </section>

            <div className="rounded-md border border-gray-200 bg-white p-2 md:p-3 lg:p-4 space-y-4">
                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholer="Search by invoice no. or receipt no or company name..."
                    noWrap
                >
                    <div className="min-w-[200px]">
                        <SelectField
                            name="companyId"
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            options={companies}
                            optionLabel="Select Companies"
                            valueKey="id"
                            labelKey="name"
                        />
                    </div>
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
                    {/* Dynamic Financial Year Filter */}
                    <div className="w-full sm:w-[200px]">
                        <SelectField
                            name="financialYear"
                            value={financialYear}
                            onChange={(e) => {
                                setFinancialYear(e.target.value);
                                setCurrentPage(1); // reset to page 1 on filter change
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
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </FilterBar>

                {error && <p>Receipts get : <span className="text-red-500">{error}</span></p>}
                {companyError && <p>Company get : <span className="text-red-500">{companyError}</span></p>}
                {countError && <p>Count get : <span className="text-red-500">{countError}</span></p>}

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

            <AddReceiptModal
                isOpen={addReceiprtModelOpen}
                onClose={() => setAddReceiprtModelOpen(false)}
                companyId={companyId}
            />

            <DeleteReceiptModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedReceipt(null);
                }}
                receiptId={selectedReceipt}
            />

            <ReceiptPreviewModal
                isOpen={isPreviewOpen}
                onClose={closeReceiptPreview}
                receiptId={selectedReceipt}
            />
        </div>
    );
}
