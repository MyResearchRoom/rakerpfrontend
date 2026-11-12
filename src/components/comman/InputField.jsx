import React from "react";

const InputField = ({
  label,
  type = "text",
  required = false,
  placeholder,
  name,
  register,
  errors,
  errorMessage,
  disabled = false,
  step,
  readOnly = false,
  className = "",
  ...rest
}) => {
  const inputId = `input-${name}`;
  const registerProps = register ? register(name) : {};
  const fieldName = registerProps.name || name;
  const combinedError = errorMessage || errors?.[name]?.message;

  return (
    <div className="mb-2">
      <label
        htmlFor={inputId}
        className="block mb-1 text-xs md:text-sm font-medium text-gray-900"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        name={fieldName}
        type={type}
        placeholder={placeholder}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full text-sm md:text-base px-2 py-1 md:py-2 rounded-lg border bg-[#f3f3f5] text-gray-800 placeholder-gray-500 outline-none focus:ring-1 focus:ring-gray-200 transition ${
          combinedError ? "border-red-500" : "border-gray-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
        required={required}
        {...rest}
        {...registerProps}
      />
      {combinedError && (
        <p className="mt-1 text-sm text-red-600">{combinedError}</p>
      )}
    </div>
  );
};

export default InputField;
