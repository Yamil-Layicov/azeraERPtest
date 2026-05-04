import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { getBackendErrorMessage } from '@/shared/api';
import styles from './StaffFormPanel.module.css';
import { Button, CustomSelect } from "@/shared/ui";
import FormInput from "@/shared/ui/input/FormInput";
import Checkbox from "@/shared/ui/checkbox/Checkbox";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSetNodeActive, useCreateNode } from "@/features/kadrlar/staff-table";
import { 
  useRootCompaniesLookup, 
  useEmployeesLookup, 
  useNodesLookup,
  useSubCompaniesLookup, 
  usePositionsLookupPaged 
} from "@/features/kadrlar/departments";
import { useEnumItemsByCode } from "@/features/lookups/hooks/useEnumItemsByCode";
import type { Option } from "@/shared/types";
import { useDebounce } from "@/shared/hooks";

interface StaffFormData {
  isMain: boolean;
  department: Option | null;
  employee: Option | null;
  isLeader: boolean;
  company: Option | null;
  position: Option | null;
  replacedEmployee: Option | null;
  isActive: boolean; 
}

interface StaffInitialData {
  id?: number;
  employeeId?: string;
  employee?: string;
  positionId?: string;
  position?: string | Option | null;
  company?: Option | null;
  department?: Option | null;
  replacedPerson?: string | null;
  isMain?: boolean;
  isLeader?: boolean;
  isActive?: boolean;
  staffCategoriesCode?: string;
  createdAt?: string;
  createdBy?: string | null;
}

interface StaffFormPanelProps {
  mode?: 'create' | 'edit';
  initialData?: StaffInitialData | null;
  onCancel?: () => void;
  onSave?: (data: StaffFormData) => void;
  showTitle?: boolean;
  onClose?: () => void;
}

