import React from "react";

const SummaryCard = ({
  title,
  value,
  color = "text-gray-900",
  titleColor = "text-gray-500",
  subtitle,
  subtitleColor = "text-gray-500",
}) => {
  return (
    <div className="rounded-lg lg:rounded-2xl border bg-white py-3 p-2 xl:p-3 shadow-sm hover:shadow-md hover:border-[1px] hover:border-dashed hover:border-blue-300 transition flex flex-col h-full items-center justify-center">
      
      <p className={`text-xs md:text-sm lg:text-base capitalize font-Montserrat font-bold text-center whitespace-normal break-words leading-none ${titleColor}`}>
        {title}
      </p>

      <p className={`mt-3 text-lg md:text-2xl xl:text-3xl whitespace-normal break-all font-bold ${color}`}>
        {value}
      </p>

      {/* 👇 Push subtitle to bottom */}
      {subtitle && (
        <p className={`text-[10px] lg:text-xs mt-auto whitespace-normal break-all ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const RevenueSummaryCard = ({
  title,
  value,
  color = "text-gray-900",
  titleColor = "text-gray-500",
  subtitle,
  subtitleColor = "text-gray-500",
}) => {
  return (
    <div className="rounded-lg lg:rounded-2xl border bg-white py-3 p-2 xl:p-3 shadow-sm hover:shadow-md hover:border-[1px] hover:border-dashed hover:border-blue-300 transition flex flex-col h-full items-center justify-center">
      
      <p className={`text-xs md:text-sm lg:text-base capitalize font-Montserrat font-bold text-center whitespace-normal break-words leading-none ${titleColor}`}>
        {title}
      </p>

      <p className={`mt-3 text-lg md:text-xl xl:text-2xl whitespace-normal break-all font-bold ${color}`}>
        {value}
      </p>

      {/* 👇 Push subtitle to bottom */}
      {subtitle && (
        <p className={`text-[10px] lg:text-xs mt-auto whitespace-normal break-all ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SummaryCard;