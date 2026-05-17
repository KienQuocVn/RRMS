import { ApiResponse } from '@/types/common.types';
import { Profile } from '@/types/profile.types';

import { apiClient } from './client';

export interface ProfileUpdatePayload {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  birthday?: string | null;
  gender?: Profile['gender'];
  cccd?: string | null;
  address?: string | null;
  job?: string | null;
  placeOfIssue?: string | null;
  dateOfIssue?: string | null;
  avatar?: string | null;
  role?: string[];
  permissions?: string[];
}

export function normalizeProfile(profile: Partial<Profile> | null | undefined): Profile {
  return {
    username: profile?.username ?? '',
    fullName: profile?.fullName ?? profile?.fullname ?? '',
    fullname: profile?.fullname ?? profile?.fullName ?? '',
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    birthday: profile?.birthday ?? null,
    gender: profile?.gender ?? null,
    cccd: profile?.cccd ?? null,
    address: profile?.address ?? null,
    job: profile?.job ?? null,
    placeOfIssue: profile?.placeOfIssue ?? null,
    dateOfIssue: profile?.dateOfIssue ?? null,
    avatar: profile?.avatar ?? null,
    role: profile?.role ?? [],
    permissions: profile?.permissions ?? [],
  };
}

export function buildProfileUpdatePayload(
  profile: Profile,
  overrides: Partial<ProfileUpdatePayload> = {},
): ProfileUpdatePayload {
  const normalized = normalizeProfile(profile);

  return {
    username: normalized.username,
    fullName: normalized.fullName,
    phone: normalized.phone,
    email: normalized.email,
    birthday: normalized.birthday,
    gender: normalized.gender,
    cccd: normalized.cccd,
    address: normalized.address,
    job: normalized.job,
    placeOfIssue: normalized.placeOfIssue,
    dateOfIssue: normalized.dateOfIssue,
    avatar: normalized.avatar,
    role: normalized.role,
    permissions: normalized.permissions,
    ...overrides,
  };
}

export const profileService = {
  getProfile: async (username: string): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get<any, ApiResponse<Profile>>('/profile', {
      params: { username },
    });

    return {
      ...response,
      result: normalizeProfile(response.result),
    };
  },

  updateProfile: async (data: ProfileUpdatePayload): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.put<any, ApiResponse<Profile>>('/profile', data);

    return {
      ...response,
      result: normalizeProfile(response.result),
    };
  },

  changePassword: async (data: any): Promise<ApiResponse<string>> => {
    return apiClient.put('/profile/change-password', data);
  },
};
