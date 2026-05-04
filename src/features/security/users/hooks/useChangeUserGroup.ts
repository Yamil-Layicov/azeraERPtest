import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersService } from "../api";
import type { ChangeUserGroupRequest } from "../model";
import { USERS_QUERY_KEYS } from "./useUsers";

export const useChangeUserGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeUserGroupRequest) => usersService.changeUserGroup(payload),
    onSuccess: () => {
      toast.success("Qrup uğurla dəyişdirildi");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
    },
  });
};
