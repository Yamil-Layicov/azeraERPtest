import React, { useState, useEffect } from 'react';
import styles from './VacancyForm.module.css';
import { Button, FormInput } from '@/shared/ui';
import CustomSelect from '@/shared/ui/select/CustomSelect';
import type { Option } from '@/shared/types';
import { useCompaniesLookup } from "@/features/kadrlar/departments";
import { usePositions, useLookups, useWorkloadRates } from "@/features/lookups/hooks";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import { useDebounce } from "@/shared/hooks";

export interface VacancyFormPayload {
  organizationUnitId: string;
  positionId: string;
  positionName: string;
  workloadRateCode: string;
  staffCategoryCode: string;
  sayi: number | "";
}

export interface VacancyFormData {
  organizationUnitId: string;
  organizationUnit: Option | null;
  positionId: string;
  positionName: string;
  position: Option | null;
  workloadRateCode: string;
  workloadRate: Option | null;
  staffCategoryCode: string;
  staffCategory: Option | null;
  sayi: number | "";
}

interface VacancyFormProps {
  onSave: (data: VacancyFormPayload) => void;
  isLoading?: boolean;
  defaultParent?: Option | null;
}

const VacancyForm: React.FC<VacancyFormProps> = ({ 
  onSave, 
  isLoading = false,
  defaultParent = null
}) => {
  const [positionSearch, setPositionSearch] = useState("");
  const debouncedPositionSearch = useDebounce(positionSearch, 500);
  const {
    options: positionsOptions,
    isLoading: isPositionsLoading,
    fetchNextPage: fetchNextPositions,
    hasNextPage: hasNextPositions,
    isFetchingNextPage: isFetchingNextPositions,
  } = usePositions(debouncedPositionSearch, true);
  
  const { data: lookupsData } = useLookups();
  const { data: workloadData } = useWorkloadRates();
  const staffCategoryOptions = React.useMemo(() => mapEnumItemsToOptions(lookupsData?.result?.staffCategories), [lookupsData]);
  const workloadOptions = React.useMemo(() => mapEnumItemsToOptions(workloadData?.result), [workloadData]);

  const { data: companiesOptions = [] } = useCompaniesLookup();
  
  const toStr = (v: string | number | undefined | null): string => 
    v != null ? String(v) : '';

  const [formData, setFormData] = useState<VacancyFormData>({
    organizationUnitId: toStr(defaultParent?.id),
    organizationUnit: defaultParent,
    positionId: '',
    positionName: '',
    position: null,
    workloadRateCode: '',
    workloadRate: null,
    staffCategoryCode: '',
    staffCategory: null,
    sayi: 1,
  });

  useEffect(() => {
    if (defaultParent) {
      const fullOption = companiesOptions.find(opt => String(opt.id) === String(defaultParent.id));
      const targetOption = fullOption || defaultParent;
      
      setFormData(prev => ({
        ...prev,
        organizationUnitId: toStr(targetOption.id),
        organizationUnit: targetOption,
      }));
    }
  }, [defaultParent, companiesOptions]);

  const handleChange = (field: keyof VacancyFormData, value: Option | null) => {
    if (field === 'organizationUnit') {
      setFormData(prev => ({
        ...prev,
        organizationUnit: value,
        organizationUnitId: toStr(value?.id)
      }));
      return;
    }

    const updates: Partial<VacancyFormData> = { [field]: value };
    if (field === 'position') {
      updates.positionId = toStr(value?.id);
      updates.positionName = value?.fullName ?? '';
    } else if (field === 'workloadRate') {
      updates.workloadRateCode = toStr(value?.id);
    } else if (field === 'staffCategory') {
      updates.staffCategoryCode = toStr(value?.id);
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleClear = () => {
    setPositionSearch("");
    setFormData({
      organizationUnitId: toStr(defaultParent?.id),
      organizationUnit: defaultParent,
      positionId: '',
      positionName: '',
      position: null,
      workloadRateCode: '',
      workloadRate: null,
      staffCategoryCode: '',
      staffCategory: null,
      sayi: 1,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      organizationUnitId: formData.organizationUnitId,
      positionId: formData.positionId,
      positionName: formData.position?.fullName ?? '',
      workloadRateCode: formData.workloadRateCode,
      staffCategoryCode: formData.staffCategoryCode,
      sayi: formData.sayi,
    });
  };

  const isFormValid = formData.organizationUnitId && formData.positionId 
    && formData.workloadRateCode && formData.staffCategoryCode && formData.sayi !== "" && Number(formData.sayi) >= 1 && Number(formData.sayi) <= 20;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label htmlFor="organizationUnit" className={styles.label}>
            Əsas qurum <span className={styles.required}>*</span>
          </label>
          <CustomSelect
            id="organizationUnit"
            options={companiesOptions}
            value={formData.organizationUnit}
            onChange={(option) => handleChange('organizationUnit', option)}
            defaultText="Əsas qurum seçin"
            disabled={isLoading || !!defaultParent}
            isClearable={!defaultParent}
            isSearchable={true}
          />
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label htmlFor="position" className={styles.label}>
              Vəzifə <span className={styles.required}>*</span>
            </label>
            <CustomSelect
              id="position"
              options={positionsOptions}
              value={formData.position}
              onChange={(option) => handleChange('position', option)}
              defaultText={isPositionsLoading ? "Yüklənir..." : "Seçin"}
              disabled={isLoading}
              isClearable={false}
              isSearchable
              onSearch={(q) => setPositionSearch(q)}
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                if (
                  scrollHeight - scrollTop <= clientHeight + 10 &&
                  hasNextPositions &&
                  !isFetchingNextPositions
                ) {
                  fetchNextPositions();
                }
              }}
              isLoading={isFetchingNextPositions || isPositionsLoading}
              variant="form"
            />
          </div>

          <div className={styles.formGroup} style={{ width: "120px" }}>
            <label htmlFor="vacancy-sayi" className={styles.label}>
              Sayı <span className={styles.required}>*</span>
            </label>
            <FormInput
              id="vacancy-sayi"
              type="number"
              placeholder="1"
              value={formData.sayi === "" ? "" : String(formData.sayi)}
              onChange={(v) => {
                const val = v.trim();
                if (val === "") {
                  setFormData(prev => ({ ...prev, sayi: "" }));
                  return;
                }
                const num = parseInt(val, 10) || 1;
                setFormData(prev => ({ ...prev, sayi: Math.min(20, Math.max(1, num)) }));
              }}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="staffCategory" className={styles.label}>
            Heyyət <span className={styles.required}>*</span>
          </label>
          <CustomSelect
            id="staffCategory"
            options={staffCategoryOptions}
            value={formData.staffCategory}
            onChange={(option) => handleChange('staffCategory', option as Option | null)}
            defaultText="Seçin"
            disabled={isLoading}
            variant="form"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workloadRate" className={styles.label}>
            İş rejimi <span className={styles.required}>*</span>
          </label>
          <CustomSelect
            id="workloadRate"
            options={workloadOptions}
            value={formData.workloadRate}
            onChange={(option) => handleChange('workloadRate', option as Option | null)}
            defaultText="Seçin"
            disabled={isLoading}
            variant="form"
          />
        </div>
      </div>
      {/* Buttonlar */}
      <div className={styles.footer}>
        <div className={styles.deleteBtnWrapper}></div>
        <div className={styles.saveBtnWrapper}>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !isFormValid}
            className={styles.formBtn}
          >
            {isLoading ? 'Yüklənir...' : 'Yadda saxla'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            disabled={isLoading}
            className={styles.formBtn}
          >
            Təmizlə
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VacancyForm;


