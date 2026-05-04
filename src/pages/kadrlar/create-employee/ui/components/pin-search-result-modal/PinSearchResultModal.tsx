import React, { useMemo, useCallback } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { Button, Table } from "@/shared/ui";
import type { ColumnDef } from "@/shared/types";
import styles from "./PinSearchResultModal.module.css";
import { useEnumItemsByCode } from "@/features/lookups/hooks/useEnumItemsByCode";

export interface Employee {
  id?: string;
  companyName: string;
  createdAt: string;
  employmentTypeCode: string;
  status: string;
  isPrimary?: boolean;
}

export interface RelativeEmployee {
  id: string;
  fullname: string;
  companyName: string;
  status: string;
  createdAt: string;
}

export interface PinSearchResultData {
  name: string;
  surname: string;
  patronymic: string;
  birthDate: string;
  gender: string;
  pin: string;
  employees: Employee[];
  relativesWhoAreEmployees?: RelativeEmployee[];
}

interface PinSearchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  data: PinSearchResultData | null;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("az-AZ");
  } catch {
    return dateString;
  }
};

const formatGender = (gender: string): string => {
  if (gender === "Male" || gender === "male") return "Kişi";
  if (gender === "Female" || gender === "female") return "Qadın";
  return gender || "-";
};

const formatEmploymentDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const parts = dateString.split("T");
    if (parts.length === 2) {
      const datePart = parts[0];
      const timePart = parts[1];
      
      if (datePart && timePart) {
        const [year, month, day] = datePart.split("-");
        
        const time = timePart.split(".")[0];
        if (time && year && month && day) {
          const [hours, minutes, seconds] = time.split(":");
          if (hours && minutes && seconds) {
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
          }
        }
      }
    } 
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("az-AZ");
    const formattedTime = date.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  } catch {
    return dateString;
  }
};

const PinSearchResultModal: React.FC<PinSearchResultModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  data,
}) => {
  const { rawData: employmentTypes, isPending: isLoadingTypes } = useEnumItemsByCode("EmploymentTypes", isOpen);

  const getEmploymentLabel = useCallback((code: string) => {
    if (!code) return "-";
    if (isLoadingTypes) return "Yüklənir...";
    
    const types = (employmentTypes || []) as any[];
    const type = types.find((item) => item.value === code);
    return type ? type.label : code;
  }, [employmentTypes, isLoadingTypes]);

  // Table columns for employees
  const employeeColumns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        header: "Rəsm. forması",
        accessor: "employmentTypeCode",
        sortable: false,
        render: (item) => <span>{getEmploymentLabel(item.employmentTypeCode)}</span>,
      },
      {
        header: "Şirkət",
        accessor: "companyName",
        sortable: false,
        render: (item) => <span>{item.companyName || "-"}</span>,
      },
      {
        header: "Status",
        accessor: "status",
        sortable: false,
        render: (item) => <span>{item.status || "-"}</span>,
      },
      {
        header: "Tarix",
        accessor: "createdAt",
        sortable: false,
        render: (item) => <span>{formatEmploymentDate(item.createdAt)}</span>,
      },
    ],
    [getEmploymentLabel]
  );

  // Table columns for relatives
  const relativeColumns = useMemo<ColumnDef<RelativeEmployee>[]>(
    () => [
      {
        header: "S.A.A",
        accessor: "fullname",
        sortable: false,
        render: (item) => <span>{item.fullname || "-"}</span>,
      },
      {
        header: "Şirkət",
        accessor: "companyName",
        sortable: false,
        render: (item) => <span>{item.companyName || "-"}</span>,
      },
      {
        header: "Status",
        accessor: "status",
        sortable: false,
        render: (item) => <span>{item.status || "-"}</span>,
      },
      {
        header: "Tarix",
        accessor: "createdAt",
        sortable: false,
        render: (item) => <span>{formatEmploymentDate(item.createdAt)}</span>,
      },
    ],
    []
  );

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onCancel();
    onClose();
  }, [onCancel, onClose]);

  // Early return ONLY after all hooks are called
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="İşçi Məlumatları" size="lg">
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Ad:</span>
            <span className={styles.value}>{data.name || "-"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Doğum tarixi:</span>
            <span className={styles.value}>{formatDate(data.birthDate)}</span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Soyad:</span>
            <span className={styles.value}>{data.surname || "-"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Cins:</span>
            <span className={styles.value}>{formatGender(data.gender)}</span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Ata adı:</span>
            <span className={styles.value}>{data.patronymic || "-"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>FİN:</span>
            <span className={styles.value}>{data.pin || "-"}</span>
          </div>
        </div>

        {/* Existing Employees Table */}
        {data.employees && data.employees.length > 0 && (
          <div className={styles.employmentsSection}>
            <div className={styles.sectionTitle}>İş yerləri</div>
            <div className={styles.tableWrapper}>
              <Table data={data.employees} columns={employeeColumns} />
            </div>
          </div>
        )}

        {/* New Relatives Table */}
        {data.relativesWhoAreEmployees && data.relativesWhoAreEmployees.length > 0 && (
          <div className={styles.employmentsSection}>
            <div className={styles.sectionTitle}>Qohumlar</div>
            <div className={styles.tableWrapper}>
              <Table data={data.relativesWhoAreEmployees} columns={relativeColumns} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Ləğv et
        </Button>
        <Button type="button" variant="primary" onClick={handleConfirm}>
          Təsdiq et
        </Button>
      </div>
    </Modal>
  );
};

export default PinSearchResultModal;
