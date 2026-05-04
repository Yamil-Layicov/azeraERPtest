import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormInput } from "@/shared/ui";
import {
  renewPasswordSchema,
  type RenewPasswordValues,
} from "@/features/auth/model/schema";
import { ArrowLeftIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { AUTH_CONFIG } from "@/shared/config/consts";
import { authService } from "@/features/auth/api/authService";
import styles from "@/pages/login-page/ui/Login.module.css";
import { getBackendErrorMessage } from "@/shared/api";
import type { AxiosError } from "axios";

export default function RenewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const usernameFromUrl = searchParams.get("username") || "";

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RenewPasswordValues>({
    resolver: zodResolver(renewPasswordSchema),
    defaultValues: {
      username: usernameFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RenewPasswordValues> = async (data) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!token) {
      toast.error("Token tapılmadı. Zəhmət olmasa yenidən giriş edin.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await authService.renewPassword({
        token,
        username: data.username,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      });

      if (!response.isSuccess) {
        toast.error(
          response.errorMessage || "Şifrə yenilənərkən xəta baş verdi",
        );
        return;
      }

      toast.success("Şifrə uğurla yeniləndi!");
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      navigate("/login", { replace: true });
    } catch (e) {
      toast.error(
        getBackendErrorMessage(e as AxiosError) ||
          "Şifrə yenilənərkən xəta baş verdi",
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.iconWrapper}>
          <div className={styles.lockIconCircle}>
            <LockClosedIcon className={styles.lockIcon} />
          </div>
        </div>
        <h2 className={styles.pageTitle + " " + styles.newPasswordTitle}>
          Yeni şifrə təyin edin
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <FormInput
              id="username"
              type="text"
              label="İstifadəçi adı"
              placeholder=""
              disabled={true}
              readOnly={true}
              className={styles.input}
              value={watch("username")}
              onChange={(val) => setValue("username", val)}
            />
          </div>

          <div className={styles.formGroup}>
            <FormInput
              id="newPassword"
              type="password"
              label="Yeni şifrə"
              placeholder="Yeni şifrəni daxil edin"
              className={styles.input}
              value={watch("newPassword")}
              onChange={(val) =>
                setValue("newPassword", val, { shouldValidate: true })
              }
            />
            {errors.newPassword && (
              <p className={styles.fieldError}>{errors.newPassword.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <FormInput
              id="confirmPassword"
              type="password"
              label="Yeni şifrənin təkrarı"
              placeholder="Şifrəni təkrar daxil edin"
              className={styles.input}
              value={watch("confirmPassword")}
              onChange={(val) =>
                setValue("confirmPassword", val, { shouldValidate: true })
              }
            />
            {errors.confirmPassword && (
              <p className={styles.fieldError}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.submitButton} ${styles.secondaryBtn}`}
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ArrowLeftIcon width={20} height={20} strokeWidth={3.5} />
              Geri
            </button>

            <button type="submit" className={styles.submitButton}>
              Yenilə
            </button>
          </div>
        </form>
      </div>
      <div className={styles.copyright}>
        <a
          href="https://netrone.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {/* {new Date().getFullYear()} ©  */}
          Powered By NETRONE
        </a>
      </div>
    </div>
  );
}
