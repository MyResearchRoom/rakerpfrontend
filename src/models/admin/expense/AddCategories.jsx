import React, { useEffect, useMemo, useState } from "react";
import { X, Pencil, Trash2, Plus } from "lucide-react";
import InputField from "../../../components/comman/InputField";
import NestedTabHeader from "../../../components/comman/NestedTabHeader";
import ViewExpenseCategories from "../../../components/feature/AdminAndEmployee/expenses/viewExpenseCategories";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchExpenseCategory } from "../../../store/actions/expenseCatgeory";
import { addExpenseCategory, editExpenseCategory, getExpenseCategoryById } from "../../../services/expense";
import SelectField from "../../../components/comman/SelectField";
import { useSelector } from "react-redux";
import { fetchCompanyDropdownList } from "../../../store/actions/companyAction";

const AddCategories = ({ isOpen, onClose,companyId }) => {
    const { role } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("Categories List");
    const [categoryLoading, setCatgeoryLoading] = useState(false);
    const dispatch = useDispatch();

    console.log("company id in add category",companyId);

    const { companies } = useSelector(
        (state) => state.companyDropdownData
    );
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        companyId: companyId || "",
        name: "",
        description: "",
    });

    const [categoryEditId, setCategoryEditId] = useState(null);

    const [editMode, setEditMode] = useState(false);

    const handleSubmit = async () => {
        if (!formData.companyId) {
            toast.error("Please select a company");
            return;
        }

        if (!formData.name.trim()) {
            toast.error("Category name is required.");
            return;
        }
        const payload = new FormData();
        payload.append("companyId", formData.companyId);
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        try {
            setCatgeoryLoading(true);
            console.log("Data",formData);
            const res = editMode ? await editExpenseCategory(payload, categoryEditId) : await addExpenseCategory(payload);
            if (res) {
                toast.success(res || (editMode ? "Expense category update successfullyy..." : "Expense category added successfullyy..."));
                dispatch(fetchExpenseCategory({ searchTerm: "", page:1 }));
                setFormData({ name: "", description: "" });
                setActiveTab("Categories List");
                setEditMode(false);
                setCategoryEditId(null);
            }
        } catch (err) {
            console.error("ERROR:", err);
            toast.error(err);
        } finally {
            setCatgeoryLoading(false);
        }


    };

    const handleEdit = async (id) => {
        if (!id) return;
        setEditMode(true);
        setCategoryEditId(id);
        // setFormData(cat);
        try {
            const res = await getExpenseCategoryById(id);
            if (res) {
                setFormData({
                    companyId: res?.companyId || "",
                    name: res?.name || "",
                    description: res?.description || "",
                });
                setActiveTab("Add/Edit Category");

            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            toast.error(err);
        }
    };

    useEffect(() => {
        if(!companyId) {
            dispatch(fetchCompanyDropdownList());
        }
    }, [dispatch,companyId]);

    if (!isOpen) return null;

    const tabs = [
        { label: "Categories List" },
        { label: "Add/Edit Category" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[900px] h-[90vh] rounded-2xl shadow-lg flex flex-col mx-2">

                <div className="flex items-start justify-between px-5 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Manage Expense Categories
                        </h2>
                        <p className="text-sm text-gray-500">
                            Add, edit, or delete expense categories
                        </p>
                    </div>
                    <X
                        className="cursor-pointer"
                        size={18}
                        onClick={onClose}
                    />
                </div>

                <div className="px-5">
                    <NestedTabHeader
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-3">
                    {activeTab === "Categories List" && (
                        <ViewExpenseCategories onEdit={handleEdit} companyIdFromParent={companyId} />
                    )}

                    {activeTab === "Add/Edit Category" && (
                        <div className="bg-white p-2 md:p-3 lg:p-4 rounded-md border border-gray-300 space-y-4 mt-3">
                            
                            {role!=="COMPANY" &&
                                <SelectField
                                    label="Company"
                                    required={true}
                                    name="companyId"
                                    value={formData.companyId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            companyId: e.target.value,
                                        })
                                    }
                                    options={companies}
                                    optionLabel="Select Company"
                                    valueKey="id"
                                    labelKey="name"
                                />
                            }
                            <InputField
                                label="Category Name"
                                name="name"
                                value={formData.name}
                                required={true}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />

                            <InputField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />

                            <div className="flex justify-end gap-2 pt-4 lg:pt-7">
                                <button
                                    onClick={() => setActiveTab("Categories List")}
                                    className="px-4 py-2 border rounded bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {editMode ? "Update" : "Add"} Category
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCategories;
