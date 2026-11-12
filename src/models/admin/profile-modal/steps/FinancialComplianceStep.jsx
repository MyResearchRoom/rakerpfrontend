import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import InputField from '../../../../components/comman/InputField';
import SelectField from '../../../../components/comman/SelectField';
import ButtonComponent from '../../../../components/comman/ButtonComponent';

const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];

const createEmptyBankAccount = () => ({
  id: Date.now(),
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  accountOpeningDate: "",
});

const normalizeBankAccounts = (accounts) => {
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return [createEmptyBankAccount()];
  }

  return accounts.map((bank, index) => ({
    id: bank.id || `${Date.now()}-${index}`,
    bankName: bank.bankName || "",
    accountNumber: bank.accountNumber || "",
    ifscCode: bank.ifscCode || "",
    accountOpeningDate: bank.accountOpeningDate || "",
  }));
};

const getBankAccountsForSubmit = (accounts) =>
  accounts.map(({ bankName, accountNumber, ifscCode, accountOpeningDate }) => ({
    bankName,
    accountNumber,
    ifscCode,
    accountOpeningDate,
  }));

const FinancialComplianceStep = ({ isEditMode }) => {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const formBankAccounts = watch("bankAccounts");

  const [bankAccounts, setBankAccounts] = useState(() =>
    normalizeBankAccounts(formBankAccounts)
  );

  const [editingBankId, setEditingBankId] = useState(
    bankAccounts[0].id
  );

  const handleAddBank = () => {
    const newBank = createEmptyBankAccount();

    setBankAccounts((prev) => [...prev, newBank]);
    setEditingBankId(newBank.id);
  };

  const handleRemoveBank = (id) => {
    setBankAccounts((prev) =>
      prev.filter((bank) => bank.id !== id)
    );

    if (editingBankId === id) {
      setEditingBankId(null);
    }
  };

  const handleBankChange = (id, field, value) => {
    setBankAccounts((prev) =>
      prev.map((bank) =>
        bank.id === id
          ? { ...bank, [field]: value }
          : bank
      )
    );
  };

  useEffect(() => {
    const submitBankAccounts = getBankAccountsForSubmit(bankAccounts);
    const firstBankAccount = submitBankAccounts[0] || {};

    setValue("bankAccounts", submitBankAccounts, { shouldDirty: true });
  }, [bankAccounts, setValue]);

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-300">

      {/* Row 1 */}
      {/* BANK DETAILS SECTION */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">Bank Details</p>

          <ButtonComponent
            handleButtonClick={handleAddBank}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded"
          >
            <Plus size={16} strokeWidth={3} />
            Add Bank
          </ButtonComponent>
        </div>

        {bankAccounts.map((bank, index) => (
          <div
            key={bank.id}
            className={`border p-4 rounded-xl transition-all duration-200 ${editingBankId === bank.id
              ? "bg-white shadow-md border-blue-300"
              : "bg-gray-100"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between pb-3 font-semibold">
              <p>Bank Account {index + 1}</p>

              <div className="flex gap-2 items-center">
                <Pencil
                  size={16}
                  className="cursor-pointer text-blue-600 hover:text-blue-700"
                  onClick={() =>
                    setEditingBankId(
                      editingBankId === bank.id ? null : bank.id
                    )
                  }
                />

                {bankAccounts.length > 1 && (
                  <Trash2
                    size={16}
                    className="cursor-pointer text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveBank(bank.id)}
                  />
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                label="Bank Name"
                value={bank.bankName}
                disabled={editingBankId !== bank.id}
                onChange={(e) =>
                  handleBankChange(
                    bank.id,
                    "bankName",
                    e.target.value
                  )
                }
                placeholder="Enter bank name"
              />

              <InputField
                label="Account Number"
                value={bank.accountNumber}
                disabled={editingBankId !== bank.id}
                onChange={(e) =>
                  handleBankChange(
                    bank.id,
                    "accountNumber",
                    e.target.value
                  )
                }
                placeholder="Enter account number"
              />

              <InputField
                label="IFSC Code"
                value={bank.ifscCode}
                disabled={editingBankId !== bank.id}
                onChange={(e) =>
                  handleBankChange(
                    bank.id,
                    "ifscCode",
                    e.target.value
                  )
                }
                placeholder="SBIN0001234"
              />

              <InputField
                label="Account Opening Date"
                type="date"
                value={bank.accountOpeningDate}
                disabled={editingBankId !== bank.id}
                onChange={(e) =>
                  handleBankChange(
                    bank.id,
                    "accountOpeningDate",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputField
          label="INC-20A Submission"
          name="inc20aSubmission"
          type="date"
          placeholder="dd-mm-yyyy"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />

        <Controller
          name="firstAgmConducted"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <SelectField
              label="First AGM Conducted"
              name={field.name}
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              options={yesNoOptions}
              optionLabel="Select status"
              errorMessage={errors.firstAgmConducted?.message}
              disabled={!isEditMode}
            />
          )}
        />

        <Controller
          name="stationeryPrepared"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <SelectField
              label="Stationery Prepared"
              name={field.name}
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              options={yesNoOptions}
              optionLabel="Select status"
              errorMessage={errors.stationeryPrepared?.message}
              disabled={!isEditMode}
            />
          )}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputField
          label="CA/Auditor Name"
          name="caAuditorName"
          placeholder="Enter CA name"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="CA Contact Number"
          name="caContactNumber"
          placeholder="+91 98765 43210"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
        <InputField
          label="CA Email"
          name="caEmail"
          type="email"
          placeholder="ca@example.com"
          register={register}
          errors={errors}
          disabled={!isEditMode}
        />
      </div>

    </div>
  );
};

export default FinancialComplianceStep;
