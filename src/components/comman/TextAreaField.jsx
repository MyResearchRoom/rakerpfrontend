import React from "react";

const TextAreaField = ({
  label,
  type='text',
  required = false,
  placeholder,
  name,
  value,
  onChange,
  row,
  errorMessage
}) => {
  return (
    <div className="mb-2">
      <label
        htmlFor="input-field"
        className="block mb-1 text-sm font-medium text-gray-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        rows={row}
        id="input-field"
        className="w-full  px-2 py-2 rounded-lg border border-gray-200 bg-[#f3f3f5] text-gray-800  placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-200"
        placeholder={placeholder}
        required={required}
      />
    {errorMessage && (
        <p className="mt-2 text-sm text-red-600 ">{errorMessage}</p>
    )}
    </div>
  );
};

export default TextAreaField;
