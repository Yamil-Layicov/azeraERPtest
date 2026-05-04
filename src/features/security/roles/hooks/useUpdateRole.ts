import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import type { UpdateRoleRequest } from "../../users/model";
import { ROLES_QUERY_KEYS } from "./useRoles";

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, UpdateRoleRequest>({
    mutationFn: (payload: UpdateRoleRequest) => usersService.updateRole(payload),
    onSuccess: () => {
      toast.success("Rol uğurla yeniləndi");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.all });
    },
  });
};

