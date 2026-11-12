import React, { useEffect, useState } from "react";
import {
  Building2,
  Wallet,
  ChevronRight,
  Layers3,
} from "lucide-react";

import ButtonComponent from "../../../comman/ButtonComponent";
import SelectField from "../../../comman/SelectField";
import { useNavigate } from "react-router-dom";

const AccountsPortal = ({
  companies = [],
  selectedCompany,
  setSelectedCompany,
  financialYear,
  setFinancialYear,
  financialYearOptions = [],
  onContinue,
}) => {

  console.log(financialYearOptions);
  const navigate=useNavigate();

  const [viewType, setViewType] = useState("all");

  const [localCompany, setLocalCompany] = useState(
    selectedCompany || ""
  );
  const [localFinancialYear, setLocalFinancialYear] = useState(
    financialYear || ""
  );

  useEffect(() => {
    setLocalCompany(selectedCompany || "");
  }, [selectedCompany]);

  useEffect(() => {
    setLocalFinancialYear(financialYear || "");
  }, [financialYear]);

  const handleContinue = () => {
    if (viewType === "all") {
      setSelectedCompany("");
      setFinancialYear("");
    } else {
      setSelectedCompany(localCompany);
      setFinancialYear(localFinancialYear);
    }

    onContinue?.();
  };

  const disable =
    viewType === "company" &&
    (!localCompany || !localFinancialYear);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-10 rounded-3xl bg-blue-400 px-10 py-12 text-white shadow-xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
                <Wallet size={42} />
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Accounts Portal
                </h1>

                <p className="mt-2 text-sm md:text-base text-blue-100">
                  Manage company accounts, ledgers, receipts,
                  and transactions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">
                Financial management system
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                RAK Advisory
              </h3>
            </div>
          </div>
        </div>


        {/* MAIN CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Accounts Management Access
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View all accounts or continue with a selected company.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* VIEW ALL */}
            <button
              type="button"
              onClick={() => setViewType("all")}
              className={`rounded-2xl border p-6 text-left transition-all 
               ${viewType === "all"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-gray-50"
                }
              `}
            >

              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Layers3 size={18} />
                View All Accounts
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Layers3
                  size={30}
                  className="text-blue-600"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Accounts Dashboard
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Access all company ledgers, balances,
                receipts, expenses, and transaction records.
              </p>

              {viewType === "all" && (
                <div className="mt-6 inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
                  Selected
                </div>
              )}

              <ButtonComponent
                // handleButtonClick={onViewAll}
                 handleButtonClick={()=>navigate("/allaccounts")}
                className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <div className="flex items-center justify-center gap-2">
                  Open Accounts
                  <ChevronRight size={18} />
                </div>
              </ButtonComponent>
            </button>

            {/* SELECT COMPANY */}
            <button
              type="button"
              onClick={() => setViewType("company")}
              className={`rounded-2xl border p-6 text-left flex flex-col transition-all ${viewType === "company"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-gray-50"
                }`}
            >

              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Building2 size={18} />
                Select Company
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                <Building2
                  size={30}
                  className="text-indigo-600"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Company Accounts
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Continue with a selected company and manage
                only its ledger and account records.
              </p>

              {viewType === "company" && (
                <div className="mt-6">
                  <SelectField
                    value={localCompany}
                    onChange={(e) =>
                      setLocalCompany(e.target.value)
                    }
                    options={companies}
                    labelKey="name"
                    valueKey="id"
                    optionLabel="Choose Company"
                  />

                  <div className="mt-3">
                    <SelectField
                      value={localFinancialYear}
                      onChange={(e) =>
                        setLocalFinancialYear(e.target.value)
                      }
                      options={financialYearOptions}
                      labelKey="label"
                      valueKey="value"
                      optionLabel="Select Financial Year"
                    />
                  </div>
                </div>
              )}

              {viewType === "company" && (
                <div className="mt-6 inline-flex rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white w-fit">
                  Selected
                </div>
              )}

              <ButtonComponent
                handleButtonClick={handleContinue}
                disabled={disable}
                className={`rounded-2xl mt-5  px-8 py-3 text-sm font-semibold text-white transition  ${disable ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                <div className="flex items-center gap-2">
                  Continue
                  <ChevronRight size={18} />
                </div>
              </ButtonComponent>
            </button>
          </div>

          {/* BUTTON */}
          <div className="mt-8 flex justify-end">


          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPortal;