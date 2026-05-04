import React, { useRef, useState, useEffect } from "react";
import { ArrowDownTrayIcon, DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, ModernDatePicker, Button, Modal } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import styles from "./TrainingForm.module.css";

const FILE_ACCEPT =
  ".png,.jpeg,.jpg,.pdf,.doc,.docx,.xls,.xlsx,image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const isImageFile = (file: File) => file.type.startsWith("image/");
type ExistingAttachmentKind = "image" | "pdf" | "word" | "excel" | "other";

const getFileTypeByName = (fileName: string): "pdf" | "word" | "excel" | "other" => {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "word";
  if (ext === "xls" || ext === "xlsx") return "excel";
  return "other";
};

export interface TrainingFormValue {
  telimNovu: Option | null;
  kursunAdi: string;
  baslamaTarixi: Date | null;
  bitmeTarixi: Date | null;
  sertifikatTarixi: Date | null;
  sertifikatNomresi: string;
  uploadedFiles: File[];
}

export interface TrainingFormProps {
  value: TrainingFormValue;
  onChange: (value: TrainingFormValue) => void;
  errors?: {
    telimNovu?: string;
    kursunAdi?: string;
    baslamaTarixi?: string;
  };
  addButtonLabel?: string;
  isEditMode?: boolean;
  existingAttachments?: { id: string; fileName: string }[];
  onRemoveExistingAttachment?: (attachmentId: string) => void;
  onAdd: () => void;
  onClear: () => void;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({
  value,
  onChange,
  errors,
  addButtonLabel = "Əlavə et",
  isEditMode = false,
  existingAttachments = [],
  onRemoveExistingAttachment,
  onAdd,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingAttachmentMeta, setExistingAttachmentMeta] = useState<
    Record<string, { kind: ExistingAttachmentKind; previewUrl?: string }>
  >({});
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });
  const files = value.uploadedFiles;

  useEffect(() => {
    const urls = files.map((f) => (isImageFile(f) ? URL.createObjectURL(f) : ""));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  useEffect(() => {
    let isCancelled = false;
    const createdUrls: string[] = [];

    const detectExistingAttachmentMeta = async () => {
      if (existingAttachments.length === 0) {
        setExistingAttachmentMeta({});
        return;
      }

      const nextMeta: Record<string, { kind: ExistingAttachmentKind; previewUrl?: string }> = {};

      await Promise.all(
        existingAttachments.map(async ({ id: attachId }) => {
          try {
            const response = await fetch(`/api/proxy/identity/file/download/${attachId}`);
            const type = (response.headers.get("content-type") || "").toLowerCase();

            if (type.startsWith("image/")) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              createdUrls.push(url);
              nextMeta[attachId] = { kind: "image", previewUrl: url };
              return;
            }

            if (type.includes("pdf")) {
              nextMeta[attachId] = { kind: "pdf" };
              return;
            }
            if (
              type.includes("msword") ||
              type.includes("wordprocessingml")
            ) {
              nextMeta[attachId] = { kind: "word" };
              return;
            }
            if (
              type.includes("ms-excel") ||
              type.includes("spreadsheetml")
            ) {
              nextMeta[attachId] = { kind: "excel" };
              return;
            }

            nextMeta[attachId] = { kind: "other" };
          } catch {
            nextMeta[attachId] = { kind: "other" };
          }
        })
      );

      if (!isCancelled) {
        setExistingAttachmentMeta(nextMeta);
      }
    };

    void detectExistingAttachmentMeta();

    return () => {
      isCancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [existingAttachments]);

  const update = (part: Partial<TrainingFormValue>) => {
    onChange({ ...value, ...part });
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const list = Array.from(newFiles);
    const allowed = list.filter((f) => {
      if (f.type.startsWith("image/")) return true;
      const type = f.type.toLowerCase();
      return (
        type === "application/pdf" ||
        type === "application/msword" ||
        type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        type === "application/vnd.ms-excel" ||
        type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
    update({ uploadedFiles: [...files, ...allowed] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    update({ uploadedFiles: files.filter((_, i) => i !== index) });
  };

  const downloadExistingAttachment = (attachId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `/api/proxy/identity/file/download/${attachId}`;
    const matched = existingAttachments.find((x) => x.id === attachId);
    link.download = matched?.fileName || attachId;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeExistingAttachment = (attachId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExistingAttachment?.(attachId);
  };

  const handlePreview = (url: string, title: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewModal({ isOpen: true, url, title });
  };

  const downloadFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const file = files[index];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="telim-novu">
            Təlim növü
          </label>
          <EnumLookupSelect
            id="telim-novu"
            code="TrainingTypes"
            value={value.telimNovu}
            onChange={(v) => update({ telimNovu: v })}
            defaultText="Seçin"
            variant="form"
            isSearchable
            searchPlaceholder="Axtar..."
          />
          {errors?.telimNovu && <p className={styles.errorText}>{errors.telimNovu}</p>}
        </div>
        <div className={styles.fieldGroup}>
          <FormInput
            id="kursun-adi"
            type="text"
            label="Kursun adı"
            placeholder="Daxil edin"
            value={value.kursunAdi}
            onChange={(v) => update({ kursunAdi: v })}
          />
          {errors?.kursunAdi && <p className={styles.errorText}>{errors.kursunAdi}</p>}
        </div>
        <div className={styles.datesGroup}>
          <div className={styles.dateField}>
            <label className={styles.label} htmlFor="baslama-tarixi">
              Başlama tarixi
            </label>
            <ModernDatePicker
              id="baslama-tarixi"
              value={value.baslamaTarixi}
              onChange={(v) => update({ baslamaTarixi: v })}
              placeholder="dd.mm.yyyy"
            />
            {errors?.baslamaTarixi && <p className={styles.errorText}>{errors.baslamaTarixi}</p>}
          </div>
          <div className={styles.dateField}>
            <label className={styles.label} htmlFor="bitme-tarixi">
              Bitmə tarixi
            </label>
            <ModernDatePicker
              id="bitme-tarixi"
              value={value.bitmeTarixi}
              onChange={(v) => update({ bitmeTarixi: v })}
              placeholder="dd.mm.yyyy"
            />
          </div>
        </div>
      </div>

      <div className={`${styles.formRow} ${styles.formRowAlignTop}`}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sertifikat-tarixi">
            Sertifikatın tarixi<span className={styles.requiredStar}>*</span>
          </label>
          <ModernDatePicker
            id="sertifikat-tarixi"
            value={value.sertifikatTarixi}
            onChange={(v) => update({ sertifikatTarixi: v })}
            placeholder="dd.mm.yyyy"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="sertifikat-nomresi">
            Sertifikatın nömrəsi<span className={styles.requiredStar}>*</span>
          </label>
          <FormInput
            id="sertifikat-nomresi"
            type="text"
            label=""
            placeholder="Daxil edin"
            value={value.sertifikatNomresi}
            onChange={(v) => update({ sertifikatNomresi: v })}
          />
        </div>
        <div className={styles.fileDropzoneGroup}>
          <label className={styles.label}>Fayl</label>
          <div
            className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
            aria-label="Fayl yüklə"
          >
            {files.length === 0 && existingAttachments.length === 0 ? (
              <div className={styles.uploadContent}>
                <PhotoIcon className={styles.uploadIcon} />
                <span className={styles.uploadText}>Bir fayl yükləyin və ya sürüşdürüb atın.</span>
                <span className={styles.allowedText}>İcazə verilir *.png, *.jpeg, *.jpg, *.pdf, *.doc, *.docx, *.xls, *.xlsx</span>
              </div>
            ) : (
              <div className={styles.fileList}>
                {existingAttachments.map(({ id: attachId, fileName }) => (
                  <div key={`existing-${attachId}`} className={styles.fileItem}>
                    <div
                      className={styles.filePreview}
                      onClick={
                        existingAttachmentMeta[attachId]?.kind === "image" &&
                        existingAttachmentMeta[attachId]?.previewUrl
                          ? handlePreview(existingAttachmentMeta[attachId].previewUrl!, fileName)
                          : undefined
                      }
                    >
                      {existingAttachmentMeta[attachId]?.kind === "image" &&
                      existingAttachmentMeta[attachId]?.previewUrl ? (
                        <img
                          src={existingAttachmentMeta[attachId].previewUrl}
                          alt={fileName}
                          className={styles.previewImg}
                        />
                      ) : (
                        <div
                          className={`${styles.fileTypeBadge} ${
                            existingAttachmentMeta[attachId]?.kind === "pdf"
                              ? styles.fileTypePdf
                              : existingAttachmentMeta[attachId]?.kind === "word"
                                ? styles.fileTypeWord
                                : existingAttachmentMeta[attachId]?.kind === "excel"
                                  ? styles.fileTypeExcel
                                  : styles.fileTypeOther
                          }`}
                        >
                          {existingAttachmentMeta[attachId]?.kind === "pdf"
                            ? "PDF"
                            : existingAttachmentMeta[attachId]?.kind === "word"
                              ? "DOC"
                              : existingAttachmentMeta[attachId]?.kind === "excel"
                                ? "XLS"
                                : <DocumentIcon className={styles.pdfIcon} />}
                        </div>
                      )}
                    </div>
                    <span
                      className={`${styles.fileName} ${
                        existingAttachmentMeta[attachId]?.kind === "image" &&
                        existingAttachmentMeta[attachId]?.previewUrl
                          ? styles.clickableName
                          : ""
                      }`}
                      title={fileName}
                      onClick={
                        existingAttachmentMeta[attachId]?.kind === "image" &&
                        existingAttachmentMeta[attachId]?.previewUrl
                          ? handlePreview(existingAttachmentMeta[attachId].previewUrl!, fileName)
                          : undefined
                      }
                    >
                      {fileName}
                    </span>
                    <button
                      type="button"
                      className={styles.fileDownloadBtn}
                      onClick={downloadExistingAttachment(attachId)}
                      title="Yüklə"
                      aria-label="Faylı yüklə"
                    >
                      <ArrowDownTrayIcon className={styles.removeIcon} />
                    </button>
                    <button
                      type="button"
                      className={styles.fileRemoveBtn}
                      onClick={removeExistingAttachment(attachId)}
                      title="Sil"
                      aria-label="Faylı sil"
                    >
                      <XMarkIcon className={styles.removeIcon} />
                    </button>
                  </div>
                ))}
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className={styles.fileItem}>
                    <div
                      className={styles.filePreview}
                      onClick={
                        previews[index] ? handlePreview(previews[index], file.name) : undefined
                      }
                    >
                      {previews[index] ? (
                        <img src={previews[index]} alt={file.name} className={styles.previewImg} />
                      ) : (
                        <div
                          className={`${styles.fileTypeBadge} ${
                            getFileTypeByName(file.name) === "pdf"
                              ? styles.fileTypePdf
                              : getFileTypeByName(file.name) === "word"
                                ? styles.fileTypeWord
                                : getFileTypeByName(file.name) === "excel"
                                  ? styles.fileTypeExcel
                                  : styles.fileTypeOther
                          }`}
                        >
                          {getFileTypeByName(file.name) === "pdf"
                            ? "PDF"
                            : getFileTypeByName(file.name) === "word"
                              ? "DOC"
                              : getFileTypeByName(file.name) === "excel"
                                ? "XLS"
                                : <DocumentIcon className={styles.pdfIcon} />}
                        </div>
                      )}
                    </div>
                    <span
                      className={`${styles.fileName} ${previews[index] ? styles.clickableName : ""}`}
                      title={file.name}
                      onClick={
                        previews[index] ? handlePreview(previews[index], file.name) : undefined
                      }
                    >
                      {file.name}
                    </span>
                    <button type="button" className={styles.fileDownloadBtn} onClick={downloadFile(index)} title="Yüklə" aria-label="Faylı yüklə">
                      <ArrowDownTrayIcon className={styles.removeIcon} />
                    </button>
                    <button type="button" className={styles.fileRemoveBtn} onClick={removeFile(index)} title="Sil" aria-label="Faylı sil">
                      <XMarkIcon className={styles.removeIcon} />
                    </button>
                  </div>
                ))}
                <span className={styles.addMore}>+ Əlavə fayl seçin</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="training-files"
            className={styles.hiddenInput}
            accept={FILE_ACCEPT}
            multiple
            onChange={(e) => addFiles(e.target.files)}
            tabIndex={-1}
            aria-hidden
          />
        </div>
      </div>

      <div className={styles.buttonsRow}>
        <PermissionGuard
          permission={isEditMode ? PERMISSIONS.EMPLOYEE.UPDATE : PERMISSIONS.EMPLOYEE.CREATE}
        >
          <Button type="button" variant="secondary" className={styles.addButton} onClick={onAdd}>
            {addButtonLabel}
          </Button>
        </PermissionGuard>
        <Button type="button" variant="outline" className={styles.clearButton} onClick={onClear}>
          Təmizlə
        </Button>
      </div>

      <Modal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        title={previewModal.title}
        size="lg"
      >
        <div className={styles.previewModalBody}>
          <img src={previewModal.url} alt={previewModal.title} className={styles.fullPreviewImg} />
        </div>
      </Modal>
    </div>
  );
};
