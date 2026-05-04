import type { DepartmentNode } from "../../../../model/types";
import type { Option } from "@/shared/types";
import type { FormValues } from "../types";
import { COMPANY_TYPE_ID } from "../constants";


export const findOptionById = (
  options: Option[],
  id: string | null | undefined
): Option | null => {
  if (!id) return null;
  return (
    options.find(
      (opt) => opt.id === id || opt.id === String(id)
    ) || null
  );
};


export const transformInitialDataToFormValues = (
  initialData: DepartmentNode,
  companyTypesOptions: Option[],
  companiesOptions: Option[],
  workScheduleOptions: Option[]
): FormValues => {
  const typeOption = findOptionById(
    companyTypesOptions,
    initialData.type
  );

  const parentOption = findOptionById(
    companiesOptions,
    initialData.parentDepartmentId
  );
  const parentOptionFromApiName =
    initialData.parentDepartmentName && initialData.parentDepartmentId
      ? {
          id: initialData.parentDepartmentId,
          fullName: initialData.parentDepartmentName,
          role: "",
        }
      : null;
  const parentOptionFallback =
    !parentOptionFromApiName && !parentOption && initialData.parentDepartmentId
      ? {
          id: initialData.parentDepartmentId,
          fullName: initialData.parentDepartmentName || initialData.parentDepartmentId,
          role: "",
        }
      : null;
  const workScheduleOption = findOptionById(
    workScheduleOptions,
    initialData.workScheduleCode
  );

  const isCompanyType = typeOption?.id === COMPANY_TYPE_ID;

  return {
    type: typeOption,
    fullName: initialData.name || "",
    legalName: isCompanyType ? initialData.legalName || "" : "",
    parent: parentOptionFromApiName || parentOption || parentOptionFallback,
    workSchedule: workScheduleOption,
    voen: initialData.voen || "",
    note: initialData.activity || "",
    website: initialData.website || initialData.website || "", 
    fax: initialData.fax || "",
    phone: initialData.phone || "",

    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
    sortOrder: initialData.sortOrder ?? 0,
    sayi: initialData.sayi ?? "",
    createdAt: initialData.createdAt,
    createdBy: initialData.createdBy,
  };
};

