import { useRef, useState, useImperativeHandle, forwardRef, useEffect } from "react";
import type { SubmitErrorHandler, Path, PathValue } from "react-hook-form";
import AvatarUploader from "../../../../employee-shared/ui/avatar-uploader/AvatarUploader";
import { FormInput } from "@/shared/ui/input";
import { DocumentInfoSection } from "../../../../employee-shared/ui/document-info";
import { Button } from "@/shared/ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { AddressInfoSection } from "./components/address-info/AddressInfoSection";
import { PersonalMainInfoSection } from "./components/main-info/PersonalMainInfoSection";
import PinSearchResultModal from "@/pages/kadrlar/create-employee/ui/components/pin-search-result-modal/PinSearchResultModal";
import { usePersonalInfoForm } from "./usePersonalInfoForm";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import { useEmployeeStore } from "@/features/kadrlar/create-worker/model/useEmployeeStore";
import { usePendingWorkExperienceApproval } from "@/features/kadrlar/create-worker/hooks/usePendingWorkExperienceApproval";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import type { PersonalInfoFormValues } from "@/features/kadrlar/create-worker/model/schemas";
import { ConfirmModal } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import axios from "axios";
import type { 
  EmployeeDocument,
  NewDocumentState,
} from "../../../../employee-shared/model/types";
import toast from "react-hot-toast";
import styles from "./PersonalInfoTab.module.css";

export interface PersonalInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

export interface PersonalInfoTabProps {
  onDirtyChange?: (isDirty: boolean) => void;
  pageMode?: "add" | "details";
}

