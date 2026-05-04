import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { usersService } from "../../users/api";
import type { ChangeRoleClaimRequest } from "../../users/model";
import { ROLES_QUERY_KEYS } from "./useRoles";

export const useChangeRoleClaim = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, ChangeRoleClaimRequest>({
    mutationFn: (payload: ChangeRoleClaimRequest) => usersService.changeRoleClaim(payload),
    onSuccess: () => {
      toast.success("Səlahiyyət uğurla əlavə edildi");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEYS.all });
    },
  });
};

