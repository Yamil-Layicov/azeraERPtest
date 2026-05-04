import { useMemo } from "react";
import { EyeIcon, TrashIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { ColumnDef, Option } from "@/shared/types";
import type { Country } from "./types";
import styles from "../ui/CountriesPage.module.css";

interface UseCountriesColumnsProps {
  currentPage?: number;
  selectedRowCount?: Option | null;
  onDetail: (country: Country) => void;
  onDelete: (country: Country) => void;
  onCities: (country: Country) => void;
}

export const useCountriesColumns = ({
  currentPage = 1,
  selectedRowCount,
  onDetail,
  onDelete,
  onCities,
}: UseCountriesColumnsProps) => {
  const renderCheckStatus = (isActive: boolean) => {
    return isActive ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CheckIcon width={20} style={{ color: "#16a34a" }} />
      </div>
    ) : (
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
    );
  };

  const columns = useMemo<ColumnDef<Country>[]>(
    () => [
      {
        header: "Sıra №",
        accessor: "sortOrder",
        sortable: false,
        render: (item) => item.sortOrder ?? "-",
      },
      {
        header: "Kod",
        accessor: "code",
        sortable: false,
        render: (item) => item.code || "-",
      },
      {
        header: "Adı",
        accessor: "name",
        sortable: false,
        render: (item) => <span className={styles.roleName}>{item.name}</span>,
      },
      {
        header: "Yerli ad",
        accessor: "nativeName",
        sortable: false,
        render: (item) => item.nativeName || "-",
      },
      {
        header: "Telefon kodu",
        accessor: "phoneCode",
        sortable: false,
        render: (item) => item.phoneCode || "-",
      },
      {
        header: "Valyuta",
        accessor: "currencyCode",
        sortable: false,
        render: (item) => item.currencyCode || "-",
      },
      {
        header: "Aktiv",
        accessor: "isActive",
        sortable: false,
        render: (item) => renderCheckStatus(item.isActive),
      },
      {
        header: "",
        accessor: "actions",
        width: "120px",
        sortable: false,
        render: (item) => (
          <div className={styles.actionGroup}>
            <button
              className={`${styles.customActionBtn} ${styles.detailBtn}`}
              onClick={() => onDetail(item)}
              title="Ətraflı bax"
            >
              <EyeIcon width={16} />
            </button>
            <button
              className={`${styles.customActionBtn} ${styles.deleteBtn}`}
              onClick={() => !item.isSystem && onDelete(item)}
              title={item.isSystem ? "Sistem ölkəsi silinə bilməz" : "Ölkəni sil"}
              disabled={item.isSystem}
            >
              <TrashIcon width={16} />
            </button>
            <button
              className={`${styles.customActionBtn} ${styles.citiesBtn}`}
              onClick={() => onCities(item)}
              title="Şəhərlər"
            >
              <BuildingOfficeIcon width={16} />
              <span>Şəhərlər</span>
            </button>
          </div>
        ),
      },
    ],
    [currentPage, selectedRowCount, onDetail, onDelete, onCities]
  );

  return columns;
};
