import { useQuery } from "@tanstack/react-query";
import { authService } from "../api/authService";
import type { GetUserProfileResponseType } from "../model/schema";

export const USER_PROFILE_KEYS = {
  PROFILE: ["user", "profile"] as const,
};

export const useGetUserProfile = () => {
  return useQuery<GetUserProfileResponseType>({
    queryKey: USER_PROFILE_KEYS.PROFILE,
    queryFn: ({ signal }) => authService.getProfileInfo(signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
