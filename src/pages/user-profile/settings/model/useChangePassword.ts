import { useState, useEffect } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import type { MeResponseType } from "@/features/auth/model/schema";
import { changePasswordFormSchema } from "@/features/auth/model/schema";
import { authService } from "@/features/auth/api/authService";
import { toast } from "react-hot-toast";

interface FormData {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useChangePassword = () => {
  const { data: meData } = useUser();
  const typedMeData = meData as MeResponseType | undefined;
  const user = typedMeData?.result?.user;

  const [formData, setFormData] = useState<FormData>({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      const displayName = user.fullname || user.username || "";
      setFormData((prev) => ({ ...prev, username: displayName }));
    }
  }, [user]);

  const validateField = (fieldName: string, updatedFormData: FormData) => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: updatedFormData.currentPassword,
      newPassword: updatedFormData.newPassword,
      confirmNewPassword: updatedFormData.confirmPassword,
    });

    const newErrors: Record<string, string> = { ...errors };

    if (!result.success) {
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        const displayField = field === "confirmNewPassword" ? "confirmPassword" : field;

        if (fieldName === "newPassword") {
          if (displayField === "newPassword") {
            newErrors[displayField] = error.message;
          }
          if (displayField === "confirmPassword" && touchedFields.has("confirmPassword")) {
            newErrors[displayField] = error.message;
          }
        } else if (fieldName === "confirmPassword") {
          if (displayField === "confirmPassword") {
            newErrors[displayField] = error.message;
          }
        } else if (displayField === fieldName) {
          newErrors[displayField] = error.message;
        }
      });
    } else {
      if (fieldName === "newPassword") {
        delete newErrors.newPassword;
        if (updatedFormData.newPassword === updatedFormData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
      } else if (fieldName === "confirmPassword") {
        delete newErrors.confirmPassword;
      } else {
        delete newErrors[fieldName];
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (name: string, value: string) => {
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    setTouchedFields((prev) => new Set(prev).add(name));
    
    validateField(name, updatedFormData);
  };

  const validateForm = () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmPassword,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        const displayField = field === "confirmNewPassword" ? "confirmPassword" : field;
        if (displayField) {
          newErrors[displayField] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });

      if (!response.isSuccess) {
        toast.error(response.errorMessage || "Şifrə dəyişdirilərkən xəta baş verdi");
        return;
      }

      toast.success("Şifrə uğurla dəyişdirildi");

      setFormData({
        username: formData.username,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setTouchedFields(new Set());
    } catch (error) {
      console.error("Şifrə dəyişdirilərkən xəta baş verdi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};

