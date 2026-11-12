import { Download, Sheet, Upload, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import InputField from "../../components/comman/InputField"
import SelectField from "../../components/comman/SelectField"
import FileUpload from "../../components/comman/fileUpload";
import { viewComplianceDocument } from "../../utils/complianceDocuments";
import { addBuldBoardOfDirector, addCompanyBoardOfDirector, editCompanyBoardOfDirector, getBoardOfDirectorById } from "../../services/boardOfDirector";
import { fetchBoardOfDirectors } from "../../store/actions/boardOfDirector";
import { useDispatch, useSelector } from "react-redux";

const directorDocumentFields = [
    "kycDocument",
    "aadhaarCard",
    "panCard",
    "bankStatement",
    "sevenTwelve",
];

const AddBoardDirectorModal = ({ isOpen, onClose, id, directorID }) => {
    const { role } = useSelector((state) => state.auth);
    const isCompanyRole = role === "COMPANY";
    const isCompanyDocOnlyView = isCompanyRole && Boolean(directorID);

    const [formData, setFormData] = useState({
        role: "",
        holdingSince: "",
        fullName: "",
        age: "",

        gender: "",
        category: "",
        qualification: "",
        background: "",

        mobile: "",
        email: "",
        skill: "",

        dinNumber: "",
        farmerCert: "",

        folioNumber: "",
        pan: "",
        aadhaar: "",
        shareDate: "",

        faceValue: "",
        shares: "",

        capital: "",
        shareholding: "",
        land: "",
        landRecord: "",

        village: "",
        block: "",
        tehsil: "",
        district: "",

        state: "",
        pincode: "",

        kycDocument: null,
        aadhaarCard: null,
        panCard: null,
        bankStatement: null,
        sevenTwelve: null,
    });

    const resetForm = () => {
        setFormData({
            role: "",
            holdingSince: "",
            fullName: "",
            age: "",
            gender: "",
            category: "",
            qualification: "",
            background: "",
            mobile: "",
            email: "",
            skill: "",
            dinNumber: "",
            farmerCert: "",
            folioNumber: "",
            pan: "",
            aadhaar: "",
            shareDate: "",
            faceValue: "",
            shares: "",
            capital: "",
            shareholding: "",
            land: "",
            landRecord: "",
            village: "",
            block: "",
            tehsil: "",
            district: "",
            state: "",
            pincode: "",
        });

        setErrors({});
        setDocumentFiles({});
    };

    const fetchBoardOfDircetor = async () => {
        try {
            setLoading(true);

            const res = await getBoardOfDirectorById(directorID);
            console.log("response ",res);
            

            if (res) {
                setFormData({
                    role: res.role || "",
                    holdingSince: res.holdingSince || "",
                    fullName: res.fullName || "",
                    age: res.age || "",

                    gender: res.gender || "",
                    category: res.category || "",
                    qualification: res.qualification || "",
                    background: res.background || "",

                    mobile: res.mobile || "",
                    email: res.email || "",
                    skill: res.skill || "",

                    dinNumber: res.dinNumber || "",
                    farmerCert: res.farmerCert || "",

                    folioNumber: res.folioNumber || "",
                    pan: res.pan || "",
                    // aadhaar: res.aadhaar ? res.aadhaar.replace(/\s/g, "") : "",
                    // aadhaar:res.aadhaar.replace(/\s/g, "") || "",
                    aadhaar: res.aadhaar ? res.aadhaar.replace(/\s/g, "") : "",
                    shareDate: res.shareDate || "",

                    faceValue: res.faceValue || "",
                    shares: res.shares || "",

                    capital: res.capital || "",
                    shareholding: res.shareholding || "",
                    land: res.land || "",
                    landRecord: res.landRecord || "",

                    village: res.village || "",
                    block: res.block || "",
                    tehsil: res.tehsil || "",
                    district: res.district || "",

                    state: res.state || "",
                    pincode: res.pincode || "",

                    kycDocument: res.kycDocument || null,
                    aadhaarCard: res.aadhaarCard || null,
                    panCard: res.panCard || null,
                    bankStatement: res.bankStatement || null,
                    sevenTwelve: res.sevenTwelve || null,
                });

            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (directorID) {
            resetForm();
            fetchBoardOfDircetor();
        }
    }, [directorID]);

    const [errors, setErrors] = useState({});
    const [documentFiles, setDocumentFiles] = useState({});

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

    const validate = () => {

        let newErrors = {};

        if (!formData.role) newErrors.role = "Role is required";
        if (!formData.fullName) newErrors.fullName = "Full name is required";

        if (!formData.mobile) {
            newErrors.mobile = "Mobile is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Enter a valid 10-digit mobile number";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Invalid email";
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

    const fileRef = useRef();

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

        if (field === "kycDocument" && file && !file.type?.startsWith("image/")) {
            toast.error("Only image files are allowed for Director's Picture");
            e.target.value = "";
            return;
        }

        setDocumentFiles((prev) => ({
            ...prev,
            [field]: file || null,
        }));
    };

    

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form");
            return;
        }
        const payload = new FormData();

        Object.keys(formData).forEach((key) => {
            if (
                directorDocumentFields.includes(key) ||
                directorDocumentFields.some((field) => key === `${field}ContentType`)
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

        directorDocumentFields.forEach((field) => {
            if (documentFiles[field]) {
                payload.append(field, documentFiles[field]);
            }
        });

        for (let pair of payload.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            setLoading(true);
            const response = directorID ? await editCompanyBoardOfDirector(payload, directorID) : await addCompanyBoardOfDirector(payload, id);
            if (response) {
                toast.success(response || (directorID ? "director added successfully..." : "Director added successfully"));
                resetForm();
                onClose();
                dispatch(
                    fetchBoardOfDirectors({
                        id,
                        role: "",
                        searchTerm: "",
                        page: "",
                    })
                );
            } else {
                toast.error("Something went wrong")
            }

        } catch (err) {
            console.error("ERROR:", err);
            toast.error(err);
        } finally {
            setLoading(false);
        }

    };

    const handleFileUpload = async () => {

        if (!excelFile) {
            return toast.error("Please upload file first and then submit");
        }
        try {
            setLoadingUpload(true);
            const payload = new FormData();
            if (excelFile) payload.append("file", excelFile);
            const response = await addBuldBoardOfDirector(payload, id);
            if (response) {
                toast.success(response?.message || "BOD added..")
                console.log("response", response);
                setResponseData(response?.data);
                setExcelFile(null);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white w-[80%] rounded-lg p-5 shadow-lg relative h-[90vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row items-center justify-between gap-5 mb-5 border-b border-gray-400 pb-2">
                    <h2 className="text-lg font-bold text-black">
                        {directorID ? "Edit Board of Director Details" : "Add Board of Directors"}
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
                            <h2 className="text-sm md:text-base font-semibold mb-4">Add New Director</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                <SelectField
                                    label="Role"
                                    required
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    optionLabel="Select Role"
                                    options={[
                                        { value: 'director', label: "Director" },
                                        { value: 'chairman', label: "Chairman" },
                                    ]}
                                    labelKey="label"
                                    valueKey="value"
                                    errorMessage={errors?.role}
                                />

                                <InputField
                                    label="Holding Position Since"
                                    type="date"
                                    name="holdingSince"
                                    value={formData.holdingSince}
                                    onChange={handleChange}
                                    errorMessage={errors?.holdingSince}
                                />

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

                                <SelectField
                                    label="B.Sc Agri/Chemistry Background"
                                    name="background"
                                    value={formData.background}
                                    onChange={handleChange}
                                    optionLabel='Select'
                                    options={[
                                        { value: 'true', label: "Yes" },
                                        { value: 'false', label: "No" },
                                    ]}
                                    labelKey="label"
                                    valueKey="value"
                                    errorMessage={errors?.background}
                                />

                                <InputField
                                    label="Mobile Number"
                                    name="mobile"
                                    required
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    errorMessage={errors?.mobile}
                                />

                                <InputField
                                    label="Email ID"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    errorMessage={errors?.email}
                                />

                                <InputField
                                    label="Key Skill"
                                    name="skill"
                                    value={formData.skill}
                                    onChange={handleChange}
                                    placeholder="e.g., Management"
                                    errorMessage={errors?.skill}
                                />

                                <InputField
                                    label="DIN Number"
                                    name="dinNumber"
                                    value={formData.dinNumber}
                                    onChange={handleChange}
                                    placeholder="Enter DIN"
                                    errorMessage={errors?.dinNumber}
                                />

                                <SelectField
                                    label="Farmer Certificate Collected"
                                    name="farmerCert"
                                    value={formData.farmerCert}
                                    onChange={handleChange}
                                    optionLabel='Select'
                                    options={[
                                        { value: 'true', label: "Yes" },
                                        { value: 'false', label: "No" },
                                    ]}
                                    labelKey="label"
                                    valueKey="value"
                                    errorMessage={errors?.farmerCert}
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
                                    value={formData.aadhaar}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012"
                                    errorMessage={errors?.aadhaar}
                                />

                                <InputField
                                    label="Date of Share Capital Contribution"
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
                                    label="Number of Shares"
                                    name="shares"
                                    type='number'
                                    value={formData.shares}
                                    onChange={handleChange}
                                    placeholder="1000"
                                    errorMessage={errors?.shares}
                                />

                                <InputField
                                    label="Share Capital Contribution"
                                    name="capital"
                                    type='number'
                                    value={formData.capital}
                                    onChange={handleChange}
                                    placeholder="100000"
                                    errorMessage={errors?.capital}
                                />

                                <InputField
                                    label="Shareholding %"
                                    name="shareholding"
                                    type='number'
                                    value={formData.shareholding}
                                    onChange={handleChange}
                                    placeholder="10.5"
                                    errorMessage={errors?.shareholding}
                                />

                                <InputField
                                    label="Total Landholding (Acres)"
                                    name="land"
                                    type='number'
                                    value={formData.land}
                                    onChange={handleChange}
                                    placeholder="5.5"
                                    errorMessage={errors?.land}
                                />

                                <InputField
                                    label="Land Record Number"
                                    name="landRecord"
                                    value={formData.landRecord}
                                    onChange={handleChange}
                                    placeholder="Survey/Khasra"
                                    errorMessage={errors?.landRecord}
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

                                    placeholder={"123 456"}
                                />

                            </div>
                        </>
                

                    <div className="mt-8">
                        <h2 className="text-sm md:text-base font-semibold mb-4">
                            Upload Documents
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* KYC */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="Director's Picture"
                                    name="kycDocument"
                                    display={true}
                                    accept="image/*"
                                    value={formData.kycDocument}
                                    existingFileName="Director's Picture"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("kycDocument", e)
                                    }
                                />

                                {directorID && (documentFiles.kycDocument || formData.kycDocument) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.kycDocument || formData.kycDocument,
                                                "KYC Document",
                                                formData.kycDocumentContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
                                    >
                                        <Eye size={18} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>

                            {/* Aadhaar */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="Aadhaar Card"
                                    name="aadhaarCard"
                                    display={true}
                                    value={formData.aadhaarCard}
                                    existingFileName="Aadhaar Card"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("aadhaarCard", e)
                                    }
                                />

                                {directorID && (documentFiles.aadhaarCard || formData.aadhaarCard) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.aadhaarCard || formData.aadhaarCard,
                                                "Aadhaar Card",
                                                formData.aadhaarCardContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
                                    >
                                        <Eye size={18} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>

                            {/* PAN */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="PAN Card"
                                    name="panCard"
                                    display={true}
                                    value={formData.panCard}
                                    existingFileName="PAN Card"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("panCard", e)
                                    }
                                />

                                {directorID && (documentFiles.panCard || formData.panCard) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.panCard || formData.panCard,
                                                "PAN Card",
                                                formData.panCardContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
                                    >
                                        <Eye size={18} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>

                            {/* Bank */}
                            <div className="flex flex-col">
                                <FileUpload
                                    title="Bank Statement"
                                    name="bankStatement"
                                    display={true}
                                    value={formData.bankStatement}
                                    existingFileName="Bank Statement"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("bankStatement", e)
                                    }
                                />

                                {directorID && (documentFiles.bankStatement || formData.bankStatement) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.bankStatement || formData.bankStatement,
                                                "Bank Statement",
                                                formData.bankStatementContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
                                    >
                                        <Eye size={18} />
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
                                    value={formData.sevenTwelve}
                                    existingFileName="7/12 Document"
                                    handleChange={(e) =>
                                        handleDocumentFileChange("sevenTwelve", e)
                                    }
                                />

                                {directorID && (documentFiles.sevenTwelve || formData.sevenTwelve) && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDocumentInViewer(
                                                documentFiles.sevenTwelve || formData.sevenTwelve,
                                                "7/12 Document",
                                                formData.sevenTwelveContentType || "application/pdf"
                                            )
                                        }
                                        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition"
                                    >
                                        <Eye size={18} />
                                        View Uploaded Document
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>


                    <div className="flex flex-wrap items-center md:justify-end gap-3 mt-6">
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
                            {directorID ? "Update Director" : (loading ? "Adding director " : "+ Add Director")}
                        </button>
                    </div>
                </div>


                {!isCompanyDocOnlyView && (
                    <>
                        <div className="border border-blue-300 bg-blue-50 p-5 rounded-lg flex flex-col gap-2 mb-10">

                            <div className="flex flex-col md:flex-row items-start gap-5 justify-between border-b-2 pb-3 border-dashed border-gray-500">

                                <div className="space-y-1">
                                    <h2 className="text-sm md:text-base font-semibold mb-1">Bulk Import via Excel</h2>
                                    <h2 className="text-xs md:text-sm font-semibold text-gray-700">
                                        Download the template, fill director details, and upload to add multiple directors at once.
                                    </h2>
                                </div>

                                <div className="font-semibold ">
                                    <button
                                        className='bg-white flex flex-row gap-2 items-center p-2 md:px-4 border border-gray-300 rounded-md'
                                        onClick={() => {
                                            const link = document.createElement("a");
                                            link.href = "/template/BOD_Template.csv";
                                            link.download = "BOD_Template.csv";
                                            link.click();
                                        }}
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

export default AddBoardDirectorModal;

