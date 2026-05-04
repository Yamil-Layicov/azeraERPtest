import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import { CloseButton } from "@/shared/ui/close-button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: string;
  className?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  titleAlign?: "left" | "center";
  titleSize?: "small" | "medium" | "large";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  width,
  className = "",
  closeOnOverlayClick = false,
  showCloseButton = true,
  titleAlign = "left",
  titleSize = "medium",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      if (!document.body.classList.contains("modal-open")) {
        document.body.style.top = `-${scrollY}px`;
        if (scrollBarWidth > 0) {
          document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        document.documentElement.classList.add("modal-open");
        document.body.classList.add("modal-open");
      }

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
        
        const openModals = document.querySelectorAll(`[class*="overlay"]`);
        if (openModals.length <= 1) {
          document.documentElement.classList.remove("modal-open");
          document.body.classList.remove("modal-open");
          
          const top = document.body.style.top;
          document.body.style.top = "";
          document.body.style.paddingRight = "";
          
          if (top) {
            window.scrollTo(0, parseInt(top || "0") * -1);
          }
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      onClick={() => closeOnOverlayClick && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.container} ${styles[size]} ${className}`}
        onClick={handleContentClick}
        style={width ? { width, maxWidth: "none" } : {}}
      >
        <div className={styles.header}>
          {title && (
            <h2 className={`${styles.title} ${titleAlign === "center" ? styles.titleCentered : ""} ${titleSize === "small" ? styles.titleSmall : titleSize === "large" ? styles.titleLarge : styles.titleMedium}`}>
              {title}
            </h2>
          )}
          {showCloseButton ? (
            <div className={`${styles.closeButton} ${titleAlign === "center" ? styles.closeButtonPushedRight : ""}`}>
              <CloseButton onClick={onClose} />
            </div>
          ) : null}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
