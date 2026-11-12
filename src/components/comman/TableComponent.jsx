import React from "react";

const TableComponent = ({
  columns,
  data,
  actionLabel,
  actions,
  check,
  checkLabel,
  loading=false,
  skeletonRows=5,
}) => {
  
  const totalColumns= columns.length + (actions ? 1 : 0) + (check ? 1 : 0);
  return (
    <table className="w-full text-[#364153] break-words">
      <thead className="w-full">
        <tr className=" w-full border-b border-gray-200">
          {check && (
            <th
              className={`h-12 text-left font-semibold`}
            >
              {checkLabel()}
            </th>
          )}
          {columns.map((col, index) => (
            <th 
              key={index} 
              className={`h-12 text-left font-semibold 
                ${col.className || "text-left"}
                ${col.headerClassName || ""}`}
            >
              {col.label}
            </th>
          ))}
          {actionLabel && <th className={`h-12 text-center font-medium`}>{actionLabel}</th>}
        </tr>
      </thead>
      <tbody>
        {
          loading ? (
             Array.from({ length: skeletonRows }).map((_, i) => (
            <tr
              key={i}
              className={`h-10 border-b border-gray-200  animate-pulse text-black `}
            >
              {Array.from({ length: totalColumns }).map((_, j) => (
                <td key={j} className={`${col.className || ""} align-top`}>
                  <div className="h-4 bg-gray-300 rounded w-3/4 "></div>
                </td>
              ))}
            </tr>
          ))
          ) :
          data?.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr key={rowIndex} className="h-10 border-b border-gray-200 text-sm hover:bg-[#f7f7f7] ">
              {check && <td>{check ? check(item, rowIndex) : null}</td>}
              {columns.map((col, colInd) => (
                <td 
                  key={colInd} 
                  className={`${col.className || ""}`}
                >
                  {col.render ? col.render(item, rowIndex) : item[col.field]}
                </td>
              ))}
              {actions && <td>{actions ? actions(item, rowIndex) : null}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={Math.max(
                1,
                columns.length + (actions ? 1 : 0) + (check ? 1 : 0)
              )}
              className="text-center"
            >
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default React.memo(TableComponent);
