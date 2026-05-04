import React, { useState } from "react";
import {
  Squares2X2Icon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  PrinterIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { CiClock2 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CustomSelect, Button } from "@/shared/ui";
import styles from "./QRInfoModal.module.css";
import type { InventoryItem } from "../../models/Mockdata";

interface QRInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

const QRInfoModal: React.FC<QRInfoModalProps> = ({ isOpen, onClose, item }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printSize, setPrintSize] = useState({ id: "1", label: "70 × 40 mm (standart)" });

  const sizeOptions = [
    { id: "1", label: "70 × 40 mm (standart)" },
    { id: "2", label: "50 × 30 mm (kiçik)" },
    { id: "3", label: "100 × 50 mm (böyük)" },
  ];

  if (!isOpen || !item) return null;

  const currentTime = new Date().toLocaleString("az-AZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(item.inventoryNo);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox}>
              <Squares2X2Icon className="w-6 h-6" />
            </div>
            <div className={styles.headerInfo}>
              <h3>AZERAHOLDİNG • İNVENTAR</h3>
              <h2>QR Məlumat Kartı</h2>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.timeBadge}>
              <CiClock2 className="w-4 h-4" />

              {currentTime}
            </div>
            <button onClick={onClose} className={styles.closeHeaderBtn}>
              <IoMdClose />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.flexRow}>
            <div className={styles.card}>
              <label className={styles.label}>İNVENTAR NÖMRƏSİ</label>
              <div className={styles.inventoryNoWrapper}>
                <div className={styles.invNo}>{item.inventoryNo}</div>
                <button
                  className={styles.copyBtn}
                  title="Kopyala"
                  onClick={handleCopy}
                >
                  <DocumentDuplicateIcon className="w-5 h-5" />
                </button>
              </div>
              <p className={styles.hint}>
                Bu kod aktivin unikal inventar nömrəsidir.
              </p>
            </div>

            <div className={styles.card}>
              <label className={styles.label}>STATUS</label>
              <div className={styles.statusBadge}>
                <CheckCircleIcon className="w-5 h-5" />
                Aktiv
              </div>
              <p className={styles.hint}>
                Status inventar axınında cari vəziyyəti göstərir.
              </p>
            </div>
          </div>
          <div className={styles.flexRow}>
            <div className={styles.card}>
              <label className={styles.label}>AKTİV</label>
              <h4 className={styles.infoTitle}>{item.activeName}</h4>
              <p className={styles.infoSubtitle}>Marka/model qeyd edilməyib</p>
              <div className={styles.infoItem}>
                <span className={styles.itemLabel}>Kateqoriya:</span>
                <span className={styles.itemValue}>
                  {item.category} / {item.subCategory}
                </span>
              </div>
            </div>

            <div className={styles.card}>
              <label className={styles.label}>
                HAL-HAZIRDA KİMƏ TƏHKİM OLUNUB
              </label>
              <h4 className={styles.infoTitle}>{item.responsiblePerson}</h4>
              <div className={styles.infoItem}>
                <span className={styles.itemLabel}>FİN:</span>
                <span className={styles.itemValue}>{item.responsibleFin}</span>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div className={styles.infoItem}>
                  <span className={styles.itemLabel}>Biznes vahidi:</span>
                  <span className={styles.itemValue}>{item.company}</span>
                </div>
                <div className={`${styles.infoItem} ${styles.departmentItem}`}>
                  <span className={styles.itemLabel}>Departament:</span>
                  <span className={styles.itemValue}>{item.department}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.itemLabel}>Şöbə / Lokasiya:</span>
                  <span className={styles.itemValue}>{item.location}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.itemLabel}>Təhvil tarixi:</span>
                  <span className={styles.itemValue}>
                    {item.deliveryDate || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ marginBottom: "0.25rem" }}>
            <label className={styles.label}>QR KOD</label>
            <div className={styles.qrCardContent}>
              <div className={styles.qrImageWrapper}>
                <div className={styles.qrPlaceholder}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${item.qrToken}`}
                    alt="QR Code"
                  />
                </div>
              </div>
              <div className={styles.qrInfo}>
                <div className={styles.qrText}>
                  <h4>Skan edərək bu aktivin kartına daxil olun</h4>
                  <p>
                    QR kod bu səhifənin sabit linkini saxlayır. Etiket çap üçün
                    "Etiket Çap" seçin.
                  </p>
                </div>
                <div className={styles.qrActions}>
                  <button className={styles.btnSecondary}>
                    <PrinterIcon />
                    Çap et
                  </button>
                  <button className={styles.btnPrimary} onClick={() => setIsPrintModalOpen(true)}>
                    <TagIcon />
                    Etiket Çap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPrintModalOpen && (
        <div className={styles.printModalOverlay} onClick={() => setIsPrintModalOpen(false)}>
          <div className={styles.printModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.printModalHeader}>
              <h3>Etiket Çap</h3>
              <button onClick={() => setIsPrintModalOpen(false)} className={styles.closeHeaderBtn}>
                <IoMdClose />
              </button>
            </div>
            <div className={styles.printModalBody}>
              <p className={styles.printDesc}>
                Etiket ölçüsünü seçin. Sistem ayrıca "etiket print" rejimini açacaq və avtomatik çap dialoqunu göstərəcək.
              </p>
              <p className={styles.printNote}>
                <strong>Qeyd:</strong> Etiket çapında yalnız QR çıxacaq.
              </p>
              <div className={styles.printSelectGroup}>
                <label>Ölçü</label>
                <CustomSelect
                  id="printSize"
                  options={sizeOptions}
                  value={printSize}
                  defaultText="Seçin..."
                  onChange={(opt) => setPrintSize(opt as { id: string; label: string })}
                />
              </div>
            </div>
            <div className={styles.printModalFooter}>
              <Button variant="default" onClick={() => setIsPrintModalOpen(false)}>Bağla</Button>
              <Button variant="primary" onClick={() => console.log("Çap et klikləndi")}>Çap et</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRInfoModal;
