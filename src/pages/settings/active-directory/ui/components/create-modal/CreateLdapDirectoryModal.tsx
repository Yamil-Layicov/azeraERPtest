import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import {
  createLdapDirectoryFormSchema,
  type CreateLdapDirectoryFormInput,
} from "../../../model/createLdapDirectorySchema";
import styles from "./CreateLdapDirectoryModal.module.css";

const defaultValues: Omit<CreateLdapDirectoryFormInput, "port" | "timeout"> & { port: string; timeout: string } = {
  name: "",
  domain: "",
  host: "",
  port: "",
  useSsl: false,
  useTls: false,
  baseDn: "",
  username: "",
  password: "",
  searchFilter: "",
  timeout: "",
  isActive: true,
};

export type CreateLdapDirectoryPayload = {
  name: string;
  domain: string;
  host: string;
  port: number;
  useSsl: boolean;
  useTls: boolean;
  baseDn: string;
  username: string;
  password: string;
  searchFilter: string;
  timeout: number;
  isActive: boolean;
};

interface CreateLdapDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLdapDirectoryPayload) => void;
  isLoading?: boolean;
}

export const CreateLdapDirectoryModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CreateLdapDirectoryModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createLdapDirectoryFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const onSubmit = (data: any) => {
    onSave({
      name: String(data.name).trim(),
      domain: String(data.domain).trim(),
      host: String(data.host).trim(),
      port: parseInt(data.port, 10),
      useSsl: data.useSsl ?? false,
      useTls: data.useTls ?? false,
      baseDn: String(data.baseDn).trim(),
      username: String(data.username).trim(),
      password: String(data.password),
      searchFilter: String(data.searchFilter).trim(),
      timeout: parseInt(data.timeout, 10),
      isActive: data.isActive ?? true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni LDAP Directory əlavə et"
      size="md"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContainer}>
          <FormInput
            label="Ad"
            id="create-ldap-name"
            type="text"
            placeholder="Məs: Active Directory"
            register={register("name")}
            required
            autoComplete="off"
            error={errors.name?.message}
          />
          <FormInput
            label="Domain"
            id="create-ldap-domain"
            type="text"
            placeholder="Məs: example.com"
            register={register("domain")}
            required
            autoComplete="off"
            error={errors.domain?.message}
          />
          <FormInput
            label="Ünvan"
            id="create-ldap-host"
            type="text"
            placeholder="Məs: ldap.example.com"
            register={register("host")}
            required
            autoComplete="off"
            error={errors.host?.message}
          />
          <FormInput
            label="Port"
            id="create-ldap-port"
            type="number"
            placeholder="Məs: 389"
            register={register("port", { min: 1, max: 9999 })}
            required
            autoComplete="off"
            error={errors.port?.message}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="create-ldap-useSsl"
                {...register("useSsl", {
                  onChange: (e) => {
                    if (e.target.checked) {
                      setValue("useTls", false);
                    }
                  },
                })}
              />
              <span>SSL istifadə et</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="create-ldap-useTls"
                {...register("useTls", {
                  onChange: (e) => {
                    if (e.target.checked) {
                      setValue("useSsl", false);
                    }
                  },
                })}
              />
              <span>TLS istifadə et</span>
            </label>
          </div>
          <FormInput
            label="Base DN"
            id="create-ldap-baseDn"
            type="text"
            placeholder="Məs: DC=example,DC=com"
            register={register("baseDn")}
            required
            autoComplete="off"
            error={errors.baseDn?.message}
          />
          <FormInput
            label="İstifadəçi adı"
            id="create-ldap-username"
            type="text"
            placeholder="Məs: admin@example.com"
            register={register("username")}
            required
            autoComplete="off"
            error={errors.username?.message}
          />
          <FormInput
            label="Şifrə"
            id="create-ldap-password"
            type="password"
            placeholder="Şifrəni daxil edin"
            register={register("password")}
            required
            autoComplete="off"
            error={errors.password?.message}
          />
          <FormInput
            label="LDAP Filter"
            id="create-ldap-searchFilter"
            type="text"
            placeholder="Məs: (objectClass=person)"
            register={register("searchFilter")}
            required
            autoComplete="off"
            error={errors.searchFilter?.message}
          />
          <FormInput
            label="Gözləmə vaxtı(Timeout)"
            id="create-ldap-timeout"
            type="number"
            placeholder="Məs: 30"
            register={register("timeout", { min: 1 })}
            required
            autoComplete="off"
            error={errors.timeout?.message}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
          <div className={styles.checkboxSingle}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                id="create-ldap-isActive"
                {...register("isActive")}
              />
              <span>Aktiv</span>
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            type="submit"
            variant="primary"
            className={styles.footerButton}
            disabled={isLoading}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerButton}
            disabled={isLoading}
          >
            Ləğv et
          </Button>
        </div>
      </form>
    </Modal>
  );
};
