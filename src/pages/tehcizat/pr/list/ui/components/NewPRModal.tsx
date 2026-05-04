import React, { useState } from "react";
import styles from "./NewPRModal.module.css";
import {
  Modal,
  FormInput,
  FormTextarea,
  CustomSelect,
  FileDropzone,
  Button,
} from "@/shared/ui";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Option } from "@/shared/types";

interface NewPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORY_OPTIONS: Option[] = [
  { id: "it", label: "İT", fullName: "İT" },
  { id: "facilities", label: "Təsərrüfat", fullName: "Təsərrüfat" },
  { id: "office", label: "Ofis ləvazimatı", fullName: "Ofis ləvazimatı" },
];

const COST_CENTER_OPTIONS: Option[] = [
  { id: "cc1", label: "İT Avadanlıqları", fullName: "İT Avadanlıqları" },
  { id: "cc2", label: "Ofis Xərcləri", fullName: "Ofis Xərcləri" },
  { id: "cc3", label: "Kargüzarlıq", fullName: "Kargüzarlıq" },
];

const NewPRModal: React.FC<NewPRModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState<Option | null>(null);
  const [costCenter, setCostCenter] = useState<Option | null>(null);
  const [products, setProducts] = useState([
    { id: Date.now().toString(), name: "", quantity: 1, value: 0 },
  ]);
  const [files, setFiles] = useState<File[]>([]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: Date.now().toString(), name: "", quantity: 1, value: 0 },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleProductChange = (id: string, field: string, value: any) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + p.quantity * p.value, 0);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      purpose,
      category,
      costCenter,
      products,
      files,
      totalAmount: calculateTotal(),
      createdDate: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Satınalma Tələbi (PR)"
      size="xl"
    >
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.row}>
          <FormTextarea
            label="Məqsəd / Əsaslandırma"
            id="purpose"
            placeholder="Niyə lazımdır?"
            value={purpose}
            onChange={setPurpose}
            required
            className={styles.fullWidth}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Kateqoriya</label>
            <CustomSelect
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              defaultText="Kateqoriya seçin"
              variant="form"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Xərc Mərkəzi</label>
            <CustomSelect
              options={COST_CENTER_OPTIONS}
              value={costCenter}
              onChange={setCostCenter}
              defaultText="Xərc mərkəzi seçin"
              variant="form"
            />
          </div>
        </div>

        <div className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h3>Məhsullar</h3>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddProduct}
              className={styles.addBtn}
            >
              <PlusIcon width={16} /> Əlavə et
            </Button>
          </div>

          <div className={styles.productRows}>
            {products.map((product, index) => (
              <div key={product.id} className={styles.productRow}>
                <div className={styles.prodName}>
                  <FormInput
                    label={index === 0 ? "Məhsulun adı / Spesifikasiyası" : ""}
                    type="text"
                    id={`prod-name-${product.id}`}
                    placeholder="Məhsul adı"
                    value={product.name}
                    onChange={(val) =>
                      handleProductChange(product.id, "name", val)
                    }
                    required
                  />
                </div>
                <div className={styles.prodQty}>
                  <FormInput
                    label={index === 0 ? "Miqdar" : ""}
                    type="number"
                    id={`prod-qty-${product.id}`}
                    placeholder="0"
                    value={product.quantity.toString()}
                    onChange={(val) =>
                      handleProductChange(product.id, "quantity", Number(val))
                    }
                    required
                  />
                </div>
                <div className={styles.prodValue}>
                  <FormInput
                    label={index === 0 ? "Təxmini Dəyər" : ""}
                    type="number"
                    id={`prod-value-${product.id}`}
                    placeholder="0.00"
                    value={product.value.toString()}
                    onChange={(val) =>
                      handleProductChange(product.id, "value", Number(val))
                    }
                    required
                  />
                </div>
                <div
                  className={`${styles.prodAction} ${index === 0 ? styles.withLabel : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className={styles.deleteBtn}
                    disabled={products.length === 1}
                  >
                    <TrashIcon width={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totalRow}>
            <span>
              Yekun Məbləğ: <strong>{calculateTotal()} AZN</strong>
            </span>
          </div>
        </div>

        <div className={styles.filesSection}>
          <FileDropzone
            id="pr-files"
            label="Əlavə Fayllar"
            onChange={(updatedFiles) => setFiles(updatedFiles || [])}
            value={files}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Ləğv et
          </Button>
          <Button type="submit" variant="primary">
            Tələbi Göndər
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewPRModal;
