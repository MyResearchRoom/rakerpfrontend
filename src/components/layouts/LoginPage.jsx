// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Eye, EyeOff, Loader } from "lucide-react";
// import { useDispatch } from "react-redux";

// import { ADMIN, COMPANY, EMPLOYEE } from "../../constants/role";
// import { loginUser } from "../../store/slices/authSlice";
// import { userLogin } from "../../services/auth";

// import logo from "../../assets/logo.png";
// import welogo from "../../assets/welogo.png";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const response = await userLogin(formData);
//       console.log("Login data", response);

//       if (response) {
//         let route = [];

//         const loginRole = response?.user?.role;

//         if (loginRole === ADMIN) {
//           route = [
//             "DASHBOARD",
//             "COMPANIES",
//             "MATERIALS",
//             "EXPENSES",
//             "INVOICES",
//             "RECEIPTS",
//             "ACCOUNTS",
//             "COMPLIANCE",
//             "REPORTS",
//             "SETTING",
//           ];
//         } else if (loginRole === EMPLOYEE) {
//           route = response?.accessRoute || [];
//         } else if (loginRole === COMPANY) {
//           route = [
//             "COMPANY_DASHBOARD",
//             "MY_INVOICES",
//             "MY_RECEIPTS",
//             "MY_MATERIALS",
//             "COMPLIANCE_DOCUMENTS",
//             "PROFILE",
//             "BOARD_OF_DIRECTORS",
//             "FARMER_MEMBERS",
//             "MY_EXPENSES",
//             "MY_ACCOUNT",
//           ];
//         }

//         dispatch(
//           loginUser({
//             token: response?.accessToken,
//             role: response?.user?.role,
//             user: response?.user,
//             accessRoute: route,
//             companyId: response?.companyId,
//           })
//         );

//         localStorage.setItem(
//           "user",
//           JSON.stringify(response?.user)
//         );

//         if (response?.user?.role === COMPANY) {
//           navigate("/company-dashboard");
//         } else {
//           navigate("/");
//         }
//       } else {
//         toast.error("Something went wrong");
//       }
//     } catch (error) {
//       console.log("login error",error);

//       toast.error(error?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* MAIN SECTION */}
//       <div className="flex flex-1">
//         {/* LEFT SIDE */}
//         <div className="hidden md:flex w-1/2 items-center justify-center px-16">
//           <div className="max-w-md w-full text-center">
//             <img
//               src={logo}
//               alt="Logo"
//               className="w-48 mb-6 mx-auto"
//             />

//             <h1 className="text-4xl font-bold text-blue-600 mb-3">
//               Welcome to RAK ERP
//             </h1>

//             <p className="text-lg text-black">
//               Innovate, Integrate, Elevate with RAK ERP
//             </p>

//             <p className="text-lg text-gray-600 mt-2">
//               Built by Experts, Designed for Producers
//             </p>

//             <p className="text-sm text-gray-400 mt-2">
//               Manage your record keeping, Compliances, Accounting and Guide on Govt.Schemes
//             </p>

//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex w-full md:w-1/2 items-center justify-center p-6">
//           <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
//             <h2 className="text-center text-xl font-semibold mb-6">
//               LOG IN
//             </h2>

//             <form
//               className="space-y-5"
//               onSubmit={handleSubmit}
//             >
//               {/* ROLE */}
//               <select
//                 name="role"
//                 value={formData.role}
//                 required
//                 onChange={handleChange}
//                 className="w-full text-sm bg-[#f3f3f5] border border-gray-300 rounded-md p-2.5 outline-none"
//               >
//                 <option value="">Select Role</option>
//                 <option value={ADMIN}>Admin</option>
//                 <option value={EMPLOYEE}>Employee</option>
//                 <option value={COMPANY}>Company</option>
//               </select>

