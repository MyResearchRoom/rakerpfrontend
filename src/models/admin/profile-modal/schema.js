import { z } from 'zod';

const trimValue = (value) =>
  typeof value === 'string' ? value.trim() : value;

const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && trimValue(value) === '');

const optionalPattern = (regex, message) =>
  z
    .string()
    .optional()
    .refine((value) => {
      if (isEmptyValue(value)) return true;
      return regex.test(trimValue(value));
    }, { message });

const optionalDate = (message) =>
  z
    .string()
    .optional()
    .refine((value) => {
      if (isEmptyValue(value)) return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(trimValue(value));
    }, { message });

// const optionalNumber = (message) =>
//   z
//     .string()
//     .optional()
//     .refine((value) => {
//       if (isEmptyValue(value)) return true;
//       return /^\d+(\.\d+)?$/.test(trimValue(value));
//     }, { message });

const optionalNumber = (message) =>
  z.preprocess(
    (value) => {
      if (isEmptyValue(value)) return undefined;

      return typeof value === "number"
        ? value
        : Number(trimValue(value));
    },
    z.number({
      invalid_type_error: message,
    }).optional()
  );

const optionalCoordinate = (message) =>
  z
    .string()
    .optional()
    .refine((value) => {
      if (isEmptyValue(value)) return true;
      return /^-?\d+(\.\d+)?$/.test(trimValue(value));
    }, { message });


const optionalEnum = (values, message) =>
  z
    .string()
    .optional()
    .refine((value) => {
      if (isEmptyValue(value)) return true;
      return values.includes(trimValue(value));
    }, { message });

const optionalText = (message) =>
  z
    .string()
    .optional()
    .refine((value) => {
      if (isEmptyValue(value)) return true;
      return trimValue(value).length > 0;
    }, { message });

const optionalEmail = (message) =>
  z.preprocess(
    (value) => {
      if (isEmptyValue(value)) return undefined;
      return trimValue(value);
    },
    z.string().email(message).optional()
  );

const mobilePattern = /^[6-9]\d{9}$/;
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
const tanPattern = /^[A-Z]{4}[0-9]{5}[A-Z]$/i;
const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/i;
const alphanumericPattern = /^[A-Z0-9]+$/i;

// Step 1: Company Profile Schema
export const companyProfileSchema = z.object({
  fpoUniqueCode: z.string().min(1, 'FPO Unique Code is required'),
});

// Step 2: FPO Identification Schema
export const fpoIdentificationSchema = z.object({
  dateOfStartActivities: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  nameApprovalDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  moaAoAPrepDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  registrationDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  incorporationDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  cinNumber: optionalPattern(alphanumericPattern, 'CIN must contain only letters and numbers'),
  panNumber: optionalPattern(panPattern, 'Enter a valid PAN (ABCDE1234F)'),
  tanNumber: optionalPattern(tanPattern, 'Enter a valid TAN (AAAA12345A)'),
  gstApplicationDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  gstNumber: optionalPattern(gstPattern, 'Enter a valid GSTIN (29AABCT1332L1Z5)'),
  gstCertificateIssueDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
});

// Step 3: Financial & Compliance Schema
export const financialComplianceSchema = z.object({
  bankAccounts: z
    .array(
      z.object({
        bankName: optionalText('Bank name cannot be blank if provided'),
        accountNumber: optionalPattern(/^\d+$/, 'Account number should contain only digits'),
        ifscCode: optionalPattern(/^[A-Z0-9]+$/i, 'IFSC should contain only letters or numbers'),
        accountOpeningDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
      })
    )
    .optional(),
  inc20aSubmission: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  firstAgmConducted: optionalEnum(['true', 'false'], 'Select Yes or No'),
  stationeryPrepared: optionalEnum(['true', 'false'], 'Select Yes or No'),
  caAuditorName: optionalText('CA/Auditor name cannot be blank if provided'),
  caContactNumber: optionalPattern(mobilePattern, 'Enter a valid 10-digit mobile number'),
  caEmail: optionalEmail('Enter a valid email'),
});

// Step 4: FPO Officials Schema
export const fpoOfficialsSchema = z.object({
  ceoName: optionalText('CEO name cannot be blank if provided'),
  ceoContact: optionalPattern(mobilePattern, 'Enter a valid 10-digit mobile number'),
  ceoEmail: optionalEmail('Enter a valid email'),
  ceoAppointmentDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  accountantName: optionalText('Accountant name cannot be blank if provided'),
  accountantContact: optionalPattern(mobilePattern, 'Enter a valid 10-digit mobile number'),
  accountantEmail: optionalEmail('Enter a valid email'),
  accountantAppointmentDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
});

