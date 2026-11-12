import React, { useEffect, useState } from "react";
import { Building2, Calendar, FileCheck2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ButtonComponent from "../../../comman/ButtonComponent";
import SelectField from "../../../comman/SelectField";
import { fetchCompanyDropdownList } from "../../../../store/actions/companyAction";
import { getFinancialYearOptions } from "../../../../services/compliance"; // ← new import

const CompliancePortal = ({
  companies,
  selectedCompany,
  selectedFinancialYear,
  setSelectedCompany,
  setSelectedFinancialYear,
  onContinue,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies: storeCompanies } = useSelector((state) => state.companyDropdownData);
  const companyOptions = companies || storeCompanies || [];

  const [localCompany, setLocalCompany]           = useState(selectedCompany || "");
  const [localFinancialYear, setLocalFinancialYear] = useState(selectedFinancialYear || "");

  // ── Indian FY options fetched from backend ─────────────────────────────────
  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [fyLoading, setFyLoading]                       = useState(true);

  useEffect(() => {
    const fetchFYOptions = async () => {
      try {
        setFyLoading(true);
        const data = await getFinancialYearOptions(); // returns [{ label, value, tag }]
        setFinancialYearOptions(data);
      } catch {
        // fallback: derive Indian FY on the client if API fails
        const today       = new Date();
        const month       = today.getMonth() + 1;
        const year        = today.getFullYear();
        const fyStart     = month >= 4 ? year : year - 1;
        setFinancialYearOptions([
          { label: `${fyStart - 1}-${fyStart}`,     value: `${fyStart - 1}-${fyStart}`,     tag: "Previous Year" },
          { label: `${fyStart}-${fyStart + 1}`,     value: `${fyStart}-${fyStart + 1}`,     tag: "Current Year"  },
          { label: `${fyStart + 1}-${fyStart + 2}`, value: `${fyStart + 1}-${fyStart + 2}`, tag: "Next Year"     },
        ]);
      } finally {
        setFyLoading(false);
      }
    };

    fetchFYOptions();
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setLocalCompany(selectedCompany || "");
    setLocalFinancialYear(selectedFinancialYear || "");
  }, [selectedCompany, selectedFinancialYear]);

  useEffect(() => {
    if (!companies && (!storeCompanies || storeCompanies.length === 0)) {
      dispatch(fetchCompanyDropdownList());
    }
  }, [companies, dispatch, storeCompanies]);

  const handleContinue = () => {
    setSelectedCompany?.(localCompany);
    setSelectedFinancialYear?.(localFinancialYear);

    if (onContinue) {
      onContinue();
      return;
    }

    navigate("/compliance/upload", {
      state: {
        companyId:     localCompany,
        financialYear: localFinancialYear,
      },
    });
  };

  const disable = !localCompany || !localFinancialYear;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-10 rounded-3xl bg-blue-400 px-10 py-12 text-white shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">
                <FileCheck2 size={42} />
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Compliance Portal
                </h1>

                <p className="mt-2 text-blue-100 text-sm md:text-base">
                  Access and manage company compliance documents,
                  certificates, and records.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">
                Secure compliance management system
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
              Select Compliance Details
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose a company and financial year to continue.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* COMPANY */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Building2 size={18} />
                Select Company
              </div>

              <SelectField
                value={localCompany}
                onChange={(e) => setLocalCompany(e.target.value)}
                options={companyOptions}
                labelKey="name"
                valueKey="id"
                optionLabel="Choose Company"
              />
            </div>

            {/* FINANCIAL YEAR */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar size={18} />
                Financial Year
              </div>

              {fyLoading ? (
                <div className="h-10 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-400">
                  Loading...
                </div>
              ) : (
                <SelectField
                  value={localFinancialYear}
                  onChange={(e) => setLocalFinancialYear(e.target.value)}
                  options={financialYearOptions}
                  labelKey="label"
                  valueKey="value"
                  optionLabel="Select Financial Year"
                />
              )}
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-8 flex justify-end">
            <ButtonComponent
              handleButtonClick={handleContinue}
              disabled={disable || fyLoading}
              className={`rounded-2xl px-8 py-3 text-sm font-semibold text-white transition ${
                disable || fyLoading
                  ? "cursor-not-allowed bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Continue to Upload
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePortal;
