import type { ColumnDef } from "@/shared/types";
import type { InventoryItem } from "./Mockdata";
import { Button, StatusBadge } from "@/shared/ui";
import {
  PhotoIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { FaCopy } from "react-icons/fa";

export function getActiveInventoryColumns({
  styles,
  getInitials,
  handlePhotoClick,
  handleQRClick,
  handleHistoryClick,
  handleTransferClick,
  handleDetailClick,
  handleCopyClick,
}: {
  styles: Record<string, string>;
  getInitials: (name: string) => string;
  handlePhotoClick: (item: InventoryItem) => void;
  handleQRClick: (item: InventoryItem) => void;
  handleHistoryClick: (item: InventoryItem) => void;
  handleTransferClick: (item: InventoryItem) => void;
  handleDetailClick: (item: InventoryItem) => void;
  handleCopyClick: (inventoryNo: string) => void;
}): ColumnDef<InventoryItem>[] {
  return [
    {
      header: "İnventar",
      accessor: "inventoryNo",
      width: "180px",
      render: (item: InventoryItem) => (
        <div className={styles.cellMultiline}>
          <div className={styles.inventoryBadge}><span>{item.inventoryNo} </span> <Button variant="default" className={styles.copyBtn} onClick={() => handleCopyClick(item.inventoryNo)}>
            <FaCopy  size={12}/>
          </Button>  </div>
         
        </div>
      ),
    },
    {
      header: "Aktiv",
      accessor: "activeName",
      render: (item: InventoryItem) => (
        <div className={styles.cellMultiline}>
          <span className={styles.primaryText}>{item.activeName}</span>
          {item.activeDescription && (
            <span className={styles.secondaryText}>
              {item.activeDescription}
            </span>
          )}
          {item.serialNumber && (
            <span className={styles.secondaryText}>
              Seriya: {item.serialNumber}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Şirkət / Dept / Lokasiya",
      accessor: "company",
      render: (item: InventoryItem) => (
        <div className={styles.cellMultiline}>
          <span className={styles.primaryText} style={{ fontSize: "0.8rem" }}>
            {item.company}
          </span>
          <span className={styles.secondaryText}>{item.department}</span>
          <span className={styles.secondaryText}>{item.location}</span>
        </div>
      ),
    },
    {
      header: "Məsul şəxs",
      accessor: "responsiblePerson",
      render: (item: InventoryItem) => (
        <div className={styles.userWithAvatar}>
          <div className={styles.avatar}>
            {getInitials(item.responsiblePerson)}
          </div>
          <div className={styles.cellMultiline}>
            <span className={styles.primaryText}>{item.responsiblePerson}</span>
            <span className={styles.secondaryText}>
              FIN: {item.responsibleFin}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Kateqoriya",
      accessor: "category",
      render: (item: InventoryItem) => (
        <div className={styles.cellMultiline}>
          <span className={styles.primaryText}>{item.category}</span>
          <span className={styles.secondaryText}>{}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      width: "100px",
      render: (item: InventoryItem) => (
        <div className={styles.statusContainer}>
          <StatusBadge
            label={item.status}
            variant={item.status === "Aktiv" ? "success" : "neutral"}
          />
        </div>
      ),
    },
    {
      header: "Təhvil tarixi",
      accessor: "deliveryDate",
      width: "120px",
      render: (item: InventoryItem) => (
        <span className={styles.secondaryText} style={{ fontWeight: 500 }}>
          {item.deliveryDate || "—"}
        </span>
      ),
    },
    {
      header: "",
      accessor: "id",
      width: "200px",
      render: (item: InventoryItem) => (
        <div className={styles.actionButtons}>
          <button
            className={styles.iconBtn}
            title={item.imageCount > 0 ? "Şəkilə bax" : "Şəkil yoxdur"}
            disabled={item.imageCount === 0}
            onClick={() => handlePhotoClick(item)}
          >
            <PhotoIcon />
          </button>
          <button
            className={styles.iconBtn}
            title="QR Kodu"
            onClick={() => handleQRClick(item)}
          >
            <QrCodeIcon />
          </button>
          <button
            className={styles.iconBtn}
            title="Tarixçə"
            onClick={() => handleHistoryClick(item)}
          >
            <ClockIcon />
          </button>
          <button
            className={`${styles.iconBtn} ${styles.dangerIconBtn}`}
            title="Təhvil-təslim / Yer dəyişmə"
            onClick={() => handleTransferClick(item)}
          >
            <ArrowsRightLeftIcon />
          </button>
          <button
            className={styles.iconBtn}
            title="Görüntü"
            onClick={() => handleDetailClick(item)}
            
          >
            <EyeIcon />
          </button>
        </div>
      ),
    },
  ];
}
