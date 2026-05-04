import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, FormInput, Button, FormTextarea } from "@/shared/ui";
import { ROUTES } from "@/app/routes/consts";
import styles from "./AddUser.module.css";

export const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    note: "",
  });

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleClear = useCallback(() => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      note: "",
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.CRM.CUSTOMERS.ALL_LIST.LINK);
  };
  return (
    <div className={styles.container}>
      <PageHeader title="Yeni müştəri əlavə et" />

      <div className={styles.pageWrapper}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            style={{ display: "none" }}
            type="text"
            name="fakeusernameremembered"
          />
          <input
            style={{ display: "none" }}
            type="password"
            name="fakepasswordremembered"
          />

          <div className={styles.formGrid}>
            <div className={styles.formColumn}>
              <div className={styles.fieldGroup}>
                <FormInput
                  id="fullName"
                  type="text"
                  label="Ad, Soyad"
                  placeholder="Ad daxil edin"
                  value={formData.fullName}
                  onChange={(val) => handleInputChange("fullName", val)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className={styles.fieldGroup}>
                <FormInput
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Email daxil edin"
                  value={formData.email}
                  onChange={(val) => handleInputChange("email", val)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.fieldGroup}>
                <FormInput
                  id="password"
                  type="password"
                  label="Şifrə"
                  placeholder="Şifrə daxil edin"
                  value={formData.password}
                  onChange={(val) => handleInputChange("password", val)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.fieldGroup}>
                <FormTextarea
                  id="note"
                  label="Qeyd"
                  placeholder="Qeyd daxil edin..."
                  value={formData.note}
                  onChange={(val) => handleInputChange("note", val)}
                  className={styles.textareaField}
                />
              </div>
            </div>

            {/* Sağ Sütun */}
            <div className={styles.formColumn}>
              <div className={styles.fieldGroup}>
                <FormInput
                  id="username"
                  type="text"
                  label="İstifadəçi adı"
                  placeholder="İstifadəçi adı daxil edin"
                  value={formData.username}
                  onChange={(val) => handleInputChange("username", val)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className={styles.fieldGroup}>
                <FormInput
                  id="phone"
                  type="text"
                  label="Telefon"
                  placeholder="Telefon daxil edin"
                  value={formData.phone}
                  onChange={(val) => handleInputChange("phone", val)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.fieldGroup}>
                <FormInput
                  id="confirmPassword"
                  type="password"
                  label="Şifrəni təsdiqlə"
                  placeholder="Şifrəni təkrar daxil edin"
                  value={formData.confirmPassword}
                  onChange={(val) => handleInputChange("confirmPassword", val)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              className={styles.submitBtn}
            >
              Əlavə et
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              className={styles.clearBtn}
            >
              Təmizlə
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
