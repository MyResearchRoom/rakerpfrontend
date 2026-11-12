import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SelectField from '../../../../components/comman/SelectField';

const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];

const ITInfrastructureStep = ({isEditMode}) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-transparent py-2 rounded-md inline-block w-full">
            <h3 className="text-sm font-semibold text-gray-800">IT Infrastructure</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            name="laptopDesktopAvailable"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Laptop/Desktop Available"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.laptopDesktopAvailable?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <Controller
            name="internetConnectivity"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Internet Connectivity"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.internetConnectivity?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <Controller
            name="printerAvailable"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Printer Available"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.printerAvailable?.message}
                disabled={!isEditMode}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ITInfrastructureStep;
