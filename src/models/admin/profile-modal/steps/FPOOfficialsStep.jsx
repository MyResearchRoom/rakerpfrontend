import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from "../../../../components/comman/InputField";

const FPOOfficialsStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-300">

      {/* CEO Information */}
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-blue-50 py-2 px-4 rounded-md w-full">
          <h3 className="text-sm font-semibold text-gray-800">CEO Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="CEO Name"
            name="ceoName"
            placeholder="Enter CEO name"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="CEO Contact"
            name="ceoContact"
            placeholder="+91 98765 43210"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="CEO Email"
            name="ceoEmail"
            type="email"
            placeholder="ceo@example.com"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="Appointment Date"
            name="ceoAppointmentDate"
            type="date"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>
      </div>

      {/* Accountant Information */}
      <div className="flex flex-col space-y-4 mb-6 text-left">
        <div className="bg-green-50 py-2 px-4 rounded-md w-full">
          <h3 className="text-sm font-semibold text-gray-800">Accountant Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Accountant Name"
            name="accountantName"
            placeholder="Enter accountant name"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="Contact"
            name="accountantContact"
            placeholder="+91 98765 43210"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="Email"
            name="accountantEmail"
            type="email"
            placeholder="accountant@example.com"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />

          <InputField
            label="Appointment Date"
            name="accountantAppointmentDate"
            type="date"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>
      </div>

    </div>
  );
};

export default FPOOfficialsStep;