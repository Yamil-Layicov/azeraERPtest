import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  PageHeader,
  FormInput,
  CustomSelect,
  ModernDatePicker,
  Table,
  Button,
  FileInput,
} from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import styles from "./AnbarAddPage.module.css";
import { logger } from "@/shared/lib/hooks/logger";

// --- MOCK DATA ---
const MOCK_POS = [
  {
    id: "po-1",
    poNumber: "PO-2024-001",
    vendor: "AzerSupply MMC",
    items: [
      {
        id: "i1",
        name: "Dizel Generator 50kW",
        sku: "DG-50K-W",
        orderedQty: 2,
        unit: "ədəd",
        unitPrice: 12500,
        vat: 18,
      },
      {
        id: "i2",
        name: "Yağ süzgəci",
        sku: "FIL-OIL-XL",
        orderedQty: 10,
        unit: "ədəd",
        unitPrice: 45,
        vat: 18,
      },
    ],
  },
  {
    id: "po-2",
    poNumber: "PO-2024-002",
    vendor: "Metak İnşaat",
    items: [
      {
        id: "i3",
        name: "PVC Boru 100mm",
        sku: "PVC-100",
        orderedQty: 50,
        unit: "metr",
        unitPrice: 12,
        vat: 18,
      },
      {
        id: "i4",
        name: "Birləşdirici mufta",
        sku: "PVC-CON-100",
        orderedQty: 20,
        unit: "ədəd",
        unitPrice: 5,
        vat: 18,
      },
    ],
  },
];

const WAREHOUSES: Option[] = [
  { id: "main", label: "Baş Anbar" },
  { id: "backup", label: "Ehtiyat Anbar" },
];

const QC_STATUSES: Option[] = [
  { id: "accepted", label: "Qəbul" },
  { id: "rejected", label: "İnkar" },
  { id: "rework", label: "Təmir" },
];

// --- TYPES ---
interface GRNItem {
  productId: string;
  name: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  warehouse: Option | null;
  qcStatus: Option | null;
  serialNumber?: string;
  shelfLife?: Date | null;
  unitPrice: number;
  vat: number;
}

interface GRNForm {
  poId: Option | null;
  vendor: string;
  waybillNo: string;
  receivingDate: Date | null;
  items: GRNItem[];
  files: File | File[] | null;
  nomenklatura: string;
}

