import type { ColumnDef } from "@/shared/types";
import type { KontragentFormData } from "../../add-kontragents/model/useAddKontragentsPage";
import styles from "../ui/Kontragents.module.css";

export const getKontragentColumns = (): ColumnDef<Partial<KontragentFormData>>[] => [
  {
    header: "#",
    accessor: "id",
    width: "50px",
    render: (_: any, index?: number) => (index !== undefined ? index + 1 : ""),
  },
  {
    header: "Ad / Hüquqi Ad",
    accessor: "name",
    render: (row: any) =>
      row.type === "legal" ? row.legalName : `${row.firstName} ${row.lastName}`,
  },
  {
    header: "VÖEN / FİN",
    accessor: "identifier",
    render: (row: any) => (row.type === "legal" ? row.voen : row.finCode),
  },
  {
    header: "Tip",
    accessor: "type",
    render: (row: any) => (row.type === "legal" ? "Hüquqi" : "Fiziki"),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row: any) => (
      <span
        className={`${styles.statusBadge} ${
          row.status?.id === "active" ? styles.activeStatus : styles.passiveStatus
        }`}
      >
        {row.status?.label}
      </span>
    ),
  },
  {
    header: "Telefon",
    accessor: "phone",
  },
  {
    header: "E-poçt",
    accessor: "email",
  },
];
