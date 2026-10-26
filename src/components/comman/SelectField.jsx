

import React, { useState, useRef, useEffect } from "react";

const SelectField = ({
  label,
  required,
  errorMessage,
  optionLabel = "Select",
  options = [],
  labelKey = "label",
  valueKey = "value",
  name,
  value,
  onChange,
  disabled = false,
  register,
  errors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(value ?? "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const registerProps = register ? register(name) : {};
  const fieldName = registerProps.name || name;
  const combinedError = errorMessage || errors?.[name]?.message;

  const defaultOption = {
    [labelKey]: optionLabel,
    [valueKey]: "",
  };

  const filteredOptions = [defaultOption, ...options].filter((opt) =>
    String(opt[labelKey]).toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption =
    selectedValue === "" || selectedValue === null
      ? defaultOption
      : options.find((opt) => String(opt[valueKey]) === String(selectedValue)) ??
        defaultOption;

  const handleSelect = (option) => {
    const optionValue = option[valueKey];
    setSelectedValue(optionValue);
    const payload = {
      target: {
        name: fieldName,
        value: optionValue,
      },
    };

    onChange?.(payload);
    registerProps.onChange?.(payload);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="w-full relative " ref={dropdownRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Selected Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-1 md:py-2 rounded-lg border border-gray-200 bg-[#f3f3f5] text-gray-800 text-sm md:text-base break-all ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } ${combinedError ? "border-red-500" : ""} transition`}
      >
        {selectedOption ? selectedOption[labelKey] : optionLabel}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 border rounded-md text-sm outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Options */}
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No records available. Please add data first.
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 text-sm hover:bg-gray-100 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {option[labelKey]}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}

      {combinedError && (
        <p className="mt-1 text-sm text-red-600 ">{combinedError}</p>
      )}
    </div>
  );
};

export default SelectField;
