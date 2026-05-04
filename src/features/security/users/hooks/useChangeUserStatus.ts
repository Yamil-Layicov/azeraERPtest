import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersService } from "../api";
import { USERS_QUERY_KEYS } from "./useUsers";

interface ChangeUserStatusPayload {
  userId: string;
  isActive: boolean;
}

export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: ChangeUserStatusPayload) =>
      usersService.changeUserStatus(userId, isActive),
    onSuccess: (_, { userId }) => {
      toast.success("Status uğurla dəyişdirildi");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};
