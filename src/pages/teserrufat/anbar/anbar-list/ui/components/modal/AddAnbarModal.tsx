import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button, FormInput, CustomSelect } from "@/shared/ui";
import styles from "./AddAnbarModal.module.css";
import type { Warehouse } from "../../../models/types";

interface AddAnbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormValues) => void;
}

type FormValues = Omit<Warehouse, "id" | "createdAt">;

const warehouseTypeOptions = [
  { id: "Central", label: "Mərkəzi" },
  { id: "Distribution", label: "Paylayıcı" },
  { id: "Retail", label: "Pərakəndə" },
  { id: "ColdStorage", label: "Soyuq Anbar" },
];

const statusOptions = [
  { id: "Active", label: "Aktiv" },
  { id: "Inactive", label: "Deaktiv" },
];

export const AddAnbarModal: React.FC<AddAnbarModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: "Active",
      type: "Central",
      area: 0,
      capacity: 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Yeni Anbar Əlavə et"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGrid}>
          <FormInput
            label="Anbar Adı"
            id="name"
            placeholder="Anbar adını daxil edin"
            register={register("name", { required: "Anbar adı mütləqdir" })}
            error={errors.name?.message}
            required
            type="text"
          />

          <FormInput
            label="Şirkət"
            id="company"
            placeholder="Şirkət adını daxil edin"
            register={register("company", { required: "Şirkət adı mütləqdir" })}
            error={errors.company?.message}
            required
            type="text"
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Anbar Növü <span className="required-star">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Anbar növü mütləqdir" }}
              render={({ field }) => (
                <CustomSelect
                  options={warehouseTypeOptions}
                  value={warehouseTypeOptions.find(
                    (opt) => opt.id === field.value,
                  ) ?? null}
                  onChange={(val) => field.onChange(val?.id)}
                  error={errors.type?.message}
                  defaultText=""
                />
              )}
            />
          </div>

          <FormInput
            label="Məsul Şəxs"
            id="manager"
            placeholder="Məsul şəxsin adını daxil edin"
            register={register("manager", { required: "Məsul şəxs mütləqdir" })}
            error={errors.manager?.message}
            required
            type="text"
          />

          <FormInput
            label="Sahə (m²)"
            id="area"
            type="number"
            placeholder="Sahəni daxil edin"
            register={register("area", { valueAsNumber: true })}
          />

          <FormInput
            label="Tutum (vahid)"
            id="capacity"
            type="number"
            placeholder="Tutumu daxil edin"
            register={register("capacity", { valueAsNumber: true })}
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Status <span className="required-star">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status mütləqdir" }}
              render={({ field }) => (
                <CustomSelect
                  options={statusOptions}
                  value={
                    statusOptions.find((opt) => opt.id === field.value) ?? null
                  }
                  onChange={(val) => field.onChange(val?.id)}
                  error={errors.status?.message}
                  defaultText=""
                />
              )}
            />
          </div>

          {/* <div className={styles.fullWidth}> */}
            <FormInput
              label="Ünvan"
              id="location"
              placeholder="Anbarın yerləşdiyi ünvanı daxil..."
              register={register("location")}
              required
              type="text"
            />
          {/* </div> */}
        </div>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose} type="button">
            Ləğv et
          </Button>
          <Button variant="primary" type="submit">
            Yadda saxla
          </Button>
        </div>
      </form>
    </Modal>
  );
};
