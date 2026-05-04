import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MdZoomOutMap } from "react-icons/md";
import type { ChangeEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { Modal } from "@/shared/ui/modal/base";
import styles from "./AvatarUploader.module.css";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"] as const;
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAllowedImageFile(file: File): boolean {
  if (
    ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return true;
  }
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

interface AvatarUploaderProps {
  preview?: string | null;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileSelect?: (file: File | null) => void;
  onClear?: () => void;
  onClick?: () => void;
  fileInputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
  isUploading?: boolean;
  initialFileName?: string | null;
  initialFileSize?: number | null;
}

export default function AvatarUploader({
  preview,
  onFileChange,
  onFileSelect,
  onClear,
  onClick,
  fileInputRef,
  className,
  isUploading = false,
  initialFileName = null,
  initialFileSize = null,
}: AvatarUploaderProps) {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = fileInputRef ?? internalInputRef;
  const justSelectedRef = useRef(false);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    sizeFormatted: string;
  } | null>(null);
  const [compressionMessage, setCompressionMessage] = useState<string | null>(
    null,
  );
  const [isCompressing, setIsCompressing] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [imageTitle, setImageTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) {
      setFileInfo(null);
      setImageTitle(null);
      return;
    }

    if (initialFileName || typeof initialFileSize === "number") {
      setImageTitle(initialFileName || "Şəkil");
      setFileInfo({
        name: initialFileName || "Şəkil",
        sizeFormatted:
          typeof initialFileSize === "number" ? formatFileSize(initialFileSize) : "",
      });
    }
  }, [preview, initialFileName, initialFileSize]);

  const handleWrapperClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    if (!preview) {
      if (onClick) onClick();
      else {
        justSelectedRef.current = true;
        inputRef.current?.click();
        setTimeout(() => {
          justSelectedRef.current = false;
        }, 1000);
      }
    }
  };

  const createSyntheticEvent = (file: File): ChangeEvent<HTMLInputElement> => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return {
      target: { files: dataTransfer.files } as HTMLInputElement,
    } as ChangeEvent<HTMLInputElement>;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    justSelectedRef.current = true;
    const file = e.target.files?.[0];
    if (!file) {
      // İstifadəçi Cancel edibsə dialoqda, input dəyəri boşalır
      // və onChange tetiklenir (bəzi brauzerlərdə).
      // justSelectedRef-i yenidən sıfırlamaq lazımdır.
      setTimeout(() => {
        justSelectedRef.current = false;
      }, 500);
      return;
    }

    if (!isAllowedImageFile(file)) {
      toast.error("Yalnız PNG, JPEG və JPG formatları qəbul olunur.");
      if (inputRef.current) inputRef.current.value = "";
      setTimeout(() => {
        justSelectedRef.current = false;
      }, 500);
      return;
    }

    setCompressionMessage(null);

    if (isImageFile(file) && file.size > MAX_SIZE_BYTES) {
      setIsCompressing(true);
      try {
        let compressedFile = await imageCompression(file, {
          maxSizeMB: MAX_SIZE_MB,
          useWebWorker: true,
          preserveExif: false,
        });
        if (compressedFile.size > MAX_SIZE_BYTES) {
          compressedFile = await imageCompression(file, {
            maxSizeMB: MAX_SIZE_MB - 1,
            maxWidthOrHeight: 2000,
            initialQuality: 0.6,
            fileType: "image/jpeg",
            useWebWorker: true,
            preserveExif: false,
          });
        }
        if (compressedFile.size > MAX_SIZE_BYTES) {
          toast.error(`Şəkil ölçüsü ${MAX_SIZE_MB} MB həddini aşır`);
          if (inputRef.current) inputRef.current.value = "";
          setIsCompressing(false);
          setTimeout(() => {
            justSelectedRef.current = false;
          }, 500);
          return;
        }
        const originalFormatted = formatFileSize(file.size);
        const compressedFormatted = formatFileSize(compressedFile.size);
        setImageTitle(compressedFile.name);
        setFileInfo({
          name: compressedFile.name,
          sizeFormatted: compressedFormatted,
        });
        setCompressionMessage(
          `Şəkil ${originalFormatted}-dan ${compressedFormatted}-a endirildi`,
        );
        onFileSelect?.(compressedFile);
        onFileChange?.(createSyntheticEvent(compressedFile));
      } catch {
        setFileInfo({
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
        });
        onFileSelect?.(file);
        onFileChange?.(e);
      } finally {
        setIsCompressing(false);
        setTimeout(() => {
          justSelectedRef.current = false;
        }, 500);
      }
    } else {
      setImageTitle(file.name);
      setFileInfo({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
      });
      onFileSelect?.(file);
      onFileChange?.(e);
      setTimeout(() => {
        justSelectedRef.current = false;
      }, 500);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = () => {
    setFileInfo(null);
    setCompressionMessage(null);
    onFileSelect?.(null);
    onClear?.();
  };

  return (
    <div className={styles.wrapper} onClick={handleWrapperClick}>
      <div
        className={`${styles.avatarUploader} ${className || ""}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!preview && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            e.stopPropagation();
            if (onClick) onClick();
            else inputRef.current?.click();
          }
        }}
        aria-label="Şəkil seçin"
      >
        {preview ? (
          <>
            <button
              className={styles.zoomAvatarBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewModalOpen(true);
              }}
              title="Böyüt"
              type="button"
            >
              <MdZoomOutMap className={styles.zoomIcon} />
            </button>
            <img src={preview} alt="Avatar" className={styles.avatarPreview} />
            <button
              className={styles.clearAvatarBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              title="Şəkli sil"
              type="button"
            >
              <XMarkIcon className={styles.clearIcon} />
            </button>
          </>
        ) : (
          <>
            <div className={styles.uploadContent}>
              <PhotoIcon className={styles.uploadIcon} />
              <span className={styles.uploadText}>Şəkil seçin</span>
              <span className={styles.allowedText}>
                İcazə verilir *.png, *.jpeg, *.jpg
              </span>
            </div>
          </>
        )}
        <input
          type="file"
          ref={inputRef}
          className={styles.hiddenInput}
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          tabIndex={-1}
          aria-hidden
        />

        {isUploading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>Yüklənir...</span>
          </div>
        )}
      </div>
      {preview && fileInfo && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName} title={fileInfo.name}>
            {fileInfo.name}
          </span>
          <span className={styles.fileSize}>{fileInfo.sizeFormatted}</span>
          {compressionMessage && (
            <span className={styles.compressionBadge}>
              {compressionMessage}
            </span>
          )}
        </div>
      )}
      {isCompressing && (
        <span className={styles.compressingText}>Sıxışdırılır...</span>
      )}

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={`${imageTitle} - ${fileInfo?.sizeFormatted || ""}`}
        size="xl"
        className={styles.previewModal}
      >
        <div className={styles.previewModalContent}>
          {preview && (
            <img
              src={preview}
              alt="Şəkil önizləmə"
              className={styles.previewModalImage}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
