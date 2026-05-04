import { PageHeader, Button, CustomSelect } from "@/shared/ui";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import type { Option } from "@/shared/types";
import styles from "../../StaffTablePage.module.css";

interface StaffTableHeaderProps {
  selectedCompany: Option | null;
  rootCompaniesOptions: Option[];
  isLoadingCompanies: boolean;
  onCompanyChange: (company: Option | null) => void;
  onCompanyMenuOpen: () => void;
  onAddNew: () => void;
}

export function StaffTableHeader({
  selectedCompany,
  rootCompaniesOptions,
  isLoadingCompanies,
  onCompanyChange,
  onCompanyMenuOpen,
  onAddNew,
}: StaffTableHeaderProps) {
  return (
    <PageHeader title="Ştat Cədvəli" className={styles.header}>
           <div className={styles.companyWrapper}>
        <CustomSelect
          id="staff-company"
          options={rootCompaniesOptions}
          value={selectedCompany}
          onChange={onCompanyChange}
          onMenuOpen={onCompanyMenuOpen}
          defaultText={rootCompaniesOptions.length === 1 ? "" : "Şirkət seçin"}
          variant="default"
          icon={BuildingOfficeIcon}
          isSearchable
          searchPlaceholder="Şirkət axtar..."
          ariaLabel="Şirkət seçin"
          isLoading={isLoadingCompanies}
        />
      </div>
      <Button type="button" variant="primary" onClick={onAddNew} className={styles.addButton}>
        + Yeni
      </Button>
    </PageHeader>
  );
}
