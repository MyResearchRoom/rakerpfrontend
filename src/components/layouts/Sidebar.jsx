import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes/routes";
import { Building2, Crown, User, Users, X } from "lucide-react";
import { useSelector } from "react-redux";
import { ADMIN, COMPANY, EMPLOYEE } from "../../constants/role";

const Sidebar = ({isOpen,onClose}) => {
    const modalRef = React.useRef();
    const {role}=useSelector((state)=>state?.auth)
      useEffect(() => {
        const handleClickOutside = (e) => {
          if (!isOpen) return;
          if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isOpen, onClose]);
      
  return (
    <aside
      ref={modalRef}
      className={`h-full bg-white border-r border-gray-400 p-2 overflow-y-auto shadow-lg transition-transform duration-300
      ${
        isOpen
          ? "fixed inset-y-0 left-0 z-50 w-[220px]"
          : "hidden lg:flex lg:w-[15%]"
      }`}
    >
      <nav className="w-full">
        {isOpen && (
          <X  
            className="ml-auto text-2xl text-gray-600 cursor-pointer lg:hidden"
            onClick={onClose} 
          />
        )}

        {role===ADMIN &&
          <div className="mx-2 border border-blue-600 bg-blue-50 px-2 py-1 mt-2 rounded-lg flex flex-row items-center gap-1">
            <Crown className="text-blue-600 w-4 h-4 lg:w-5 lg:h-5"/>
            <p className="text-blue-600 text-sm lg:text-base font-semibold">Admin Portal</p>
          </div>
        }

        {role===EMPLOYEE &&
          <div className="mx-2 border border-green-600 bg-green-50 px-2 py-1 mt-2 rounded-lg flex flex-row items-center gap-1">
            <Users className="text-green-600 w-4 h-4 lg:w-5 lg:h-5"/>
            <p className="text-green-600 text-sm lg:text-base font-semibold">Employee Portal</p>
          </div>
        }

        {role===COMPANY &&
          <div className="mx-2 border border-orange-600 bg-orange-50 px-2 py-1 mt-2 rounded-lg flex flex-row items-center gap-1">
            <Building2 className="text-orange-600 w-4 h-4 lg:w-5 lg:h-5"/>
            <p className="text-orange-600 text-sm lg:text-base font-semibold">Company Portal</p>
          </div>
        }

        <ul className="space-y-1 w-full mt-4 lg:mt-6 mb-5">
          {routes.filter((item)=>item.roles.includes(role)).map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 px-3 py-2 rounded-md font-normal transition-colors duration-150 break-words
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : " text-gray-700 hover:bg-gray-100 "
                  }`
                }
                onClick={onClose}
              >
                <route.icon size={18} className="shrink-0" />
                <span>{route.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
