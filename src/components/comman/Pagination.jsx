import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Utility to generate page range based on current page and total pages
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 2) pages.push(1, "...");
      else for (let i = 1; i < start; i++) pages.push(i);

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < totalPages - 1) pages.push("...", totalPages);
      else if (end === totalPages - 1) pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="w-full flex justify-end mt-8">
      {/* Desktop / Tablet */}
      <div className="hidden sm:flex items-center gap-2">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 "
        >
          ◀
        </button>

        {/* Page Numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded-md text-sm transition ${
                currentPage === page
                  ? "bg-blue-50  text-blue-600 border-blue-200 font-bold"
                  : "hover:bg-gray-100 "
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          ▶
        </button>
      </div>

      {/* Mobile View */}
      <div className="flex sm:hidden items-center gap-3 text-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50 "
        >
          ◀
        </button>
        <span className="">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pagination;
