import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil, MoveLeft } from "lucide-react";
import PageHeader from "../../../comman/PageHeader";
import SelectField from "../../../comman/SelectField";
import InputField from "../../../comman/InputField";
import { formatCurrency } from "../../../comman/formateCurrency";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyDropdownList } from "../../../../store/actions/companyAction";
import { Oval } from "react-loader-spinner";
import ButtonComponent from "../../../comman/ButtonComponent";
import { fetchMaterials } from "../../../../store/actions/materials";
import { toast } from "react-toastify";
import { generateNewInvoice } from "../../../../services/invoice";
import { fetchInvoices } from "../../../../store/actions/invoiceActions";
import { useLocation, useNavigate } from "react-router-dom";

const today = new Date().toISOString().split("T")[0];

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  materialId: "",
  quantity: "0",
  rate: "0",
  gst: "18",
  amount: "0",
  isManualAmount: false,
});

const CreateInvoicePage = () => {
  const { role} = useSelector((state) => state.auth);
  const location = useLocation();
  const companyId = location.state?.companyId;


  const [selectedCompany, setSelectedCompany] = useState(companyId || "");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [items, setItems] = useState([emptyItem()]);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    pan: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  // useEffect(() => {
  //   if (companyId) {
  //     setSelectedCompany(companyId);
  //   }
  // }, [companyId]);

  const [supplyTransportDetails, setSupplyTransportDetails] = useState({
    transportationMode: "",
    transportDescription: "",
    placeOfSupply: "",
    dateOfSupply: "",
  });

  const handleCustomerChange = (field, value) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [errors, setErrors] = useState({});

  const validateCustomerDetails = () => {
    const newErrors = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(customerDetails.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (customerDetails.gstin.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(customerDetails.gstin.trim().toUpperCase())
    ) {
      newErrors.gstin = "Invalid GSTIN format";
    }

    if (!customerDetails.pan.trim()) {
      newErrors.pan = "PAN is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerDetails.pan.trim().toUpperCase())
    ) {
      newErrors.pan = "Invalid PAN format";
    }

    if (!customerDetails.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!customerDetails.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!customerDetails.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!customerDetails.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(customerDetails.pincode)) {
      newErrors.pincode = "Invalid pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    const newItem = emptyItem();
    setItems((prev) => [...prev, newItem]);
    setEditingItemId(newItem.id);
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "materialId") {
          const selectedMaterial = materials.find(
            (m) => m.id === Number(value)
          );

          return {
            ...item,
            materialId: value,
            quantity: 1,
            rate: Number(selectedMaterial?.price) || 0,
            gst: Number(selectedMaterial?.gstRate) || 0,
            isManualAmount: false,
          };
        }

        if (field === "amount") {
          return {
            ...item,
            amount: value,
            isManualAmount: true,
          };
        }

        return {
          ...item,
          [field]: value,
          isManualAmount: false,
        };
      })
    );
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const summary = items.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const gst = Number(item.gst) || 0;

        const base = quantity * rate;
        const gstAmount = (base * gst) / 100;

        return {
          subtotal: acc.subtotal + base,
          gstTotal: acc.gstTotal + gstAmount,
        };
      },
      { subtotal: 0, gstTotal: 0 }
    );

    return {
      subtotal: summary.subtotal,
      gstTotal: summary.gstTotal,
      total: summary.subtotal + summary.gstTotal,
    };
  }, [items]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      return toast.error("Please select company");
    }

    if (!invoiceDate) {
      return toast.error("Please select date");
    }

    if (!items.length) {
      return toast.error("Add at least one item");
    }

    if (!validateCustomerDetails()) {
      return toast.error("Fix highlighted error first and then submit");
    };

    if (
  !items.every(
    (item) =>
      item.materialId !== "" &&
      item.materialId !== null &&
      item.materialId !== undefined
  )
) {
  return toast.error("Please select a material for every invoice item.");
}

    const payload = {
      companyId: selectedCompany,
      invoiceDate: invoiceDate,
      items: items.map((item) => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const gst = Number(item.gst) || 0;
        return {
          materialId: item.materialId,
          quantity,
          rate,
          gst,
        };
      }),
      customerDetails: {
        name: customerDetails.name,
        phone: customerDetails.phone,
        email: customerDetails.email,
        address: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        pan: customerDetails.pan,
        gstin: customerDetails.gstin ? customerDetails.gstin : "",
      },
      supplyTransportDetails: {
        transportationMode:
          supplyTransportDetails.transportationMode,
        transportDescription:
          supplyTransportDetails.transportDescription,
        placeOfSupply:
          supplyTransportDetails.placeOfSupply,
        dateOfSupply:
          supplyTransportDetails.dateOfSupply,
      },
    };

    try {
      setSaveLoading(true);
      const response = await generateNewInvoice(payload);
      if (response) {
        toast.success(response || "Invoice generated successfully")
        setInvoiceDate("");
        setSelectedCompany("");
        setItems([emptyItem()]);
        dispatch(
          fetchInvoices({
            searchTerm: '',
            date: '',
            companyId: companyId ||'',
            status: '',
            page: 1,
          })
        );

        role!=="COMPANY" ?
          navigate("/invoices") :
          navigate("/company-invoices");
      }
      else {
        toast.error("Something went wrong")
      }
    } catch (err) {
      console.error("ERROR:", err);
      toast.error(err);
    } finally {
      setSaveLoading(false);
    }

  };

  const dispatch = useDispatch();
  const [editingItemId, setEditingItemId] = useState(null);

  const { companies, error, loading } = useSelector(
    (state) => state.companyDropdownData
  );

  useEffect(() => {
    if(role!=="COMPANY") {
      dispatch(fetchCompanyDropdownList())
    }
  }, [dispatch,role]);

  const { materials, error: materialsError, loading: materialLoading } = useSelector(
    (state) => state.materials
  );

  useEffect(() => {
    if(selectedCompany){
      dispatch(
        fetchMaterials({
          page: '',
          limit: "All",
          companyId:selectedCompany,
        })
      );
    }
  }, [dispatch,selectedCompany]);

  if (loading || materialLoading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-40">
        <Oval
          height={60}
          width={60}
          color="#2563eb"
          secondaryColor="#93c5fd"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
        <p className="text-gray-500 animate-pulse">
          {loading && "Loading company list..."}
          {materialLoading && "Loading material list..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 min-h-screen pb-4">
      <div className='flex flex-row items-start gap-2 w-full'>
        <MoveLeft className='text-gray-900 mt-2' onClick={() => 
          navigate("/invoices", {
                state: { showPortal: false },
          })} />
        <PageHeader
          title="Create Invoice"
          subTitle="Generate a new invoice for a company"
        />

      </div>
      {error && <p>Company get : <span className="text-red-500">{error}</span></p>}
      {materialsError && <p>Material get : <span className="text-red-500">{materialsError}</span></p>}

      <div className="grid gap-6 md:grid-cols-3 items-start">
        <section className="rounded-3xl border bg-white p-4 md:p-6 shadow-sm md:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {role!=="COMPANY" &&
              <SelectField
                label="Select Company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                options={companies}
                valueKey="id"
                labelKey="name"
                disabled={companyId}
              />
            }

            <InputField
              label="Invoice Date"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Customer Details
            </h2>

            <div className="mt-3 border border-gray-200 rounded-2xl p-3 md:p-5 bg-white">

              <div className="md:space-y-4">
                <div className="grid gap-2 md:gap-4 md:grid-cols-3">
                  <InputField
                    label={"Customer Name"}
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, name: e.target.value })
                    }
                    required
                    errorMessage={errors.name}
                  />

                  <InputField
                    label={"Email"}
                    required
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, email: e.target.value })
                    }
                    errorMessage={errors.email}
                  />

                  <InputField
                    label={"Phone"}
                    required
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, phone: e.target.value })
                    }
                    errorMessage={errors.phone}
                  />
                </div>

                <div className="grid gap-2 md:gap-4 md:grid-cols-2">
                  <InputField
                    label="GSTIN"
                    value={customerDetails.gstin}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, gstin: e.target.value })
                    }
                    errorMessage={errors.gstin}
                  />

                  <InputField
                    label={"PAN"}
                    value={customerDetails.pan}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, pan: e.target.value })
                    }
                    required
                    errorMessage={errors.pan}
                  />
                </div>

                <div>
                  <InputField
                    label={"Address"}
                    value={customerDetails.address}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, address: e.target.value })
                    }
                    required
                    errorMessage={errors.address}
                  />
                </div>

                <div className="grid gap-2 md:gap-4 md:grid-cols-3">
                  <InputField
                    label={"State"}
                    value={customerDetails.state}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, state: e.target.value })
                    }
                    required
                    errorMessage={errors.state}
                  />

                  <InputField
                    label={"City"}
                    value={customerDetails.city}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, city: e.target.value })
                    }
                    required
                    errorMessage={errors.city}
                  />

                  <InputField
                    label={"Pincode"}
                    value={customerDetails.pincode}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, pincode: e.target.value })
                    }
                    required
                    errorMessage={errors.pincode}
                  />

                </div>

              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Supply & Transport Details
            </h2>

            <div className="mt-3 border border-gray-200 rounded-2xl p-3 md:p-5 bg-white">
              <div className="md:space-y-4">

                <div className="grid gap-2 md:gap-4 md:grid-cols-2">
                  <SelectField
                    label="Transportation Mode"
                    value={supplyTransportDetails.transportationMode}
                    onChange={(e) =>
                      setSupplyTransportDetails({
                        ...supplyTransportDetails,
                        transportationMode: e.target.value,
                      })
                    }
                    options={[
                      { label: "Road", value: "Road" },
                      { label: "Rail", value: "Rail" },
                      { label: "Air", value: "Air" },
                      { label: "Ship", value: "Ship" },
                      { label: "Courier", value: "Courier" },
                      { label: "Hand Delivery", value: "Hand Delivery" },
                    ]}
                  />

                  <InputField
                    label="Place of Supply"
                    value={supplyTransportDetails.placeOfSupply}
                    onChange={(e) =>
                      setSupplyTransportDetails({
                        ...supplyTransportDetails,
                        placeOfSupply: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2 md:gap-4 md:grid-cols-2">
                  <InputField
                    label="Transport Description"
                    value={supplyTransportDetails.transportDescription}
                    onChange={(e) =>
                      setSupplyTransportDetails({
                        ...supplyTransportDetails,
                        transportDescription: e.target.value,
                      })
                    }
                  />

                  <InputField
                    label="Date of Supply"
                    type="date"
                    value={supplyTransportDetails.dateOfSupply}
                    onChange={(e) =>
                      setSupplyTransportDetails({
                        ...supplyTransportDetails,
                        dateOfSupply: e.target.value,
                      })
                    }
                  />
                </div>

              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <p className="font-semibold">Invoice Items</p>

              <ButtonComponent
                handleButtonClick={handleAddItem}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded"
              >
                <Plus size={16} strokeWidth={3} />
                Add
              </ButtonComponent>
            </div>

            {items.map((item, index) => {
              const quantity = Number(item.quantity) || 0;
              const rate = Number(item.rate) || 0;
              const gst = Number(item.gst) || 0;

              const base = quantity * rate;
              const calculatedAmount = base + (base * gst) / 100;

              const displayAmount = item.isManualAmount
                ? item.amount
                : Math.round(calculatedAmount);

              return (
                <div
                  key={item.id}
                  className={`border p-4 rounded-xl transition-all duration-200 ${editingItemId === item.id
                    ? "bg-white shadow-md border-blue-300"
                    : "bg-gray-100"
                    }`}
                >
                  <div className="flex justify-between pb-3 font-semibold">
                    <p>Item {index + 1}</p>

                    <div className="flex gap-2 items-center">
                      <Pencil
                        size={16}
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                        onClick={() =>
                          setEditingItemId(
                            editingItemId === item.id ? null : item.id
                          )
                        }
                      />
                      {items.length > 1 && (
                        <Trash2
                          size={16}
                          className="cursor-pointer text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.id)}
                        />
                      )}
                    </div>
                  </div>

                  <SelectField
                    label="Select material"
                    value={item.materialId}
                    disabled={editingItemId !== item.id}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "materialId",
                        e.target.value
                      )
                    }
                    options={materials}
                    valueKey="id"
                    labelKey="itemName"
                  />

                  <div className="grid md:grid-cols-4 gap-2 mt-2">
                    <InputField
                      label="Qty"
                      type="number"
                      disabled={editingItemId !== item.id}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          e.target.value
                        )
                      }

                    />

                    <InputField
                      label="Rate"
                      type="number"
                      disabled={editingItemId !== item.id}
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "rate",
                          e.target.value
                        )
                      }

                    />

                    <SelectField
                      label="GST"
                      value={item.gst}
                      disabled={editingItemId !== item.id}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "gst",
                          e.target.value
                        )
                      }
                      options={[0, 5, 12, 18].map((g) => ({
                        label: `${g}%`,
                        value: g,
                      }))}

                    />

                    <InputField
                      label="Amount"
                      type="number"
                      disabled={editingItemId !== item.id}
                      value={displayAmount}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "amount",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="font-semibold">Summary</p>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {Math.ceil(totals.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span>₹ {Math.ceil(totals.gstTotal)}</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹ {Math.ceil(totals.total)}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
          >
            {saveLoading ? "Generating....." : "Generate Invoice"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
