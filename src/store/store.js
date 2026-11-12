import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice"
import { companyByIdReducer, companyDropdownReducer, companyReducer } from "./reducers/companyReducer";
import { employeeReducer } from "./reducers/employeeListReducer";
import { getListOfBODForExcelReducer, getListOfBosardOfDirectoreReducer } from "./reducers/boardOfDirectorReducer";
import { getListOfFarmerMemberReducer, getListOfFMForExcelReducer } from "./reducers/farmerMemberReducer";
import { materialReducer } from "./reducers/materialReducer";
import { invoiceReducer } from "./reducers/invoicesReducer";
import { receiptsReducer } from "./reducers/receiptsReducer";
import { countAdminDashboardReducer, countCompanyDashboardReducer, countReducer } from "./reducers/countReducer";
import { expenseCategoriesReducer } from "./reducers/expenseCategoryReducer";
import { expenseReducer } from "./reducers/expenseReducer";
import { accountReducer, accountReducerForExcel } from "./reducers/accountReducer";
import { complianceReducer } from "./reducers/complianceReducer";
export const store=configureStore({
    reducer:{
        auth:authReducer,
        companyData: companyReducer,
        companyDropdownData: companyDropdownReducer,
        empployeeData: employeeReducer,
        companyById : companyByIdReducer,
        boardOfDirector : getListOfBosardOfDirectoreReducer,
        farmerMember : getListOfFarmerMemberReducer,
        BODForExcel : getListOfBODForExcelReducer,
        FMForExcel : getListOfFMForExcelReducer,
        materials: materialReducer,
        invoices: invoiceReducer,
        receipts: receiptsReducer,
        counts: countReducer,
        expenseCategories:expenseCategoriesReducer,
        expenses: expenseReducer,
        account:accountReducer,
        accountForExcel:accountReducerForExcel,
        compliances: complianceReducer,

        adminDashCounts: countAdminDashboardReducer,

        companyDashCount:countCompanyDashboardReducer,
    }
})
