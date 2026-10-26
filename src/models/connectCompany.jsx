import { Eye, EyeOff, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { addNewCompany, editCompany, getCompanyById } from "../services/companyService";
import { fetchCompanies, fetchCompanyDataById } from "../store/actions/companyAction";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from '../components/comman/fileUpload';
import { fetchEmployee } from "../store/actions/employeeList";
import SelectField from "../components/comman/SelectField";
import InputField from "../components/comman/InputField";
import { EMPLOYEE } from "../constants/role";

const initialState = {
    companyName: "",
    gstin: "",
    pan: "",
    companyType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    assignedEmployee: "",
    password: "",
    confirmPassword: "",
    logo: null,
};


const companyTypes = [
    { label: "Private Ltd", value: "private_ltd" },
    { label: "Public Ltd", value: "public_ltd" },
    { label: "LLP", value: "llp" },
    { label: "OPC", value: "opc" },
    { label: "Partnership", value: "partnership" },
    { label: "Proprietorship", value: "proprietorship" },
    { label: "Producer Company", value: "producer_company" },
    { label: "Section 8 Company", value: "section8" },
    { label: "Trust", value: "trust" },
    { label: "Society", value: "society" },
    { label: "Cooperative", value: "cooperative" },
    { label: "Government", value: "government" },
    { label: "Producer Organisation", value: "producer_organisation" },
    { label: "Other", value: "other" }
];


const ConnectCompany = ({ isOpen, onClose, initialData }) => {
    const { user, role } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const { employees } = useSelector((state) => state.empployeeData);

    useEffect(() => {
        if (role === EMPLOYEE && user?.id) {
            setFormData((prev) => ({ ...prev, assignedEmployee: user.id }));
        }
    }, [role, user?.id]);

    const fetchCompanyById = async () => {
        try {
            console.log("initial data",initialData);
            
            setLoading(true);
            const response = await getCompanyById(initialData);
            console.log("company name",response.name);
            
            if (response) {
                setFormData({
                    companyName: response.name || "",
                    gstin: response.gstin || "",
                    pan: response.pan || "",
                    companyType: response.companyType || "",
                    address: response.address || "",
                    city: response.city || "",
                    state: response.state || "",
                    pincode: response.pincode || "",
                    contactPerson: response.contactPerson || "",
                    contactEmail: response.email || "",
                    contactPhone: response.mobileNumber || "",
                    assignedEmployee: response.assignEmployeeData?.id ?? "",
                    logo: response?.logo || null,
                    password: "",
                    confirmPassword: "",
                    // password: response?.password || "",
                    // confirmPassword: response?.password || "",
                });
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialData) fetchCompanyById();
    }, [initialData]);

    useEffect(() => {
        dispatch(fetchEmployee({ searchTerm: "", page: "", limit: "All" }));
    }, []);

    const isEditMode = !!initialData;

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFormData((prev) => ({ ...prev, logo: file }));
    };

    const validate = () => {
        let newErrors = {};

        const name = formData.companyName?.toLowerCase().trim();
        if (!name) {
            newErrors.companyName = "Company name is required";
        } 

        if (!formData.gstin.trim()) {
            newErrors.gstin = "GSTIN is required";
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin.trim().toUpperCase())) {
            newErrors.gstin = "Invalid GSTIN format";
        }

        if (!formData.pan.trim()) {
            newErrors.pan = "PAN is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.trim().toUpperCase())) {
            newErrors.pan = "Invalid PAN format";
        }

        if (!formData.companyType) newErrors.companyType = "Select company type";
        if (!formData.address.trim()) newErrors.address = "Address required";
        if (!formData.city.trim()) newErrors.city = "City required";
        if (!formData.state.trim()) newErrors.state = "State required";

        if (!formData.pincode.trim()) newErrors.pincode = "Pincode required";
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person required";

        if (!formData.contactEmail.trim()) newErrors.contactEmail = "Email required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) newErrors.contactEmail = "Invalid email";

        if (!formData.contactPhone.trim()) newErrors.contactPhone = "Phone required";
        else if (!/^\d{10}$/.test(formData.contactPhone)) newErrors.contactPhone = "Invalid phone number";

        if (!formData.assignedEmployee) newErrors.assignedEmployee = "Assign employee is required";

        // In edit mode, validate password only if the user has typed something
        if (!isEditMode) {
            if (!formData.password) newErrors.password = "Password required";
            else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";

            if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password required";
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        } else {
            if (formData.password || formData.confirmPassword) {
                if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
                if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix highlighted error first");
            return;
        }

        const payload = new FormData();
        payload.append("name", formData.companyName);
        payload.append("gstin", formData.gstin);
        payload.append("pan", formData.pan);
        payload.append("companyType", formData.companyType);
        payload.append("address", formData.address);
        payload.append("city", formData.city);
        payload.append("state", formData.state);
        payload.append("pincode", formData.pincode);
        payload.append("contactPerson", formData.contactPerson);
        payload.append("email", formData.contactEmail);
        payload.append("mobileNumber", formData.contactPhone);
        payload.append("assignEmployee", formData.assignedEmployee);

        // Only append password if provided (handles both add and optional edit)
        if (formData.password) {
            payload.append("password", formData.password);
        }

        if (formData.logo instanceof File) {
            payload.append("logo", formData.logo);
        }

        try {
            setLoading(true);
            const response = isEditMode
                ? await editCompany(payload, initialData)
                : await addNewCompany(payload);

            if (response) {
                toast.success(response || (isEditMode ? "Company edited successfully" : "Company added successfully"));
                setFormData(initialState);
                onClose();
                dispatch(fetchCompanies({ searchTerm: "", status: "", employeeId: "", page: "" }));
                if (initialData) dispatch(fetchCompanyDataById(initialData));
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.error("ERROR:", err);
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-[95%] max-w-2xl rounded-xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row gap-5 border-b justify-between p-5 items-start">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {initialData ? "Edit Company" : "Connect New Company"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {initialData
                                ? "Update the company details to keep the information accurate and up to date."
                                : "Enter the details of the company you want to connect to the RAK ERP system."}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-black">
                        <X />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-5 max-h-[70vh] overflow-y-auto flex flex-col gap-3"
                >
                    {/* Company Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-1">Company Information</h3>

                        {/* Company Name - full width */}
                        <div className="mb-3">
                            <InputField
                                label="Company Name" required name="companyName"
                                placeholder="Tech Solutions" value={formData.companyName}
                                onChange={handleChange} errorMessage={errors.companyName}
                            />
                        </div>

                        {/* Company Type - full width */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <SelectField
                                label="Company Type" required name="companyType"
                                options={companyTypes} value={formData.companyType}
                                onChange={handleChange} labelKey="label" valueKey="value"
                                errorMessage={errors.companyType}
                            />
                            <InputField
                                label="GSTIN" required name="gstin"
                                placeholder="29AABCT1332L1Z5" value={formData.gstin}
                                onChange={handleChange} errorMessage={errors.gstin}
                            />
                            <InputField
                                label="PAN" required name="pan"
                                placeholder="AABCT1332L" value={formData.pan}
                                onChange={handleChange} errorMessage={errors.pan}
                            />
                        </div>
                    </div>

                    {/* Address Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-2">Address Details</h3>
                        <InputField
                            label="Address" required name="address"
                            placeholder="No. 45, MG Road" value={formData.address}
                            onChange={handleChange} errorMessage={errors.address}
                        />
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <InputField
                                label="City" required name="city"
                                placeholder="Bangalore" value={formData.city}
                                onChange={handleChange} errorMessage={errors.city}
                            />
                            <InputField
                                label="State" required name="state"
                                placeholder="Karnataka" value={formData.state}
                                onChange={handleChange} errorMessage={errors.state}
                            />
                        </div>
                        <InputField
                            label="Pincode" required name="pincode"
                            placeholder="560001" value={formData.pincode}
                            onChange={handleChange} errorMessage={errors.pincode}
                        />
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-2">Contact Details</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <InputField
                                label="Contact Person" required name="contactPerson"
                                placeholder="Priya Sharma" value={formData.contactPerson}
                                onChange={handleChange} errorMessage={errors.contactPerson}
                            />
                            <InputField
                                label="Contact Email" required name="contactEmail"
                                placeholder="priya@techsolutions.com" value={formData.contactEmail}
                                onChange={handleChange} errorMessage={errors.contactEmail}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <InputField
                                label="Contact Phone" required name="contactPhone"
                                placeholder="+91 98765 43210" value={formData.contactPhone}
                                onChange={handleChange} errorMessage={errors.contactPhone}
                            />
                            <SelectField
                                label="Assigned Employee" onChange={handleChange}
                                name="assignedEmployee" value={formData.assignedEmployee}
                                optionLabel="Select employee" options={employees}
                                labelKey="name" valueKey="id" required={true}
                                errorMessage={errors.assignedEmployee} disabled={role === EMPLOYEE}
                            />
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <FileUpload
                        title="Company logo (optional)" name="logo"
                        display={true} handleChange={handleFileChange}
                    />
                    {formData.logo && (
                        <img
                            src={typeof formData.logo === "object" ? URL.createObjectURL(formData.logo) : formData.logo}
                            alt="logo preview"
                            className="mt-2 h-16 w-16 object-cover rounded-md border"
                        />
                    )}

                    {/* Password Fields */}
                    <div>
                        <h3 className="text-sm font-semibold text-black mb-2">
                            {isEditMode ? "Change Password (optional)" : "Set Password"}
                        </h3>
                        {isEditMode && (
                            <p className="text-xs text-gray-400 mb-2">
                                Leave blank to keep the existing password unchanged.
                            </p>
                        )}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="relative">
                                <InputField
                                    label="Password" required={!isEditMode} name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password} onChange={handleChange}
                                    errorMessage={errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="relative">
                                <InputField
                                    label="Confirm Password" required={!isEditMode} name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword} onChange={handleChange}
                                    errorMessage={errors.confirmPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-1 border rounded-md bg-gray-200 border-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1 bg-blue-600 text-white rounded-md"
                        >
                            {isEditMode ? "Update Company" : loading ? "Adding Company..." : "Connect Company"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConnectCompany;