import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { toast } from "react-hot-toast";

export const useSentConfirmCode = () => {
  return useMutation({
    mutationFn: (type: "Email" | "Mobile") => authService.sentConfirmCode(type),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.success("Təsdiq kodu göndərildi");
      }
    },
  });
};
