import React, { useEffect, useRef } from "react";
import { ChevronDown, CircleUser, LogOut, Menu, Settings, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { LOGO } from "../../assets";
import { fetchCompanyDataById } from "../../store/actions/companyAction";

const Header = ({onToggleSideBar}) => {
 const { user, role, companyId } = useSelector((state) => state.auth);
const companyName = useSelector((state) => state.companyById?.company?.name);

const isCompany = role?.toLowerCase() === "company";

const displayName = isCompany
  ? companyName || user?.name || "Company"
  : user?.name || "User";

    const dispatch=useDispatch();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
    const navigate=useNavigate();
    const profileRef = useRef(null);

   useEffect(() => {
  if (role?.toLowerCase() === "company" && companyId) {
    dispatch(fetchCompanyDataById(companyId));
  }
}, [role, companyId, dispatch]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
          setIsProfileMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

   

    
  return (
    <header className='p-3 flex justify-between items-center border-b border-gray-400'>
      <div className='flex gap-2 items-center'>
          <Menu onClick={onToggleSideBar} size={20} className="lg:hidden block text-black" />
          <img
            src={LOGO}
            alt="RAK logo"
            className="h-10 w-auto object-contain"
          />
          <h3 className='font-bold text-2xl text-blue-800'>ERP</h3>          
      </div>
        
      <div className='flex gap-2 md:gap-4 items-center'>

        <div ref={profileRef} className="relative">
          <div className="relative sm:block hidden">

            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="bg-blue-100 h-8 w-8 text-[#35a8eb] rounded-full text-sm font-medium flex justify-center items-center">
              <span className="bg-blue-100 h-8 w-8 text-[#35a8eb] rounded-full text-sm font-medium flex justify-center items-center">
  {displayName
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()}
</span>
              </span>

              <div className="flex flex-col leading-tight">
               <span className="font-medium text-sm capitalize">
  {displayName}
</span>
                <span className="text-gray-600 font-medium text-xs">
                  {/* {role} */}
                  {user?.email}
                </span>
              </div>

              <ChevronDown
                className={` text-gray-700 transition-transform duration-200 ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
                size={18}
              />
            </div>
          </div>

          <div className="relative md:hidden">
            <CircleUser
              size={20} 
              className="dark:text-blue-700 text-blue-600"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
          </div>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <p className="border-b text-center font-normal py-2 border-gray-300">My Account</p>
              <ul className="text-sm text-gray-600 ">
                <li 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                  onClick={()=>{
                    navigate("user-profie");
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <User size={16} /> Profile 
                </li>
                <li 
                  onClick={()=>{
                    // navigate("settings");
                    // setIsProfileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                >
                  <Settings size={16} /> Settings
                </li>
                <li 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                  onClick={()=>{
                    // navigate("profile");
                    // setIsProfileMenuOpen(false);
                  }}
                >
                  <User size={16} /> Support 
                </li>
                <li className="border-t border-gray-300 "></li>
                <li 
                  onClick={()=>{
                    dispatch(logoutUser()); 
                    navigate("/login", { replace: true });
                  }} 
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer transition"
                >
                  <LogOut size={16} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
       
      </div>
    </header>
  )
}

export default Header