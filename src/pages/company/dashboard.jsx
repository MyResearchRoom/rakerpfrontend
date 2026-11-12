// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { invoiceData } from "../../data/invoiceData";
// import { receiptData } from "../../data/receiptData";
// import { companyData } from "../../data/companyData";
// import ButtonComponent from "../../components/comman/ButtonComponent";
// import { fetchCompanyDashboardCount, fetchCount } from "../../store/actions/countAction";
// import { Oval } from "react-loader-spinner";
// import SummaryCard, { RevenueSummaryCard } from "../../components/comman/SummaryCard";
// import getCompanyStatusStyle from "../../components/comman/companyStatusStyle";
// import { fetchInvoices } from "../../store/actions/invoiceActions";
// import DashInvoice from "../../components/feature/company/dashInvoice";
// import { fetchCompanyDataById } from "../../store/actions/companyAction";
// import { TrendingUp } from "lucide-react";
// import { formatCurrency } from "../../components/comman/formateCurrency";
// import { FaRegFileAlt } from "react-icons/fa";
// import {
//   FaFileInvoiceDollar,
//   FaReceipt,
//   FaShieldAlt,
// } from "react-icons/fa";

// const QuickActionCard = ({ icon: Icon, title, description, iconColor, onClick }) => (
//   <div
//     onClick={onClick}
//     className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
//   >
//     <div className={`p-3 rounded-lg ${iconColor} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform`}>
//       <Icon className={`w-6 h-6 ${iconColor.replace('bg-', 'text-')}`} />
//     </div>
//     <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
//     <p className="text-xs text-gray-500 mt-1">{description}</p>
//   </div>
// );

// const stats = [
//   { label: "Total Invoices", icon: "📄" },
//   { label: "Total Receipts", icon: "📥" },
//   { label: "Outstanding Amount", icon: "💰" },
//   { label: "Compliance Docs", icon: "🛡" },
// ];

// const CompanyDashboard = () => {
//   const userEmail = useSelector((state) => state.auth.user?.email);
//   const{ companyId }=useSelector((state) => state.auth);

//   const dispatch=useDispatch();

//   const currentYear = new Date().getFullYear();

//   const yearOptions = Array.from({ length: 8 }, (_, index) => currentYear - 5 + index);

//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   const { counts, error: countError, loading: countLoading, } = useSelector(
//     (state) => state.companyDashCount
//   );

//   useEffect(() => {
//         dispatch(fetchCompanyDashboardCount(selectedYear));
//     }, [dispatch,selectedYear]);

//   const navigate = useNavigate();

//   const { company, error,loading } = useSelector(
//     (state) => state.companyById
//   );

//   useEffect(() => {
//     dispatch(
//       fetchCompanyDataById(companyId)
//     );
//   }, [companyId]);

//   if (countLoading || loading) {
//     return(
//     <div className="flex flex-col gap-2 justify-center items-center h-40">
//         <Oval
//             height={60}
//             width={60}
//             color="#2563eb"
//             secondaryColor="#93c5fd"
//             strokeWidth={4}
//             strokeWidthSecondary={4}
//         />
//         <p className="text-gray-500 animate-pulse">Loading data...</p>
//     </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-2 lg:px-4 py-4">
//       <div className="w-full space-y-6">
//         <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//           <div>

//             <h1 className="text-3xl font-bold text-gray-900">
//               Welcome to Your Portal
//             </h1>
//             <p className="text-sm text-gray-500">
//               View your invoices, receipts, and compliance documents
//             </p>
//           </div>
//           <div
//             className={`rounded-2xl py-2 px-4 text-sm font-medium shadow uppercase ${getCompanyStatusStyle(
//               company?.status
//             )}`}
//           >
//             {company?.status}
//           </div>
//         </header>

//         <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//           <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-3">Company Overview</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">

//             <SummaryCard
//               title="Total Board of Directors"
//               value={counts.totalBoardOfDirectors}
//               color="text-blue-600"
//               titleColor="text-blue-600"
//             />

//             <SummaryCard
//               title="Women Board of Directors"
//               value={counts.totalFemaleBoardOfDirectors}
//               color="text-emerald-600"
//               titleColor="text-emerald-600"
//             />

