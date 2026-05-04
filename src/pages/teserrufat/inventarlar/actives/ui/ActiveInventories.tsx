import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader, Table, TableToolbar, TableControls, TableActionGroup, Pagination, Modal, Button } from "@/shared/ui";
import InventorySearchModal from "./components/InventorySearchModal";
import QRInfoModal from "./components/QRInfoModal";
import InventoryHistoryModal from "./components/InventoryHistoryModal";
import InventoryTransferModal from "./components/InventoryTransferModal";
import styles from "./ActiveInventories.module.css";
import { activeInventoriesMockData } from "../models/Mockdata";
import type { InventoryItem } from "../models/Mockdata";
import type { ColumnDef, Option } from "@/shared/types";
import {
  rowCountOptions,
  operationOptions,
} from "@/shared/config/tableOptions";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ROUTES } from "@/app/routes/consts";
import { getActiveInventoryColumns } from "../models/models";
import toast from "react-hot-toast";

const ActiveInventories = () => {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedItemForQR, setSelectedItemForQR] =
    useState<InventoryItem | null>(null);
  const [selectedItemForHistory, setSelectedItemForHistory] =
    useState<InventoryItem | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] =
    useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] || null,
  );
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );

  const totalCount = activeInventoriesMockData.length;
  const itemsPerPage = Number(selectedRowCount?.id) || 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    console.log("Refreshing...");
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value);
  };

  const handleSearch = (data: unknown) => {
    console.log("Search data:", data);
    setIsSearchModalOpen(false);
  };

  const handlePhotoClick = (item: InventoryItem) => {
    const images = item.imageUrls ?? (item.imageUrl ? [item.imageUrl] : []);
    if (images.length > 0) {
      setSelectedImages(images);
      setCurrentImageIndex(0);
      setIsImageModalOpen(true);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleQRClick = (item: InventoryItem) => {
    setSelectedItemForQR(item);
    setIsQRModalOpen(true);
  };

  const handleHistoryClick = (item: InventoryItem) => {
    setSelectedItemForHistory(item);
    setIsHistoryModalOpen(true);
  };

  const handleTransferClick = (item: InventoryItem) => {
    setSelectedItemForTransfer(item);
    setIsTransferModalOpen(true);
  };

  const handleDetailClick = (item: InventoryItem) => {
    navigate(
      ROUTES.TESERRUFAT.INVENTAR.ACTIVE_DETAIL.LINK.replace(":id", item.id),
    );
  };

  const handleCopyClick = (inventoryNo: string) => {
    navigator.clipboard.writeText(inventoryNo);
    toast.success("Copied to clipboard");
  };
  

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns: ColumnDef<InventoryItem>[] = getActiveInventoryColumns({
    styles,
    getInitials,
    handlePhotoClick,
    handleQRClick,
    handleHistoryClick,
    handleTransferClick,
    handleDetailClick,
    handleCopyClick,
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerActions}>
        <PageHeader
          title="Aktivlər"
        />
        <Button
          className={styles.addBtn}
          variant="default"
          onClick={() => navigate(ROUTES.TESERRUFAT.INVENTAR.ADD_ACTIVE.LINK)}
        >
          <PlusIcon />
          Add
        </Button>
      </div>
      <div className={styles.content}>
        <TableToolbar>
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={handleRowCountChange}
            totalCount={totalCount}
          />

          <TableActionGroup
            onRefresh={handleRefresh}
            onSearch={handleSearchClick}
            onOperationChange={handleOperationChange}
            operationOptions={operationOptions}
            selectedOperation={selectedOperation}
          />
        </TableToolbar>
        <Table<InventoryItem>
          data={activeInventoriesMockData}
          columns={columns}
        />

        <TableToolbar>
          <TableControls
            selectedRowCount={selectedRowCount}
            onRowCountChange={handleRowCountChange}
            totalCount={totalCount}
          />
          <div className={styles.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
        </TableToolbar>
      </div>

      <InventorySearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />

      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="İnventar şəkli"
        size="md"
      >
        <div className={styles.imageModalContent}>
          {selectedImages.length > 0 ? (
            <div className={styles.sliderContainer}>
              {selectedImages.length > 1 && (
                <button
                  className={`${styles.sliderBtn} ${styles.prevBtn}`}
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon />
                </button>
              )}
              <div className={styles.imageWrapper}>
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={`İnventar ${currentImageIndex + 1}`}
                  className={styles.inventoryImage}
                />
              </div>
              {selectedImages.length > 1 && (
                <button
                  className={`${styles.sliderBtn} ${styles.nextBtn}`}
                  onClick={handleNextImage}
                >
                  <ChevronRightIcon />
                </button>
              )}
              {selectedImages.length > 1 && (
                <div className={styles.sliderDots}>
                  {selectedImages.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${
                        index === currentImageIndex ? styles.activeDot : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {selectedImages.length}
              </div>
            </div>
          ) : (
            <div className={styles.noImage}>Şəkil tapılmadı</div>
          )}
        </div>
      </Modal>

      <QRInfoModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        item={selectedItemForQR}
      />

      <InventoryHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        item={selectedItemForHistory}
      />

      <InventoryTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        item={selectedItemForTransfer}
      />
    </div>
  );
};

export default ActiveInventories;
