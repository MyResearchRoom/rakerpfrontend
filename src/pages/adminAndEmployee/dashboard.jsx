// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Plus, UserPlus, FileText, Upload, TrendingUp } from 'lucide-react';
// import ButtonComponent from '../../components/comman/ButtonComponent';
// import SummaryCard, { RevenueSummaryCard } from '../../components/comman/SummaryCard';
// import PageHeader from "../../components/comman/PageHeader";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAdminDashboardCount, fetchCount } from '../../store/actions/countAction';
// import { Oval } from 'react-loader-spinner';
// import ConnectCompany from '../../models/connectCompany';
// import { formatCurrency } from '../../components/comman/formateCurrency';

// // Reusable Quick Action Card
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

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const dispatch=useDispatch();

//   const currentYear = new Date().getFullYear();

//   const yearOptions = Array.from({ length: 8 }, (_, index) => currentYear - 5 + index);

//   const [selectedYear, setSelectedYear] = useState(currentYear);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { counts, error: countError, loading: countLoading, } = useSelector(
//     (state) => state.adminDashCounts
//   );

//   useEffect(() => {

//       dispatch(fetchAdminDashboardCount(selectedYear));

//   }, [dispatch,selectedYear]);

//   const handleButtonClick = () => {
//     setIsModalOpen(true);
//   };

//   if (countLoading) {
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
//         <p className="text-gray-500 animate-pulse">Loading count data...</p>
//     </div>
//     );
//   }

//   return (
//     <div className='flex flex-col gap-6 md:gap-6'>
//       <PageHeader  title="Dashboard" subTitle="Welcome back! Here's what's happening today.">
//         <ButtonComponent
//           handleButtonClick={handleButtonClick}
//           className="bg-blue-600 p-2 rounded-md text-white"
//         >
//           <div className='flex items-center space-x-1 text-sm'>
//             <Plus className='w-4 h-4' />
//             <span>Quick Connect</span>
//           </div>
//         </ButtonComponent>
//       </PageHeader>

//       <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//         <h2 className="text-lg xl:text-xl font-bold text-gray-800 mb-4">Total Category Wise Company Count</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
//           <SummaryCard
//             title=" Private Ltd Companies"
//             value={counts.totalPrivateLtdCompanies}
//             color="text-indigo-800"
//             subtitleColor="text-indigo-800"
//             titleColor="text-indigo-800"
//           />

//           <SummaryCard
//             title=" Public Ltd Companies"
//             value={counts.totalPublicLtdCompanies}
//             color="text-emerald-600"
//             subtitleColor="text-emerald-600"
//             titleColor="text-emerald-600"
//           />

//           <SummaryCard
//             title=" LLP Companies"
//             value={counts.totalLLPCompanies}
//             color="text-blue-600"
//             subtitleColor="text-blue-600"
//             titleColor="text-blue-600"
//           />

//           <SummaryCard
//             title=" OPC Companies"
//             value={counts.totalOPCCompanies}
//             color="text-cyan-600"
//             subtitleColor="text-cyan-600"
//             titleColor="text-cyan-600"
//           />

//           <SummaryCard
//             title=" Partnership Companies"
//             value={counts.totalPartnershipCompanies}
//             color="text-orange-600"
//             subtitleColor="text-orange-600"
//             titleColor="text-orange-600"
//           />

//           <SummaryCard
//             title=" Proprietorship Companies"
//             value={counts.totalProprietorshipCompanies}
//             color="text-amber-600"
//             subtitleColor="text-amber-600"
//             titleColor="text-amber-600"
//           />

//           <SummaryCard
//             title=" Producer Companies"
//             value={counts.totalProducerCompanyCompanies}
//             color="text-lime-600"
//             subtitleColor="text-lime-600"
//             titleColor="text-lime-600"
//           />

//           <SummaryCard
//             title=" Section 8 Companies"
//             value={counts.totalSection8pCompanies}
//             color="text-violet-600"
//             subtitleColor="text-violet-600"
//             titleColor="text-violet-600"
//           />

