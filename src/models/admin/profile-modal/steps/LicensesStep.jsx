import React from 'react';
import { useFormContext } from 'react-hook-form';

import InputField from "../../../../components/comman/InputField";

const LicensesStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <InputField
            label="Seed License Number"
            name="seedLicenseNumber"
            placeholder="Enter license number"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>

        <InputField
          label="Seed Validity"
          name="seedValidity"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Fertilizer Validity"
          name="fertilizerValidity"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <InputField
            label="Fertilizer License Number"
            name="fertilizerLicenseNumber"
            placeholder="Enter license number"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>

        <div className="md:col-span-2">
          <InputField
            label="Pesticide License Number"
            name="pesticideLicenseNumber"
            placeholder="Enter license number"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <InputField
            label="Direct Marketing/Mandi License"
            name="mandiLicenseNumber"
            placeholder="Enter license number"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>

        <InputField
          label="Pesticide Validity"
          name="pesticideValidity"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Mandi Validity"
          name="mandiValidity"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <InputField
            label="Udhyam Registration number"
            name="udyamAadhaarNumber"
            placeholder="Enter Udyam number"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>

        <InputField
          label="Udyam Issue Date"
          name="udyamIssueDate"
          type="date"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

    </div>
  );
};

export default LicensesStep;