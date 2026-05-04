import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./TruncatedTextTooltip.module.css";

interface TruncatedTextTooltipProps {
  text: string;
  truncatedText: string;
  maxLength: number;
}

export function TruncatedTextTooltip({
  text,
  truncatedText,
  maxLength,
}: TruncatedTextTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isTruncated = text.length > maxLength;

  useEffect(() => {
    if (!showTooltip || !containerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      if (!containerRef.current || !tooltipRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Tooltip'i element'in altına yerleştir
      const top = rect.bottom + 8;
      let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
      
      // Ekran dışına çıkmaması için düzelt
      const padding = 10;
      if (left < padding) {
        left = padding;
      } else if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }

      setTooltipPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showTooltip]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isTruncated) return;
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      tooltipRef.current &&
      !tooltipRef.current.contains(e.target as Node)
    ) {
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showTooltip]);

  if (!isTruncated) {
    return <div>{text}</div>;
  }

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleClick}
        className={styles.truncatedText}
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          cursor: "pointer",
          lineHeight: "1.4",
          maxWidth: "100%",
        }}
      >
        {truncatedText}
      </div>
      {showTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              position: "fixed",
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              zIndex: 10000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.tooltipContent}>{text}</div>
            <div className={styles.tooltipArrow} />
          </div>,
          document.body
        )}
    </>
  );
}
