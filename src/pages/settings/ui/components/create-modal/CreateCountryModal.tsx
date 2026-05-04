import { useEffect } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import {
  createCountryFormSchema,
  type CreateCountryFormInput,
} from "../../../active-directory/model/createCountrySchema";
import styles from "./CreateCountryModal.module.css";

const defaultValues: CreateCountryFormInput = {
  name: "",
  code: "",
  sortOrder: 0,
  nativeName: "",
  phoneCode: "",
  currencyCode: "",
};

export type CreateCountryPayload = {
  code: string;
  name: string;
  nativeName: string | null;
  phoneCode: string | null;
  currencyCode: string | null;
  sortOrder: number | null;
};

interface CreateCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCountryPayload) => void;
  isLoading?: boolean;
}

export const CreateCountryModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CreateCountryModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCountryFormInput>({
    resolver: zodResolver(createCountryFormSchema) as Resolver<CreateCountryFormInput>,
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<CreateCountryFormInput> = (data) => {
    // Resolver validasiyadan keçən məlumatı verir; boş sahələri null göndəririk (yenidən parse etməyin – schema girişi null qəbul etmir)
    onSave({
      code: String(data.code).trim().toUpperCase(),
      name: String(data.name).trim(),
      nativeName: data.nativeName === "" || data.nativeName == null ? null : String(data.nativeName).trim(),
      phoneCode: data.phoneCode === "" || data.phoneCode == null ? null : String(data.phoneCode).trim(),
      currencyCode:
        data.currencyCode === "" || data.currencyCode == null
          ? null
          : String(data.currencyCode).trim().toUpperCase(),
      sortOrder:
        typeof data.sortOrder === "number" && !Number.isNaN(data.sortOrder) ? data.sortOrder : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni ölkə əlavə et"
      size="sm"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContainer}>
          <FormInput
            label="Ölkə adı"
            id="create-country-name"
            type="text"
            placeholder="Məs: Azərbaycan"
            register={register("name")}
            required
            autoComplete="off"
            error={errors.name?.message}
          />
          <FormInput
            label="Kod"
            id="create-country-code"
            type="text"
            placeholder="Məs: AZE"
            register={register("code")}
            required
            autoComplete="off"
            error={errors.code?.message}
          />
          <FormInput
            label="Sıra nömrəsi"
            id="create-country-sortOrder"
            type="number"
            placeholder="Məs: 1"
            register={register("sortOrder", { valueAsNumber: true })}
            autoComplete="off"
            error={errors.sortOrder?.message}
          />
          <FormInput
            label="Yerli ad"
            id="create-country-nativeName"
            type="text"
            placeholder="Məs: Azərbaycan"
            register={register("nativeName")}
            autoComplete="off"
            error={errors.nativeName?.message}
          />
          <FormInput
            label="Telefon kodu"
            id="create-country-phoneCode"
            type="text"
            placeholder="Məs: +994"
            register={register("phoneCode")}
            autoComplete="off"
            error={errors.phoneCode?.message}
          />
          <FormInput
            label="Valyuta"
            id="create-country-currencyCode"
            type="text"
            placeholder="Məs: AZN"
            register={register("currencyCode")}
            autoComplete="off"
            error={errors.currencyCode?.message}
          />
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
