import { useRef, useState, useEffect } from "react";
import { DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormTextarea } from "@/shared/ui";
import styles from "./SpecialNotesTab.module.css";

const FILE_ACCEPT = ".png,.jpeg,.jpg,.pdf,image/png,image/jpeg,image/jpg,application/pdf";
const isImageFile = (file: File) => file.type.startsWith("image/");

export const SpecialNotesTab = () => {
    const [value, setValue] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const urls = uploadedFiles.map((f) => (isImageFile(f) ? URL.createObjectURL(f) : ""));
        setPreviews(urls);
        return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
    }, [uploadedFiles]);

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles?.length) return;
        const list = Array.from(newFiles);
        const allowed = list.filter((f) => f.type.startsWith("image/") || f.type === "application/pdf");
        setUploadedFiles((prev) => [...prev, ...allowed]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => (e: React.MouseEvent) => {
        e.stopPropagation();
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.fieldGroup}>
                    <FormTextarea
                    id="specialNotes"
                    label="Xüsusi qeydlər (yalnız holdingin İRD rəhbəri və məhdud sayda rəhbərlər üçün)"
                    placeholder="Daxil edin"
                    value={value}
                    onChange={setValue}
                    rows={4}
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
                    {uploadedFiles.length === 0 ? (
                        <div className={styles.uploadContent}>
                            <PhotoIcon className={styles.uploadIcon} />
                            <span className={styles.uploadText}>Bir fayl yükləyin və ya sürüşdürüb atın.</span>
                            <span className={styles.allowedText}>İcazə verilir *.png, *.jpeg, *.jpg, *.pdf</span>
                        </div>
                    ) : (
                        <div className={styles.fileList}>
                            {uploadedFiles.map((file, index) => (
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
                    id="special-notes-files"
                    className={styles.hiddenInput}
                    accept={FILE_ACCEPT}
                    multiple
                    onChange={(e) => addFiles(e.target.files)}
                    tabIndex={-1}
                    aria-hidden
                    />
                </div>
            </div>
        </div>
    );
};
