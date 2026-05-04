import React from "react";
import {
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  UserIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  FormInput,
  CustomSelect,
  FormTextarea,
  ModernDatePicker,
} from "@/shared/ui";
import styles from "./InventoryTransferModal.module.css";
import type { InventoryItem } from "../../models/Mockdata";

interface InventoryTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

const InventoryTransferModal: React.FC<InventoryTransferModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <h2>Təhvil-təslim / Yer dəyişmə</h2>
            <p>
              Yeni məlumatları daxil edərək aktivin yerini və ya məsul şəxsini
              dəyişin
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <XMarkIcon />
          </button>
        </header>

        <div className={styles.modalContent}>
          {/* Left Sidebar: Asset Summary */}
          <aside className={styles.sidebar}>
            <span className={styles.sidebarTitle}>Aktiv Məlumatları</span>
            <div className={styles.assetCard}>
              <div className={styles.imagePlaceholder}>
                <PhotoIcon />
              </div>
              <div className={styles.assetInfo}>
                <div className={styles.inventoryId}>{item.inventoryNo}</div>
                <h3 style={{ marginTop: "12px" }}>{item.activeName}</h3>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {item.category} • {item.subCategory}
                </span>
                {item.serialNumber && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    SN: {item.serialNumber}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoGroup}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <CheckBadgeIcon /> Cari Status
                </span>
                <span className={styles.infoValue}>{item.status}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <UserIcon /> Cari Təhkim
                </span>
                <span className={styles.infoValue}>
                  {item.responsiblePerson}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  FIN: {item.responsibleFin}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <MapPinIcon /> Lokasiya
                </span>
                <span className={styles.infoValue}>{item.location}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {item.department}
                </span>
              </div>
            </div>
          </aside>

          {/* Main Panel: Transfer Form */}
          <main className={styles.formPanel}>
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />{" "}
                Təşkilati və Coğrafi Məlumatlar
              </h3>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Yeni biznes vahidi{" "}
                    <span className={styles.required}>*</span>
                  </label>
                  <CustomSelect
                    defaultText="Seçin..."
                    options={[
                      { id: "1", fullName: "Azera Holding" },
                      { id: "2", fullName: "Azera Construction" },
                    ]}
                    value={null as any}
                    onChange={() => {}}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Yeni departament</label>
                  <CustomSelect
                    defaultText="Seçin..."
                    options={[
                      {
                        id: "1",
                        fullName: "İnformasiya Texnologiyaları Departamenti",
                      },
                      { id: "2", fullName: "Maliyyə Departamenti" },
                    ]}
                    value={null as any}
                    onChange={() => {}}
                  />
                  {/* <span className={styles.helperText}>
                    Departamentlər biznes vahidinə görə filtr olunur.
                  </span> */}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Yeni lokasiya / şöbə</label>
                  <CustomSelect
                    defaultText="Seçin..."
                    options={[
                      { id: "1", fullName: "2-ci mərtəbə otaq 31" },
                      { id: "2", fullName: "Baş ofis" },
                    ]}
                    value={null as any}
                    onChange={() => {}}
                  />
                  {/* <span className={styles.helperText}>
                    Lokasiyalar seçilən departamentə görə çıxır.
                  </span> */}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Yeni status <span className={styles.required}>*</span>
                  </label>
                  <CustomSelect
                    defaultText="Aktiv"
                    options={[
                      { id: "Aktiv", fullName: "Aktiv" },
                      { id: "Deaktiv", fullName: "Deaktiv" },
                      { id: "Təmirdə", fullName: "Təmirdə" },
                    ]}
                    value={{ id: "Aktiv", fullName: "Aktiv" }}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <UserIcon className="w-5 h-5 text-blue-500" /> Məsuliyyət və
                Zaman
              </h3>
              <div className={styles.row}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    flex: 1,
                  }}
                >
                  <FormInput
                    type="text"
                    id="newResponsive"
                    label="Yeni məsul şəxs (işçi)"
                    placeholder="Ad / Soyad və ya FİN axtarın..."
                    value=""
                    onChange={() => {}}
                    labelClassName={styles.label}
                  />
                  {/* <span className={styles.helperText}>
                    Məsələn: Taleh İsmayılov | FIN: 5VSHQG6
                  </span> */}
                </div>
                <div style={{ flex: 1 }}>
                  <ModernDatePicker
                    id="transferDate"
                    label="Təhvil-təslim tarixi"
                    value={new Date()}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />{" "}
                Əlavə Qeydlər
              </h3>
              <div>
                <FormTextarea
                  id="transferNotes"
                  label="Qeyd (opsional)"
                  placeholder="Məsələn: Köhnə departamentdən yeni departamentə, işçinin dəyişməsi və s."
                  value=""
                  onChange={() => {}}
                  labelClassName={styles.label}
                />
              </div>
            </section>
          </main>
        </div>

        <footer className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Ləğv et
          </button>
          <button className={styles.btnSubmit} onClick={onClose}>
            Təhvil-təslimi yadda saxla
          </button>
        </footer>
      </div>
    </div>
  );
};

export default InventoryTransferModal;
