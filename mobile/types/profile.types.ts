import { Gender } from './auth.types';

export interface Profile {
  username: string;
  fullName: string;
  fullname?: string;
  phone: string;
  email: string;
  birthday?: string | null;
  gender?: Gender | null;
  cccd?: string | null;
  address?: string | null;
  job?: string | null;
  placeOfIssue?: string | null;
  dateOfIssue?: string | null;
  avatar?: string | null;
  role?: string[];
  permissions?: string[];
}
