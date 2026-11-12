import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import SelectField from '../../../../components/comman/SelectField';
import InputField from '../../../../components/comman/InputField';

const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];

const InfrastructureStep = ({isEditMode}) => {
  const { control, register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-orange-50 py-2 rounded-md inline-block w-full">
            <h3 className="text-sm font-semibold text-gray-800">Equipment Availability</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            name="digitalMoistureMeter"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Digital Moisture Meter"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.digitalMoistureMeter?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <Controller
            name="hlMeter"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="HL Meter"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.hlMeter?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <Controller
            name="bambooSampler"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="Bamboo Sampler"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.bambooSampler?.message}
                disabled={!isEditMode}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            name="weighingScale100kg"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="100kg Weighing Scale"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.weighingScale100kg?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <Controller
            name="weighingScale500g"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <SelectField
                label="500g Weighing Scale"
                name={field.name}
                options={yesNoOptions}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                optionLabel="Select status"
                errorMessage={errors.weighingScale500g?.message}
                disabled={!isEditMode}
              />
            )}
          />
          <InputField
            label="Other Equipment"
            name="otherEquipment"
            placeholder="Specify other equip"
            register={register}
            errors={errors}
            disabled={!isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default InfrastructureStep;
