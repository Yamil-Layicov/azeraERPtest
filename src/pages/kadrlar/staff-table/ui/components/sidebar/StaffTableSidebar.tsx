import StaffFormPanel from "../form/StaffFormPanel";
import type { NodeEntry } from "@/features/kadrlar/staff-table";
import type { Option } from "@/shared/types";
import styles from "../../StaffTablePage.module.css";

interface StaffTableSidebarProps {
  isFormOpen: boolean;
  selectedItem: NodeEntry | null;
  selectedCompany: Option | null;
  rootCompaniesOptions: Option[];
  companiesOptions: Option[];
  shouldShowPanel: boolean;
  onClose: () => void;
  onSave: (data: unknown) => void;
  onCancel: () => void;
}

export function StaffTableSidebar({
  isFormOpen,
  selectedItem,
  selectedCompany,
  rootCompaniesOptions,
  companiesOptions,
  shouldShowPanel,
  onClose,
  onSave,
  onCancel,
}: StaffTableSidebarProps) {
  // Helper function to find option by ID
  const findOptionById = (options: Option[], id: string | null | undefined): Option | null => {
    if (!id) return null;
    return options.find(opt => String(opt.id) === String(id)) || null;
  };

  const formInitialData = selectedItem
    ? {
        id: selectedItem.id as never,
        employeeId: selectedItem.employeeId,
        employee: selectedItem.employeeName,
        positionId: selectedItem.positionId,
        position:
          selectedItem.positionId && selectedItem.positionName
            ? { id: selectedItem.positionId, fullName: selectedItem.positionName, role: "" }
            : null,
        company: findOptionById(companiesOptions, selectedItem.rootCompanyId) || findOptionById(rootCompaniesOptions, selectedItem.rootCompanyId) || selectedCompany,
        department: findOptionById(companiesOptions, selectedItem.subCompanyId) || null,
        replacedPerson: selectedItem.relatedName ?? null,
        isMain: selectedItem.isMain,
        isLeader: selectedItem.isHead,
        isActive: selectedItem.isActive,
        staffCategoriesCode: selectedItem.staffCategoriesCode,
        createdAt: selectedItem.createdAt,
        createdBy: selectedItem.createdBy,
      }
    : null;

  return (
    <div className={styles.rightColumn}>
      {shouldShowPanel && isFormOpen ? (
        <StaffFormPanel
          key={selectedItem ? selectedItem.id : "new"}
          mode={selectedItem ? "edit" : "create"}
          initialData={formInitialData}
          onCancel={onCancel}
          onSave={onSave}
          onClose={onClose}
          showTitle={shouldShowPanel}
        />
      ) : (
        <div className={styles.emptyState}>
          <p>Əməliyyat aparmaq üçün sol tərəfdən seçim edin</p>
        </div>
      )}
    </div>
  );
}
