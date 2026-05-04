import {
  FormInput,
  CustomSelect,
  ModernDatePicker,
  Button,
  Modal,
  FileDropzone,
  Table,
} from "@/shared/ui";
import styles from "./AddExpenseModal.module.css";
import { MdDelete } from "react-icons/md";

interface Props {
  open: boolean;
  onClose: () => void;
}

const eventTypeOptions = [
  { id: "1", label: "Yanacaq" },
  { id: "2", label: "Təmir" },
  { id: "3", label: "Yuyulma" },
];

const paymentOptions = [
  { id: "1", label: "Nağd" },
  { id: "2", label: "Kart" },
];

const currencyOptions = [
  { id: "1", label: "AZN" },
  { id: "2", label: "USD" },
];

export default function AddExpenseModal({ open, onClose }: Props) {
  return (
    <Modal
      title="Nəqliyyat xərcləri"
      isOpen={open}
      onClose={onClose}
      className={styles.modal}
    >
      <div className={styles.modalContent}>
        <div className={styles.headerSection}>
          <h3 className={styles.sectionTitle}>Yeni Nəqliyyat xərcləri</h3>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Event növü</label>
            <CustomSelect
              id="eventType"
              options={eventTypeOptions}
              value={eventTypeOptions[0] ?? null}
              onChange={() => {}}
              defaultText=""
            />
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Tarix / saat</label>
            <FormInput
              placeholder="Tarix / saat"
              id="date"
              type="text"
              value="04/13/2026 02:26 PM"
              onChange={() => {}}
              label=""
            />
          </div>

          <FormInput
            label="Odometr (km)"
            placeholder="Odometr (km)"
            id="odometer"
            type="text"
            value=""
            onChange={() => {}}
          />
          <FormInput
            label="Vendor / Servis"
            placeholder="Vendor / Servis"
            id="vendor"
            type="text"
            value=""
            onChange={() => {}}
          />

          {/* Geniş sahələr üçün tam en (optional) */}
          <FormInput
            label="Qəbz / Faktura No"
            placeholder="Qəbz / Faktura No"
            id="invoice"
            type="text"
            value=""
            onChange={() => {}}
          />
          <FormInput
            label="Qeyd"
            placeholder="Qeyd"
            id="note"
            type="text"
            value=""
            onChange={() => {}}
          />
        </div>

        <div className={styles.headerSection}>
          <h3 className={styles.sectionTitle}>Event Detalları</h3>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>Yanacaq növü</label>
            <CustomSelect
              id="fuelType"
              options={eventTypeOptions}
              value={eventTypeOptions[0] ?? null}
              onChange={() => {}}
              defaultText="Seçin..."
            />
          </div>
          <FormInput
            placeholder="Litr"
            label="Litr"
            id="liter"
            type="text"
            value=""
            onChange={() => {}}
          />
          <FormInput
            placeholder="1 litr qiyməti"
            label="1 litr qiyməti"
            id="pricePerLiter"
            type="text"
            value=""
            onChange={() => {}}
          />
        </div>

        {/* Expenses Table Section */}
        <div className={styles.headerSection}>
          <h3 className={styles.sectionTitle}>Xərclər (məcburi)</h3>
        </div>
        <div className={styles.expenseTableWrapper}>
          <Table
            columns={[
              {
                header: "Tip",
                accessor: "type",
                width: "320px",
                render: (item, index?: number) => (
                  <FormInput
                    id={`type-${index ?? 0}`}
                    type="text"
                    value={item.type}
                    onChange={() => {}}
                    placeholder="Tip"
                    label=""
                  />
                ),
              },
              {
                header: "Məbləğ",
                accessor: "amount",
                width: "320px",
                render: (item, index?: number) => (
                  <FormInput
                    id={`amount-${index ?? 0}`}
                    type="text"
                    value={item.amount}
                    onChange={() => {}}
                    placeholder="Məbləğ"
                    label=""
                  />
                ),
              },
              {
                header: "Valyuta",
                accessor: "currency",
                width: "320px",
                render: (item) => (
                  <CustomSelect
                    id="table-currency"
                    options={currencyOptions}
                    value={
                      currencyOptions.find(
                        (opt) => opt.label === item.currency,
                      ) ?? null
                    }
                    onChange={() => {}}
                    defaultText="AZN"
                  />
                ),
              },
              {
                header: "Ödəniş",
                accessor: "payment",
                width: "320px",
                render: (item) => (
                  <CustomSelect
                    id="table-payment"
                    options={paymentOptions}
                    value={
                      paymentOptions.find(
                        (opt) => opt.label === item.payment,
                      ) ?? null
                    }
                    onChange={() => {}}
                    defaultText="Nağd"
                  />
                ),
              },
              {
                header: "Tarix",
                accessor: "expenseDate",
                width: "320px",
                render: () => (
                  <ModernDatePicker
                    id="table-date"
                    value={null}
                    onChange={() => {}}
                  />
                ),
              },
              {
                header: "Qəbz No",
                accessor: "receiptNo",
                width: "320px",
                render: (item, index?: number) => (
                  <FormInput
                    id={`receiptNo-${index ?? 0}`}
                    type="text"
                    value={item.receiptNo}
                    onChange={() => {}}
                    placeholder="Qəbz No"
                    label=""
                  />
                ),
              },
              {
                header: "Qeyd",
                accessor: "expenseNote",
                width: "320px",
                render: (item, index?: number) => (
                  <FormInput
                    id={`expenseNote-${index ?? 0}`}
                    type="text"
                    value={item.expenseNote}
                    onChange={() => {}}
                    placeholder="Qeyd"
                    label=""
                  />
                ),
              },
              {
                header: "",
                accessor: "actions",
                render: () => (
                  <Button variant="danger" className={styles.deleteBtn}>
                    <MdDelete size={18} />
                  </Button>
                ),
              },
            ]}
            data={[
              {
                type: "Ehtiyat hiss",
                amount: "100",
                currency: "AZN",
                payment: "Nağd",
                expenseDate: "04/13/2026",
                receiptNo: "A123",
                expenseNote: "Motor yağı",
              },
            ]}
          />
        </div>
        <FileDropzone id="file-dropzone" label="" />

        {/* Footer Buttons */}
        <div className={styles.modalFooter}>
          <Button variant="primary" className={styles.saveButton}>
            Yadda saxla
          </Button>
        </div>
      </div>
    </Modal>
  );
}
