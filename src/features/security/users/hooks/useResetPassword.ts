import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersService } from "../api";
import type { ResetPasswordRequest } from "../model";
import { USERS_QUERY_KEYS } from "./useUsers";

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => usersService.resetPassword(payload),
    onSuccess: () => {
      toast.success("Şifrə uğurla sıfırlandı");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};
