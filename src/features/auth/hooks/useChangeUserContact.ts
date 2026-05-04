import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { toast } from "react-hot-toast";

export const useChangeUserContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { type: string; value: string }) =>
      authService.changeUserContact(payload),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Məlumat uğurla yeniləndi");
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        queryClient.invalidateQueries({ queryKey: ["lookups", "all"] });
      }
    },
  });
};
