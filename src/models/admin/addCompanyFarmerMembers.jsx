import { Download, Sheet, Upload, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import InputField from "../../components/comman/InputField";
import SelectField from "../../components/comman/SelectField";
import FileUpload from "../../components/comman/fileUpload";
import { viewComplianceDocument } from "../../utils/complianceDocuments";
import { useDispatch, useSelector } from "react-redux";
import { fetchFarmerMemebrs } from "../../store/actions/farmerMember";
import { addBulkFarmerMembers, addCompanyFarmerMember, editFarmerMember, getFarmerMemberById } from "../../services/farmerMember";

const farmerDocumentFields = [
    "aadhaarCard",
    "sevenTwelve",
    "panCard",
];

const AddFarmerMembersModal = ({ isOpen, onClose, id, farmerId }) => {

    // Role is used to decide whether the full form (admin, or company on Add)
    // or only the "Upload Documents" section (company, edit-only) should be shown.
    const { role } = useSelector((state) => state.auth);
    const isCompanyRole = role === "COMPANY";
    // Company users should see the full form when adding a new farmer member,
    // and ONLY the documents section when editing an existing one.
    const isCompanyDocOnlyView = isCompanyRole && Boolean(farmerId);

    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        gender: "",
        category: "",

        qualification: "",
        mobileNumber: "",
        email: "",
        pan: "",
        aadhaar: "",

        shareDate: "",
        faceValue: "",
        noOfShareAlloted: "",
        shareConstribution: "",

        folioNumber: "",
        shareholding: "",
        landHolding: "",
        landRecordNumber: "",

        village: "",
        block: "",
        tehsil: "",
        district: "",

        state: "",
        pincode: "",
        aadhaarCard: null,
        sevenTwelve: null,
        panCard: null,

    });

    const fetchFarmerMemberById = async () => {
        try {
            const res = await getFarmerMemberById(farmerId);
            if (res) {
                setFormData(res);
            }
            else {
                toast.error("Somethig went wrong")
            }
        }
        catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        if (farmerId) {
            fetchFarmerMemberById();
        }
    }, [farmerId]);

    const fileRef = useRef();

    const [errors, setErrors] = useState({});
    const [documentFiles, setDocumentFiles] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const openDocumentInViewer = (documentValue, docName, docContentType = "application/pdf") => {
        if (!documentValue) {
            toast.error("No uploaded document found");
            return;
        }

        if (typeof documentValue === "string") {
            viewComplianceDocument({
                doc: documentValue,
                docName,
                docContentType,
            });
            return;
        }

        if (documentValue instanceof File) {
            const fileUrl = URL.createObjectURL(documentValue);
            viewComplianceDocument({
                doc: fileUrl,
                docName: documentValue.name || docName,
                docContentType: documentValue.type || docContentType,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        // For the company doc-only edit view, only documents are being
        // submitted — skip the full-form validation entirely.
        if (isCompanyDocOnlyView) {
            setErrors({});
            return true;
        }

        let newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full name is required";

        if (!formData.mobileNumber) {
            newErrors.mobileNumber = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = "Enter valid 10-digit mobile number";
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
            newErrors.pan = "Invalid PAN format";
        }

        if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
            newErrors.aadhaar = "Aadhaar must be 12 digits";
        }

        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Enter valid 6-digit pincode number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            age: "",
            gender: "",
            category: "",

            qualification: "",
            mobileNumber: "",
            email: "",
            pan: "",
            aadhaar: "",

            shareDate: "",
            faceValue: "",
            noOfShareAlloted: "",
            shareConstribution: "",

            folioNumber: "",
            shareholding: "",
            landHolding: "",
            landRecordNumber: "",

            village: "",
            block: "",
            tehsil: "",
            district: "",

            state: "",
            pincode: "",
            aadhaarCard: null,
            sevenTwelve: null,
            panCard: null,
        });

        setErrors({});
        setDocumentFiles({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors then submit");
            return;
        }

        const payload = new FormData();

        // Even in the company doc-only edit view, the other farmer fields
        // (fullName, mobileNumber, email, etc.) still need to go to the
        // backend, since the edit endpoint requires them. The user isn't
        // editing those fields here, but formData already holds the
        // existing, previously-fetched values, so we send them back
        // unchanged alongside the newly uploaded documents.
        Object.keys(formData).forEach((key) => {
            if (
                farmerDocumentFields.includes(key) ||
                farmerDocumentFields.some((field) => key === `${field}ContentType`)
            ) {
                return;
            }

            let value = formData[key];

            const isEmpty =
                value === undefined ||
                value === null ||
                value === "" ||
                value === "Invalid date";

            if (!isEmpty) {
                payload.append(key, value);
            }
        });

        farmerDocumentFields.forEach((field) => {
            if (documentFiles[field]) {
                payload.append(field, documentFiles[field]);
            }
        });

        for (let pair of payload.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            setLoading(true);
            const response = farmerId ? await editFarmerMember(payload, farmerId) : await addCompanyFarmerMember(payload, id);
            if (response) {
                toast.success(response || (farmerId ? "Farmer members edited successfully" : "Farmer members added successfully"));
                resetForm();
                onClose();
                dispatch(
                    fetchFarmerMemebrs({
                        id,
                        searchTerm: "",
                        page: "",
                    })
                );
            } else {
                toast.error("Something went wrong")
            }

        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileClick = () => {
        fileRef.current.click();
    };

    const [excelFile, setExcelFile] = useState(null);

    const [loadingUpload, setLoadingUpload] = useState(false);

    const [responseData, setResponseData] = useState({});

    const handleExcelFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validExtensions = [".xlsx", ".csv"];
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
        ];

        const isValidExtension = validExtensions.some(ext =>
            file.name.toLowerCase().endsWith(ext)
        );

        const isValidType = validTypes.includes(file.type);

        if (!isValidExtension || !isValidType) {
            toast.error("Please upload only .xlsx or .csv file");
            return;
        }

        setExcelFile(file);
    };

    const handleDocumentFileChange = (field, e) => {
        const file = e.target.files?.[0];

        setDocumentFiles((prev) => ({
            ...prev,
            [field]: file || null,
        }));
    };

    const handleFileUpload = async () => {

        if (!excelFile) {
            return toast.error("Please upload file first and then submit");
        }
        try {
            setLoadingUpload(true);
            const payload = new FormData();
            if (excelFile) payload.append("file", excelFile);
            const response = farmerId ? await editFarmerMember(payload, farmerId) : await addBulkFarmerMembers(payload, id);
            if (response) {
                toast.success(response?.message || (farmerId ? "Farmers updated successfully.." : "Farmers added.."))
                console.log("response", response);
                setExcelFile(null);
                setResponseData(response?.data);
            }
            else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUpload(false);
        }
    }

    if (!isOpen || !id) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex  items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white w-[80%] rounded-lg p-5 shadow-lg relative h-[90vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row items-center justify-between gap-5 mb-5 border-b border-gray-400 pb-2">
                    <h2 className="text-lg font-bold text-black">
                        {farmerId ? "Edit Farmer Member Documents" : "Add Farmer Members"}
                    </h2>
                    <button
                        className="text-black text-lg"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>


                <div className="border border-gray-300 bg-gray-50 p-5 rounded-lg mb-5">

                        <>
                            <h2 className="text-sm md:text-base font-semibold mb-4">Add Farmer Member</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InputField
                                    label="Full Name"
                                    required
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    errorMessage={errors?.fullName}
                                />

                                <InputField
                                    label="Age"
                                    name="age"
                                    type='number'
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Age"
                                    errorMessage={errors?.age}
                                />

                                <SelectField
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    optionLabel='Select Gender'
                                    options={[
                                        { value: 'male', label: "Male" },
                                        { value: 'female', label: "Female" },
                                        { value: 'other', label: "Other" },
                                    ]}
                                    labelKey="label"
                                    valueKey="value"
                                    errorMessage={errors?.gender}
                                />

                                <SelectField
                                    label="Social Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    optionLabel='Select category'
                                    options={[
                                        { value: 'general', label: "General" },
                                        { value: 'obc', label: "OBC" },
                                        { value: 'sc', label: "SC" },
                                        { value: 'st', label: "ST" },
                                    ]}
                                    labelKey="label"
                                    valueKey="value"
                                    errorMessage={errors?.category}
                                />

                                <InputField
                                    label="Educational Qualification"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g., MBA"
                                    errorMessage={errors?.qualification}
                                />

                                <InputField
                                    label="Mobile Number"
                                    name="mobileNumber"
                                    required
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    errorMessage={errors?.mobileNumber}
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="farmer@example.com"
                                    errorMessage={errors?.email}
                                />

                                <InputField
                                    label="PAN"
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleChange}
                                    placeholder="ABCDE1234F"
                                    errorMessage={errors?.pan}
                                />

                                <InputField
                                    label="Aadhaar Number"
                                    name="aadhaar"
                                    required
                                    value={formData.aadhaar}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012"
                                    errorMessage={errors?.aadhaar}
                                />

                                <InputField
                                    label="Date of Share Capital Contribution / MemberShip date"
                                    type="date"
                                    name="shareDate"
                                    value={formData.shareDate}
                                    onChange={handleChange}
                                    errorMessage={errors?.shareDate}
                                />

                                <InputField
                                    label="Face Value of Share"
                                    name="faceValue"
                                    type='number'
                                    value={formData.faceValue}
                                    onChange={handleChange}
                                    placeholder="100"
                                    errorMessage={errors?.faceValue}
                                />

                                <InputField
                                    label="Number of Shares alloted"
                                    name="noOfShareAlloted"
                                    type='number'
                                    value={formData.noOfShareAlloted}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    errorMessage={errors?.noOfShareAlloted}
                                />

                                <InputField
                                    label="Contribution to Share Capital"
                                    name="shareConstribution"
                                    type='number'
                                    value={formData.shareConstribution}
                                    onChange={handleChange}
                                    placeholder="100000"
                                    errorMessage={errors?.shareConstribution}
                                />

                                <InputField
                                    label="Distinctive Folio Number"
                                    name="folioNumber"
                                    value={formData.folioNumber}
                                    onChange={handleChange}
                                    placeholder="F001"
                                    errorMessage={errors?.folioNumber}
                                />

                                <InputField
                                    label="Shareholding Percentage"
                                    name="shareholding"
                                    type='number'
                                    value={formData.shareholding}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    errorMessage={errors?.shareholding}
                                />

                                <InputField
                                    label="Total Landholding (Acres)"
                                    name="landHolding"
                                    type='number'
                                    value={formData.landHolding}
                                    onChange={handleChange}
                                    placeholder="100000"
                                    errorMessage={errors?.landHolding}
                                />

                                <InputField
                                    label="Land Record Number / (Survet/Khasra)"
                                    name="landRecordNumber"
                                    value={formData.landRecordNumber}
                                    onChange={handleChange}
                                    placeholder="F001"
                                    errorMessage={errors?.landRecordNumber}
                                />

                                <InputField
                                    label="Village"
                                    name="village"
                                    value={formData.village}
                                    onChange={handleChange}
                                    placeholder={"Enter village name"}
                                    errorMessage={errors?.village}
                                />

                                <InputField
                                    label="Block"
                                    name="block"
                                    value={formData.block}
                                    placeholder={"Enter block name"}
                                    onChange={handleChange}
                                    errorMessage={errors?.block}
                                />

                                <InputField
                                    label="Tehsil/Taluka"
                                    name="tehsil"
                                    value={formData.tehsil}
                                    onChange={handleChange}
                                    placeholder={"Enter tehsil name"}
                                    errorMessage={errors?.tehsil}
                                />

                                <InputField
                                    label="District"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder={"Enter district name"}
                                    errorMessage={errors?.district}
                                />

                                <InputField
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder={"Enter state name"}
                                    errorMessage={errors?.state}
                                />

                                <InputField
                                    label="PIN Code"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    errorMessage={errors?.pincode}
                                    placeholder={"123456"}
                                />

                            </div>
                        </>
   
                    <div className="mt-8">
                        <h2 className="text-sm md:text-base font-semibold mb-4">
                            Upload Documents
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Aadhaar */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="Aadhaar Card"
                                    name="aadhaarCard"
                                    display={true}
                                    value={documentFiles.aadhaarCard || formData.aadhaarCard}
                                    existingFileName="Aadhaar Card"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("aadhaarCard", e)
                                    }
                                />

                                {farmerId && (documentFiles.aadhaarCard || formData.aadhaarCard) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.aadhaarCard || formData.aadhaarCard,
                                                "Aadhaar Card",
                                                formData.aadhaarCardContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition w-fit"
                                    >
                                        <Eye size={14} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>

                            {/* 7/12 */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="7/12 Document"
                                    name="sevenTwelve"
                                    display={true}
                                    value={documentFiles.sevenTwelve || formData.sevenTwelve}
                                    existingFileName="7/12 Document"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("sevenTwelve", e)
                                    }
                                />

                                {farmerId && (documentFiles.sevenTwelve || formData.sevenTwelve) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.sevenTwelve || formData.sevenTwelve,
                                                "7/12 Document",
                                                formData.sevenTwelveContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition w-fit"
                                    >
                                        <Eye size={14} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>


                            <div className="flex flex-col">
                                <FileUpload
                                    title="PAN Card"
                                    name="panCard"
                                    display={true}
                                    value={documentFiles.panCard || formData.panCard}
                                    existingFileName="PAN Card"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("panCard", e)
                                    }
                                />

                                {farmerId && (documentFiles.panCard || formData.panCard) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.panCard || formData.panCard,
                                                "PAN Card",
                                                formData.panCardContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition w-fit"
                                    >
                                        <Eye size={14} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>


                        </div>
                    </div>


                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border rounded-md text-sm bg-white font-semibold border-gray-300"
                        >
                            Reset Form
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                        >
                            {farmerId ? "Update Farmer" : (loading ? "Adding Farmer " : "+ Add Farmer")}
                        </button>
                    </div>

                </div>

                {!isCompanyDocOnlyView && (
                    <>
                        <div className="border border-blue-300 bg-blue-50 p-5 rounded-lg flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row items-start gap-5 justify-between border-b-2 pb-3 border-dashed border-gray-500">
                                <div className="space-y-1">
                                    <h2 className="text-sm md:text-base font-semibold mb-1">Bulk Import via Excel</h2>
                                    <h2 className="text-xs md:text-sm font-semibold text-gray-700">
                                        Download the template, fill farmer details, and upload to add members in bulk.
                                    </h2>
                                </div>

                                <div className="font-semibold ">
                                    <button
                                        onClick={() => {
                                            const link = document.createElement("a");
                                            link.href = "/template/FarmerMember_Template.csv";
                                            link.download = "FarmerMember_Template.csv";
                                            link.click();
                                        }}
                                        className='bg-white flex flex-row gap-2 items-center p-2 md:px-4 border border-gray-300 rounded-md'
                                    >
                                        <Download className='w-4 h-4' />
                                        <p className='text-xs md:text-sm'>Download Excel Template</p>
                                    </button>
                                </div>
                            </div>


                            <div className='flex flex-col md:flex-row gap-3 text-black font-semibold pt-4 md:pt-6'>


                                <div className='bg-white flex flex-row gap-2 items-center p-2 md:px-4 border border-gray-300 rounded-md'>
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        className="hidden"
                                        accept=".xlsx,.csv"
                                        onChange={handleExcelFileChange}
                                    />

                                    <button
                                        type="button"
                                        onClick={handleFileClick}
                                        className="flex flex-row gap-2 items-center "
                                    >
                                        {excelFile ? (
                                            <div className='flex flex-row gap-2 items-center'>
                                                <Sheet className="w-4 h-4 text-green-600" />
                                                <p className='text-xs md:text-sm text-green-600'>{excelFile.name}</p>
                                            </div>

                                        ) : (
                                            <div className='flex flex-row gap-2 items-center'>
                                                <Upload className="w-4 h-4" />
                                                <p className="text-xs md:text-sm">
                                                    Upload Excel File (.xlsx / .csv)
                                                </p>
                                            </div>
                                        )}

                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="bg-blue-600 flex items-center p-2 md:px-4 rounded-md text-white"
                                    onClick={handleFileUpload}
                                >
                                    {loadingUpload ? "Submitting...." : "Submit"}
                                </button>
                            </div>
                        </div>

                        {responseData && Object.keys(responseData).length > 0 && (
                            <div className="text-green-500">
                                <p>Total records uploaded: {responseData?.totalRows ?? 0}</p>
                                <p>Successfully inserted: {responseData?.insertedRows ?? 0}</p>
                                <p>Skipped Rows: {responseData?.skippedRows ?? 0}</p>
                                <p>Duplicates in file: {responseData?.duplicateInExcel ?? 0}</p>
                                <p>Already existing records: {responseData?.duplicateInDB ?? 0}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AddFarmerMembersModal;
