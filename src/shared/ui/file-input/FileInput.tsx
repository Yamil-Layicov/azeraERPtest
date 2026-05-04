import React, { useRef, useState, useEffect } from 'react';
import styles from './FileInput.module.css';

interface FileInputProps {
  label: string;
  id: string;
  accept?: string;
  value?: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  id,
  accept = "*",
  value = null,
  onChange,
  className = "",
  disabled = false,
  multiple = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedFiles(value);
    } else if (value) {
      setSelectedFiles([value]);
    } else {
      setSelectedFiles([]);
    }
  }, [value]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    if (multiple) {
      onChange(files.length > 0 ? files : null);
    } else {
      onChange(files.length > 0 ? (files[0] || null) : null);
    }
  };

  // YENİ FUNKSİYA
  const handleClearFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Vacibdir! Arxadakı click-in işləməsinin qarşısını alır.
    setSelectedFiles([]);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Input-un daxili dəyərini sıfırlayır
    }
  };

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div 
        className={`${styles.fileInputWrapper} ${disabled ? styles.disabled : ''}`}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className={styles.hiddenInput}
          disabled={disabled}
        />
        <div className={styles.fileInputContent}>
          {selectedFiles.length > 0 ? (
            <div className={styles.filesList}>
              {selectedFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <span className={styles.fileName}>
                    {file.name}
                  </span>
                  <span className={styles.fileSize}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className={styles.fileInputText}>
              {multiple ? 'Faylları seçin...' : 'Fayl seçin...'}
            </span>
          )}
          <button 
            type="button" 
            className={styles.chooseFileButton}
          >
            Choose File
          </button>
          
          {selectedFiles.length > 0 && (
            <button
              type="button"
              className={styles.clearFileButton}
              onClick={handleClearFiles}
              title="Faylları təmizlə"
              disabled={disabled}
            >
              &times; {/* Bu 'X' işarəsidir */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;