//             <SummaryCard
//               title="Total Members"
//               value={counts.totalFarmerMembers}
//               color="text-indigo-600"
//               titleColor="text-indigo-600"
//             />

//             <SummaryCard
//               title="Total Women Members"
//               value={counts.totalFemaleFarmerMembers}
//               color="text-pink-600"
//               titleColor="text-pink-600"
//             />

//             <SummaryCard
//               title="Total Land holding"
//               value={counts.totalLandholdingAcres}
//               color="text-lime-700"
//               titleColor="text-lime-700"
//               subtitle="In acres"
//               subtitleColor="text-lime-700"
//             />

//             <SummaryCard
//               title="Total Small Farmers"
//               value={counts.totalSmallFarmers}
//               color="text-teal-600"
//               titleColor="text-teal-600"
//             />

//             <SummaryCard
//               title="Total Marginal Farmers"
//               value={counts.totalMarginalFarmers}
//               color="text-cyan-700"
//               titleColor="text-cyan-700"
//             />

//             <SummaryCard
//               title="Total Compliance"
//               value={counts.totalComplianceDocument}
//               color="text-blue-600"
//               titleColor="text-blue-600"
//             />

//             <SummaryCard
//               title="Valid Compliance"
//               value={counts.validComplianceDoc}
//               color="text-green-600"
//               titleColor="text-green-600"
//               subtitle={`In ${selectedYear}`}
//               subtitleColor="text-green-600"
//             />

//             <SummaryCard
//               title="Expiring Soon Compliance"
//               value={counts.expiringSoonComplianceDoc}
//               color="text-amber-600"
//               titleColor="text-amber-600"
//               subtitle={`Needs attention (For ${selectedYear})`}
//               subtitleColor="text-amber-600"
//             />

//             <SummaryCard
//               title="Expired Compliance"
//               value={counts.expiredComplianceDoc}
//               color="text-red-600"
//               titleColor="text-red-600"
//               subtitle={`Needs attention (For ${selectedYear})`}
//               subtitleColor="text-red-600"
//             />

//           </div>
//         </section>

//         <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//           <div className="flex flex-col md:flex-row gap-2 justify-between items-start lg:items-center mb-6">
//             <h2 className="text-lg font-bold text-gray-800">Revenue Overview</h2>

//             <div className="flex justify-end gap-4 items-center">
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(Number(e.target.value))}
//                 className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {yearOptions.map((year) => (
//                   <option key={year} value={year}>
//                     {year}-{year+1}
//                   </option>
//                 ))}
//               </select>
//               <TrendingUp className="text-green-500 w-5 h-5" />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">

//             <RevenueSummaryCard title="Total Revenue" value={formatCurrency(counts.totalRevenue)} subtitle={`For ${selectedYear}`}  subtitleColor= "text-cyan-600" color= "text-cyan-600" titleColor="text-cyan-600"/>

//             <SummaryCard title="Authorized Share Capital"  value={counts.totalAuthorizedShareCapital} subtitleColor="text-green-600" color= "text-green-600" titleColor="text-green-600"/>

//             <SummaryCard title="Paid Up Capital"  value={counts.totalPaidUpCapital} subtitleColor= "text-blue-600" color= "text-blue-600" titleColor="text-blue-600"/>

//             <SummaryCard title="Total Invoices" value={counts.totalInvoices} titleColor="text-black" color="text-black" subtitleColor= "text-black"/>

//             <SummaryCard title="Total Receipts" value={counts.totalReceipt} color="text-orange-500" subtitleColor= "text-orange-600" titleColor="text-orange-600"/>
//           </div>
//         </section>

//         <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//           <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <QuickActionCard
//               icon={FaFileInvoiceDollar}
//               title="All Invoices"
//               description="All Invoices"
//               iconColor="bg-green-600"
//               onClick={() => navigate("/company-invoices")}
//             />

//             <QuickActionCard
//               icon={FaReceipt}
//               title="All Receipts"
//               description="View All Receipts"
//               iconColor="bg-blue-600"
//               onClick={() => navigate("/company-receipts")}
//             />

//             <QuickActionCard
//               icon={FaShieldAlt}
//               title="Access Compliance Documents"
//               description="Access Compliance Documents"
//               iconColor="bg-orange-600"
//               onClick={() => navigate("/compliance/upload-documents")}
//             />
//           </div>
//         </section>