//           <SummaryCard
//             title="Total Trust Companies"
//             value={counts.totalTrustCompanies}
//             color="text-pink-600"
//             subtitleColor="text-pink-600"
//             titleColor="text-pink-600"
//           />

//           <SummaryCard
//             title=" Society Companies"
//             value={counts.totalSocietyCompanies}
//             color="text-rose-600"
//             subtitleColor="text-rose-600"
//             titleColor="text-rose-600"
//           />

//           <SummaryCard
//             title=" Cooperative Companies"
//             value={counts.totalCooperativeCompanies}
//             color="text-teal-600"
//             subtitleColor="text-teal-600"
//             titleColor="text-teal-600"
//           />

//           <SummaryCard
//             title=" Government Companies"
//             value={counts.totalGovernmentCompanies}
//             color="text-red-600"
//             subtitleColor="text-red-600"
//             titleColor="text-red-600"
//           />

//           <SummaryCard
//             title=" Producer Organisation Companies"
//             value={counts.totalProducerOrganisationCompanies}
//             color="text-sky-600"
//             subtitleColor="text-sky-600"
//             titleColor="text-sky-600"
//           />

//           <SummaryCard
//             title=" Other Organisation Companies"
//             value={counts.totalOtherCompanies}
//             color="text-slate-600"
//             subtitleColor="text-slate-600"
//             titleColor="text-slate-600"
//           />

//         </div>
//       </section>

//       <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//         <h2 className="text-lg font-bold text-gray-800 mb-4">Quick count</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">

//           <SummaryCard title="Total Board of Directors" value={counts.totalBoardOfDirectors} color="text-blue-500" subtitle="" subtitleColor="text-red-600" />
//           <SummaryCard title="Women Board of Directors" value={counts.totalFemaleBoardOfDirectors} color="text-blue-500" subtitle="" subtitleColor="text-red-600" />

//           <SummaryCard title="Total Members" value={counts.totalFarmerMembers} color="text-green-500" subtitle="" subtitleColor="text-red-600" />
//           <SummaryCard title="Total Women Members" value={counts.totalFemaleFarmerMembers} color="text-green-500" subtitle="" subtitleColor="text-red-600" />

//           <SummaryCard title="Total Land holding" value={counts.totalLandholdingAcres} color="text-green-700" subtitle="In acres" subtitleColor="text-green-700" />

//           <SummaryCard title="Valid Compliance " value={counts.validComplianceDoc} subtitle={`In ${selectedYear }`} color="text-teal-600" subtitleColor="text-teal-600" titleColor="text-teal-600"/>

//           <SummaryCard title="Expiring Soon Compliance " value={counts.expiringSoonComplianceDoc} color="text-orange-500" subtitle={`Needs attention (For ${selectedYear })`} subtitleColor="text-orange-600" titleColor="text-orange-600"/>

//           <SummaryCard title="Expired Compliance" value={counts.expiredComplianceDoc} color="text-red-600" subtitle={`Needs attention (For ${selectedYear })`} subtitleColor="text-red-600" titleColor="text-red-600"/>
//         </div>
//       </section>

//       <section className='bg-white rounded-lg px-4 md:px-6 lg:px-6 py-4 border border-gray-300 shadow-lg'>
//         <div className="flex flex-col md:flex-row gap-2 justify-between items-start lg:items-center mb-6">
//           <h2 className="text-lg font-bold text-gray-800">Revenue Overview</h2>

//           <div className="flex justify-end gap-4 items-center">
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {yearOptions.map((year) => (
//                 <option key={year} value={year}>
//                   {year}-{year+1}
//                 </option>
//               ))}
//             </select>
//             <TrendingUp className="text-green-500 w-5 h-5" />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
//           <RevenueSummaryCard
//             title="Private Ltd Company"
//             value={formatCurrency(counts.totalPrivateLtdCompanyRevenue)}
//             color="text-indigo-600"
//             titleColor="text-indigo-600"
//             subtitleColor="text-indigo-600"
//           />

//           <RevenueSummaryCard
//             title="Public Ltd Company"
//             value={formatCurrency(counts.totalPublicLtdCompanyRevenue)}
//             color="text-emerald-600"
//             titleColor="text-emerald-600"
//             subtitleColor="text-emerald-600"
//           />

//           <RevenueSummaryCard
//             title="LLP Company"
//             value={formatCurrency(counts.totalLLPCompanyRevenue)}
//             color="text-blue-600"
//             titleColor="text-blue-600"
//             subtitleColor="text-blue-600"
//           />

//           <RevenueSummaryCard
//             title="OPC Company"
//             value={formatCurrency(counts.totalOPCCompanyRevenue)}
//             color="text-cyan-600"
//             titleColor="text-cyan-600"
//             subtitleColor="text-cyan-600"
//           />

//           <RevenueSummaryCard
//             title="Partnership Company"
//             value={formatCurrency(counts.totalPartnershipCompanyRevenue)}
//             color="text-orange-500"
//             titleColor="text-orange-500"
//             subtitleColor="text-orange-500"
//           />

//           <RevenueSummaryCard
//             title="Proprietorship Company"
//             value={formatCurrency(counts.totalProprietorshipCompanyRevenue)}
//             color="text-amber-600"
//             titleColor="text-amber-600"
//             subtitleColor="text-amber-600"
//           />

//           <RevenueSummaryCard
//             title="Producer Company"
//             value={formatCurrency(counts.totalProducerCompanyCompanyRevenue)}
//             color="text-lime-600"
//             titleColor="text-lime-600"
//             subtitleColor="text-lime-600"
//           />

//           <RevenueSummaryCard
//             title="Section 8 Company"
//             value={formatCurrency(counts.totalSection8CompanyRevenue)}
//             color="text-violet-600"
//             titleColor="text-violet-600"
//             subtitleColor="text-violet-600"
//           />

//           <RevenueSummaryCard
//             title="Trust Company"
//             value={formatCurrency(counts.totalTrustCompanyRevenue)}
//             color="text-pink-600"
//             titleColor="text-pink-600"
//             subtitleColor="text-pink-600"
//           />

//           <RevenueSummaryCard
//             title="Society Company"
//             value={formatCurrency(counts.totalSocietyCompanyRevenue)}
//             color="text-rose-700"
//             titleColor="text-rose-700"
//             subtitleColor="text-rose-700"
//           />

//           <RevenueSummaryCard
//             title="Cooperative Company"
//             value={formatCurrency(counts.totalCooperativeCompanyRevenue)}
//             color="text-teal-600"
//             titleColor="text-teal-600"
//             subtitleColor="text-teal-600"
//           />

//           <RevenueSummaryCard
//             title="Government Company"
//             value={formatCurrency(counts.totalGovernmentCompanyRevenue)}
//             color="text-red-600"
//             titleColor="text-red-600"
//             subtitleColor="text-red-600"
//           />

//           <RevenueSummaryCard
//             title="Producer Organisation Company"
//             value={formatCurrency(counts.totalProducerOrganisationCompanyRevenue)}
//             color="text-sky-600"
//             titleColor="text-sky-600"
//             subtitleColor="text-sky-600"
//           />

//           <RevenueSummaryCard
//             title="Other Organisation Company"
//             value={formatCurrency(counts.totalOtherCompanyRevenue)}
//             color="text-slate-600"
//             titleColor="text-slate-600"
//             subtitleColor="text-slate-600"
//           />

//         </div>
//       </section>

//        <section>
//         <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//           <QuickActionCard
//             icon={UserPlus}
//             title="Connect Company"
//             description="Add new company"
//             iconColor="bg-blue-600"
//             onClick={() => navigate("/companies")}
//           />

//           <QuickActionCard
//             icon={FileText}
//             title="Create Invoice"
//             description="Generate new invoice"
//             iconColor="bg-green-600"
//             onClick={() => navigate("/invoices")}
//           />

//           <QuickActionCard
//             icon={Upload}
//             title="Upload Compliance"
//             description="Upload documents"
//             iconColor="bg-orange-600"
//             onClick={() => navigate("/compliance")}
//           />

//         </div>
//       </section>

//       <ConnectCompany
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  UserPlus,
  FileText,
  Upload,
  Calendar,
  Users,
  TrendingUp,
  Briefcase,
  Landmark,
  UserCheck,
  HeartHandshake,
  ChevronDown,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ButtonComponent from "../../components/comman/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardCount } from "../../store/actions/countAction";
import { Oval } from "react-loader-spinner";
import ConnectCompany from "../../models/connectCompany";
import { land_arc, company_category, compliance } from "../../assets";

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

// NOTE: the previous version of this card only had xl:/lg: size classes with
// no base size (no plain p-*, h-*, w-*, text-* before the first breakpoint).
// That's why it happened to "look fine" below lg — the browser was just
// sizing everything to content with zero explicit padding. Base classes are
// added back here so sizing is intentional at every breakpoint, and lg gets
// its own compact size so 5 cards fit that width without crowding.
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

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: 8 },
    (_, index) => currentYear - 5 + index,
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedCompanyCategory, setSelectedCompanyCategory] =
    useState("private_ltd");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [isRevenueYearDropdownOpen, setIsRevenueYearDropdownOpen] =
    useState(false);

  const { counts, loading: countLoading } = useSelector(
    (state) => state.adminDashCounts,
  );

  useEffect(() => {
    dispatch(fetchAdminDashboardCount(selectedYear));
  }, [dispatch, selectedYear]);

  if (countLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2">
        <Oval
          height={50}
          width={50}
          color="#2563eb"
          secondaryColor="#93c5fd"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />

        <p className="animate-pulse text-sm font-bold tracking-wide text-gray-500">
          Syncing Executive Workspace...
        </p>
      </div>
    );
  }

  const rawCategories = [
    {
      id: "private_ltd",
      title: "Private Ltd Companies",
      count: counts?.totalPrivateLtdCompanies || 0,
      revenue: counts?.totalPrivateLtdCompanyRevenue || 0,
    },
    {
      id: "public_ltd",
      title: "Public Ltd Companies",
      count: counts?.totalPublicLtdCompanies || 0,
      revenue: counts?.totalPublicLtdCompanyRevenue || 0,
    },
    {
      id: "llp",
      title: "LLP Companies",
      count: counts?.totalLLPCompanies || 0,
      revenue: counts?.totalLLPCompanyRevenue || 0,
    },
    {
      id: "opc",
      title: "OPC Companies",
      count: counts?.totalOPCCompanies || 0,
      revenue: counts?.totalOPCCompanyRevenue || 0,
    },
    {
      id: "partnership",
      title: "Partnership Companies",
      count: counts?.totalPartnershipCompanies || 0,
      revenue: counts?.totalPartnershipCompanyRevenue || 0,
    },
    {
      id: "proprietorship",
      title: "Proprietorship Companies",
      count: counts?.totalProprietorshipCompanies || 0,
      revenue: counts?.totalProprietorshipCompanyRevenue || 0,
    },
    {
      id: "producer",
      title: "Producer Companies",
      count: counts?.totalProducerCompanyCompanies || 0,
      revenue: counts?.totalProducerCompanyCompanyRevenue || 0,
    },
    {
      id: "section_8",
      title: "Section 8 Companies",
      count: counts?.totalSection8pCompanies || 0,
      revenue: counts?.totalSection8CompanyRevenue || 0,
    },
    {
      id: "trust",
      title: "Total Trust Companies",
      count: counts?.totalTrustCompanies || 0,
      revenue: counts?.totalTrustCompanyRevenue || 0,
    },
    {
      id: "society",
      title: "Society Companies",
      count: counts?.totalSocietyCompanies || 0,
      revenue: counts?.totalSocietyCompanyRevenue || 0,
    },
    {
      id: "cooperative",
      title: "Cooperative Companies",
      count: counts?.totalCooperativeCompanies || 0,
      revenue: counts?.totalCooperativeCompanyRevenue || 0,
    },
    {
      id: "government",
      title: "Government Companies",
      count: counts?.totalGovernmentCompanies || 0,
      revenue: counts?.totalGovernmentCompanyRevenue || 0,
    },
    {
      id: "producer_org",
      title: "Producer Organisation Companies",
      count: counts?.totalProducerOrganisationCompanies || 0,
      revenue: counts?.totalProducerOrganisationCompanyRevenue || 0,
    },
    {
      id: "other",
      title: "Other Organisation Companies",
      count: counts?.totalOtherCompanies || 0,
      revenue: counts?.totalOtherCompanyRevenue || 0,
    },
  ];

  const totalCombinedCompaniesCount = rawCategories.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const totalCombinedRevenueSum = rawCategories.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  const currentCategoryObj = rawCategories.find(
    (item) => item.id === selectedCompanyCategory,
  );

  const displayedCategoryCount =
    selectedCompanyCategory === "all_companies"
      ? totalCombinedCompaniesCount
      : currentCategoryObj?.count || 0;

  const displayedCategoryRevenue =
    selectedCompanyCategory === "all_companies"
      ? totalCombinedRevenueSum
      : currentCategoryObj?.revenue || 0;

  const displayedCategoryTitle =
    selectedCompanyCategory === "all_companies"
      ? "All Categories"
      : currentCategoryObj?.title || "";

  const complianceChartData = [
    {
      name: "Valid Compliance",
      value: counts?.validComplianceDoc || 0,
      color: "#10b981",
    },
    {
      name: "Expiring Soon",
      value: counts?.expiringSoonComplianceDoc || 0,
      color: "#f59e0b",
    },
    {
      name: "Expired",
      value: counts?.expiredComplianceDoc || 0,
      color: "#ef4444",
    },
  ];

  const totalComplianceDocs = complianceChartData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="flex h-full flex-col gap-6 rounded-2xl bg-slate-50/50 pb-16 font-sans antialiased text-slate-900">
      {/* ============================================================
          HEADER
      ============================================================ */}
      <header className="flex justify-end">
          

          <ButtonComponent
            handleButtonClick={() => setIsModalOpen(true)}
            className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm 
            transition-all hover:bg-blue-700 mt-4 sm:mt-0"
          >
            <div className="flex items-center space-x-2">
              <Plus className="h-4 w-4 stroke-[3]" />
              <span className="text-xs">Quick Connect</span>
            </div>
          </ButtonComponent>
      </header>

      {/* ============================================================
          TIER 1: KPI CARDS
          (single lg: breakpoint now drives 5-across, matching the card's
          own lg/xl compact sizing — the old lg:4/xl:5 split was leaving an
          orphaned 5th card wrapping alone onto its own row at 1024–1279px)
      ============================================================ */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-6">
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
          title="Total Land Holding"
          value={counts?.totalLandholdingAcres}
          icon={Landmark}
          accent="amber"
        />
      </section>

      {/* ============================================================
          TIER 2: COMPANY / COMPLIANCE / REVENUE
      ============================================================ */}
      <section className="grid w-full grid-cols-1 items-stretch gap-3 lg:grid-cols-3 xl:gap-6">
        {/* ==========================================================
            CARD 1: COMPANY BREAKDOWN
        ========================================================== */}
        <section
  className={`relative flex h-auto min-h-[300px] w-full flex-col rounded-2xl border
   border-gray-100 bg-white p-4 shadow-sm xl:min-h-[320px] xl:p-5 ${
    isCategoryDropdownOpen ? "z-[100]" : "z-0"
  }`}
>
  {/* Background Image */}
  <div
    className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full select-none"
    style={{
      backgroundImage: `linear-gradient(
to right,
rgba(255,255,255,1) 0%,
rgba(255,255,255,0.1) 40%,
rgba(255,255,255,0) 100%
), url(${company_category})`,
      backgroundSize: "cover",
      backgroundPosition: "right center",
      backgroundRepeat: "no-repeat",
      opacity: 0.4,
    }}
  />

  {/* ========================================================
HEADER
(stacks title above the dropdown at lg, where card width is
tightest; goes back to a single row at xl)
======================================================== */}
  <div className="relative z-20 flex flex-col md:flex-row lg:flex-col gap-2 
    xl:flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-3">
    <div className="min-w-0 flex-1">
      <h3 className="text-base font-bold tracking-tight text-gray-900">
        Company Breakdown
      </h3>

      <p className="mt-0.5 truncate text-xs font-medium text-gray-400">
        Filter by entity category attributes
      </p>
    </div>

    {/* ======================================================
CATEGORY DROPDOWN
====================================================== */}
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
        className="flex w-full max-w-xs items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 xl:w-auto"
      >
        <span className="max-w-[180px] truncate">
          {selectedCompanyCategory === "all_companies"
            ? "All Categories"
            : displayedCategoryTitle}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
            isCategoryDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ====================================================
DROPDOWN MENU
==================================================== */}
      {isCategoryDropdownOpen && (
        <div
          className="
    absolute
    right-0
    top-full
    z-[9999]
    mt-2
    w-64
    overflow-hidden
    rounded-xl
    border
    border-gray-200
    bg-white
    shadow-2xl
  "
        >
          {/* Scroll Container */}
          <div className="max-h-[220px] overflow-y-auto overscroll-contain">
            {/* All Categories */}
            <button
              type="button"
              onClick={() => {
                setSelectedCompanyCategory("all_companies");
                setIsCategoryDropdownOpen(false);
              }}
              className={`block w-full border-b border-gray-100 px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-blue-50 ${
                selectedCompanyCategory === "all_companies"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-800"
              }`}
            >
              All Categories
            </button>

            {/* Categories */}
            {rawCategories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setSelectedCompanyCategory(cat.id);
                  setIsCategoryDropdownOpen(false);
                }}
                className={`block w-full px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-blue-50 ${
                  selectedCompanyCategory === cat.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* ========================================================
COMPANY STATISTICS
======================================================== */}
  <div
    className={`relative z-10 mt-6 flex flex-1 ${
      isCategoryDropdownOpen ? "pointer-events-none" : ""
    } flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-start sm:gap-8 md:flex-row md:items-center md:justify-start md:gap-8 lg:flex-col lg:items-center lg:justify-center lg:gap-6 xl:flex-col xl:items-center xl:justify-center xl:gap-6 2xl:flex-row 2xl:items-center 2xl:justify-start 2xl:gap-4`}
  >
    {/* Donut */}
    <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full 
    bg-white/70 p-2 backdrop-blur-[0.5px] lg:h-28 lg:w-28 xl:h-40 xl:w-40">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="5"
        />

        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="5"
          strokeDasharray="65 100"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black leading-none text-slate-900 xl:text-3xl">
          {displayedCategoryCount}
        </span>
      </div>
    </div>

    {/* Statistics Panel */}
    <div className="w-full min-w-0 flex-1 space-y-3 rounded-xl bg-white/40 p-1 backdrop-blur-[0.5px] sm:space-y-4 md:space-y-4 lg:space-y-3 xl:space-y-3 2xl:space-y-3">
      {/* Companies Parameter Row */}
      <div className="flex items-center justify-between border-b border-gray-100/70 pb-2 sm:grid sm:grid-cols-2 sm:border-none sm:pb-0 md:grid md:grid-cols-2 md:border-none md:pb-0 lg:flex lg:items-center lg:justify-between lg:border-b lg:pb-2 xl:flex xl:items-center xl:justify-between xl:border-b xl:pb-2 2xl:block 2xl:border-none 2xl:pb-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 sm:text-sm md:text-sm lg:text-xs xl:text-xs 2xl:text-xs">
          Companies
        </h4>
        <p className="text-base font-black leading-none text-slate-900 sm:mt-1 sm:text-xl md:mt-1 md:text-xl lg:mt-0.5 lg:text-lg xl:mt-0.5 xl:text-lg 2xl:mt-0.5 2xl:text-xl">
          {displayedCategoryCount}
        </p>
      </div>

      {/* Revenue Parameter Row */}
      <div className="flex items-center justify-between sm:grid sm:grid-cols-2 md:grid md:grid-cols-2 lg:flex lg:items-center lg:justify-between xl:flex xl:items-center xl:justify-between 2xl:block">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 sm:text-sm md:text-sm lg:text-xs xl:text-xs 2xl:text-xs">
          Revenue
        </h4>
        <p className="truncate text-base font-black leading-none text-slate-900 sm:mt-1 sm:text-xl md:mt-1 md:text-xl lg:mt-0.5 lg:text-lg xl:mt-0.5 xl:text-lg 2xl:mt-0.5 2xl:text-xl">
          ₹
          {displayedCategoryRevenue >= 100000
            ? `${(displayedCategoryRevenue / 100000).toFixed(1)}L`
            : displayedCategoryRevenue.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  </div>
</section>

        {/* ==========================================================
            CARD 2: COMPLIANCE STATUS
        ========================================================== */}
        <section className="relative flex h-auto min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm xl:min-h-[320px] xl:p-5">
          <div
            className="absolute inset-y-0 right-0 w-1/2 pointer-events-none select-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 100%), url(${compliance})`,
              backgroundSize: "cover",
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              opacity: 0.4, // Clean, delicate visibility accent
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-extrabold tracking-tight text-slate-900">
              <span className="text-lg text-blue-600">🛡️</span>
              Compliance Status
            </h3>
          </div>

          {/* Compliance Content */}
          <div className="mt-3 grid flex-1 grid-cols-1 lg:grid-cols-1 2xl:grid-cols-12 items-center gap-2 sm:grid-cols-12">
            {/* Donut */}
            <div className="relative mx-auto flex h-[205px] w-full max-w-[205px] items-center justify-center sm:col-span-6 sm:mx-0 sm:max-w-none 
            lg:mx-auto lg:h-[130px] lg:w-[130px] xl:h-[170px] xl:w-[170px] xl:max-w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="92%"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {complianceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip disabled />
                </PieChart>
              </ResponsiveContainer>

              {/* Center */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black leading-none text-slate-900 lg:text-2xl xl:text-4xl">
                  {totalComplianceDocs}
                </span>

                <span className="mt-1 text-xs lg:text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 sm:col-span-6">
              {complianceChartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-none"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-md"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="truncate text-xs font-semibold text-gray-600 lg:text-xs xl:text-sm">
                      {item.name}
                    </span>
                  </div>

                  <span className="ml-2 text-base font-extrabold text-slate-900 lg:text-base xl:text-lg">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            CARD 3: REVENUE OVERVIEW
        ========================================================== */}
        <section className="relative flex h-auto min-h-[300px] w-full flex-col rounded-2xl border border-gray-100 
        bg-white p-4 shadow-sm xl:min-h-[320px] xl:p-5">
          {/* Header */}
          <div className="flex items-center lg:flex-col lg:items-start xl:flex-row justify-between border-b border-gray-50 pb-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-lg font-bold text-blue-600">₹</span>

              <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900">
                Revenue Overview
              </h3>
            </div>

            {/* Year Dropdown */}
            <div className="relative ml-2 lg:ml-0 lg:mt-1 shrink-0">
              <button
                onClick={() =>
                  setIsRevenueYearDropdownOpen(!isRevenueYearDropdownOpen)
                }
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-gray-700 transition-colors hover:bg-slate-50"
              >
                <Calendar className="h-3 w-3 text-gray-400" />

                <span>
                  {selectedYear}-{selectedYear + 1}
                </span>

                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isRevenueYearDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 max-h-44 w-28 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                  {yearOptions.map((year) => (
                    <div
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsRevenueYearDropdownOpen(false);
                      }}
                      className="cursor-pointer px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-slate-50"
                    >
                      {year}-{year + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Amount */}
          <div className="mt-4 space-y-1">
            <span className="block text-2xl font-black tracking-tight text-blue-600 xl:text-3xl">
              ₹
              {displayedCategoryRevenue
                ? displayedCategoryRevenue >= 100000
                  ? `${(displayedCategoryRevenue / 100000).toFixed(1)}L`
                  : displayedCategoryRevenue.toLocaleString("en-IN")
                : "0.0"}
            </span>

            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total Revenue
            </p>

            {/* Growth */}
            <div className="flex items-center gap-1.5 pt-1.5">
              <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                <span>↑ 12.5%</span>
              </div>

              <span className="text-[10px] font-bold text-gray-400">
                vs previous year
              </span>
            </div>
          </div>

          {/* Revenue Bars */}
          <div className="mt-auto flex items-end justify-between gap-1.5 pt-3">
            <div
              className="h-8 w-full rounded-t-md bg-blue-100 transition-all hover:bg-blue-200 xl:h-10"
              title="2022"
            />

            <div
              className="h-11 w-full rounded-t-md bg-blue-100 transition-all hover:bg-blue-200 xl:h-14"
              title="2023"
            />

            <div
              className="h-14 w-full rounded-t-md bg-blue-100 transition-all hover:bg-blue-200 xl:h-[72px]"
              title="2024"
            />

            <div
              className="h-[68px] w-full rounded-t-md bg-blue-100 transition-all hover:bg-blue-200 xl:h-[88px]"
              title="2025"
            />

            <div
              className="h-[88px] w-full rounded-t-md bg-blue-600 shadow-sm xl:h-28"
              title="2026"
            />
          </div>

          {/* Years */}
          <div className="flex justify-between pt-1.5 text-[9px] font-black tracking-wider text-gray-400">
            <span>2022</span>
            <span>2023</span>
            <span>2024</span>
            <span>2025</span>
            <span className="text-blue-600">2026</span>
          </div>
        </section>
      </section>

      {/* ============================================================
          OPERATIONAL QUICK ACTION PORTALS
      ============================================================ */}
      <section className="mt-4 xl:mt-0 pb-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Operational Workspace Portal
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Connect Company */}
          <button
            onClick={() => navigate("/companies")}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
          >
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 transition-transform group-hover:scale-105">
              <UserPlus className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Connect Company
              </h3>

              <p className="mt-0.5 text-sm font-semibold text-gray-500 lg:text-xs xl:text-sm">
                Register enterprise classification profiles
              </p>
            </div>
          </button>

          {/* Create Invoice */}
          <button
            onClick={() => navigate("/invoices")}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
          >
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 transition-transform group-hover:scale-105">
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Create Invoice
              </h3>

              <p className="mt-0.5 text-sm font-semibold text-gray-500 lg:text-xs xl:text-sm">
                Generate system cycle statements
              </p>
            </div>
          </button>

          {/* Upload Compliance */}
          <button
            onClick={() => navigate("/compliance")}
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:shadow-md"
          >
            <div className="rounded-xl bg-orange-50 p-3 text-orange-700 transition-transform group-hover:scale-105">
              <Upload className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Upload Compliance
              </h3>

              <p className="mt-0.5 text-sm font-semibold text-gray-500 lg:text-xs xl:text-sm">
                Store timelines verification records
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ============================================================
          CONNECT COMPANY MODAL
      ============================================================ */}
      <ConnectCompany
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}