export const PersonalInfoTab = forwardRef<PersonalInfoTabHandle, PersonalInfoTabProps>(({ onDirtyChange, pageMode = "add" }, ref) => {
  const { 
    form, 
    onSubmit,
    isPinSearchResultModalOpen,
    setIsPinSearchResultModalOpen,
    pinSearchResultData,
    handleSearchByPin,
    handlePinSearchConfirm,
    handlePinSearchCancel,
    handleCompanyChangeDependentFields,
    isFinDisabled,
    handleFinClear,
    detailsStatus,
    detailsUsername,
    detailsPosition,
    detailsDepartment,
    detailsStaffCategory,
    avatarFileName,
    avatarFileSize,
    avatarPreview,
    setAvatarPreview,
  } = usePersonalInfoForm({ onDirtyChange, pageMode });

  const { watch, setValue, formState: { errors } } = form;
  const formData = watch();
  usePendingWorkExperienceApproval({ enabled: true });

  const setPhotoId = useAddEmployeeStore((state) => state.setPhotoId);
  const setRootCompanyId = useEmployeeStore((state) => state.setRootCompanyId);

  const onError: SubmitErrorHandler<PersonalInfoFormValues> = (formErrors) => {
    if (formErrors.documents) {
      toast.error(formErrors.documents.message as string);
    }
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => {
      return form.formState.isDirty;
    },
    submit: () => {
      form.handleSubmit(onSubmit, onError)();
    },
  }));

  // --- AVATAR STATE ---
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileSelect = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    setValue("avatar", file, { shouldValidate: true, shouldDirty: true });
  };

  const handleClearAvatar = () => {
    setAvatarPreview(null);
    setValue("avatar", null, { shouldDirty: true });
    setPhotoId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- 1. SƏNƏD MƏLUMATLARI ---
  const [newDocument, setNewDocument] = useState<NewDocumentState>({
    type: null, series: "", number: "", issueDate: null, expiryDate: null
  });
  const [newDocumentResetKey, setNewDocumentResetKey] = useState(0);
  const [isFinEditModalOpen, setIsFinEditModalOpen] = useState(false);
  const [finEditUsername, setFinEditUsername] = useState("");
  const [isCheckingFin, setIsCheckingFin] = useState(false);
  const [isSavingFin, setIsSavingFin] = useState(false);
  const [finCheckResult, setFinCheckResult] = useState<boolean | null>(null);
  const [documentDeleteConfirm, setDocumentDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });

  const personId = useAddEmployeeStore((state) => state.personId);

  useEffect(() => {
    setNewDocument({ type: null, series: "", number: "", issueDate: null, expiryDate: null });
    setNewDocumentResetKey((prev) => prev + 1);
  }, [personId]);

  useEffect(() => {
    setRootCompanyId(formData.sirket?.id ? String(formData.sirket.id) : null);
  }, [formData.sirket, setRootCompanyId]);

  const validateDocNumber = (num: string) => {
    const hasAddedDocs = (formData.documents || []).length > 0;
    if (!num) {
      if (hasAddedDocs) {
        return true;
      }
      toast.error("Nömrə mütləq qeyd edilməlidir");
      return false;
    }
    if (!/^\d+$/.test(num)) {
      toast.error("Nömrə yalnız rəqəmlerden ibarət olmalıdır");
      return false;
    }
    return true;
  };

  const handleAddDocument = () => {
    const isNumberValid = validateDocNumber(newDocument.number);
    if (newDocument.type && isNumberValid) {
      const current = formData.documents || [];
      setValue("documents", [...current, { ...newDocument, id: Date.now() }], { shouldDirty: true });
      setNewDocument({ type: null, series: "", number: "", issueDate: null, expiryDate: null });
      setNewDocumentResetKey((prev) => prev + 1);
    }
  };

  const handleAskRemoveDocument = (id: number) => {
    setDocumentDeleteConfirm({ isOpen: true, id });
  };

  const handleCloseDocumentDeleteConfirm = () => {
    setDocumentDeleteConfirm({ isOpen: false, id: null });
  };

  const handleConfirmRemoveDocument = () => {
    if (documentDeleteConfirm.id === null) return;
    setValue(
      "documents",
      (formData.documents || []).filter((d) => d.id !== documentDeleteConfirm.id),
      { shouldDirty: true }
    );
    handleCloseDocumentDeleteConfirm();
  };

  const handleCheckFin = async () => {
    const pin = finEditUsername.trim();
    if (!pin) {
      toast.error("FİN daxil edin");
      return;
    }

    try {
      setIsCheckingFin(true);
      const response = pageMode === "add" 
        ? await employeesService.getByPinAddEmployee(pin)
        : await employeesService.getByPin(pin);
      setFinCheckResult((response as any)?.result?.checkStatus ?? false);
    } catch (error: unknown) {
      // Some backends return "not found" as non-2xx; treat as failed check without toast.
      if (axios.isAxiosError(error)) {
        const isSuccess = ((error.response?.data as { isSuccess?: boolean } | undefined)?.isSuccess);
        if (isSuccess === false || error.response?.status === 404) {
          setFinCheckResult(false);
          return;
        }
        // HTTP xətası üçün toast interceptor tərəfindən göstərilir.
        return;
      }
      toast.error("Yoxlama zamanı xəta baş verdi");
    } finally {
      setIsCheckingFin(false);
    }
  };

  const handleSaveFin = async () => {
    const pin = finEditUsername.trim();
    if (!pin) {
      toast.error("FİN daxil edin");
      return;
    }
    if (pin.length > 7) {
      toast.error("FİN maksimum 7 simvoldan ibarət ola bilər");
      return;
    }
    if (finCheckResult === null) {
      toast.error("Əvvəlcə Yoxla düyməsinə klik edin");
      return;
    }
    if (finCheckResult === true) {
      toast.error("Bu fin artıq istifade olunur");
      return;
    }
    if (!personId) {
      toast.error("Şəxs ID-si tapılmadı");
      return;
    }

    try {
      setIsSavingFin(true);
      const response = await employeesService.editPin({ personId: String(personId), pin });
      if (response?.isSuccess) {
        handleFieldChange("fin", pin);
        setIsFinEditModalOpen(false);
        toast.success("FİN yeniləndi");
      } else {
        toast.error(response?.errorMessage || "Xəta baş verdi");
      }
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        toast.error("Xəta baş verdi");
      }
    } finally {
      setIsSavingFin(false);
    }
  };

  const handleFieldChange = <K extends Path<PersonalInfoFormValues>>(
    field: K, 
    value: PathValue<PersonalInfoFormValues, K>
  ) => {
    const hasError = !!errors[field as keyof typeof errors];
    setValue(field, value, { shouldTouch: true, shouldValidate: hasError, shouldDirty: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <PersonalMainInfoSection
          isDetailsMode={pageMode === "details"}
          value={{
            fin: formData.fin,
            sirket: formData.sirket,
            resmilesmeFormasi: formData.resmilesmeFormasi,
            vetendasliq: formData.vetendasliq,
            ad: formData.ad,
            dogumTarixi: formData.dogumTarixi,
            dogumOlkesi: formData.dogumOlkesi,
            soyad: formData.soyad,
            cinsi: formData.cinsi,
            dogumSeheri: formData.dogumSeheri || "",
            ataAdi: formData.ataAdi,
            aileVeziyyeti: formData.aileVeziyyeti,
            tovsiyeEden: formData.tovsiyeEden || "",
            status: detailsStatus,
            username: detailsUsername,
          }}
          errors={errors}
          onFieldChange={handleFieldChange}
          onFieldBlur={(field) => form.trigger(field as Path<PersonalInfoFormValues>)}
          onCompanyChange={(val) => {
            handleFieldChange("sirket", val);
            setRootCompanyId(val?.id ? String(val.id) : null);
            handleCompanyChangeDependentFields(val);
          }}
          onResmilesmeFormasiChange={(val) => handleFieldChange("resmilesmeFormasi", val)}
          onCitizenshipChange={(val) => handleFieldChange("vetendasliq", val)}
          onBirthDateChange={(date) => handleFieldChange("dogumTarixi", date)}
          onBirthCountryChange={(val) => handleFieldChange("dogumOlkesi", val)}
          onGenderChange={(val) => handleFieldChange("cinsi", val)}
          onMaritalStatusChange={(val) => handleFieldChange("aileVeziyyeti", val)}
          onFinClear={handleFinClear}
          onFinSearch={pageMode === "details" ? () => setIsFinEditModalOpen(true) : handleSearchByPin}
          isFinDisabled={isFinDisabled}
        />

        <div className={styles.avatarSide}>
          <AvatarUploader 
            preview={avatarPreview}
            initialFileName={avatarFileName}
            initialFileSize={avatarFileSize}
            onFileSelect={handleAvatarFileSelect}
            onClear={handleClearAvatar}
            onClick={() => fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
            className={styles.avatarOverride}
          />
          {errors.avatar && (
            <p className={styles.avatarError}>{errors.avatar.message as string}</p>
          )}
        </div>
      </div>

      <div className={styles.bottomSection}>
        {pageMode === "details" && (
          <div className={styles.detailsMetaRow}>
            <FormInput
              id="details-department"
              type="text"
              label="Departament / Şöbə / Bölmə"
              value={detailsDepartment}
              onChange={() => undefined}
              disabled={true}
              placeholder="-"
            />
            <FormInput
              id="details-position"
              type="text"
              label="Vəzifə"
              value={detailsPosition}
              onChange={() => undefined}
              disabled={true}
              placeholder="-"
            />
            <FormInput
              id="details-staff-category"
              type="text"
              label="Heyyət"
              value={detailsStaffCategory}
              onChange={() => undefined}
              disabled={true}
              placeholder="-"
            />
          </div>
        )}
        <AddressInfoSection
          actualCity={formData.faktikiSeher}
          actualAddress={formData.faktikiUnvan}
          registrationSameAsActual={formData.qeydiyyatEynidir}
          registrationCountry={formData.qeydiyyatOlke || null}
          registrationCity={formData.qeydiyyatSeher || ""}
          registrationAddress={formData.qeydiyyatUnvan || ""}
          onActualCityChange={(val) => handleFieldChange("faktikiSeher", val)}
          onActualAddressChange={(val) => handleFieldChange("faktikiUnvan", val)}
          onRegistrationSameAsActualChange={(checked) => setValue("qeydiyyatEynidir", checked, { shouldDirty: true })}
          onRegistrationCountryChange={(val) => handleFieldChange("qeydiyyatOlke", val)}
          onRegistrationCityChange={(val) => handleFieldChange("qeydiyyatSeher", val)}
          onRegistrationAddressChange={(val) => handleFieldChange("qeydiyyatUnvan", val)}
          onBlur={(field) => form.trigger(field as Path<PersonalInfoFormValues>)}
          errors={errors}
        />
        
        <div className={styles.documentInfoWrapper}>
          <DocumentInfoSection
            newDocument={newDocument}
            newDocumentResetKey={newDocumentResetKey}
            addedDocuments={(formData.documents || []) as EmployeeDocument[]}
            onNewDocumentChange={(field, val) => {
              setNewDocument((prev) => ({ ...prev, [field]: val }));
            }} 
            onAddDocument={handleAddDocument} 
            onRemoveDocument={handleAskRemoveDocument}
            onListDocumentChange={(id, field, val) => {
              const updated = (formData.documents || []).map((d) => d.id === id ? { ...d, [field]: val } : d);
              setValue("documents", updated, { shouldDirty: true });
            }}
            title="Sənəd məlumatları"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={documentDeleteConfirm.isOpen}
        onClose={handleCloseDocumentDeleteConfirm}
        onConfirm={handleConfirmRemoveDocument}
        title="Sənədi silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />

      <Modal
        isOpen={isFinEditModalOpen}
        onClose={() => setIsFinEditModalOpen(false)}
        title="FİN"
        size="md"
      >
        <div className={styles.finEditModalBody}>
          <div className={styles.finEditInputRow}>
            <div className={styles.finEditInputWrap}>
              <FormInput
                id="fin-edit-username"
                label=""
                type="text"
                placeholder="FİN daxil edin"
                value={finEditUsername}
                maxLength={7}
                onChange={(val) => {
                  setFinEditUsername(val.toUpperCase().slice(0, 7));
                  if (finCheckResult !== null) setFinCheckResult(null);
                }}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className={styles.finEditCheckButton}
              onClick={handleCheckFin}
            >
              {isCheckingFin ? "Yoxlanır..." : "Yoxla"}
            </Button>
            {finCheckResult !== null && (
              finCheckResult ? (
                <XCircleIcon className={`${styles.finCheckIcon} ${styles.finCheckFail}`} />
              ) : (
                <CheckCircleIcon className={`${styles.finCheckIcon} ${styles.finCheckSuccess}`} />
              )
            )}
          </div>
          {finCheckResult === true && (
            <p className={styles.finCheckErrorText}>Bu fin artıq istifade olunur</p>
          )}
          <div className={styles.finEditFooter}>
            <Button
              type="button"
              variant="primary"
              className={styles.finEditSaveButton}
              onClick={handleSaveFin}
              disabled={isSavingFin || isCheckingFin || finCheckResult !== false}
            >
              {isSavingFin ? "Yadda saxlanır..." : "Yadda saxla"}
            </Button>
          </div>
        </div>
      </Modal>

      {pageMode !== "details" && (
        <PinSearchResultModal
          isOpen={isPinSearchResultModalOpen}
          onClose={() => setIsPinSearchResultModalOpen(false)}
          onConfirm={handlePinSearchConfirm}
          onCancel={handlePinSearchCancel}
          data={pinSearchResultData}
        />
      )}
    </div>
  );
});

PersonalInfoTab.displayName = "PersonalInfoTab";


PersonalInfoTab.displayName = "PersonalInfoTab";
