import React, { useEffect, useState } from "react";
import { permissionModules } from "../../../../data/permissionModules";
import { getAllEmployees } from "../../../../services/user";
import { toast } from "react-toastify";
import SelectField from "../../../comman/SelectField"
import { getPermissionList, getPermissionListByEmployee, grantPermission } from "../../../../services/PermissionServcie";

const PermissionsSection = () => {
  const [employees, setEmployees] = useState([]);
  const [permissionModules, setPermissionModules]=useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [permissionIds,setPermissionIds]=useState([]);


  const fetchEmployee=async()=>{
      try {
        const response=await getAllEmployees({page:"",limit:"all"});
        console.log("Employee list",response);
        
        if(response){
          setEmployees(response?.employees);
          setLoadingEmployees(false);
        }
      } catch (error) {
        toast.error(error)
      }
  }
        
  useEffect(()=>{
    fetchEmployee()
  },[])

  useEffect(()=>{
        const fetchAccessList=async()=>{
            try {
                const response=await getPermissionList();
                if(response){
                    setPermissionModules(response);
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchAccessList();
  },[]);

  useEffect(()=>{
        const fetchAccessListByEmployee=async()=>{
            try {
                const response=await getPermissionListByEmployee(selectedEmployeeId);
                if(response){
                    setPermissionIds(response);
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if(selectedEmployeeId !==''){
            fetchAccessListByEmployee();
        }
  },[selectedEmployeeId]);


  const toggleModule = (screenId) => {
    if (!selectedEmployeeId) {
        return toast.error('Select Employee First')
    };
    if(selectedEmployeeId){
      if(permissionIds.includes(screenId)){
        setPermissionIds((prev)=>(
          prev.filter(id=> id !== screenId)
        ))
      }
      else{
        setPermissionIds((prev)=>
          [...prev,screenId]
        )
      }
    }
  };

  const handleSave = async() => {
    if (!selectedEmployeeId) {
      return toast.error('Select Employee First')
    };
    setSaving(true);
    if(selectedEmployeeId){
      try {
        const response=await grantPermission({userId:selectedEmployeeId,permissionIds});
        if(response){
          toast.success(response ||'Access Granted Successfully')
          setPermissionIds([]);
          
          setSaving(false);
          setSelectedEmployeeId('');
        }
      } catch (error) {
        toast.error(error.message);
        setSaving(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6">
   
      <div className="flex flex-col gap-1">
 
        <SelectField
            label="Select Employee"
            onChange={(event) => setSelectedEmployeeId(event.target.value)}
            name="selectedEmployeeId"
            value={selectedEmployeeId}
            optionLabel={"Select employee"}
            options={employees}
            labelKey="name" 
            valueKey={"id"}
            required={true}
        />
      </div>

      <div className="min-h-[300px] flex items-center justify-center">
        {loadingEmployees ? (
          <div className="text-sm text-gray-500">
            Loading employees...
          </div>
        ) 
        // : !selectedEmployeeId ? (
        //   <div className="text-gray-400 text-sm">
        //     Select an employee to configure their permissions.
        //   </div>
        // ) 
        : (
          <div className="w-full space-y-6">
   
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {permissionModules.map((module) => (
                <label
                  key={module.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm cursor-pointer hover:border-gray-400"
                >
                  <input
                    type="checkbox"
                    checked={permissionIds.includes(module.id)}
                    onChange={() => toggleModule(module.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="font-medium text-gray-700">
                    {module.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  saving
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsSection;