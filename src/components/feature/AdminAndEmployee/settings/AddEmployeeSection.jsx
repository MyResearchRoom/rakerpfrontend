import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import InputField from "../../../comman/InputField";
import ButtonComponent from "../../../comman/ButtonComponent";
import { EMPLOYEE } from "../../../../constants/role";
import { addEmplyoee, editEmployee, getEmployeeDataById } from "../../../../services/user";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchEmployee } from "../../../../store/actions/employeeList";
import { useDispatch } from "react-redux";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const AddEmployeeSection = () => {

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editingEmployeeId = searchParams.get("employeeId");
  const isEditMode =!!editingEmployeeId;

  const fetchEmployeeDataById=async()=>{
          try { 
            
              const response=await getEmployeeDataById(editingEmployeeId);
              if(response){
                setFormState({
                  name: response.name || "",
                  email: response.email || "",
                  phone: response.mobileNumber || "",
                  username: response.email || "",
                  password: "",
                  confirmPassword: "",
                });
                setErrors({});
              }
                  
          } catch (error) {
            toast.error(error)
          }
  }
      
  useEffect(() => {
          if(editingEmployeeId){
            fetchEmployeeDataById();
          }
  }, [editingEmployeeId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "email") {
        updated.username = value;
      }

      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const clearForm = () => {
    setFormState(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const validationErrors = {};

    if (!formState.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!formState.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email.trim())) {
      validationErrors.email = "Enter a valid email";
    }

    if (!formState.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formState.phone.trim())) {
      validationErrors.phone = "Enter valid 10-digit mobile number";
    }

    if (!isEditMode) {
      if (!formState.password) {
        validationErrors.password = "Password is required";
      } else if (formState.password.length < 6) {
        validationErrors.password = "Minimum 6 characters";
      }

      if (!formState.confirmPassword) {
        validationErrors.confirmPassword = "Confirm your password";
      } else if (formState.password !== formState.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      return false;
    }

    return true;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try{
      let payload={};
      if(isEditMode){
        payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        mobileNumber: formState.phone.trim(),
      };
      } else{
      payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        mobileNumber: formState.phone.trim(),
        password: formState.password,
        role:EMPLOYEE
      };
      }

      const response = isEditMode ? await editEmployee(payload,editingEmployeeId) : await addEmplyoee(payload);
      
      if(response){
       toast.success(response|| isEditMode ? "Employee edited successfully....": "Employee added successfully...")
        
        clearForm();

        dispatch(   
          fetchEmployee({
            searchTerm:"",
            page: "",
          })
        );

        navigate("/setting/employee");
      }
      else{
        toast.error(isEditMode ? "Fail to edit employee....":"Fail to add employee");
      }

    }catch (error) {
      toast.error(error || "Something went wrong");
    }

  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-100 p-2 text-green-600">
          <EyeOff size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Add New Employee</p>
          <h3 className="text-lg font-semibold text-gray-900">
            Create a new employee account with basic details
          </h3>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Name"
            required
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="Enter name"
            errorMessage={errors?.name}
          />

          <InputField
            label="Email"
            required
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="employee@rakserp.com"
            errorMessage={errors?.email}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Phone Number"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            errorMessage={errors?.phone}
            maxLength={10}
          />

          <InputField
            label="Username"
            name="username"
            value={formState.username}
            readOnly
            placeholder="autofills from email"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <InputField
              label="Password"
              required={isEditMode ? false : true}
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              onChange={handleChange}
              errorMessage={errors?.password}
              disabled={isEditMode}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <InputField
              label="Confirm Password"
              required={isEditMode ? false : true}
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formState.confirmPassword}
              onChange={handleChange}
              errorMessage={errors?.confirmPassword}
               disabled={isEditMode}
            />

            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-[38px]"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 ml-auto">
          <ButtonComponent
            type="button"
            handleButtonClick={clearForm}
            className="px-5 py-2 rounded-lg border border-black text-white bg-green-500"
          >
            Clear Form
          </ButtonComponent>

          <ButtonComponent
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600"
          >
            {isEditMode? "Update Employee" : "Add Employee"}
          </ButtonComponent>
          
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeSection;

