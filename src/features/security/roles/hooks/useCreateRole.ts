import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import type { CreateRoleRequest } from "../../users/model";
import { ROLES_QUERY_KEYS } from "./useRoles";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, CreateRoleRequest>({
    mutationFn: (payload: CreateRoleRequest) => usersService.createRole(payload),
    onSuccess: () => {
      toast.success("Rol uğurla yaradıldı");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.all });
    },
  });
};

