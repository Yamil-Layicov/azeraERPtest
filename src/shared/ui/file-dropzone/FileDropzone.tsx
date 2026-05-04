import { useRef, useState, useEffect } from "react";
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "@/shared/ui";
import styles from "./FileDropzone.module.css";

const FILE_ACCEPT =
  ".png,.jpeg,.jpg,.pdf,image/png,image/jpeg,image/jpg,application/pdf";
const isImageFile = (file: File) => file.type.startsWith("image/");

type FileDropzoneProps = {
  id: string;
  label: string;
  value?: File[] | null;
  onChange?: (files: File[] | null) => void;
  className?: string;
  multiple?: boolean;
  labelClassName?: string;
  error?: string | null;
  existingAttachments?: { id: string; fileName: string }[];
  onRemoveExistingAttachment?: (attachmentId: string) => void;
};

const EMPTY_FILES: File[] = [];
const EMPTY_ATTACHMENTS: { id: string; fileName: string }[] = [];

export const FileDropzone = ({
  id,
  label,
  value,
  onChange,
  className = "",
  multiple = true,
  labelClassName = "",
  error,
  existingAttachments,
  onRemoveExistingAttachment,
}: FileDropzoneProps) => {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingPreviews, setExistingPreviews] = useState<Record<string, string>>({});
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = value !== undefined ? value || EMPTY_FILES : internalFiles;
  const existingAttachmentsSafe = existingAttachments ?? EMPTY_ATTACHMENTS;

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = files.map((f) =>
      isImageFile(f) ? URL.createObjectURL(f) : "",
    );
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  useEffect(() => {
    let isCancelled = false;
    const createdUrls: string[] = [];

    const loadExistingPreviews = async () => {
      if (existingAttachmentsSafe.length === 0) {
        setExistingPreviews({});
        return;
      }
      const next: Record<string, string> = {};
      await Promise.all(
        existingAttachmentsSafe.map(async ({ id }) => {
          try {
            const response = await fetch(`/api/proxy/identity/file/download/${id}`);
            const type = (response.headers.get("content-type") || "").toLowerCase();
            if (!type.startsWith("image/")) return;
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            next[id] = url;
          } catch {
          }
        }),
      );
      if (!isCancelled) {
        setExistingPreviews(next);
      }
    };
    void loadExistingPreviews();
    return () => {
      isCancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [existingAttachmentsSafe]);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const list = Array.from(newFiles);
    const allowed = list.filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );

    let updatedFiles: File[];
    if (multiple) {
      updatedFiles = [...files, ...allowed];
    } else {
      updatedFiles = allowed.slice(0, 1);
    }

    if (onChange) {
      onChange(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      setInternalFiles(updatedFiles);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedFiles = files.filter((_, i) => i !== index);

    if (onChange) {
      onChange(updatedFiles.length > 0 ? updatedFiles : null);
    } else {
      setInternalFiles(updatedFiles);
    }
  };

  const downloadExistingAttachment = (attachmentId: string, fileName: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `/api/proxy/identity/file/download/${attachmentId}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeExistingAttachment = (attachmentId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExistingAttachment?.(attachmentId);
  };

  return (
    <div className={`${styles.fileDropzoneGroup} ${className}`}>
      <label className={`${styles.label} ${labelClassName}`}>{label}</label>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Fayl yüklə"
      >
        {files.length === 0 && existingAttachmentsSafe.length === 0 ? (
          <div className={styles.uploadContent}>
            <PhotoIcon className={styles.uploadIcon} />
            <span className={styles.uploadText}>
              Bir fayl yükləyin və ya sürüşdürüb atın.
            </span>
            <span className={styles.allowedText}>
              İcazə verilir *.png, *.jpeg, *.jpg, *.pdf
            </span>
          </div>
        ) : (
          <div className={styles.fileList}>
            {existingAttachmentsSafe.map(({ id: attachmentId, fileName }) => {
              const existingPreviewUrl = existingPreviews[attachmentId];
              return (
              <div key={`existing-${attachmentId}`} className={styles.fileItem}>
                <div
                  className={styles.filePreview}
                  onClick={
                    existingPreviewUrl
                      ? (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            isOpen: true,
                            url: existingPreviewUrl,
                            title: fileName,
                          });
                        }
                      : undefined
                  }
                >
                  {existingPreviewUrl ? (
                    <img
                      src={existingPreviewUrl}
                      alt={fileName}
                      className={styles.previewImg}
                    />
                  ) : (
                    <DocumentIcon className={styles.pdfIcon} />
                  )}
                </div>
                <span
                  className={`${styles.fileName} ${existingPreviewUrl ? styles.clickableName : ""}`}
                  title={fileName}
                  onClick={
                    existingPreviewUrl
                      ? (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            isOpen: true,
                            url: existingPreviewUrl,
                            title: fileName,
                          });
                        }
                      : undefined
                  }
                >
                  {fileName}
                </span>
                <button
                  type="button"
                  className={styles.fileRemoveBtn}
                  onClick={downloadExistingAttachment(attachmentId, fileName)}
                  title="Yüklə"
                  aria-label="Faylı yüklə"
                >
                  <ArrowDownTrayIcon className={styles.removeIcon} />
                </button>
                <button
                  type="button"
                  className={styles.fileRemoveBtn}
                  onClick={removeExistingAttachment(attachmentId)}
                  title="Sil"
                  aria-label="Faylı sil"
                >
                  <XMarkIcon className={styles.removeIcon} />
                </button>
              </div>
            );
            })}
            {files.map((file, index) => {
              const previewUrl = previews[index];
              return (
              <div key={`${file.name}-${index}`} className={styles.fileItem}>
                <div
                  className={styles.filePreview}
                  onClick={
                    previewUrl
                      ? (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            isOpen: true,
                            url: previewUrl,
                            title: file.name,
                          });
                        }
                      : undefined
                  }
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className={styles.previewImg}
                    />
                  ) : (
                    <DocumentIcon className={styles.pdfIcon} />
                  )}
                </div>
                <span
                  className={`${styles.fileName} ${previewUrl ? styles.clickableName : ""}`}
                  title={file.name}
                  onClick={
                    previewUrl
                      ? (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            isOpen: true,
                            url: previewUrl,
                            title: file.name,
                          });
                        }
                      : undefined
                  }
                >
                  {file.name}
                </span>
                <button
                  type="button"
                  className={styles.fileRemoveBtn}
                  onClick={removeFile(index)}
                  title="Sil"
                  aria-label="Faylı sil"
                >
                  <XMarkIcon className={styles.removeIcon} />
                </button>
              </div>
            );
            })}
            <span className={styles.addMore}>+ Əlavə fayl seçin</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        className={styles.hiddenInput}
        accept={FILE_ACCEPT}
        multiple={multiple}
        onChange={(e) => addFiles(e.target.files)}
        tabIndex={-1}
        aria-hidden
      />
      {error && <span className={styles.errorText}>{error}</span>}
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
