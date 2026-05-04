import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { toast } from "react-hot-toast";

export const useConfirmCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, code }: { type: "email" | "phone"; code: string }) =>
      type === "email" ? authService.confirmEmail(code) : authService.confirmPhoneNumber(code),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Təsdiqlənmə uğurla başa çatdı");
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      }
    },
  });
};
