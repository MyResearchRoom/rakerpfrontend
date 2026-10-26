import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from '../../../../components/comman/InputField';

const ShareCapitalStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  const getFieldProps = (name) => ({
    ...register(name, {
      setValueAs: (v) => v === "" ? undefined : v
    }),
    name,
    type: "number",
    errorMessage: errors[name]?.message
  });

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <InputField 
          label="Authorized Share Capital (₹)" 
          placeholder="Enter amount" 
          disabled={!isEditMode} 
          {...getFieldProps("authorizedShareCapital")} 
        />

        <InputField 
          label="Total Share Capital Raised (₹)" 
          placeholder="Enter amount" 
          disabled={!isEditMode} 
          {...getFieldProps("totalShareCapitalRaised")} 
        />

        <InputField 
          label="Total Paid-Up Capital (₹)" 
          placeholder="Enter amount" 
          disabled={!isEditMode} 
          {...getFieldProps("totalPaidUpCapital")} 
        />

      </div>
    </div>
  );
};

export default ShareCapitalStep;