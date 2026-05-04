import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FormInput } from "@/shared/ui";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginFormSchema, type LoginFormValues } from "@/features/auth/model/schema";
import { ROUTES } from "@/app/routes/consts";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import styles from "./Login.module.css";
import type { AxiosError } from "axios";


export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    login(data, {
      onError: (error) => {
        const message = getBackendErrorMessage(error as AxiosError) || "Giriş zamanı xəta baş verdi";
        setError("root", {
          type: "manual",
          message,
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img 
            src={`${import.meta.env.BASE_URL}images/login/azera.svg`} 
            alt="Azera Holding" 
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className={styles.formGroup}>
            <FormInput
              id="username"
              type="text"
              label="İstifadəçi adı"
              placeholder="İstifadəçi adı"
              className={styles.input}
              register={register("username")}
            />
            {errors.username && <p className={styles.fieldError}>{errors.username.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <FormInput
              id="password"
              type="password"
              label="Şifrə"
              placeholder="********"
              className={styles.input}
              register={register("password")}
            />
            {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
          </div>

          <div className={styles.optionsContainer}>
            <label htmlFor="rememberMe" className={styles.checkboxLabel}>
              <input 
                 id="rememberMe" 
                 type="checkbox" 
                 {...register("rememberMe")}
              />
              Yadda saxla
            </label>
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD.LINK}
              className={styles.forgotPassword}
            >
              Şifrəni unutmusan?
            </Link>
          </div>

          {errors.root && (
            <div className={styles.errorMessage}>
              <p>{errors.root.message}</p>
            </div>
          )}

          <button disabled={isPending} type="submit" className={styles.submitButton}>
            {isPending ? <div className={styles.spinner}></div> : "Daxil ol"}
          </button>
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