// Step 5: Membership Details Schema
export const membershipDetailsSchema = z.object({
  totalShareholderFarmers: optionalNumber('Enter a valid number'),
  totalLandholdingAcres: optionalNumber('Enter a valid number'),
  maleMembers: optionalNumber('Enter a valid number'),
  femaleMembers: optionalNumber('Enter a valid number'),
  marginalFarmers: optionalNumber('Enter a valid number'),
  smallFarmers: optionalNumber('Enter a valid number'),
  semiMediumFarmers: optionalNumber('Enter a valid number'),
  mediumFarmers: optionalNumber('Enter a valid number'),
  largeFarmers: optionalNumber('Enter a valid number'),
});

// Step 6: Share Capital Schema
export const shareCapitalSchema = z.object({
  authorizedShareCapital: optionalNumber('Enter a valid number'),
  totalShareCapitalRaised: optionalNumber('Enter a valid number'),
  totalPaidUpCapital: optionalNumber('Enter a valid number'),
});

// Step 7: Input Shop Details Schema
export const inputShopDetailsSchema = z.object({
  shopLocation: optionalText('Shop location cannot be blank if provided'),
  tehsil: optionalText('Tehsil cannot be blank if provided'),
  district: optionalText('District cannot be blank if provided'),
  shopPincode: optionalPattern(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  areaOfShopSqFt: optionalNumber('Enter a valid number'),
  distanceFromCompetitionKm: optionalNumber('Enter a valid number'),
  latitude: optionalCoordinate('Enter a valid latitude'),
  longitude: optionalCoordinate('Enter a valid longitude'),
});

// Step 8: Licenses Schema
export const licensesSchema = z.object({
  seedLicenseNumber: optionalText('Seed license number cannot be blank if provided'),
  seedValidity: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  fertilizerValidity: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  fertilizerLicenseNumber: optionalText('Fertilizer license number cannot be blank if provided'),
  pesticideLicenseNumber: optionalText('Pesticide license number cannot be blank if provided'),
  mandiLicenseNumber: optionalText('Mandi license number cannot be blank if provided'),
  pesticideValidity: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  mandiValidity: optionalDate('Enter a valid date (YYYY-MM-DD)'),
  udyamAadhaarNumber: optionalText('Udyam Aadhaar registration number must be alphanumeric with special characters'),
  udyamIssueDate: optionalDate('Enter a valid date (YYYY-MM-DD)'),
});

// Step 9: Output Purchase Centre Schema
export const outputPurchaseCentreSchema = z.object({
  mandiName: optionalText('Mandi name cannot be blank if provided'),
  mandiLocation: optionalText('Mandi location cannot be blank if provided'),
  mandiDistrict: optionalText('Mandi district cannot be blank if provided'),
  mandiLatitude: optionalCoordinate('Enter a valid latitude'),
  mandiLongitude: optionalCoordinate('Enter a valid longitude'),
  purchaseCentreLocation: optionalText('Purchase centre location cannot be blank if provided'),
  purchaseCentreAreaSqFt: optionalNumber('Enter a valid number'),
  purchaseCentreDistanceFromMandiKm: optionalNumber('Enter a valid number'),
  warehouseLocation: optionalText('Warehouse location cannot be blank if provided'),
  warehouseAreaSqFt: optionalNumber('Enter a valid number'),
});

// Step 10: Infrastructure Schema
export const infrastructureSchema = z.object({
  digitalMoistureMeter: optionalEnum(['true', 'false'], 'Select Yes or No'),
  hlMeter: optionalEnum(['true', 'false'], 'Select Yes or No'),
  bambooSampler: optionalEnum(['true', 'false'], 'Select Yes or No'),
  weighingScale100kg: optionalEnum(['true', 'false'], 'Select Yes or No'),
  weighingScale500g: optionalEnum(['true', 'false'], 'Select Yes or No'),
  otherEquipment: optionalText('Other equipment cannot be blank if provided'),
});

// Step 11: IT Infrastructure Schema
export const itInfrastructureSchema = z.object({
  laptopDesktopAvailable: optionalEnum(['true', 'false'], 'Select Yes or No'),
  internetConnectivity: optionalEnum(['true', 'false'], 'Select Yes or No'),
  printerAvailable: optionalEnum(['true', 'false'], 'Select Yes or No'),
});

// Step 12: Business Plan Schema
export const businessPlanSchema = z.object({
  businessPlanPrepared: optionalEnum(['true', 'false'], 'Select Yes or No'),
  vendorRegistered: optionalEnum(['true', 'false'], 'Select Yes or No'),
});

export const stepSchemas = {
  1: companyProfileSchema,
  2: fpoIdentificationSchema,
  3: financialComplianceSchema,
  4: fpoOfficialsSchema,
  5: membershipDetailsSchema,
  6: shareCapitalSchema,
  7: inputShopDetailsSchema,
  8: licensesSchema,
  9: outputPurchaseCentreSchema,
  10: infrastructureSchema,
  11: itInfrastructureSchema,
  12: businessPlanSchema,
};
