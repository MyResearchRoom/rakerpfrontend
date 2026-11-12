import {
  Home,
  Building2,
  Package,
  Wallet,
  Receipt,
  FileText,
  BookOpen,
  ShieldCheck,
  BarChart3,
  Settings,
  User,
  Users,
  Wallet2,
  BookOpenIcon,
} from "lucide-react";


import { ADMIN, COMPANY, EMPLOYEE } from "../constants/role";
import { routeName } from "../constants/route";

export const routes = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Companies",
    path: "/companies",
    icon: Building2,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Materials",
    path: "/materials",
    icon: Package,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Invoices",
    path: "/invoices",
    icon: FileText,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Receipts",
    path: "/receipts",
    icon: Receipt,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: Wallet,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Accounts",
    path: "/accounts",
    icon: BookOpen,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Compliance",
    path: "/compliance",
    icon: ShieldCheck,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: [ADMIN, EMPLOYEE],
  },
  {
    label: "Setting",
    path: "/setting",
    icon: Settings,
    roles: [ADMIN, EMPLOYEE],
  },

  // COMPANY SIDE
  {
    label: "Dashboard",
    path: "/company-dashboard",
    icon: Home,
    roles: [COMPANY],
  },
  {
    label: "Board of Directors Management",
    path: "/company-board-of-directors",
    icon: Users,
    roles: [COMPANY],
  },
  {
    label: "Members ",
    path: "/company-farmer-members",
    icon: Users,
    roles: [COMPANY],
  },
  {
    label: "My Materials",
    path: "/company-materials",
    icon: Package,
    roles: [COMPANY],
  },
  {
    label: "My Invoices",
    path: "/company-invoices",
    icon: FileText,
    roles: [COMPANY],
  },
  {
    label: "My Receipts",
    path: "/company-receipts",
    icon: Receipt,
    roles: [COMPANY],
  },
  {
    label: "My Expenses",
    path: "/company-expenses",
    icon: Wallet2,
    roles: [COMPANY],
  },
  {
    label: "My Accounts",
    path: "/company-accounts",
    icon: BookOpenIcon,
    roles: [COMPANY],
  },
  {
    label: "Compliance Documents",
    path: "/company-compliance",
    icon: ShieldCheck,
    roles: [COMPANY],
  },
  {
    label: "Profile",
    path: "/company-profile",
    icon: User,
    roles: [COMPANY],
  },

];
