import React from 'react';
import { useFormContext } from 'react-hook-form';

import InputField from "../../../../components/comman/InputField";

const FPOIdentificationStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">

      {/* Row 1 */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField
          label="Date of Start Activities"
          name="dateOfStartActivities"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="Name Approval Date"
          name="nameApprovalDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="MoA/AoA Prep Date"
          name="moaAoAPrepDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="Registration Date"
          name="registrationDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div> */}

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField
          label="Incorporation Date"
          name="incorporationDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="CIN Number"
          name="cinNumber"
          placeholder="U01100MH20..."
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="PAN Number"
          name="panNumber"
          placeholder="AABCT1332L"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="TAN Number"
          name="tanNumber"
          placeholder="BNGL12345A"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputField
          label="GST Application Date"
          name="gstApplicationDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="GST Number"
          name="gstNumber"
          placeholder="29AABCT1332L1Z5"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="GST Certificate Issue Date"
          name="gstCertificateIssueDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

    </div>
  );
};

export default FPOIdentificationStep;