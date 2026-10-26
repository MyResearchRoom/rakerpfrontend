import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "../components/comman/InputField";
import { toast } from "react-toastify";
import { changePassword } from "../services/auth";

export default function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading,setLoading]=useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const payload={
        oldPassword:form.oldPassword,
        newPassword:form.newPassword,
      }
      const response=await changePassword(payload);
      if(response){
        toast.success(response || "password change successfully...");
        onClose();
      }else{
        toast.error("something went wrong");
      }
      
    } catch (err) {
        console.error("ERROR:", err); 
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

        <div className="relative mb-3">
          <InputField
            type={show.old ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => toggleShow("old")}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {show.old ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative mb-3">
          <InputField
            type={show.new ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => toggleShow("new")}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative mb-4">
          <InputField
            type={show.confirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <span
            onClick={() => toggleShow("confirm")}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded bg-gray-50">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading  ? "saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}