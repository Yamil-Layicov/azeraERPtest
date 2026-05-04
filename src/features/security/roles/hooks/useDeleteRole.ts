import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import { ROLES_QUERY_KEYS } from "./useRoles";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (roleId: string) => usersService.deleteRole(roleId),
    onSuccess: () => {
      toast.success("Rol uğurla silindi");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.all });
    },
  });
};

