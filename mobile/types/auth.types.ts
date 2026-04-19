/**
 * Auth Type Definitions
 */

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface LoginRequest {
  phone: string;
  password?: string; // Tùy chọn nếu dùng OTP hoặc mật khẩu
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
  username: string;
  fullname: string;
  phone: string;
  email: string;
  avatar: string;
  birthday: string; // LocalDate -> string
  gender: Gender;
  cccd: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: LoginResponse | null;
  isAuthenticated: boolean;
}
