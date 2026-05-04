import React, { useRef, useState, useEffect } from "react";
import { DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormInput, ModernDatePicker, Button } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./TrainingForm.module.css";

const FILE_ACCEPT = ".png,.jpeg,.jpg,.pdf,image/png,image/jpeg,image/jpg,application/pdf";
const isImageFile = (file: File) => file.type.startsWith("image/");

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
  onAdd: () => void;
  onClear: () => void;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({
  value,
  onChange,
  onAdd,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  // Tibbi heyət seçiləndə sertifikat sahələri aktiv olsun
  const isSertifikatEnabled = value.telimNovu?.fullName === "Tibbi heyət" || value.telimNovu?.id === "xarici";
  const files = value.uploadedFiles;

  useEffect(() => {
    const urls = files.map((f) => (isImageFile(f) ? URL.createObjectURL(f) : ""));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  const update = (part: Partial<TrainingFormValue>) => {
    onChange({ ...value, ...part });
  };

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const list = Array.from(newFiles);
    const allowed = list.filter((f) => f.type.startsWith("image/") || f.type === "application/pdf");
    update({ uploadedFiles: [...files, ...allowed] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    update({ uploadedFiles: files.filter((_, i) => i !== index) });
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
            disabled={!isSertifikatEnabled}
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
            disabled={!isSertifikatEnabled}
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
            {files.length === 0 ? (
              <div className={styles.uploadContent}>
                <PhotoIcon className={styles.uploadIcon} />
                <span className={styles.uploadText}>Bir fayl yükləyin və ya sürüşdürüb atın.</span>
                <span className={styles.allowedText}>İcazə verilir *.png, *.jpeg, *.jpg, *.pdf</span>
              </div>
            ) : (
              <div className={styles.fileList}>
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className={styles.fileItem}>
                    <div className={styles.filePreview}>
                      {previews[index] ? (
                        <img src={previews[index]} alt={file.name} className={styles.previewImg} />
                      ) : (
                        <DocumentIcon className={styles.pdfIcon} />
                      )}
                    </div>
                    <span className={styles.fileName} title={file.name}>{file.name}</span>
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
      <Button type="button" variant="secondary" className={styles.addButton} onClick={onAdd}>
          Əlavə et
        </Button>
      <Button type="button" variant="outline" className={styles.clearButton} onClick={onClear}>
          Təmizlə
        </Button>
      </div>
    </div>
  );
};
