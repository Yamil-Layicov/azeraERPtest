import React from "react";
import {
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  HashtagIcon,
  MapPinIcon,
  UserIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import styles from "./InventoryHistoryModal.module.css";
import type { InventoryItem } from "../../models/Mockdata";

interface InventoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

const InventoryHistoryModal: React.FC<InventoryHistoryModalProps> = ({
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
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <h2>Təhvil-təslim və Status Tarixçəsi</h2>
            <p>
              {item.activeName} • {item.inventoryNo}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.modalContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.assetCardHeader}>
                <div className={styles.inventoryId}>{item.inventoryNo}</div>
                <div className={styles.assetBrief}>
                  <h3>{item.activeName}</h3>
                  <p>
                    {item.category} • {item.subCategory}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.sidebarGroup}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <CheckBadgeIcon className="w-3 h-3" /> Cari Status
                </span>
                <div className={styles.statusBadge}>{item.status}</div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <UserIcon className="w-3 h-3" /> Cari Təhkim
                </span>
                <span className={styles.infoValue}>
                  {item.responsiblePerson}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  FIN: {item.responsibleFin}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <MapPinIcon className="w-3 h-3" /> Lokasiya
                </span>
                <span className={styles.infoValue}>{item.location}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  {item.department}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <HashtagIcon className="w-3 h-3" /> Seriya Nömrəsi
                </span>
                <span className={styles.infoValue}>
                  {item.serialNumber || "—"}
                </span>
              </div>

              {item.activeDescription && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <ArchiveBoxIcon className="w-3 h-3" /> Təsvir
                  </span>
                  <p
                    className={styles.infoValue}
                    style={{
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      color: "#64748b",
                    }}
                  >
                    {item.activeDescription}
                  </p>
                </div>
              )}
            </div>
          </aside>

          <main className={styles.timelinePanel}>
            <h3 className={styles.panelTitle}>Əməliyyatların Axını</h3>

            <div className={styles.timeline}>
              {item.history && item.history.length > 0 ? (
                item.history.map((event) => (
                  <div key={event.id} className={styles.timelineItem}>
                    <div className={styles.timelineDot}>
                      {event.operation.includes("inventar") ? (
                        <PlusIcon className="w-3 h-3 text-emerald-600" />
                      ) : event.operation.includes("Təhvil") ? (
                        <ArrowsRightLeftIcon className="w-3 h-3 text-amber-600" />
                      ) : (
                        <ArrowsUpDownIcon className="w-3 h-3 text-blue-600" />
                      )}
                    </div>

                    <div className={styles.eventCard}>
                      <div className={styles.eventHeader}>
                        <div className={styles.eventTitle}>
                          <h4>{event.operation}</h4>
                          <div className={styles.eventPerformedBy}>
                            {event.performedBy}
                          </div>
                        </div>
                        <div className={styles.eventDate}>{event.date}</div>
                      </div>

                      <div className={styles.eventGrid}>
                        {event.fromPerson && (
                          <div className={styles.eventMetaItem}>
                            <span className={styles.eventMetaLabel}>
                              Kimdən
                            </span>
                            <span className={styles.eventMetaValue}>
                              {event.fromPerson}
                            </span>
                          </div>
                        )}
                        {event.toPerson && (
                          <div className={styles.eventMetaItem}>
                            <span className={styles.eventMetaLabel}>Kimə</span>
                            <span className={styles.eventMetaValue}>
                              {event.toPerson}
                            </span>
                          </div>
                        )}
                        <div className={styles.eventMetaItem}>
                          <span className={styles.eventMetaLabel}>Status</span>
                          <span className={styles.eventMetaValue}>
                            {event.status}
                          </span>
                        </div>
                        {event.location && (
                          <div className={styles.eventMetaItem}>
                            <span className={styles.eventMetaLabel}>
                              Lokasiya
                            </span>
                            <span className={styles.eventMetaValue}>
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {event.note && (
                        <div className={styles.eventNote}>{event.note}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyHistory}>
                  <ArchiveBoxIcon className="w-12 h-12" />
                  <p>Bu inventar üçün hələ ki, tarixçə qeydı mövcud deyil.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InventoryHistoryModal;
