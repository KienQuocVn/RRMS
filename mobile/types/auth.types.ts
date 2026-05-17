/**
 * Auth Type Definitions
 */

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type UserType = 'CUSTOMER' | 'HOST' | 'BROKER';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
  username: string;
  fullName: string;
  fullname?: string;
  phone: string;
  email: string;
  avatar?: string | null;
  birthday?: string | null;
  gender?: Gender | null;
  cccd?: string | null;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isAuthenticated: boolean;
}

export interface RegisterRequest {
  username: string;
  phone: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthenticationRegisterRequest {
  gmail: string;
  code?: string;
}

export interface ChangePasswordByEmailRequest {
  email: string;
  newPassword?: string;
  code?: string;
}
