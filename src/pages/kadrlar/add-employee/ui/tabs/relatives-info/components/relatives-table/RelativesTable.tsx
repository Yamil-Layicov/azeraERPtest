import React, { useMemo } from "react";
import styles from "./RelativesTable.module.css";
import { Table } from "@/shared/ui/table";
import { TableButton, TableRowActions, EmptyState } from "@/shared/ui";
import type { ColumnDef, Option } from "@/shared/types";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import { useLookups } from "@/pages/kadrlar/employees/ui/components/cv-page/models/useLookups";

export type RelativeItem = {
  id: string;
  degree: Option | null;
  socialStatus: Option | null;
  surname: string;
  name: string;
  patronymic: string;
  birthDate: Date | null;
  birthCity: string;
  workplace: string;
  pin: string;
  address: string;
  isDeceased: boolean;
  isPensioner: boolean;
  status?: string;
  personRelative?: {
    birthCountryCode?: string;
    birthCityId?: number;
    foreignBirthCity?: string;
  };
};

interface RelativesTableProps {
  data: RelativeItem[];
  onRemove: (id: string) => void;
  onEdit?: (item: RelativeItem) => void;
}
export const RelativesTable: React.FC<RelativesTableProps> = ({
  data,
  onRemove,
  onEdit,
}) => {
  const { getCountryLabel, getCityLabel } = useLookups();

  const columns = useMemo<ColumnDef<RelativeItem>[]>(
    () => [
      {
        header: "Qohumluq dərəcəsi",
        accessor: "degree",
        sortable: false,
        render: (item) => <span>{item.degree?.fullName || "-"}</span>,
      },
      {
        header: "Qohum",
        accessor: "name", 
        sortable: false,
        render: (item) => (
          <span>{`${item.surname} ${item.name} ${item.patronymic}`}</span>
        ),
      },

      {
        header: "FİN",
        accessor: "pin",
        sortable: false,
        render: (item) => <span>{item.pin || "-"}</span>,
      },
      {
        accessor: "birthPlace",
        header: "Doğum yeri",
        sortable: false,
        render: (item: RelativeItem) => {
          const isAZE = item?.personRelative?.birthCountryCode === "AZE";

          if (isAZE) {
            const countryCode = item?.personRelative?.birthCountryCode || "";
            const cityId = item?.personRelative?.birthCityId || "";
            return `${getCountryLabel(countryCode)} , ${getCityLabel(cityId)}`;
          } else {
            const countryCode = item?.personRelative?.birthCountryCode || "";
            const foreignCity = item?.personRelative?.foreignBirthCity || "";
            return `${getCountryLabel(countryCode)} , ${foreignCity}`;
          }
        },
      },

      {
        header: "Yaşadığı ünvan",
        accessor: "address",
        sortable: false,
        render: (item) => <span>{item.address || "-"}</span>,
      },

      {
        header: "İş yeri və vəzifəsi",
        accessor: "workplace",
        sortable: false,
        render: (item) => {
          const socialStatusText = item.socialStatus?.fullName?.trim() || "";
          const workplaceText = item.workplace?.trim() || "";

          if (socialStatusText && workplaceText) {
            return <span>{`${socialStatusText} - ${workplaceText}`}</span>;
          }

          if (socialStatusText) {
            return <span>{socialStatusText}</span>;
          }

          return <span>{workplaceText || "-"}</span>;
        },
      },

      {
        header: "",
        accessor: "actions",
        sortable: false,
        render: (item) => (
          <TableRowActions>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.UPDATE}>
              <TableButton
                variant="edit"
                onClick={() => onEdit?.(item)}
                title="Düzəliş et"
              />
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <TableButton
                variant="delete"
                onClick={() => onRemove(item.id)}
                title="Sil"
              />
            </PermissionGuard>
          </TableRowActions>
        ),
      },
    ],
    [onRemove, onEdit, getCountryLabel, getCityLabel],
  );

  const getRowClassName = (item: RelativeItem) => {
    const status = item.status || "";
    if (status === "Pending") return styles.pendingRow;
    if (status === "Approved") return styles.approvedRow;
    return "";
  };

  return (
    <div className={styles.wrapper}>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.tableScroll}>
          <Table data={data} columns={columns} getRowClassName={getRowClassName} />
        </div>
      )}
    </div>
  );
};