export default function AnbarAddPage() {
  const { register, control, handleSubmit, setValue, watch, reset } =
    useForm<GRNForm>({
      defaultValues: {
        poId: null,
        vendor: "",
        waybillNo: "",
        nomenklatura: "",
        receivingDate: new Date(),
        items: [],
        files: null,
      },
    });

  const { fields, replace } = useFieldArray({
    control,
    name: "items",
  });

  // Watchers for reactive UI
  const selectedPo = watch("poId");

  // PO seçildikdə məlumatları doldur
  const handlePoChange = (option: Option | null) => {
    setValue("poId", option);
    const po = MOCK_POS.find((p) => p.id === option?.id);
    if (po) {
      setValue("vendor", po.vendor);
      const grnItems: GRNItem[] = po.items.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        orderedQty: item.orderedQty,
        receivedQty: item.orderedQty,
        unit: item.unit,
        warehouse: WAREHOUSES[0] || null,
        qcStatus: QC_STATUSES[0] || null,
        unitPrice: item.unitPrice,
        vat: item.vat,
      }));
      replace(grnItems);
    } else {
      setValue("vendor", "");
      replace([]);
    }
  };
  const onSubmit = (data: GRNForm) => {
    logger.error("GRN Submit Data (Mock):", data);
    alert("Məlumatlar yadda saxlanıldı (Mock)!\nKonsola baxın.");
  };

  const poOptions = useMemo(
    () => MOCK_POS.map((po) => ({ id: po.id, label: po.poNumber })),
    [],
  );

  const columns: ColumnDef<GRNItem>[] = [
    {
      header: "Məhsulun adı / SKU",
      accessor: "name",
      render: (item) => (
        <div>
          <strong>{item.name}</strong>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.sku}</div>
        </div>
      ),
    },
    { header: "Sifariş Miqdarı", accessor: "orderedQty" },
    {
      header: "Qəbul edilən Miqdar",
      accessor: "receivedQty",
      render: (_, index) => (
        <FormInput
          label=""
          id={`items-${index}-receivedQty`}
          type="number"
          placeholder="0"
          register={register(`items.${index}.receivedQty` as any, {
            valueAsNumber: true,
          })}
          className={styles.itemInput}
        />
      ),
    },
    { header: "Vahid", accessor: "unit" },
    {
      header: "Anbar / Zona",
      accessor: "warehouse",
      render: (_, index) => (
        <Controller
          control={control}
          name={`items.${index}.warehouse` as any}
          render={({ field }) => (
            <CustomSelect
              options={WAREHOUSES}
              defaultText="Seçin"
              value={field.value as Option | null}
              onChange={field.onChange}
              variant="compact"
            />
          )}
        />
      ),
    },
    {
      header: "Status (QC)",
      accessor: "qcStatus",
      render: (_, index) => (
        <Controller
          control={control}
          name={`items.${index}.qcStatus` as any}
          render={({ field }) => (
            <CustomSelect
              options={QC_STATUSES}
              defaultText="Seçin"
              value={field.value as Option | null}
              onChange={field.onChange}
              variant="compact"
            />
          )}
        />
      ),
    },
    {
      header: "Seriya / Partiya",
      accessor: "serialNumber",
      render: (_, index) => (
        <FormInput
          label=""
          id={`items-${index}-serialNumber`}
          type="text"
          placeholder="Seriya No"
          register={register(`items.${index}.serialNumber` as any)}
        />
      ),
    },
    {
      header: "Son istifadə tarixi",
      accessor: "shelfLife",
      render: (_, index) => (
        <Controller
          control={control}
          name={`items.${index}.shelfLife` as any}
          render={({ field }) => (
            <ModernDatePicker
              value={field.value as Date | null}
              onChange={field.onChange}
            />
          )}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader title="Anbar - Əlavə et" />

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
        {/* 1. Master Info Header */}
        <div className={styles.headerGrid}>
          <div className={styles.selectWrapper}>
            <label className={styles.label}>PO Seçimi (Purchase Order)</label>
            <CustomSelect
              options={poOptions}
              defaultText="PO Seçin"
              value={selectedPo}
              onChange={handlePoChange}
              id="po-select"
            />
          </div>
          <FormInput
            label="Təchizatçı"
            id="vendor"
            type="text"
            placeholder=""
            register={register("vendor")}
            readOnly
          />
          <FormInput
            label="Qaimə nömrəsi"
            id="waybillNo"
            type="text"
            placeholder="Məs: QN-123456"
            register={register("waybillNo")}
            required
          />
          <FormInput
            label="Nomenklatura"
            id="nomenklatura"
            type="text"
            placeholder="Elektronik nomenklatura"
            register={register("nomenklatura")}
            required
          />
          <Controller
            control={control}
            name="receivingDate"
            render={({ field }) => (
              <ModernDatePicker
                label="Mədaxil Tarixi"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

      
        <div className={styles.tableContainer}>
          <Table<GRNItem> data={fields as any} columns={columns} />
          {fields.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}
            >
              Zəhmət olmasa aşağıda məhsulların görünməsi üçün PO seçin.
            </div>
          )}
        </div>

        {/* 3. Traceability (Files) & Financial Summary */}
        <div className={styles.traceabilitySection}>
          <FileInput
            label="Şəkil / Sənəd Yükləmə"
            id="grn-files"
            onChange={(files) => setValue("files", files)}
            multiple
            value={watch("files")}
          />
        </div>

        {/* 4. Footer Actions */}
        <div className={styles.footerActions}>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            İmtina et
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={fields.length === 0}
          >
            Yadda saxla
          </Button>
        </div>
      </form>
    </div>
  );
}
