import React, { useState, useEffect } from "react";
import styles from "./CreateRFQModal.module.css";
import {
  Modal,
  Button,
  FormTextarea,
  FormInput,
  CustomSelect,
  ModernDatePicker,
} from "@/shared/ui";
import type { Option } from "@/shared/types";
import type { PendingRFQItem, RFQFormData } from "../../model/types";

interface CreateRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingItem: PendingRFQItem | null;
  onSubmit: (data: RFQFormData) => void;
}

const CreateRFQModal: React.FC<CreateRFQModalProps> = ({
  isOpen,
  onClose,
  pendingItem,
  onSubmit,
}) => {
  const [lotType, setLotType] = useState<"single" | "combined">("single");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState<Option | null>(null);
  const [warranty, setWarranty] = useState("");
  const [notes, setNotes] = useState("");

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen && pendingItem) {
      setLotType("single");
      setDeadline(null);
      setDescription(
        `Təfərrüat: ${pendingItem.itemName} (${pendingItem.requestedQty} ədəd)`,
      );
      setDeliveryTerms(null);
      setWarranty("");
      setNotes("");
      setHasError(false);
    }
  }, [isOpen, pendingItem]);

  const deliveryOptions: Option[] = [
    {
      id: "Sifarişçinin anbarına çatdırılma",
      fullName: "Sifarişçinin anbarına çatdırılma",
    },
    {
      id: "Təchizatçının ofisindən təhvil alma",
      fullName: "Təchizatçının ofisindən təhvil alma",
    },
    { id: "Texniki quraşdırma daxil", fullName: "Texniki quraşdırma daxil" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadline || !deliveryTerms) {
      setHasError(true);
      return;
    }

    const formData: RFQFormData = {
      lotType,
      deadline: deadline.toISOString(),
      description,
      deliveryTerms: deliveryTerms.id.toString(),
      warranty,
      vendors: [],
      notes,
    };

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className={styles.readOnlyInfo}>
          <strong>Seçilmiş Tələb:</strong>{" "}
          {pendingItem ? `${pendingItem.prNo} — ${pendingItem.itemName}` : ""}
        </div>
      }
      size="lg"
    >
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {hasError && (
          <div className={styles.errorAlert}>
            Zəhmət olmasa tarixləri və çatdırılma şərtlərini seçin.
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Tələbin Formatı (Lot Tipi)</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="lotType"
                value="single"
                checked={lotType === "single"}
                onChange={() => setLotType("single")}
              />
              Tək Məhsul
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="lotType"
                value="combined"
                checked={lotType === "combined"}
                onChange={() => setLotType("combined")}
              />
              Birləşdirilmiş Lot
            </label>
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.formGroup}>
            <ModernDatePicker
              id="rfq-deadline"
              label="Son Müraciət Tarixi (Deadline) *"
              value={deadline}
              onChange={setDeadline}
              className={styles.labelClass}
              error={hasError && !deadline ? "Məcburidir" : undefined}
            />
          </div>
          <div className={styles.formGroup}>
            <FormInput
              label="Sığorta və Zəmanət"
              id="rfq-warranty"
              type="text"
              value={warranty}
              onChange={setWarranty}
              placeholder="Məs: 1 il rəsmi zəmanət"
              labelClassName={styles.labelClass}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Çatdırılma Şərtləri *</label>
            <CustomSelect
              id="rfq-delivery"
              options={deliveryOptions}
              value={deliveryTerms}
              onChange={(val) => setDeliveryTerms(val as Option)}
              error={hasError && !deliveryTerms ? "Məcburidir" : undefined}
              defaultText="Seçin"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <FormTextarea
            label="Təsvir və Keyfiyyət Meyarları"
            id="rfq-desc"
            value={description}
            onChange={setDescription}
            placeholder="Malın texniki göstəricilərini və keyfiyyət standartlarını yazın..."
            rows={4}
          />
        </div>

        <div className={styles.gridContainer}></div>

        <div className={styles.formGroup}>
          <FormTextarea
            label="Əlavə Qeydlər / İclas Göstərişləri"
            id="rfq-notes"
            value={notes}
            onChange={setNotes}
            placeholder="Pre-bid iclas ehtiyacı varsa və ya aydınlaşdırıcı xüsusi ismarıc..."
            rows={2}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="outline" type="button" onClick={onClose}>
            İmtina et
          </Button>
          <Button variant="primary" type="submit">
            Təsdiqlə və Göndər
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRFQModal;
