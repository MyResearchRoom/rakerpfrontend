import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleChevronDown } from "lucide-react";

const NestedTabHeader = ({
  tabs = [],
  useRoutes = false,
  activeTab,
  onTabChange,
  basePath = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleTabClick = (tab) => {
    if (useRoutes) {
      navigate(`${tab.path}`);
    } else {
      onTabChange(tab.label);
    }
    setOpen(false);
  };

  const isActive = (tab) => {
    if (useRoutes) {
      if (tab.isIndex && location.pathname === `/${basePath}`) return true;
      return location.pathname === `/${basePath}/${tab.path}`;
    } else {
      return tab.label === activeTab;
    }
  };

  const currentTab = tabs.find((tab) => isActive(tab)) || tabs[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div
        className="hidden sm:flex flex-row bg-[#ececf0] h-10 w-fit rounded-full mt-4 gap-4 items-center px-1 text-sm"
        
      >
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`rounded-full h-8 flex justify-center items-center cursor-pointer transition px-3  ${
              isActive(tab)
                ? " bg-white text-black font-semibold shadow-md"
                : "bg-[#ececf0] text-[#364153] "
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="sm:hidden mt-4 relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center bg-[#ececf0] px-4 py-2 rounded-full cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {currentTab?.label}
          </span>
          <CircleChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>

        {open && (
          <div className="absolute mt-2 w-full bg-white border border-gray-200  rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
            {tabs.map((tab) => (
              <div
                key={tab.label}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100  ${
                  isActive(tab)
                    ? "font-semibold text-blue-600"
                    : ""
                }`}
              >
                {tab.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NestedTabHeader;
