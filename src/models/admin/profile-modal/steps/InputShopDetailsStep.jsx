import React from 'react';
import { useFormContext } from 'react-hook-form';

import InputField from "../../../../components/comman/InputField";

const InputShopDetailsStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">

      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InputField
          label="Shop Location"
          name="shopLocation"
          placeholder="Enter shop location"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Tehsil"
          name="tehsil"
          placeholder="Enter tehsil"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="District"
          name="district"
          placeholder="Enter district"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Pincode"
          name="shopPincode"
          placeholder="Enter pincode"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InputField
          label="Area of Shop (sq ft)"
          name="areaOfShopSqFt"
          placeholder="Enter area"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Distance from Competition (km)"
          name="distanceFromCompetitionKm"
          placeholder="Enter distance"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Latitude"
          name="latitude"
          placeholder="12.9716° N"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <InputField
          label="Longitude"
          name="longitude"
          placeholder="77.5946° E"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

    </div>
  );
};

export default InputShopDetailsStep;