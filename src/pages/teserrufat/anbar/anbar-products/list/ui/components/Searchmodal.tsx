import { useState } from "react";
import styles from "./Searchmodal.module.css";
import {
  Button,
  CustomSelect,
  FormInput,
  Modal,
  ModernDatePicker,
} from "@/shared/ui";

const Searchmodal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // State-ləri hər input üçün ayrı təyin edirik
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    id: string;
  } | null>(null);

  const handleClear = () => {
    setBarcode("");
    setProductName("");
    setStock("");
    setDate(null);
    setSelectedStatus(null);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ətraflı Axtarış" size="lg">
      <div className={styles.modalContent}>
        <div className={styles.grid2}>
          <FormInput
            label="SKU/Barcode"
            type="text"
            id="searchBarcode"
            placeholder="Məhsul Barcode axtar"
            value={barcode}
            onChange={(e) => setBarcode(e)}
          />
          <FormInput
            label="Məhsul Adı"
            type="text"
            id="searchProduct"
            placeholder="Məhsul adını axtar"
            value={productName}
            onChange={(e) => setProductName(e)}
          />
        </div>

        <div className={styles.grid2}>
          <div>
            <label htmlFor="searchStatus" className={styles.label}>
              Məhsul Statusu
            </label>
            <CustomSelect
              defaultText="Seçim edin..."
              id="searchStatus"
              value={selectedStatus}
              onChange={(val: any) => setSelectedStatus(val)}
              options={[
                { label: "Bütün Statuslar", id: "all" },
                { label: "Kritik Səviyyədə Olan", id: "lowStock" },
                { label: "Bitmiş Məhsullar", id: "outOfStock" },
              ]}
            />
          </div>
          <div>
            <label htmlFor="searchWarehouse" className={styles.label}>
              Anbarın adı
            </label>
            <CustomSelect
              defaultText="Seçim edin..."
              id="searchWarehouse"
              value={selectedStatus}
              onChange={(val: any) => setSelectedStatus(val)}
              options={[
                { label: "Bütün Anbarlar", id: "all" },
                { label: "Anbar 1", id: "warehouse1" },
                { label: "Anbar 2", id: "warehouse2" },
              ]}
            />
          </div>
        </div>
        <div className={styles.grid2}>
          <FormInput
            label="Lot/Seriya"
            type="text"
            id="searchLot"
            placeholder="Lot/Seriya adını axtar"
            value={productName}
            onChange={(e) => setProductName(e)}
          />
          <FormInput
            label="Movcud stok"
            type="number"
            id="searchStock"
            placeholder="Stok miqdarı"
            value={stock}
            onChange={(e) => setStock(e)}
          />
        </div>
        <div className={styles.grid2}>
          <ModernDatePicker
            label="Tarix"
            id="searchDate"
            placeholder="Tarix axtar"
            value={date}
            onChange={(val: any) => setDate(val)}
          />
          <FormInput
            label="Min-Max"
            type="text"
            id="searchDate"
            placeholder="Min-Max"
            onChange={(val: any) => setDate(val)}
          />
        </div>

        <div className={styles.searchButtonContainer}>
          <Button
            onClick={handleClear}
            variant="default"
            className={styles.searchButton}
          >
            Təmizlə
          </Button>{" "}
          <Button variant="primary" className={styles.searchButton}>
            Axtarış
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Searchmodal;
