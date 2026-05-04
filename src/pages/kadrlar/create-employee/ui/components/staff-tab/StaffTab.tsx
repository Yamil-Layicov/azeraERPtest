import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import styles from "./StaffTab.module.css";
import { CustomSelect, Checkbox } from "@/shared/ui";
import { EnumLookupSelect } from "@/features/lookups";
import type { StaffTabProps } from "./types";
import { useCreateEmployeeContext } from "../../../contexts/CreateEmployeeContext";
import { departmentsService } from "@/features/kadrlar/departments";
import { createEmployeeService } from "@/features/kadrlar/create-employee/api";
import type { Option } from "@/shared/types";
import type { AxiosError } from "axios";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

const StaffTab: React.FC<StaffTabProps> = () => {
  const {
    formData,
    handleInputChange: onInputChange,
    rootCompanyId,
    employmentId,
    setHandleStaffSave,
  } = useCreateEmployeeContext();
  
  const [subCompaniesOptions, setSubCompaniesOptions] = useState<Option[]>([]);
  const [isLoadingSubCompanies, setIsLoadingSubCompanies] = useState(false);
  const [positionsOptions, setPositionsOptions] = useState<Option[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);

  const handleSave = useCallback(async () => {
    if (!employmentId) {
      toast.error("İşçi yaradılmamışdır");
      return;
    }

    if (!formData.company) {
      toast.error("İş yeri seçilməlidir");
      return;
    }

    if (!formData.position) {
      toast.error("Vəzifə seçilməlidir");
      return;
    }

    try {
      const payload = {
        isMain: true,
        employmentId: employmentId,
        isHead: formData.isLeader || false,
        subCompanyId: formData.company.id.toString(),
        positionId: formData.position.id.toString(),
        experienceTypeCode: formData.experienceType ? formData.experienceType.id.toString() : null,
        relatedNodeId: null,
      };

      const response = await createEmployeeService.createNode(payload);

      if (response && (response as any).isSuccess !== false) {
        toast.success("Ştat cədvəli məlumatları uğurla yadda saxlanıldı");
      } else {
        const errorMessage = (response as any)?.errorMessage || "Xəta baş verdi";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(getBackendErrorMessage(error as AxiosError) || "Xəta baş verdi");
      const errorMessage = error?.response?.data?.errorMessage || error?.message || "Xəta baş verdi";
      toast.error(errorMessage);
    }
  }, [employmentId, formData.company, formData.position, formData.isLeader, formData.experienceType]);

  // Register handleSave to context
  useEffect(() => {
    if (setHandleStaffSave) {
      setHandleStaffSave(handleSave);
    }
  }, [setHandleStaffSave, handleSave]);

  useEffect(() => {
    const loadSubCompanies = async () => {
      if (!rootCompanyId) {
        return;
      }

      setIsLoadingSubCompanies(true);
      try {
        const options = await departmentsService.getSubCompaniesLookup(rootCompanyId);
        setSubCompaniesOptions(options);
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError) || "Alt şirkətlər yüklənərkən xəta baş verdi");
      } finally {
        setIsLoadingSubCompanies(false);
      }
    };

    loadSubCompanies();
  }, [rootCompanyId]);

  useEffect(() => {
    const loadPositions = async () => {
      setIsLoadingPositions(true);
      try {
        const response = await departmentsService.getPositionsLookup();
        setPositionsOptions(response.options);
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError) || "Vəzifələr yüklənərkən xəta baş verdi");
      } finally {
        setIsLoadingPositions(false);
      }
    };

    loadPositions();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.formRow}>
        <div style={{ marginTop: "5px" }}>
          <Checkbox id="cbx-leader" label="Rəhbər" checked={formData.isLeader} onChange={(checked) => onInputChange("isLeader", checked)} />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Departament / Şöbə / Bölmə</label>
          <CustomSelect 
            options={subCompaniesOptions} 
            value={formData.company} 
            onChange={(val) => onInputChange("company", val)} 
            defaultText={isLoadingSubCompanies ? "Yüklənir..." : subCompaniesOptions.length > 0 ? "Seçin" : "İş yeri seçilməyib"} 
            isSearchable={true} 
            searchPlaceholder="Axtar..." 
            disabled={isLoadingSubCompanies || !rootCompanyId}
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Vəzifə</label>
          <CustomSelect 
            options={positionsOptions} 
            value={formData.position} 
            onChange={(val) => onInputChange("position", val)} 
            defaultText={isLoadingPositions ? "Yüklənir..." : positionsOptions.length > 0 ? "Seçin" : "Vəzifə seçilməyib"} 
            isSearchable={true} 
            searchPlaceholder="Axtar..." 
            disabled={isLoadingPositions}
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Staj növü</label>
          <EnumLookupSelect
            id="experience-type"
            code="ExperienceTypes"
            value={formData.experienceType}
            onChange={(val) => onInputChange("experienceType", val)}
            defaultText="Seçin"
            isClearable={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffTab;