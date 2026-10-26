import React, { Suspense, useEffect } from 'react';
import './App.css';
import SuspenseLoader from './components/comman/SuspenseLoader';
import LoginPage from './components/layouts/LoginPage';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from "./components/layouts/Header";
import Sidebar from "./components/layouts/Sidebar";
import { ProtectedRoute } from './components/comman/ProtectedRoute';
import { ADMIN, COMPANY, EMPLOYEE } from './constants/role';
import { routeName } from './constants/route';

import Dashboard from './pages/adminAndEmployee/dashboard';
import Invoices from './pages/adminAndEmployee/invoices';
import Recipts from './pages/adminAndEmployee/recipts';
import Materials from './pages/adminAndEmployee/materials';
import Company from './pages/adminAndEmployee/company';
import CompanyDetails from './pages/adminAndEmployee/companyDetails';

import CompanyDashboard from './pages/company/dashboard';
import CompanyInvoices from './pages/company/invoices';
import CompanyRecipts from './pages/company/recipts';

import { useDispatch, useSelector } from 'react-redux';
import { authFailed, loginUser } from './store/slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { BoardOfDirectorsManagement, Compliance as CompanyDetailsCompliance, FarmerMembers, CompanyInvoicesAdminSide, Receipts } from './components/feature/AdminAndEmployee/company';
import Expense from './pages/adminAndEmployee/expense';
import Account from './pages/adminAndEmployee/account';
import CompliancePortal from './components/feature/AdminAndEmployee/compliance/compliancePortal';
import Reports from './pages/adminAndEmployee/reports';
import Setting from './pages/adminAndEmployee/setting';
import PermissionsSection from './components/feature/AdminAndEmployee/settings/PermissionsSection';
import AddEmployeeSection from './components/feature/AdminAndEmployee/settings/AddEmployeeSection';
import CompanyCompliance from './pages/company/compliance';
import CompanyProfile from './pages/company/profile';
import BoardOfDirectorsCompany from './pages/company/boardOfDirectors';
import CompanyFarmerMembers from './pages/company/farmerMembersDetails';
import axios from 'axios';
import ViewEmployeeSection from './components/feature/AdminAndEmployee/settings/ViewEmployeeSection';
import CreateInvoicePage from './components/feature/AdminAndEmployee/invoice/CreateInvoicePage';
import Profile from './pages/profile';
import ExpenseDeytails from './components/feature/AdminAndEmployee/expenses/expenseDeytails';
import CompanyAccount from './pages/company/account';
import CompanyExpenses from './pages/company/expenses';
import CompanyExpenseDeytails from './components/feature/company/expense/expenseDeytails';
import CompanyMaterials from './pages/company/materials';
import UploadDocumentPage from './components/feature/AdminAndEmployee/compliance/uploadDocumentPage';
import AllCompnayExpenses from './pages/adminAndEmployee/allCompnayExpenses';
import AllCompanyAccount from './pages/adminAndEmployee/allCompanyAccount';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header onToggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 no-scrollbar">
          <Suspense fallback={<SuspenseLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { authLoading, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const tryAutoLogin = async () => {
    // console.log("in try auto login");

    try {
      // console.log("in try auto login try block");
      const res = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

      // console.log("res in app",res);


      if (res?.data?.success) {
        const response = res?.data?.data
        let route = [];

        const loginRole = response?.user?.role;

        if (loginRole === ADMIN) {
          route = ["DASHBOARD", "COMPANIES", "MATERIALS", "EXPENSES", "INVOICES", "RECEIPTS", "ACCOUNTS", "COMPLIANCE", "REPORTS", "SETTING"];
        } else if (loginRole === EMPLOYEE) {
          route = response?.accessRoute
        } else if (loginRole === COMPANY) {
          route = ["COMPANY_DASHBOARD", "MY_MATERIALS", "MY_INVOICES", "MY_RECEIPTS", "COMPLIANCE_DOCUMENTS", "PROFILE", "BOARD_OF_DIRECTORS", "FARMER_MEMBERS", "MY_EXPENSES", "MY_ACCOUNT"];
        }

        dispatch(loginUser({
          token: response?.accessToken,
          role: response?.user?.role,
          user: response?.user,
          accessRoute: route || [],
          companyId: response?.companyId,
        }));

        localStorage.setItem("user", JSON.stringify(response?.user));

      } else {
        dispatch(authFailed());
      }

    } catch {
      // console.log("in try auto login catch block");
      dispatch(authFailed());
      // toast.error("Auth failed");
    }
  };

  useEffect(() => {
    tryAutoLogin();
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Restoring session...
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.DASHBOARD}
              />
            }>
              <Route path="/" element={<Dashboard />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.COMPANIES}
              />
            }>
              <Route path="/companies" element={<Company />} >
              </Route>
              <Route path="/companies/:id" element={<CompanyDetails />} >
                <Route index element={<BoardOfDirectorsManagement />} />
                <Route path="invoices" element={<CompanyInvoicesAdminSide />} />
                <Route path="receipts" element={<Receipts />} />
                <Route path="compliance" element={<CompanyDetailsCompliance />} />
                <Route path="Compliance" element={<Navigate to="../compliance" replace />} />
                <Route path="complience" element={<Navigate to="../compliance" replace />} />
                <Route path="boardOfDirectors" element={<BoardOfDirectorsManagement />} />
                <Route path="farmerMemebrs" element={<FarmerMembers />} />
              </Route>
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.MATERIALS}
              />
            }>
              <Route path="/materials" element={<Materials />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.RECEIPTS}
              />
            }>
              <Route path="/receipts" element={<Recipts />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ADMIN, EMPLOYEE]}
                  routeName={routeName.INVOICES}
                />
              }
            >
              <Route path="/invoices" element={<Invoices />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ADMIN, EMPLOYEE, COMPANY]}
                  routeName={
                    role === COMPANY
                      ? routeName.MY_INVOICES
                      : routeName.INVOICES
                  }
                />
              }
            >
              <Route path="/create-invoice" element={<CreateInvoicePage />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.EXPENSES}
              />
            }>
              <Route path="/expenses" element={<Expense />} />
              <Route path="/expense-details/:id" element={<ExpenseDeytails />} />
              <Route path="/allexpenses" element={<AllCompnayExpenses />} />

            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.ACCOUNTS}
              />
            }>
              <Route path="/accounts" element={<Account />} />
              <Route path="/allaccounts" element={<AllCompanyAccount />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.COMPLIANCE}
              />
            }>
              <Route path="/compliance/upload" element={<UploadDocumentPage />} />
              <Route path="/compliance/list" element={<Navigate to="/compliance" replace />} />
              <Route path="/compliance" element={<CompliancePortal />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[ADMIN, EMPLOYEE]}
                routeName={routeName.REPORTS}
              />
            }>
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[ADMIN, EMPLOYEE]}
                  routeName={routeName.SETTING}
                />
              }
            >
              <Route path="/setting" element={<Setting />}>

                <Route index element={<ViewEmployeeSection />} />
                <Route path="employee" element={<ViewEmployeeSection />} />
                <Route path="permissions" element={<PermissionsSection />} />
                <Route path="addemployee" element={<AddEmployeeSection />} />
              </Route>
            </Route>

            {/* COMPANY SIDE */}
            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.COMPANY_DASHBOARD}
              />
            }>
              <Route path="/company-dashboard" element={<CompanyDashboard />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.BOARD_OF_DIRECTORS}
              />
            }>
              <Route path="/company-board-of-directors" element={<BoardOfDirectorsCompany />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.FARMER_MEMBERS}
              />
            }>
              <Route path="/company-farmer-members" element={<CompanyFarmerMembers />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[COMPANY]}
                  routeName={routeName.MY_MATERIALS}
                />
              }
            >
              <Route path="/company-materials" element={<CompanyMaterials />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.MY_INVOICES}
              />
            }>
              <Route path="/company-invoices" element={<CompanyInvoices />} />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.MY_RECEIPTS}
              />
            }>
              <Route path="/company-receipts" element={<CompanyRecipts />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[COMPANY]}
                  routeName={routeName.MY_EXPENSES}
                />
              }
            >
              <Route path="/company-expenses" element={<CompanyExpenses />} />
              <Route path="/company-expense-details/:id" element={<CompanyExpenseDeytails />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[COMPANY]}
                  routeName={routeName.MY_ACCOUNT}
                />
              }
            >
              <Route path="/company-accounts" element={<CompanyAccount />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[COMPANY]}
                  routeName={routeName.COMPLIANCE_DOCUMENTS}
                />
              }
            >
              <Route
                path="/company-compliance"
                element={<Navigate to="/compliance/upload-documents" replace />}
              />

              <Route
                path="/compliance/upload-documents"
                element={<UploadDocumentPage />}
              />
            </Route>

            <Route element={
              <ProtectedRoute
                allowedRoles={[COMPANY]}
                routeName={routeName.PROFILE}
              />
            }>
              <Route path="/company-profile" element={<CompanyProfile />} />
            </Route>

            <Route path="/unauth" element={<UnauthorizedPage />} />
            <Route path="/user-profie" element={<Profile />} />

          </Route>
        </Routes>

        <ToastContainer />
      </Suspense>
    </>
  );
}

export default App;
