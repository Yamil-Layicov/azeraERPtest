import React from "react";
import styles from "../TransactionDetailModal.module.css";

interface DocumentSectionProps {
  documents?: string | string[];
}

export const DocumentSection: React.FC<DocumentSectionProps> = ({ documents }) => {
  return (
    <div className={styles.notesContainer}>
      <span className={styles.label}>Sənədlər:</span>
      <div className={styles.notesContent}>
        <div className={styles.documentContainer}>
          {documents ? (
            Array.isArray(documents) ? (
              documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  📄 Sənəd {index + 1}.pdf
                </a>
              ))
            ) : (
              <a
                href={documents}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Sənəd.pdf
              </a>
            )
          ) : (
            <span className={styles.value}>Yoxdur</span>
          )}
        </div>
      </div>
    </div>
  );
};