import React, { useEffect, useState } from "react";
import SelectField from "../../../components/comman/SelectField";
import InputField from "../../../components/comman/InputField";
import { X } from "lucide-react";
import { fetchMaterials } from "../../../store/actions/materials";
import { addNewMaterial, editMaterial, getMaterialById } from "../../../services/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { fetchCompanyDropdownList } from "../../../store/actions/companyAction";

const gstOptions = [
  { label: "0 %", value: "0" },
  { label: "5 %", value: "5" },
  { label: "12 %", value: "12" },
  { label: "18 %", value: "18" },
  { label: "28 %", value: "28" },
];
const unitOptions = [
  { label: "Kg", value: "kg" },
  { label: "Gram", value: "gram" },
  { label: "Quintal", value: "quintal" },
  { label: "Ton", value: "ton" },
  { label: "Liter", value: "liter" },
  { label: "Mililiter", value: "mililiter" },
  { label: "Packet", value: "packet" },
  { label: "Bag", value: "bag" },
  { label: "Box", value: "box" },
  { label: "Dozen", value: "dozen" },
  { label: "Piece", value: "piece" },

];

const AddMaterialModal = ({
  isOpen,
  onClose,
  materialId
}) => {
  const { companyId ,role} = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    companyId: companyId || "",
    itemName: "",
    hsnCode: "",
    unit: "",
    gstRate: "",
    price: "",
  });
  
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    companies,
    loading: companyLoading,
    error: companyError,
  } = useSelector((state) => state.companyDropdownData);

  const isEditMode = !!materialId;

  const [errors, setErrors] = useState({});

  const fetchMaterialById = async () => {
    try {
      setLoading(true);
      const response = await getMaterialById(materialId);
      console.log("response", response);

      if (response) {
        setFormValues({
          companyId: response.companyId || "",
          itemName: response.itemName || "",
          hsnCode: response.hsnCode || "",
          unit: response.unit || "",
          gstRate:
          response.gstRate !== null && response.gstRate !== undefined
            ? Number(response.gstRate)
            : "",

          price:
            response.price !== null && response.price !== undefined
              ? Number(response.price)
              : "",
                  });

      }
    } catch (error) {
      toast.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (materialId) {
      fetchMaterialById();
    }
  }, [materialId]);

  useEffect(() => {
    if(role!=="COMPANY") {
      dispatch(fetchCompanyDropdownList());
    }
  }, [dispatch,role]);

  if (!isOpen) return null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.companyId)
      newErrors.companyId = "Company is required";

    if (!formValues.itemName.trim())
      newErrors.itemName = "Material name is required";
    if (!formValues.hsnCode.trim()) newErrors.hsnCode = "HSN code is required";
    if (!formValues.unit) newErrors.unit = "Unit is required";
    if (formValues.gstRate === "") newErrors.gstRate = "GST rate is required";
    if (!formValues.price || isNaN(Number(formValues.price)))
      newErrors.price = "Enter valid price";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      console.log("Formvalues",formValues);
      const response = isEditMode ? await editMaterial(formValues, materialId) : await addNewMaterial(formValues);
      console.log("response", response);

      if (response) {
        toast.success(response || (isEditMode ? "Material edited successfully" : "Material added successfully"));

        // toast.success(response);
        setFormValues({
          companyId: "",
          itemName: "",
          hsnCode: "",
          unit: "",
          gstRate: "",
          price: "",
        });
        onClose();
        dispatch(fetchMaterials({ searchTerm: "", page: "" }));
      }
      else {
        toast.error("Something went wrong")
      }
    } catch (err) {
      console.log("err", err);

      toast.error(err || "toast error");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
   
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Material" : "Add New Material"}
            </h3>
            <p className="text-xs text-gray-500">
              Enter details to {isEditMode ? "update" : "add"} material
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X />
          </button>
        </div>

        <div className="mt-4 space-y-4">

          {role!=="COMPANY" &&
          <SelectField
            label="Company"
            required
            name="companyId"
            value={formValues.companyId}
            onChange={handleInputChange}
            options={companies}
            optionLabel="Select Company"
            valueKey="id"
            labelKey="name"
            errorMessage={errors.companyId}
            disabled={isEditMode || companyId}
          />
          }

          <InputField
            label="Material Name"
            required
            name="itemName"
            value={formValues.itemName}
            onChange={handleInputChange}
            errorMessage={errors.itemName}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              label="HSN Code"
              required
              name="hsnCode"
              value={formValues.hsnCode}
              onChange={handleInputChange}
              errorMessage={errors.hsnCode}
            />
            <SelectField
              label="Unit"
              required
              name="unit"
              value={formValues.unit}
              onChange={handleInputChange}
              options={unitOptions}
              optionLabel="Select unit"
              valueKey="value"
              labelKey="label"
              errorMessage={errors.unit}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <SelectField
              label="GST Rate"
              required
              name="gstRate"
              value={formValues.gstRate}
              onChange={handleInputChange}
              options={gstOptions}
              optionLabel="Select GST rate"
              valueKey="value"
              labelKey="label"
              errorMessage={errors.gstRate}
            />
            <InputField
              label="Price"
              required
              name="price"
              type="number"
              value={formValues.price}
              onChange={handleInputChange}
              errorMessage={errors.price}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="bg-gray-100 text-black px-4 py-2 rounded-md border "
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 px-4 py-2 text-white rounded-md"
            >
              {isEditMode ? "Update material" : loading ? "Saving" : "Save Material"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal;