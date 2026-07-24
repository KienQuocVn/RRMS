/**
 * Tenant Type Definitions
 */

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface TenantRequest {
  fullName: string;
  phone: string;
  cccd: string;
  email?: string;
  birthday?: string; // YYYY-MM-DD
  gender?: Gender;
  address?: string;
  job?: string;
  licenseDate?: string;
  placeOfLicense?: string;
  frontPhoto?: string;
  backPhoto?: string;
  role?: boolean; // true: khách chính, false: thành viên
  relationship?: string;
  typeOfTenant?: boolean;
  temporaryResidence?: boolean;
  informationVerify?: boolean;
}

export interface TenantResponse {
  tenantId: string;
  fullName: string;
  phone: string;
  cccd: string;
  email: string;
  birthday: string;
  gender: Gender;
  address: string;
  job: string;
  licenseDate: string;
  placeOfLicense: string;
  frontPhoto: string;
  backPhoto: string;
  role: boolean;
  relationship: string;
  typeOfTenant: boolean;
  temporaryResidence: boolean;
  informationVerify: boolean;
}
