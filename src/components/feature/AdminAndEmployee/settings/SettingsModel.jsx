import React from "react";
import { Outlet } from "react-router-dom";
import NestedTabHeader from "../../../../components/comman/NestedTabHeader";

const tabConfigs = [
  { label: "Employees", path: "employee", isIndex: true },
  { label: "Add Employee", path: "addemployee" },
  { label: "Permissions", path: "permissions", },
];

const SettingsModel = () => (
  <div className="min-h-screen space-y-6">
    <div className="space-y-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage employees and permissions</p>
      </div>

      <NestedTabHeader tabs={tabConfigs} useRoutes={true} basePath="setting" />
    </div>

    <Outlet />
  </div>
);

export default SettingsModel;
