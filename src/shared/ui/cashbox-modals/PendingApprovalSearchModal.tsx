import { useMemo, useState } from "react";
import styles from "./modals/CashboxSearchModal.module.css";
import { Button } from "@/shared/ui/button";
import { CustomSelect } from "@/shared/ui/select";
import { Modal } from "@/shared/ui/modal/base";
import type { Option } from "@/shared/types";
import {
  useGetPendingApprovalCashBoxes,
  useGetOperationTypes,
  useGetCashPurposes,
  useGetRootCompanies,
  useGetNodes,
} from "@/features/maliyye/cash-operations";

interface PendingApprovalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: PendingApprovalSearchFormData) => void;
}

export interface PendingApprovalSearchFormData {
  operationType: Option | null;
  source: Option | null;
  purpose: Option | null;
  treasurer: Option | null;
}

function PendingApprovalSearchModal({
  isOpen,
  onClose,
  onSearch,
}: PendingApprovalSearchModalProps) {
  // Track which fields have been clicked to trigger on-demand fetching
  const [interactedFields, setInteractedFields] = useState<
    Record<string, boolean>
  >({
    operationType: false,
    source: false,
    purpose: false,
    treasurer: false,
  });

  const handleFieldOpen = (field: string) => {
    setInteractedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Queries - enabled only when specific selector is opened
  const { data: opTypesResponse, isFetching: isFetchingOpTypes } =
    useGetOperationTypes({
      enabled: interactedFields.operationType,
    });

  const { data: cashBoxesResponse, isFetching: isFetchingCashBoxes } =
    useGetPendingApprovalCashBoxes({
      enabled: interactedFields.source,
    });

  const { data: purposesResponse, isFetching: isFetchingPurposes } =
    useGetCashPurposes({
      enabled: interactedFields.purpose,
    });

  // Şirkətlər — xəzinədar seçimi açılanda lazım olur
  const { data: rootCompaniesResponse } = useGetRootCompanies({
    enabled: interactedFields.treasurer,
  });
  const firstCompanyId = rootCompaniesResponse?.result?.[0]?.value;

  const { data: nodesResponse, isFetching: isFetchingNodes } = useGetNodes(
    firstCompanyId,
    { enabled: interactedFields.treasurer && !!firstCompanyId, pageIndex: 0 },
  );

  // Mappings
  const operationTypeOptions: Option[] = useMemo(() => {
    if (!opTypesResponse?.result) return [];
    return opTypesResponse.result.map((item) => ({
      id: String(item.value),
      fullName: item.label,
      role: "",
    }));
  }, [opTypesResponse]);

  const sourceOptions: Option[] = useMemo(() => {
    if (!cashBoxesResponse?.result) return [];
    return cashBoxesResponse.result.map((box) => ({
      id: box.value,
      fullName: box.label,
      role: "",
    }));
  }, [cashBoxesResponse]);

  const purposeOptions: Option[] = useMemo(() => {
    if (!purposesResponse?.result) return [];
    return purposesResponse.result.map((purpose) => ({
      id: purpose.value,
      fullName: purpose.label,
      role: "",
    }));
  }, [purposesResponse]);

  const treasurerOptions: Option[] = useMemo(() => {
    if (!nodesResponse?.result?.data) return [];
    return nodesResponse.result.data.map((node) => ({
      id: node?.value || "",
      fullName: node?.label || "",
      role: "",
    }));
  }, [nodesResponse]);

  const [formData, setFormData] = useState<PendingApprovalSearchFormData>({
    operationType: null,
    source: null,
    purpose: null,
    treasurer: null,
  });

  const handleInputChange = (
    field: keyof PendingApprovalSearchFormData,
    value: Option | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(formData);
    onClose();
  };

  const handleClear = () => {
    setFormData({
      operationType: null,
      source: null,
      purpose: null,
      treasurer: null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Axtarış"
      size="md"
      className={styles.customModalWidth}
    >
      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="operationType">
              Əməliyyatın növü
            </label>
            <CustomSelect
              id="operationType"
              options={operationTypeOptions}
              value={formData.operationType}
              onChange={(value) => handleInputChange("operationType", value)}
              onOpen={() => handleFieldOpen("operationType")}
              defaultText={isFetchingOpTypes ? "Yüklənir..." : "Seçin"}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Axtar..."
              disabled={isFetchingOpTypes}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="source">
              Mənbə
            </label>
            <CustomSelect
              id="source"
              options={sourceOptions}
              value={formData.source}
              onChange={(value) => handleInputChange("source", value)}
              onOpen={() => handleFieldOpen("source")}
              defaultText={isFetchingCashBoxes ? "Yüklənir..." : "Seçin"}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Mənbə axtar..."
              disabled={isFetchingCashBoxes}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="purpose">
              Təyinat
            </label>
            <CustomSelect
              id="purpose"
              options={purposeOptions}
              value={formData.purpose}
              onChange={(value) => handleInputChange("purpose", value)}
              onOpen={() => handleFieldOpen("purpose")}
              defaultText={isFetchingPurposes ? "Yüklənir..." : "Seçin"}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Təyinat axtar..."
              disabled={isFetchingPurposes}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="treasurer">
              Xəzinədar
            </label>
            <CustomSelect
              id="treasurer"
              options={treasurerOptions}
              value={formData.treasurer}
              onChange={(value) => handleInputChange("treasurer", value)}
              onOpen={() => handleFieldOpen("treasurer")}
              defaultText={isFetchingNodes ? "Yüklənir..." : "Seçin"}
              variant="form"
              isSearchable={true}
              disabled={isFetchingNodes}
              searchPlaceholder="Xəzinədar axtar..."
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.actionButtons}>
            <Button
              type="button"
              variant="primary"
              onClick={handleSearch}
              className={styles.searchButton}
            >
              Axtar
            </Button>
            <Button
              type="button"
              variant="clear"
              onClick={handleClear}
              className={styles.clearButton}
            >
              Təmizlə
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PendingApprovalSearchModal;
