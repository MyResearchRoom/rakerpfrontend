import React, { useEffect, useState } from "react";
import {
  Building2,
  ReceiptIndianRupee,
  ChevronRight,
  Layers3,
} from "lucide-react";

import ButtonComponent from "../../../comman/ButtonComponent";
import SelectField from "../../../comman/SelectField";

export default function InvoicePortal({
  companies = [],
  selectedCompany,
  setSelectedCompany,
  financialYear,
  setFinancialYear,
  financialYearOptions = [],
  onViewAll,
  onContinue,
}) {
  const [localCompany, setLocalCompany] = useState(selectedCompany || "");
  const [localFinancialYear, setLocalFinancialYear] = useState(financialYear || "");

  useEffect(() => {
    setLocalCompany(selectedCompany || "");
  }, [selectedCompany]);

  useEffect(() => {
    setLocalFinancialYear(financialYear || "");
  }, [financialYear]);

  const handleContinue = () => {
    setSelectedCompany(localCompany);
    setFinancialYear(localFinancialYear);
    onContinue?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-10 rounded-3xl bg-blue-400 px-10 py-12 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
                <ReceiptIndianRupee size={42} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Invoices Portal
                </h1>
                <p className="mt-2 text-sm md:text-base text-blue-100">
                  Manage company Invoices, records, and financial entries.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Invoices management system</p>
              <h3 className="mt-1 text-2xl font-bold">RAK Advisory</h3>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Invoices Management Access
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              View all Invoices or continue with a selected company.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* VIEW ALL INVOICES */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Layers3 size={18} />
                View All Invoices
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <ReceiptIndianRupee size={30} className="text-blue-600" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Invoices Dashboard
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Access all company Invoices, filters, summaries, and financial
                records in one place.
              </p>
              <ButtonComponent
                handleButtonClick={onViewAll}
                className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <div className="flex items-center justify-center gap-2">
                  Open Invoices
                  <ChevronRight size={18} />
                </div>
              </ButtonComponent>
            </div>

            {/* SELECT COMPANY */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Building2 size={18} />
                Select Company
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Building2 size={30} className="text-blue-600" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Company Invoices
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Continue with a selected company and manage only its Invoices
                entries and records.
              </p>

              {/* Choose Company */}
              <div className="mt-6">
                <SelectField
                  value={localCompany}
                  onChange={(e) => setLocalCompany(e.target.value)}
                  options={companies}
                  labelKey="name"
                  valueKey="id"
                  optionLabel="Choose Company"
                />
              </div>

              {/* Select Financial Year — below Choose Company */}
              <div className="mt-3">
                <SelectField
                  value={localFinancialYear}
                  onChange={(e) => setLocalFinancialYear(e.target.value)}
                  options={financialYearOptions}
                  labelKey="label"
                  valueKey="value"
                  optionLabel="Select Financial Year"
                />
              </div>

              <ButtonComponent
                handleButtonClick={handleContinue}
                disabled={!localCompany}
                className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-2">
                  Continue
                  <ChevronRight size={18} />
                </div>
              </ButtonComponent>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