//         <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
//             <ButtonComponent
//               handleButtonClick={() => navigate("/company-invoices")}
//               className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
//             >
//               View All
//             </ButtonComponent>
//           </div>

//           <div className="overflow-x-auto">
//             <DashInvoice />
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// };

// export default CompanyDashboard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { invoiceData } from "../../data/invoiceData";
import { receiptData } from "../../data/receiptData";
import { companyData } from "../../data/companyData";
import ButtonComponent from "../../components/comman/ButtonComponent";
import {
  fetchCompanyDashboardCount,
  fetchCount,
} from "../../store/actions/countAction";
import { Oval } from "react-loader-spinner";
import getCompanyStatusStyle from "../../components/comman/companyStatusStyle";
import { fetchInvoices } from "../../store/actions/invoiceActions";
import DashInvoice from "../../components/feature/company/dashInvoice";
import { fetchCompanyDataById } from "../../store/actions/companyAction";
import {
  Briefcase,
  UserCheck,
  Users,
  HeartHandshake,
  Landmark,
  ShieldAlert,
  IndianRupee,
  FileText,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "../../components/comman/formateCurrency";
import { compliance, company_category } from "../../assets";

// ---- Gradient KPI card — same system as the admin dashboard ----
const KPI_ACCENTS = {
  blue: {
    gradient: "from-blue-50 to-white",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    titleText: "text-blue-700",
  },
  pink: {
    gradient: "from-pink-50 to-white",
    iconBg: "bg-pink-100",
    iconText: "text-pink-600",
    titleText: "text-pink-700",
  },
  emerald: {
    gradient: "from-emerald-50 to-white",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    titleText: "text-emerald-700",
  },
  violet: {
    gradient: "from-violet-50 to-white",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    titleText: "text-violet-700",
  },
  amber: {
    gradient: "from-amber-50 to-white",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    titleText: "text-amber-700",
  },
};

const GradientKpiCard = ({ title, value, icon: Icon, accent }) => {
  const styles = KPI_ACCENTS[accent] ?? KPI_ACCENTS.blue;
  return (
    <div
      className={`flex items-center lg:items-start 2xl:items-center gap-3 rounded-2xl border border-gray-100 bg-gradient-to-br ${styles.gradient} p-4 shadow-sm transition-all duration-300 
      hover:shadow-md lg:gap-2 lg:p-2 2xl:gap-4 2xl:p-5`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} lg:h-8 lg:w-8 lg:rounded-md 
        2xl:h-14 2xl:w-14 2xl:rounded-2xl`}
      >
        <Icon
          className={`h-6 w-6 ${styles.iconText} lg:h-4 lg:w-4 2xl:h-7 2xl:w-7`}
          strokeWidth={2.2}
        />
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-bold ${styles.titleText} lg:text-xs 2xl:text-sm`}
        >
          {title}
        </p>
        <p className="mt-1 text-2xl font-black leading-none text-slate-900 lg:text-xl 2xl:text-3xl">
          {value ?? 0}
        </p>
      </div>
    </div>
  );
};