//               {/* EMAIL */}
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter Email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full text-sm bg-[#f3f3f5] border border-gray-300 rounded-md p-2.5 outline-none"
//               />

//               {/* PASSWORD */}
//               <div className="relative">
//                 <input
//                   type={
//                     showPassword ? "text" : "password"
//                   }
//                   name="password"
//                   placeholder="Enter Password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full text-sm bg-[#f3f3f5] border border-gray-300 rounded-md p-2.5 pr-10 outline-none"
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowPassword(!showPassword)
//                   }
//                   className="absolute right-3 top-2.5 text-gray-500"
//                 >
//                   {showPassword ? (
//                     <EyeOff size={18} />
//                   ) : (
//                     <Eye size={18} />
//                   )}
//                 </button>
//               </div>

//               {/* FORGOT PASSWORD */}
//               <div className="flex justify-end items-center text-sm">
//                 <button
//                   type="button"
//                   className="text-[#1c398e] hover:underline hover:text-[#0a5986]"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               {/* BUTTON */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2.5 text-white rounded-md font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center"
//               >
//                 {loading ? (
//                   <Loader
//                     size={22}
//                     className="animate-spin"
//                   />
//                 ) : (
//                   "LOG IN"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="flex flex-col md:flex-row justify-between items-center px-6 py-3 text-sm text-gray-500">
//         {/* LEFT */}
//         <div className="flex flex-col items-center md:items-start gap-1">
//           <img
//             src={welogo}
//             alt="we logo"
//             className="w-20"
//           />

//           <div className="flex flex-wrap items-center gap-1 text-xs md:text-sm leading-5">
//             <span>Designed by</span>

//             <a
//               href="https://www.wesolutize.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="font-semibold text-blue-600 hover:underline"
//             >
//               NeoWeSolutize Technologies
//             </a>

//             <span className="text-gray-500">|</span>

//             <span>Developed for</span>

//             <a
//               href="https://rakadvisory.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="font-semibold text-blue-600 hover:underline"
//             >
//               RAK Advisory
//             </a>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="text-center md:text-right mt-2 md:mt-0">
//           Access is limited to verified users in
//           accordance with Company Policy.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Loader,
  ShieldCheck,
  Mail,
  Lock,
  UserCircle,
  LogIn,
  CheckCircle2,
  BarChart3,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { useDispatch } from "react-redux";

import { ADMIN, COMPANY, EMPLOYEE } from "../../constants/role";
import { loginUser } from "../../store/slices/authSlice";
import { userLogin } from "../../services/auth";

import logo from "../../assets/logo.png";
import welogo from "../../assets/welogo.png";
import { loginBg } from "../../assets";
// Background image imported directly from your project assets folder

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await userLogin(formData);
      console.log("Login data", response);

      if (response) {
        let route = [];

        const loginRole = response?.user?.role;

        if (loginRole === ADMIN) {
          route = [
            "DASHBOARD",
            "COMPANIES",
            "MATERIALS",
            "EXPENSES",
            "INVOICES",
            "RECEIPTS",
            "ACCOUNTS",
            "COMPLIANCE",
            "REPORTS",
            "SETTING",
          ];
        } else if (loginRole === EMPLOYEE) {
          route = response?.accessRoute || [];
        } else if (loginRole === COMPANY) {
          route = [
            "COMPANY_DASHBOARD",
            "MY_INVOICES",
            "MY_RECEIPTS",
            "MY_MATERIALS",
            "COMPLIANCE_DOCUMENTS",
            "PROFILE",
            "BOARD_OF_DIRECTORS",
            "FARMER_MEMBERS",
            "MY_EXPENSES",
            "MY_ACCOUNT",
          ];
        }

        dispatch(
          loginUser({
            token: response?.accessToken,
            role: response?.user?.role,
            user: response?.user,
            accessRoute: route,
            companyId: response?.companyId,
          }),
        );

        localStorage.setItem("user", JSON.stringify(response?.user));

        if (response?.user?.role === COMPANY) {
          navigate("/company-dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("login error", error);
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between overflow-hidden font-sans antialiased text-slate-800 bg-slate-50 relative">
      {/* FULL BACKGROUND IMAGE LAYER WITH OPACITY MASK FOR PERFECT TEXT CONTRAST */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(248, 250, 252, 0.92) 0%, rgba(241, 245, 249, 0.85) 50%, 
          rgba(226, 232, 240, 0.4) 100%), url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Decorative Blur Orbs to blend the illustration style seamlessly */}
      <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/10 blur-3xl pointer-events-none select-none z-0" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none select-none z-0" />

      {/* MAIN CONTENT SPLIT WRAPPER */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          {/* LEFT SIDE: LOGO & VISUAL FEATURE GRID */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center text-left space-y-6 pr-4">
            <div className="space-y-4">
              <img
                src={logo}
                alt="RAK Advisory Logo"
                className="h-20 w-auto object-contain mb-2"
              />
              <div>
                <span className="text-xs font-black text-blue-600 bg-blue-50/90 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100/60 shadow-sm inline-block">
                  Welcome to RAK Advisory
                </span>
                <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight mt-3 leading-tight">
                  RAK{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    ERP
                  </span>
                </h1>
                <p className="text-base font-bold text-slate-600 mt-2 tracking-tight">
                  Innovate, Integrate, Elevate with RAK ERP.
                </p>
                <p className="text-sm font-semibold text-slate-400 mt-1 max-w-md">
                  Manage your record keeping, Compliances, Accounting and Guide
                  on Govt. Schemes.
                </p>
              </div>
            </div>

            {/* Core Capability Badges Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-white rounded-2xl shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                  <ShieldCheck size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Compliances
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Made Simple
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-white rounded-2xl shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <BarChart3 size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Smarter
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Accounting
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-white rounded-2xl shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                  <Settings2 size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Integrated
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Operations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-white rounded-2xl shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                  <CheckCircle2 size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    Built For
                  </h4>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Growth
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/40">
              <p className="text-lg italic font-serif text-slate-400 tracking-wide font-medium">
                "Your Compliance & Growth Partner"
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: GLASSMORPHIC AUTH CARD */}
          <div className="col-span-1 lg:col-span-6 flex justify-center w-full">
            <div className="bg-white/75 border border-white/60 shadow-xl rounded-3xl w-full max-w-md p-6 sm:p-10 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

              {/* Responsive Logo Header for Mobile (Hidden on Desktop) */}
              <div className="lg:hidden flex flex-col items-center mb-6">
                <img
                  src={logo}
                  alt="RAK Advisory Logo"
                  className="h-12 w-auto object-contain mb-3"
                />
              </div>

              <div>
                <div className="mb-8 text-center lg:text-left">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    Log In
                  </h2>
                  <p className="text-sm font-semibold text-slate-400 mt-1.5">
                    Access your RAK Advisory ERP workspace
                  </p>
                </div>

                {/* Increased row gaps between field components */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* ROLE SELECTION BOX */}
                  <div className="space-y-2 mb-6">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block pl-0.5">
                      Assign Identity Profile
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <UserCircle size={20} strokeWidth={2.2} />
                      </div>
                      {/* Height extended using p-3.5 and text set to text-base */}
                      <select
                        name="role"
                        value={formData.role}
                        required
                        onChange={handleChange}
                        className="w-full text-base font-semibold bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 pl-12 pr-10 outline-none text-slate-800 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                      >
                        <option
                          value=""
                          className="font-semibold text-slate-400"
                        >
                          Select Role
                        </option>
                        <option
                          value={ADMIN}
                          className="font-semibold text-slate-700"
                        >
                          Admin Account
                        </option>
                        <option
                          value={EMPLOYEE}
                          className="font-semibold text-slate-700"
                        >
                          Employee Workspace
                        </option>
                        <option
                          value={COMPANY}
                          className="font-semibold text-slate-700"
                        >
                          Company Portal
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* EMAIL FIELD INPUT */}
                  <div className="space-y-2 mb-6">
                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block pl-0.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Mail size={20} strokeWidth={2.2} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full text-base font-semibold bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 pl-12 outline-none text-slate-800 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD INPUT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-0.5">
                      <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider block">
                        Security Password
                      </label>
                      <button
                        type="button"
                        className="text-xs font-bold text-blue-600 hover:text-indigo-600 hover:underline transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={20} strokeWidth={2.2} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full text-base font-semibold bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 pl-12 pr-12 outline-none text-slate-800 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} strokeWidth={2} />
                        ) : (
                          <Eye size={20} strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON - Made larger to match input field proportions */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3.5 text-white rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/10 hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 group cursor-pointer"
                  >
                    {loading ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>LOG IN</span>
                        <LogIn
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                          strokeWidth={2.5}
                        />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED FOOTER WRAPPER */}
      <footer className="w-full bg-white/40 border-t border-slate-200/40 backdrop-blur-md px-6 sm:px-10 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-semibold text-slate-500 z-10 relative">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <img
            src={welogo}
            alt="WeSolutize"
            className="h-16 w-auto object-contain opacity-75"
          />
          <div className="h-3 w-px bg-slate-300 hidden sm:block" />
          <p className="text-slate-400 font-medium text-xs">
            Designed by{" "}
            <a
              href="https://www.wesolutize.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline"
            >
              NeoWeSolutize Technologies
            </a>{" "}
            | Developed for{" "}
            <a
              href="https://rakadvisory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline"
            >
              RAK Advisory
            </a>
          </p>
        </div>

        <div className="text-center sm:text-right text-xs text-slate-500 font-medium tracking-tight">
          Access is limited to authorized users only.
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
