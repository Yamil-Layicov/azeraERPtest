import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersService } from "../api";
import type { ChangeUserRoleRequest } from "../model";
import { USERS_QUERY_KEYS } from "./useUsers";

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeUserRoleRequest) => usersService.changeUserRole(payload),
    onSuccess: () => {
      toast.success("Rol uğurla dəyişdirildi");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};
