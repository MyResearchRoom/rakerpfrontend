import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const SearchComponent = ({
  searchTerm,
  setSearchTerm,
  placeholer,
  delay = 500,
  setCurrentPage,
}) => {
  const [inputValue, setInputValue] = useState(searchTerm || "");

  useEffect(() => {
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay, setSearchTerm]);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 md:h-5 md:w-5"
      />

      <input
        type="text"
        value={inputValue}
        onChange={(e) =>{ 
          setInputValue(e.target.value);
          setCurrentPage(1);
        }
        }
        placeholder={placeholer || "Search..."}
        autoComplete="off"
        className="w-full rounded-lg border border-gray-200 bg-[#f3f3f5] py-2 pl-10 pr-4 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-200 md:text-base"
      />
    </div>
  );
};

export default React.memo(SearchComponent);