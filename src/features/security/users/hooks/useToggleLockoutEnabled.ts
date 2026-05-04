import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersService } from "../api";
import { USERS_QUERY_KEYS } from "./useUsers";

export const useToggleLockoutEnabled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.toggleLockoutEnabled(userId),
    onSuccess: (_, userId) => {
      toast.success("Məhdudiyyət uğurla dəyişdirildi");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};
