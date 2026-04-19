import { Gender } from './auth.types';

/**
 * Profile Type Definitions
 */

export interface Profile {
  username: string;
  fullname: string;
  phone: string;
  email: string;
  birthday: string;
  gender: Gender;
  cccd: string;
  avatar: string;
  role: string[];
  permissions: string[];
}