// ---- Farmer Breakdown: Small vs Marginal, same visual treatment as admin's
// Company Breakdown card (background image accent on the right half) ----
const FarmerBreakdownCard = ({ small, marginal }) => {
  const total = small + marginal;

  const data =
    total > 0
      ? [
          {
            name: "Small Farmers",
            value: small,
            color: "#639922",
          },
          {
            name: "Marginal Farmers",
            value: marginal,
            color: "#1D9E75",
          },
        ]
      : [
          {
            name: "No data",
            value: 1,
            color: "#e2e8f0",
          },
        ];

  return (
    <section
      className="
        relative flex h-auto min-h-[300px] w-full flex-col
        overflow-hidden rounded-2xl border border-gray-100
        bg-white p-5 shadow-sm

        lg:min-h-[310px] lg:p-4
        xl:min-h-[320px] xl:p-5
        2xl:min-h-[340px] 2xl:p-6
      "
    >
      {/* Background Image */}
      <div
        className="
          pointer-events-none absolute inset-y-0 right-0
          z-0 w-full select-none
        "
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.1) 40%,
              rgba(255,255,255,0) 100%
            ),
            url(${company_category})
          `,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: 0.6,
        }}
      />

      {/* Header */}
      <div className="relative z-10 min-w-0">
        <h3
          className="
            font-bold tracking-tight text-gray-900
            text-base
            lg:text-sm
            xl:text-sm
            2xl:text-base
          "
        >
          Farmer Breakdown
        </h3>

        <p
          className="
            mt-0.5 truncate font-medium text-gray-400
            text-xs
            lg:text-[10px]
            xl:text-[11px]
            2xl:text-xs
          "
        >
          Small vs marginal farmer members
        </p>
      </div>

      {/* Main Content */}
      <div
        className="
          relative z-10 mt-4 flex flex-1
          flex-col items-center justify-center
          gap-3

          lg:mt-3
          lg:gap-2

          xl:mt-3
          xl:gap-2

          2xl:mt-4
          2xl:gap-4
          2xl:flex-row
        "
      >
        {/* Donut Chart */}
        <div
          className="
            relative flex shrink-0 items-center justify-center
            rounded-full p-2
            backdrop-blur-[0.5px]

            h-48 w-48

            lg:h-40 lg:w-40
            xl:h-52 xl:w-52
            2xl:h-56 2xl:w-56
          "
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius="50%"
                outerRadius="78%"
                paddingAngle={total > 0 ? 4 : 0}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Total */}
          <div
            className="
              pointer-events-none absolute
              flex items-center justify-center
              text-center
            "
          >
            <span
              className="
                font-black leading-none text-slate-900

                text-xl

                lg:text-2xl
                xl:text-2xl
                2xl:text-3xl
              "
            >
              {total}
            </span>
          </div>
        </div>

        {/* Farmer Stats */}
        <div
          className="
            w-fit min-w-[170px]
            rounded-xl bg-white/40
            px-4 py-2.5
            text-center
            backdrop-blur-[0.5px]

            lg:min-w-[160px]
            lg:px-3
            lg:py-2

            xl:min-w-[170px]
            xl:px-3
            xl:py-2

            2xl:min-w-[190px]
            2xl:px-4
            2xl:py-3
          "
        >
          {/* Small Farmers */}
          <div>
            <h4
              className="
                flex items-center justify-center gap-1.5
                font-bold uppercase tracking-wider text-gray-400

                text-[10px]

                lg:text-[9px]
                xl:text-[9px]
                2xl:text-[11px]
              "
            >
              <span
                className="
                  shrink-0 rounded-full

                  h-2 w-2

                  lg:h-1.5 lg:w-1.5
                  xl:h-1.5 xl:w-1.5
                  2xl:h-2 2xl:w-2
                "
                style={{ backgroundColor: "#639922" }}
              />

              <span>Small Farmers</span>
            </h4>

            <p
              className="
                mt-1 font-black leading-none text-slate-900

                text-xl

                lg:text-lg
                xl:text-lg
                2xl:text-2xl
              "
            >
              {small}
            </p>
          </div>

          {/* Marginal Farmers */}
          <div className="mt-2 lg:mt-1.5 xl:mt-1.5 2xl:mt-2.5">
            <h4
              className="
                flex items-center justify-center gap-1.5
                font-bold uppercase tracking-wider text-gray-400

                text-[10px]

                lg:text-[9px]
                xl:text-[9px]
                2xl:text-[11px]
              "
            >
              <span
                className="
                  shrink-0 rounded-full

                  h-2 w-2

                  lg:h-1.5 lg:w-1.5
                  xl:h-1.5 xl:w-1.5
                  2xl:h-2 2xl:w-2
                "
                style={{ backgroundColor: "#1D9E75" }}
              />

              <span>Marginal Farmers</span>
            </h4>

            <p
              className="
                mt-1 font-black leading-none text-slate-900

                text-xl

                lg:text-lg
                xl:text-lg
                2xl:text-2xl
              "
            >
              {marginal}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- Compliance Status — identical design to the admin dashboard ----
const ComplianceStatusCard = ({
  valid,
  expiring,
  expired,
  total,
  onViewAll,
}) => {
  const sum = valid + expiring + expired;
  const rows = [
    { label: "Valid Compliance", value: valid, color: "#10b981" },
    { label: "Expiring Soon", value: expiring, color: "#f59e0b" },
    { label: "Expired", value: expired, color: "#ef4444" },
  ];
  const pieData =
    sum > 0 ? rows : [{ label: "No data", value: 1, color: "#e2e8f0" }];

  return (
    <section className="relative flex h-auto min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm xl:min-h-[320px] xl:p-5">
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none select-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 100%), 
          url(${compliance})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
        }}
      />

      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900">
          <span className="text-lg text-blue-600">🛡️</span>
          Compliance Status
        </h3>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-1 lg:grid-cols-1 2xl:grid-cols-12 items-center gap-2 sm:grid-cols-12">
        {/* Donut */}
        <div
          className="relative mx-auto flex h-[205px] w-full max-w-[205px] items-center justify-center sm:col-span-6 sm:mx-0 sm:max-w-none 
                  lg:mx-auto lg:h-[120px] lg:w-[120px] lg:max-w-[150px] xl:h-[170px] xl:w-[170px] xl:max-w-[170px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="92%"
                paddingAngle={0}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black leading-none text-slate-900 lg:text-2xl xl:text-4xl">
              {total ?? sum}
            </span>

            <span className="mt-1 text-xs lg:text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 sm:col-span-6">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-none"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-md"
                  style={{ backgroundColor: row.color }}
                />
                <span className="truncate text-sm font-semibold text-gray-600">
                  {row.label}
                </span>
              </div>
              <span className="ml-2 text-lg font-extrabold text-slate-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---- Revenue Overview — total revenue + a genuine paid-up/authorized ratio,
// no fabricated growth percentage since only one year's figures are available ----
const RevenueOverviewCard = ({
  totalRevenue,
  authorizedCapital,
  paidUpCapital,
  invoices,
  receipts,
  selectedYear,
  yearOptions,
  onYearChange,
}) => {
  const ratio =
    authorizedCapital > 0
      ? Math.min(100, Math.round((paidUpCapital / authorizedCapital) * 100))
      : 0;

  return (
    <section
      className="relative flex h-auto min-h-[300px] w-full flex-col rounded-2xl border border-gray-100
     bg-white p-5 shadow-sm justify-between xl:min-h-[320px] xl:p-5"
    >
      <div>
        {/* Header Section */}
        <div className="flex items-center lg:flex-col lg:items-start xl:flex-row justify-between border-b border-gray-50 pb-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <IndianRupee className="h-4 w-4" />
            </div>
            <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900">
              Revenue Overview
            </h3>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="ml-2 lg:ml-0 lg:mt-1 shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}-{year + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Total Revenue Information */}
        <div className="mt-3.5">
          <span className="block text-3xl font-black tracking-tight text-blue-600 leading-none">
            {formatCurrency(totalRevenue)}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
            Total Revenue · {selectedYear}
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-3.5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-gray-400">
            <span>Paid-up vs Authorized Capital</span>
            <span className="text-slate-700 font-extrabold">{ratio}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${ratio}%` }}
            />
          </div>
        </div>
      </div>

      {/* NEW: Highlighted Micro-KPI Grid Cards Block */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
        {/* Authorized Card */}
        <div className="bg-gradient-to-br from-blue-50/60 to-white border border-blue-100/50 rounded-xl p-2.5 min-w-0 shadow-sm transition-all duration-200 hover:shadow hover:from-blue-50">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Authorized
          </span>
          <span className="block text-base font-black text-slate-900 truncate mt-0.5">
            {formatCurrency(authorizedCapital)}
          </span>
        </div>

        {/* Paid-up Card */}
        <div className="bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-100/50 rounded-xl p-2.5 min-w-0 shadow-sm transition-all duration-200 hover:shadow hover:from-indigo-50">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Paid-up
          </span>
          <span className="block text-base font-black text-slate-900 truncate mt-0.5">
            {formatCurrency(paidUpCapital)}
          </span>
        </div>

        {/* Invoices Card */}
        <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100/50 rounded-xl p-2.5 min-w-0 shadow-sm transition-all duration-200 hover:shadow hover:from-emerald-50">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Invoices
          </span>
          <span className="block text-base font-black text-slate-900 mt-0.5">
            {invoices ?? 0}
          </span>
        </div>

        {/* Receipts Card */}
        <div className="bg-gradient-to-br from-amber-50/50 to-white border border-amber-100/40 rounded-xl p-2.5 min-w-0 shadow-sm transition-all duration-200 hover:shadow hover:from-amber-50">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Receipts
          </span>
          <span className="block text-base font-black text-slate-900 mt-0.5">
            {receipts ?? 0}
          </span>
        </div>
      </div>
    </section>
  );
};

