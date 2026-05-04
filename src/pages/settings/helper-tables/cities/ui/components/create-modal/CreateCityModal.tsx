import { useEffect } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Button } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import {
  createCityFormSchema,
  type CreateCityFormInput,
} from "../../../model/createCitySchema";
import styles from "./CreateCityModal.module.css";

const defaultValues: CreateCityFormInput = {
  name: "",
};

export type CreateCityPayload = {
  name: string;
  countryId: number;
};

interface CreateCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCityPayload) => void;
  isLoading?: boolean;
  countryId: number;
}

export const CreateCityModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  countryId,
}: CreateCityModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCityFormInput>({
    resolver: zodResolver(createCityFormSchema) as Resolver<CreateCityFormInput>,
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<CreateCityFormInput> = (data) => {
    onSave({
      countryId,
      name: String(data.name).trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni şəhər əlavə et"
      size="sm"
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formContainer}>
          <FormInput
            label="Adı"
            id="create-city-name"
            type="text"
            placeholder="Məs: Bakı"
            register={register("name")}
            required
            autoComplete="off"
            error={errors.name?.message}
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
