import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from '../../../../components/comman/InputField';

const CompanyProfileStep = ({isEditMode}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  // 👇 FORCE CLEAN VALUE ON MOUNT (prevents leakage)
  // useEffect(() => {
  //   if (!watch("fpoUniqueCode")) {
  //     setValue("fpoUniqueCode", "");
  //   }
  // }, [setValue, watch]);

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Company Unique Code"
          name="fpoUniqueCode"
          placeholder="Enter Company code"
          register={register}
          errors={errors}
          required
          disabled={!isEditMode}
        />
      </div>
    </div>
  );
};

export default CompanyProfileStep;