const StaffFormPanel: React.FC<StaffFormPanelProps> = ({ 
  mode = 'create', 
  initialData, 
  onCancel, 
  onSave,
  showTitle = true,
  onClose
}) => {
  const setNodeActiveMutation = useSetNodeActive();
  const createNodeMutation = useCreateNode();
  
  const [formData, setFormData] = useState<StaffFormData>({
    isMain: true,
    department: null,
    employee: null,
    isLeader: false,
    company: null,
    position: null,
    replacedEmployee: null,
    isActive: true 
  });

  const { data: rootCompaniesOptions = [] } = useRootCompaniesLookup(mode !== 'edit');
  const { data: employeesOptions = [] } = useEmployeesLookup(
    mode !== 'edit' && formData.company?.id ? String(formData.company.id) : null
  );
  const { data: nodesOptions = [] } = useNodesLookup(
    mode !== 'edit' && !formData.isMain && formData.company?.id ? String(formData.company.id) : null,
    0
  );
  const { data: subCompaniesOptions = [] } = useSubCompaniesLookup(
    mode !== 'edit' && formData.company?.id ? String(formData.company.id) : null
  );

  const [positionsPageIndex, setPositionsPageIndex] = useState(0);
  const [positionSearchQuery, setPositionSearchQuery] = useState("");
  const debouncedPositionSearchQuery = useDebounce(positionSearchQuery, 400);
  const [positionOptions, setPositionOptions] = useState<Option[]>([]);
  const [positionsTotalCount, setPositionsTotalCount] = useState(0);
  const [isPositionsSelectOpened, setIsPositionsSelectOpened] = useState(false);

  const isCreateMode = mode !== "edit";
  const {
    data: positionsPageData,
    isLoading: isLoadingPositionsPage,
    isFetching: isFetchingPositionsPage,
  } = usePositionsLookupPaged(
    positionsPageIndex,
    debouncedPositionSearchQuery || undefined,
    isCreateMode && isPositionsSelectOpened,
  );

  useEffect(() => {
    if (!isCreateMode) return;
    setPositionsPageIndex(0);
    setPositionOptions([]);
    setPositionsTotalCount(0);
    setPositionSearchQuery("");
    setIsPositionsSelectOpened(false);
  }, [isCreateMode]);

  useEffect(() => {
    if (!isCreateMode) return;
    if (!isPositionsSelectOpened) return;
    setPositionsPageIndex(0);
    setPositionOptions([]);
  }, [debouncedPositionSearchQuery, isCreateMode, isPositionsSelectOpened]);

  useEffect(() => {
    if (!positionsPageData) return;
    setPositionsTotalCount(positionsPageData.totalCount);
    setPositionOptions((prev) => {
      if (positionsPageData.pageIndex === 0) return positionsPageData.options;

      const existingIds = new Set(prev.map((opt) => String(opt.id)));
      const appended = positionsPageData.options.filter(
        (opt) => !existingIds.has(String(opt.id)),
      );
      return [...prev, ...appended];
    });
  }, [positionsPageData]);

  const hasNextPositions = useMemo(
    () => positionOptions.length < positionsTotalCount,
    [positionOptions.length, positionsTotalCount],
  );

  const handlePositionSearch = useCallback((query: string) => {
    setPositionSearchQuery(query.trim());
  }, []);

  const handlePositionsMenuOpen = useCallback(() => {
    setIsPositionsSelectOpened(true);
    if (positionOptions.length === 0) {
      setPositionsPageIndex(0);
      setPositionsTotalCount(0);
    }
  }, [positionOptions.length]);

  const handlePositionScroll = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight + 10 &&
        hasNextPositions &&
        !isFetchingPositionsPage &&
        !isLoadingPositionsPage
      ) {
        setPositionsPageIndex((prev) => prev + 1);
      }
    },
    [hasNextPositions, isFetchingPositionsPage, isLoadingPositionsPage],
  );

  const staffCategoriesQuery = useEnumItemsByCode("StaffCategories", true);
  const staffCategoriesList = staffCategoriesQuery.rawData || [];

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        isMain: initialData.isMain ?? true,
        department: initialData.department ?? null,
        employee: initialData.employee ? { id: initialData.employeeId || String(initialData.id), fullName: initialData.employee, role: "" } : null,
        isLeader: initialData.isLeader ?? false,
        company: initialData.company ?? null,
        position: initialData.position 
          ? (typeof initialData.position === 'string' 
              ? { id: "99", fullName: initialData.position, role: "" } 
              : initialData.position)
          : null,
        replacedEmployee: initialData.replacedPerson ? { id: "88", fullName: initialData.replacedPerson, role: "" } : null,
        isActive: initialData.isActive ?? true 
      });
    } else {
      setFormData({
        isMain: true,
        department: null,
        employee: null,
        isLeader: false,
        company: null,
        position: null,
        replacedEmployee: null,
        isActive: true
      });
    }
  }, [mode, initialData]);

  const handleChange = (field: keyof StaffFormData, value: boolean | Option | null) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'company') {
        newData.employee = null;
        newData.department = null;
        newData.position = null;
        newData.replacedEmployee = null;
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (mode === 'edit') {
      if (!initialData?.id) {
        toast.error("ID tapılmadı");
        return;
      }
      const nodeId = String(initialData.id);
      const newIsActive = !formData.isActive; 
      try {
        await setNodeActiveMutation.mutateAsync({ nodeId, isActive: newIsActive });
        toast.success(newIsActive ? "Node uğurla aktiv edildi" : "Node uğurla deaktiv edildi");
        if (onSave) {
          onSave({ ...formData, isActive: newIsActive });
        }
        if (onClose) {
          onClose();
        }
      } catch (error) {
        const message = isAxiosError(error) ? getBackendErrorMessage(error) : (error instanceof Error ? error.message : (newIsActive ? "Aktiv etmə zamanı xəta baş verdi" : "Deaktiv etmə zamanı xəta baş verdi"));
        toast.error(message);
      }
    } else {
      if (!formData.company) {
        toast.error("Şirkət seçilməlidir");
        return;
      }
      if (!formData.employee) {
        toast.error("İşçi seçilməlidir");
        return;
      }
      if (formData.isMain) {
        if (!formData.department) {
          toast.error("Departament / Şöbə / Bölmə seçilməlidir");
          return;
        }
        if (!formData.position) {
          toast.error("Vəzifə seçilməlidir");
          return;
        }
      } else {
        if (!formData.replacedEmployee) {
          toast.error("Əvəz olunacaq əməkdaş seçilməlidir");
          return;
        }
      }

      try {
        const payload = {
          isMain: formData.isMain,
          employmentId: String(formData.employee.id),
          isHead: formData.isLeader,
          subCompanyId: formData.department ? String(formData.department.id) : null,
          positionId: formData.isMain && formData.position ? String(formData.position.id) : null,
          relatedNodeId: formData.replacedEmployee ? String(formData.replacedEmployee.id) : null,
        };

        await createNodeMutation.mutateAsync(payload);
        toast.success("Ştat uğurla yaradıldı");
        
        if (onSave) {
          onSave(formData);
        }
        if (onClose) {
          onClose();
        }
      } catch (error) {
        const message = isAxiosError(error) ? getBackendErrorMessage(error) : (error instanceof Error ? error.message : "Ştat yaratma zamanı xəta baş verdi");
        toast.error(message);
      }
    }
  };

  const getButtonConfig = () => {
    if (mode === 'create') {
      return {
        text: 'Yadda saxla',
        style: {} 
      };
    }

    if (formData.isActive) {
      return {
        text: 'Deaktiv et',
        style: { 
          backgroundColor: '#ef4444', 
          borderColor: '#ef4444',
          color: 'white' 
        }
      };
    } else {
      return {
        text: 'Aktiv et',
        style: { 
          backgroundColor: '#10b981', 
          borderColor: '#10b981',
          color: 'white' 
        }
      };
    }
  };

  const buttonConfig = getButtonConfig();
  return (
    <div className={styles.container}>
      {showTitle && (
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            {mode === 'create' ? 'Yeni Ştat Vahidi' : 'Ştat Məlumatları'}
          </div>
          {onClose && (
            <Button 
              type="button" 
              variant="clear" 
              onClick={onClose}
              className={styles.closeBtn}
            >
              <XMarkIcon width={20} />
            </Button>
          )}
        </div>
      )}

      <div className={styles.checkboxWrapper}>
        <Checkbox
          id="isMain"
          label="Əsas"
          checked={formData.isMain}
          onChange={(checked) => handleChange("isMain", checked)}
          disabled={mode === 'edit'}
        />
      </div>

      {mode === 'edit' ? (
        <FormInput
          type="text"
          id="company"
          label="Şirkət"
          value={initialData?.company?.fullName || ''}
          placeholder=""
          disabled={true}
        />
      ) : (
        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
            Şirkət <span className="required-star">*</span>
          </label>
          <CustomSelect
            options={rootCompaniesOptions}
            value={formData.company}
            onChange={(val) => handleChange("company", val)}
            defaultText="Seçin"
            isSearchable={true}
          />
        </div>
      )}

      {formData.isMain ? (
        <>
          {mode === 'edit' ? (
            <FormInput
              type="text"
              id="employee"
              label="İşçi"
              value={initialData?.employee || ''}
              placeholder=""
              disabled={true}
            />
          ) : (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                İşçi <span className="required-star">*</span>
              </label>
              <CustomSelect
                options={employeesOptions}
                value={formData.employee}
                onChange={(val) => handleChange("employee", val)}
                defaultText="Seçin"
                isSearchable={true}
                disabled={!formData.company}
              />
            </div>
          )}

          {mode === 'edit' ? (
            <FormInput
              type="text"
              id="isLeader"
              label="Heyət"
              value={
                initialData?.staffCategoriesCode 
                  ? (staffCategoriesList.find((item: any) => String(item.value) === String(initialData.staffCategoriesCode))?.label ?? initialData.staffCategoriesCode)
                  : (formData.isLeader ? "true" : "false")
              }
              placeholder=""
              disabled={true}
            />
          ) : (
            <div className={styles.checkboxWrapper}>
              <Checkbox
                id="isLeader"
                label="Rəhbər"
                checked={formData.isLeader}
                onChange={(checked) => handleChange("isLeader", checked)}
              />
            </div>
          )}

          {mode === 'edit' ? (
            <FormInput
              type="text"
              id="department"
              label="Departament / Şöbə / Bölmə"
              value={initialData?.department?.fullName || ''}
              placeholder=""
              disabled={true}
            />
          ) : (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                Departament / Şöbə / Bölmə <span className="required-star">*</span>
              </label>
              <CustomSelect
                options={subCompaniesOptions}
                value={formData.department}
                onChange={(val) => handleChange("department", val)}
                defaultText="Seçin"
                isSearchable={true}
                disabled={!formData.company}
              />
            </div>
          )}

          {mode === 'edit' ? (
            <FormInput
              type="text"
              id="position"
              label="Vəzifə"
              value={
                initialData?.position
                  ? (typeof initialData.position === "string"
                      ? initialData.position
                      : (initialData.position as Option).fullName)
                  : ""
              }
              placeholder=""
              disabled={true}
            />
          ) : (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                Vəzifə <span className="required-star">*</span>
              </label>
              <CustomSelect
                options={positionOptions}
                value={formData.position}
                onChange={(val) => handleChange("position", val)}
                defaultText="Seçin"
                isSearchable={true}
                searchPlaceholder="Axtar..."
                disabled={!formData.company}
                onSearch={handlePositionSearch}
                onScroll={handlePositionScroll}
                onMenuOpen={handlePositionsMenuOpen}
                isLoading={isLoadingPositionsPage || isFetchingPositionsPage}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {mode === 'edit' ? (
            <FormInput
              type="text"
              id="employee"
              label="İşçi"
              value={initialData?.employee || ''}
              placeholder=""
              disabled={true}
            />
          ) : (
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                İşçi <span className="required-star">*</span>
              </label>
              <CustomSelect
                options={employeesOptions}
                value={formData.employee}
                onChange={(val) => handleChange("employee", val)}
                defaultText="Seçin"
                isSearchable={true}
                disabled={!formData.company}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
              Əvəz olunacaq əməkdaş <span className="required-star">*</span>
            </label>
            <CustomSelect
              options={nodesOptions}
              value={formData.replacedEmployee}
              onChange={(val) => handleChange("replacedEmployee", val)}
              defaultText="Seçin"
              isSearchable={true}
              disabled={mode === 'edit' || !formData.company}
            />
          </div>
        </>
      )}

      {mode === 'edit' && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: "140px", color: "#868e96", fontStyle: "italic" }}>
              Yaranma tarixi:
            </label>
            <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#868e96", fontStyle: "italic" }}>
              {initialData?.createdAt ? new Date(initialData.createdAt).toLocaleString("az-AZ", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, minWidth: "140px", color: "#868e96", fontStyle: "italic" }}>
              Daxil edən:
            </label>
            <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#868e96", fontStyle: "italic" }}>
              {initialData?.createdBy || "-"}
            </span>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <Button 
          type="button"
          className={styles.formBtn} 
          variant="primary"
          onClick={handleSubmit}
          disabled={setNodeActiveMutation.isPending}
        >
          {setNodeActiveMutation.isPending ? 'Gözləyin...' : buttonConfig.text}
        </Button>
        <Button 
          type="button"
          className={styles.formBtn} 
          variant="secondary" 
          onClick={onCancel}
        >
          {mode === 'edit' ? 'İmtina et' : 'Ləğv et'}
        </Button>
      </div>
    </div>
  );
};

export default StaffFormPanel;
