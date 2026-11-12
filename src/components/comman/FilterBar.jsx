import SearchComponent from "./SearchComponent";

const FilterBar = ({ children, searchTerm, setSearchTerm,placeholer,setCurrentPage }) => {
  return (
    <div className="p-2 flex flex-wrap items-center gap-2 md:gap-4">
      
      {/* Search */}
      <div className="w-full sm:w-[300px]">
        <SearchComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholer={placeholer}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Filters */}
      {children}
      
    </div>
  );
};

export default FilterBar;
