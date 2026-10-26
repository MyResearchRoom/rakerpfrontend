import { FileSpreadsheet, FileText, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount, fetchAccountForExcel } from '../../../store/actions/accountAction';
import InputField from '../../../components/comman/InputField';
import SelectField from '../../../components/comman/SelectField';
import ButtonComponent from '../../../components/comman/ButtonComponent';
import { Oval } from 'react-loader-spinner';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatCurrency } from '../../../components/comman/formateCurrency';

const FilterTypes = [
    { label: "Expense", value: "expense" },
    { label: "Receipt", value: "receipt" },
  ];

export default function LedgerExportModel({ isOpen, onClose,companyId }) {
    const [selectedCompany, setSelectedCompany] = useState(companyId ||"");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [type,setType]=useState("");
    const dispatch=useDispatch();

    useEffect(() => {
        if (!isOpen) return; 
        dispatch(
            fetchAccountForExcel({
                searchTerm:'',
                companyId:selectedCompany,
                type:type,
                fromDate:startDate,
                toDate:endDate,
                page:'',
                limit:"All"
            })
        );
    }, [isOpen,selectedCompany,type,startDate,endDate, dispatch]);

    const { companies, error: companyError, loading: companyLoading, } = useSelector(
          (state) => state.companyDropdownData
    );

    const { account, totalPages, error, total, loading } = useSelector(
          (state) => state.accountForExcel
    );

    if (loading) {
    return(
    <div className="flex flex-col gap-2 justify-center items-center h-40">
        <Oval
            height={60}
            width={60}
            color="#2563eb"
            secondaryColor="#93c5fd"
            strokeWidth={4}
            strokeWidthSecondary={4}
        />
        <p className="text-gray-500 animate-pulse ">Loading account data...</p>
    </div>
    );
    };

    const exportToExcel = () => {
        if (!account || account.length === 0) {
            toast.error("No account data available");
            return;
        }

        const tableData = account.map((item, index) => [
            index + 1,
            item?.date || "-",
            item?.transactionId || "-",
            item?.company || "-",
            item?.description || "-",
            formatCurrency(item.debit) || "0",
            formatCurrency(item.credit) || "0",
            formatCurrency(item.balance) || "0",
            item?.reference || "-",
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            ["Account Report"],
            [],
            [],
            [
            "Sr No",
            "Date",
            "Transaction ID",
            "Company",
            "Description",
            "Debit",
            "Credit",
            "Balance",
            "Reference",
            ],
            ...tableData,

            [], 

            [
                "",
                "",
                "",
                "",
                "",
                `Total Debit: ${formatCurrency(total?.totalDebit) || "0"}`,
                `Total Credit: ${formatCurrency(total?.totalCredit) || "0"}`,
                `Total Balance: ${formatCurrency(total?.totalBalance) || "0"}`
            ],

        ]);

        worksheet["!cols"] = new Array(9).fill({ wch: 18 });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Account-Report");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fileName = `Account-Report.xlsx`;

        saveAs(data, fileName);
    };

    if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="mb-4 flex items-start justify-between border-b-2 border-gray-300 px-6 py-4">

                <div className='flex flex-row gap-2 items-center'>
                    <FileText size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Download report
                    </h3>
                </div>
                

                <button
                    onClick={onClose}
                    className="rounded-full bg-gray-100 p-1 text-gray-500 hover:text-gray-900"
                >
                    <X size={20} />
                </button>
            </div>

            <div className='flex flex-row flex-wrap gap-x-5 gap-y-2 px-6 py-2'>
                <div className="min-w-[200px]">
                <SelectField
                  name="company"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  options={companies}
                  labelKey='name'
                  valueKey='id'
                  optionLabel="Select company"
                  disabled={companyId}
                />
              </div>

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
                <p className='text-sm font-semibold'>From :</p>
                <InputField
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="min-w-[200px] flex flex-row items-center gap-1">
                <p className='text-sm font-semibold'>To : </p>
                <InputField
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className='px-6 py-2 pb-5'>
                {loading ? (
                    <p className=''>Wait..  Data is loading</p>
                ) : account && account.length > 0 ? (
                    <p className='text-blue-500'>Ready to download</p>
                ) : (
                    <p className='text-orange-400'>No data found to download</p>
                )}
            </div>

            <div className='px-6 py-4 flex flex-row gap-4 ml-auto justify-end border-t-2 border-gray-300 w-full'>
                <ButtonComponent
                    handleButtonClick={onClose}
                    className="bg-gray-100 text-gray-700 rounded-md"
                >
                    <p className="text-black border border-gray-200 px-4 py-2 rounded-md">Cancel</p>
                </ButtonComponent>
                

                <ButtonComponent
                    handleButtonClick={exportToExcel}
                    className="p-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                >
                    <FileSpreadsheet size={18} /> {loading ? "loading..." : "Download Excel"}
                </ButtonComponent>
            </div>
            
        </div>
    </div>
  )
}
