import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from '../../../../components/comman/InputField';

const OutputPurchaseCentreStep = ({isEditMode}) => {
  const { register, formState: { errors } } = useFormContext();

  const getFieldProps = (name) => ({
    ...register(name),
    name,
    errorMessage: errors[name]?.message
  });

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
      
      {/* Mandi Details Section */}
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-transparent py-2 rounded-md inline-block w-full">
          <h3 className="text-sm font-semibold text-gray-800">Mandi Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <InputField label="Mandi Name" placeholder="Enter mandi name" disabled={!isEditMode}  {...getFieldProps("mandiName")} />
          </div>
          <InputField label="Location" placeholder="Enter loc" disabled={!isEditMode}  {...getFieldProps("mandiLocation")} />
          <InputField label="District" placeholder="Enter dis" disabled={!isEditMode} {...getFieldProps("mandiDistrict")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField label="Latitude" placeholder="12.9716° N" disabled={!isEditMode} {...getFieldProps("mandiLatitude")} />
          <InputField label="Longitude" placeholder="77.5946° E" disabled={!isEditMode} {...getFieldProps("mandiLongitude")} />
        </div>
      </div>

      {/* Purchase Centre Section */}
      <div className="flex flex-col space-y-4 text-left">
        <div className="bg-cyan-50 py-2 px-4 rounded-md inline-block w-full">
          <h3 className="text-sm font-semibold text-gray-800">Purchase Centre</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Location" placeholder="Enter location" disabled={!isEditMode} {...getFieldProps("purchaseCentreLocation")} />
          <InputField label="Area (sq ft)" placeholder="Enter area" disabled={!isEditMode} {...getFieldProps("purchaseCentreAreaSqFt")} />
          <InputField label="Distance from Mandi (km)" placeholder="Enter distance" disabled={!isEditMode} {...getFieldProps("purchaseCentreDistanceFromMandiKm")} />
        </div>
      </div>

      {/* Warehouse Section */}
      <div className="flex flex-col space-y-4 text-left mb-4">
        <div className="bg-blue-50 py-2 px-4 rounded-md inline-block w-full">
          <h3 className="text-sm font-semibold text-gray-800">Warehouse</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-1/2">
          <InputField label="Warehouse Location" placeholder="Enter location" disabled={!isEditMode} {...getFieldProps("warehouseLocation")} />
          <InputField label="Warehouse Area (sq ft)" placeholder="Enter area" disabled={!isEditMode} {...getFieldProps("warehouseAreaSqFt")} />
        </div>
      </div>

    </div>
  );
};

export default OutputPurchaseCentreStep;