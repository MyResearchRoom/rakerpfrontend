import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import ButtonComponent from "../../../components/comman/ButtonComponent";
import InputField from "../../../components/comman/InputField";
import SelectField from "../../../components/comman/SelectField";
import TextAreaField from "../../../components/comman/TextAreaField";
import FileUpload from "../../../components/comman/fileUpload";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addExpense, getExpenseById } from "../../../services/expense";
import { fetchExpenses } from "../../../store/actions/expense";
import { fetchCompanyDropdownList } from "../../../store/actions/companyAction";
import { fetchExpenseCategory } from "../../../store/actions/expenseCatgeory";

const paymentOptions = [
    { label: "Bank Transfer", value: "bank transfer" },
    { label: "UPI", value: "upi" },
    { label: "Cash", value: "cash" },
    { label: "Cheque", value: "cheque" },
    { label: "Card", value: "card" },
  ];

const AddExpenseModal = ({
  isOpen,
  onClose,
  companyId,
  onSuccess,
  // expenseId
}) => {
  // console.log("company id",companyId);

  const { role } = useSelector((state) => state.auth);
  
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const defaultValues = useMemo(() => ({
    date: today,
    companyId: companyId || "",
    category: "",
    amount: "",
    description: "",
    paymentMethod: "",
    reference: "",
    notes: "",
    receipt: null,
  }), [today,companyId]);

  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  // const fetchExpenseById=async()=>{
  //   try {  
  //     const response=await getExpenseById(expenseId);
  //     if(response){
  //       // setExpenseData(response);
  //       setFormValues({
  //         date:response.date,
  //         companyId:resp
  //       })
  //       console.log("expenses res",response);
        
  //     }          
  //   } catch (error) {
  //     toast.error(error)
  //   }
  // }

  // useEffect(() => {
  //   if(expenseId){
  //     fetchExpenseById();
  //   }
  // }, [expenseId]);

  const [loading,setLoading] =useState(false);

  useEffect(() => {
    if (companyId) {
      setFormValues((prev) => ({
        ...prev,
        companyId,
      }));
    }
  }, [companyId]);

  const { categories, error: categoryError , loading:categoryLoading } = useSelector(
      (state) => state.expenseCategories
  );

  const { companies, error: companyError, loading: companyLoading, } = useSelector(
    (state) => state.companyDropdownData
  );

  useEffect(() => {
    if(formValues.companyId && role!=="COMPANY"){
      dispatch(
        fetchExpenseCategory({ searchTerm: "", page: "", limit: "ALL" , companyId:formValues.companyId})
      );
    }
  }, [dispatch, formValues.companyId]);

  useEffect(() => {
    if ((!companies || companies.length === 0) && !companyId) {
      dispatch(fetchCompanyDropdownList());
    }
  }, [dispatch, companies, companyId]);

  const resetForm = () => {
    setFormValues(defaultValues);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => {
      if (field === "paymentMethod") {
        return {
          ...prev,
          paymentMethod: value,
          reference: value === "cash" ? "N/A" : "",
        };
      }
     
      return {
        ...prev,
        [field]: value,
      };
    });
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFormValues((prev) => ({ ...prev, receipt: file }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.date) newErrors.date = "Expense date is required";
    if (!formValues.companyId) newErrors.companyId = "Select a company";
    if (!formValues.category) newErrors.category = "Select a category";
    if (!formValues.amount || Number(formValues.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!formValues.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async() => {
    if (!validate()){
      toast.error("Enter valid details")
      return;
    }
    const payload = new FormData();
      payload.append("companyId", formValues.companyId);
      payload.append("categoryId", formValues.category);
      payload.append("date", formValues.date);
      payload.append("amount", formValues.amount);
      payload.append("description", formValues.description);
      payload.append("paymentMethod", formValues.paymentMethod);
      payload.append("reference", formValues.reference);
      if(formValues.notes) payload.append("notes", formValues.notes);

      if(formValues.receipt) payload.append("receipt", formValues.receipt);
      
      try {
        setLoading(true);
        const response= await addExpense(payload);
        if(response){
            toast.success(response||"Exoense added successfully..")
            resetForm();
            dispatch(
              fetchExpenses({
                categoryId:"",
                companyId:companyId,
                page:1,
              }));
            handleClose();
            onSuccess?.();
            
        }else{
           toast.error("Something went wrong")
        }
      } catch (err) {
        console.error("ERROR:", err); 
        toast.error(err);
      } finally {
        setLoading(false);
      }
      
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {"Add New Expense"}
            </p>
            <p className="text-xs text-gray-500">
              {"Enter the details of the expense"}
            </p>
          </div>
          <button onClick={handleClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-900">
            <X size={18} />
          </button>
        </div>

        {companyError && <p>Company get : <span className="text-red-500">{companyError}</span></p>}

        {categoryError && <p>Category get : <span className="text-red-500">{categoryError}</span></p>}

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              label="Expense Date"
              type="date"
              value={formValues.date}
              onChange={(event) => handleChange("date", event.target.value)}
              required={true}
              errorMessage={errors.date}
            />

          </div>

          <div className="grid pb-2">
           
            {role!=="COMPANY" &&
            <SelectField
              label="Company"
              value={formValues.companyId}
              onChange={(event) => handleChange("companyId", event.target.value)}
              options={companies}
              optionLabel="Select Companies"
              valueKey="id"
              labelKey="name"
              required={true}
              errorMessage={errors.companyId}
              disabled={companyId}
            />
            }
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <SelectField
              label="Expense Category"
              value={formValues.category}
              options={categories}
              onChange={(event) => handleChange("category", event.target.value)}
              valueKey="id"
              labelKey="name"
              optionLabel="All Categories"
              errorMessage={errors.category}
              required={true}
            />
            <InputField
              label="Amount (₹)"
              type="number"
              value={formValues.amount}
              onChange={(event) => handleChange("amount", event.target.value)}
              placeholder="0.00"
              errorMessage={errors.amount}
              required
            />
          </div>

          <TextAreaField
            label="Description"
            value={formValues.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="Enter expense description"
            errorMessage={errors.description}
            required
          />

          <div className="grid gap-3 md:grid-cols-2">
            <SelectField
              label="Payment Method"
              value={formValues.paymentMethod}
              onChange={(event) => handleChange("paymentMethod", event.target.value)}
              required={true}
              options={paymentOptions}
              optionLabel="Select method"
              valueKey="value"
              labelKey="label"
            />
            <InputField
              label="Reference Number"
              required={formValues.paymentMethod !== "cash"}
              value={formValues.reference}
              onChange={(event) => handleChange("reference", event.target.value)}
              placeholder="Transaction reference"
              disabled={formValues.paymentMethod === "cash"}
            />
          </div>

          <FileUpload
            title="Upload Bill / Receipt"
            name="billFile"
            display={true}
            handleChange={handleFile}
          />

          <TextAreaField
            label="Notes"
            value={formValues.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Additional notes"
          />

          <div className="flex justify-end gap-3 pt-2">
            <ButtonComponent
              handleButtonClick={handleClose}
              className="bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              <p className="text-black border border-gray-200 px-4 py-2 rounded-md">Cancel</p>
            </ButtonComponent>
            <ButtonComponent
              handleButtonClick={handleSave}
              className="bg-blue-600 px-4 py-2 text-sm rounded-md"
            >
              {"Save Expense"}
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
