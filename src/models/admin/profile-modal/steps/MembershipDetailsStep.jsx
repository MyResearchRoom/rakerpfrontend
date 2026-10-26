import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from '../../../../components/comman/InputField';

const MembershipDetailsStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

//  const getFieldProps = (name, type = "text") => ({
//   ...register(name, {
//     valueAsNumber: type === "number",
//   }),
//   name,
//   type,
//   errorMessage: errors[name]?.message
// });


  const getFieldProps = (name, type = "text") => ({
    ...register(name),
    name,
    type,
    errorMessage: errors[name]?.message
  });
  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-300">

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <InputField label="Total Shareholder Farmers" placeholder="Enter num" 
          disabled={!isEditMode} {...getFieldProps("totalShareholderFarmers", "number")} />
        <InputField label="Total Landholding (acres)" placeholder="Enter total" disabled={!isEditMode} {...getFieldProps("totalLandholdingAcres","number")} />
        <InputField label="Male Members" placeholder="Enter num" disabled={!isEditMode} {...getFieldProps("maleMembers","number")} />
        <InputField label="Female Members" placeholder="Enter num" disabled={!isEditMode} {...getFieldProps("femaleMembers","number")} />
      </div>

      {/* Farmer Categories Section */}
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-yellow-50 py-2 px-4 rounded-md inline-block w-full">
          <h3 className="text-sm font-semibold text-gray-800">Farmer Categories</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <InputField label="Small" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("smallFarmers","number")} />
          <InputField label="Marginal" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("marginalFarmers","number")} />
          {/* <InputField label="Semi-Medium" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("semiMediumFarmers", "number")} /> */}
          <InputField label="Medium" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("mediumFarmers","number")} />
          <InputField label="Large" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("largeFarmers","number")} />
        </div>
      </div>

    </div>
  );
};

export default MembershipDetailsStep;


// import React from 'react';
// import { useFormContext } from 'react-hook-form';
// import InputField from '../../../../components/comman/InputField';

// const MembershipDetailsStep = ({isEditMode}) => {
//   const { register, formState: { errors } } = useFormContext();

//   const getFieldProps = (name, type = "text") => ({
//     ...register(name),
//     name,
//     type,
//     errorMessage: errors[name]?.message
//   });

//   return (
//     <div className="flex flex-col space-y-8 animate-in fade-in duration-300">

//       {/* Overview Section */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
//         <InputField label="Total Shareholder Farmers" placeholder="Enter num" 
//           disabled={!isEditMode} {...getFieldProps("totalShareholderFarmers", "number")} />
//         <InputField label="Total Landholding (acres)" placeholder="Enter total" disabled={!isEditMode} {...getFieldProps("totalLandholdingAcres", "number")} />
//         <InputField label="Male Members" placeholder="Enter num" disabled={!isEditMode} {...getFieldProps("maleMembers", "number")} />
//         <InputField label="Female Members" placeholder="Enter num" disabled={!isEditMode} {...getFieldProps("femaleMembers", "number")} />
//       </div>

//       {/* Farmer Categories Section */}
//       <div className="flex flex-col space-y-4 text-left">
//         <div className="bg-yellow-50 py-2 px-4 rounded-md inline-block w-full">
//           <h3 className="text-sm font-semibold text-gray-800">Farmer Categories</h3>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//           <InputField label="Small" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("smallFarmers", "number")} />
//           <InputField label="Marginal" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("marginalFarmers", "number")} />
//           {/* <InputField label="Semi-Medium" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("semiMediumFarmers", "number")} /> */}
//           <InputField label="Medium" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("mediumFarmers", "number")} />
//           <InputField label="Large" placeholder="Enter n" disabled={!isEditMode} {...getFieldProps("largeFarmers", "number")} />
//         </div>
//       </div>

//     </div>
//   );
// };

// export default MembershipDetailsStep;