const CompanyDashboard = () => {
  const userEmail = useSelector((state) => state.auth.user?.email);
  const { companyId } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: 8 },
    (_, index) => currentYear - 5 + index,
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    counts,
    error: countError,
    loading: countLoading,
  } = useSelector((state) => state.companyDashCount);

  useEffect(() => {
    dispatch(fetchCompanyDashboardCount(selectedYear));
  }, [dispatch, selectedYear]);

  const navigate = useNavigate();

  const { company, error, loading } = useSelector((state) => state.companyById);

  useEffect(() => {
    dispatch(fetchCompanyDataById(companyId));
  }, [companyId]);

  if (countLoading || loading) {
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
        <p className="text-gray-500 animate-pulse">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="w-full space-y-6">
        {/* ===================== HEADER ===================== */}

        <header className="flex justify-end">
          <div
            className={`w-fit rounded-2xl px-4 py-2 text-sm font-medium uppercase shadow ${getCompanyStatusStyle(
              company?.status,
            )}`}
          >
            {company?.status}
          </div>
        </header>

        {/* ===================== TIER 1: KPI CARDS ===================== */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <GradientKpiCard
            title="Board of Directors"
            value={counts?.totalBoardOfDirectors}
            icon={Briefcase}
            accent="blue"
          />
          <GradientKpiCard
            title="Women Board of Directors"
            value={counts?.totalFemaleBoardOfDirectors}
            icon={UserCheck}
            accent="pink"
          />
          <GradientKpiCard
            title="Total Members"
            value={counts?.totalFarmerMembers}
            icon={Users}
            accent="emerald"
          />
          <GradientKpiCard
            title="Women Members"
            value={counts?.totalFemaleFarmerMembers}
            icon={HeartHandshake}
            accent="violet"
          />
          <GradientKpiCard
            title="Land Holding"
            value={counts?.totalLandholdingAcres}
            icon={Landmark}
            accent="amber"
          />
        </section>

        {/* ===================== TIER 2: FARMER BREAKDOWN / COMPLIANCE / REVENUE ===================== */}
        <section className="grid w-full grid-cols-1 items-stretch gap-3 lg:grid-cols-3">
          <FarmerBreakdownCard
            small={Number(counts?.totalSmallFarmers) || 0}
            marginal={Number(counts?.totalMarginalFarmers) || 0}
          />
          <ComplianceStatusCard
            valid={Number(counts?.validComplianceDoc) || 0}
            expiring={Number(counts?.expiringSoonComplianceDoc) || 0}
            expired={Number(counts?.expiredComplianceDoc) || 0}
            total={counts?.totalComplianceDocument}
            onViewAll={() => navigate("/compliance/upload-documents")}
          />
          <RevenueOverviewCard
            totalRevenue={counts?.totalRevenue}
            authorizedCapital={Number(counts?.totalAuthorizedShareCapital) || 0}
            paidUpCapital={Number(counts?.totalPaidUpCapital) || 0}
            invoices={counts?.totalInvoices}
            receipts={counts?.totalReceipt}
            selectedYear={selectedYear}
            yearOptions={yearOptions}
            onYearChange={setSelectedYear}
          />
        </section>

        {/* ===================== QUICK ACTIONS ===================== */}
        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate("/company-invoices")}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700 transition-transform group-hover:scale-105">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  All Invoices
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  View all invoices
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/company-receipts")}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
            >
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 transition-transform group-hover:scale-105">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  All Receipts
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  View all receipts
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/compliance/upload-documents")}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
            >
              <div className="rounded-xl bg-orange-50 p-3 text-orange-700 transition-transform group-hover:scale-105">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Access Compliance Documents
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  Upload and review documents
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* ===================== RECENT INVOICES (unchanged) ===================== */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h2>
            <ButtonComponent
              handleButtonClick={() => navigate("/company-invoices")}
              className="rounded-full bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
            >
              View All
            </ButtonComponent>
          </div>

          <div className="overflow-x-auto">
            <DashInvoice />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyDashboard;
