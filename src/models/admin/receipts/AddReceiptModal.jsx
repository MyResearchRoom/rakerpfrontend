import React, { useEffect, useMemo, useState } from "react";
import { fetchCompanyDropdownList } from "../../../store/actions/companyAction";
import InputField from "../../../components/comman/InputField";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SelectField from "../../../components/comman/SelectField";
import { getInvoiceByCompanyId } from "../../../services/invoice";
import { fetchReceipts } from "../../../store/actions/receiptsActions";
import { generateNewReceipt } from "../../../services/receipt";
import { toast } from "react-toastify";
import { fetchCount } from "../../../store/actions/countAction";
import { Oval } from "react-loader-spinner";

const getToday = () => new Date().toISOString().split("T")[0];


const AddReceiptModal = ({ isOpen, onClose ,companyId}) => {
  const dispatch=useDispatch();

    const { role } = useSelector((state) => state.auth);
  

  const [formState, setFormState] = useState({
    companyId: companyId || "",
    invoiceNumber: "",
    amount: "",
    paymentDate: getToday(),
    paymentMethod: "",
    transactionRef: "",
  });

  const [invoices,setInvoices]=useState([]);
  const [invoiceLoading,setInvoiceLoading]=useState(false);
  const [receiptSubmit,setReceiptSubmit]=useState(false);

  const { companies, error, loading } = useSelector(
      (state) => state.companyDropdownData
  );

  useEffect(() => {
  if ((!companies || companies.length === 0) && role !=="COMPANY") {
    dispatch(fetchCompanyDropdownList());
  }
  }, [dispatch]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!formState.companyId) return;

      try {
        setInvoiceLoading(true);

        const data = await getInvoiceByCompanyId(formState.companyId);
        setInvoices(data);
      } catch (err) {
        toast.error(err);
        setInvoices([]);
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoices();
  }, [formState.companyId]);

  const paymentOptions = [
    { label: "Bank Transfer", value: "bank transfer" },
    { label: "UPI", value: "upi" },
    { label: "Cash", value: "cash" },
    { label: "Cheque", value: "cheque" },
    { label: "Card", value: "card" },
  ];

  const handleChange = (field, value) => {
    setFormState((prev) => {
      if (field === "paymentMethod") {
        return {
          ...prev,
          paymentMethod: value,
          transactionRef: value === "cash" ? "N/A" : "",
        };
      }
      if(field==="invoiceNumber"){
        const selectedInvoice = invoices.find(
          (i)=>i.id===Number(value)
        );
        return{
          ...prev,
          invoiceNumber:value ,
          amount : Number(selectedInvoice?.totalRemaining) || 0,
        }
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = async() => {

    const payload = new FormData();
      payload.append("companyId", formState.companyId);
      payload.append("invoiceId", formState.invoiceNumber);
      payload.append("amount", formState.amount);
      payload.append("paymentDate", formState.paymentDate);
      payload.append("paymentMethod", formState.paymentMethod);
      payload.append("transactionReference", formState.transactionRef);

      try {
          setReceiptSubmit(true);
          const response= await generateNewReceipt(payload);
          console.log("response",response);
            
          if(response){
            toast.success(response || "Receipt generated successfully");
            setFormState({
              companyId: "",
              invoiceNumber: "",
              amount: "",
              paymentDate: getToday(),
              paymentMethod: "",
              transactionRef: "",
            });
            onClose();
            dispatch(fetchReceipts({ searchTerm:"",page:1}));
            dispatch(fetchCount());
            }
            else{
              toast.error("Something went wrong")
            }
          } catch (err) {
            console.log("err",err);
            
            toast.error(err || "toast error");
          } finally {
            setReceiptSubmit(false);
          }
  };

  if (!isOpen) return null;

  if (loading ) {
    return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
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
          {/* {materialLoading && "Loading material list..."} */}
        </p>
    </div>
    </div></div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate New Receipt</h3>
            <p className="text-sm text-gray-500">
              Record payment received from a company against an invoice
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X/>
          </button>
        </div>

        {error && <p>Company get : <span className="text-red-500">{error}</span></p>}
        <div className="space-y-2">
         
          {role!=="COMPANY" &&
          <SelectField
              label="Select Company"
              value={formState.companyId}
              onChange={(e) => {
                handleChange("companyId", e.target.value);
              }}
              options={companies}
              valueKey="id"
              labelKey="name"
              required={true}
              disabled={companyId}
          />
          }


          <SelectField
              label="Select invoice"
              value={formState.invoiceNumber}
              disabled={!formState.companyId || invoiceLoading}
              onChange={(e) => handleChange("invoiceNumber", e.target.value)}
              options={invoices}
              valueKey="id"
              labelKey="invoiceNumber"
              required={true}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              label="Payment Amount (₹)"
              required
              name="amount"
              type="number"
              step="0.01"
              value={formState.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
            />
            <InputField
              label="Payment Date"
              required
              name="paymentDate"
              type="date"
              value={formState.paymentDate}
              onChange={(e) => handleChange("paymentDate", e.target.value)}
            />
          </div>

          <SelectField
              label="Select payment method"
              required={true}
              name="paymentMethod"
              value={formState.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              options={paymentOptions}
              optionLabel="Select payment method"
              valueKey="value"
              labelKey="label"
          />

          <div>
            <InputField
              label="Transaction Reference / UTR Number"
              required={formState.paymentMethod !== "cash"}
              name="transactionRef"
              value={formState.transactionRef}
              onChange={(e) => handleChange("transactionRef", e.target.value)}
              placeholder="e.g., UTR123456789"
              disabled={formState.paymentMethod === "cash"}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600"
          >
            <p className="text-black border border-gray-300 px-4 py-2 rounded-md bg-gray-50">Cancel</p>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {receiptSubmit ? "Generating ...." : "Generate Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptModal;
