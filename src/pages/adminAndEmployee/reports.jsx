import React from "react";
import {
  FaBalanceScale,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaFileAlt,
} from "react-icons/fa";
import { MdOutlineAssessment } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";

const reports = [
  {
    title: "Balance Sheet",
    description:
      "View your assets, liabilities and equity summary.",
    icon: <FaBalanceScale size={28} />,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "Profit & Loss",
    description:
      "View your income, expenses and net profit/loss.",
    icon: <MdOutlineAssessment size={28} />,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "Cash Flow",
    description:
      "Track cash inflows and outflows in your business.",
    icon: <FaMoneyBillWave size={28} />,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    title: "GST Reports",
    description:
      "View GST Sales, Purchases and Expenses reports.",
    icon: <FaFileInvoiceDollar size={28} />,
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Reports
        </h1>

        <p className="mt-2 text-gray-500">
          Generate and view your business reports
        </p>
      </div>

      {/* Report Categories */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">
          Report Categories
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {reports.map((report) => (
            <div
              key={report.title}
              className="group flex min-h-[250px] flex-col justify-between rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-md"
            >
              <div>
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${report.bg} ${report.color}`}
                >
                  {report.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-800">
                  {report.title}
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  {report.description}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <FiArrowRight
                  size={22}
                  className={`${report.color} transition-transform group-hover:translate-x-1`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-slate-800">
          Report Filters
        </h2>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              From Date
            </label>

            <input
              type="date"
              className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              To Date
            </label>

            <input
              type="date"
              className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Financial Year
            </label>

            <select className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500">
              <option>Select financial year</option>
              <option>2025-26</option>
              <option>2024-25</option>
              <option>2023-24</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="h-12 w-full rounded-xl bg-blue-600 font-medium text-white transition-all hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-3 text-blue-700">
          <IoInformationCircleOutline size={22} />

          <p className="text-sm">
            Select a report category above and apply filters to
            generate the report.
          </p>
        </div>
      </div>
    </div>
  );
}