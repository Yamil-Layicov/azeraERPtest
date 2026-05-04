import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";

/**
 * Table'daki row'un edit/delete butonlarını gösterip göstermeyeceğini kontrol eder
 * 
 * @param itemEmployeeId - Table row'dan gelen employeeId
 * @returns boolean - true: butonlar gösterilir, false: gizlenir
 * 
 * @example
 * const canManage = useCanManageRow(row.employeeId);
 * {canManage && <EditButton />}
 */
export const useCanManageRow = (itemEmployeeId?: string | number | null): boolean => {
  const storeEmployeeId = useAddEmployeeStore((state) => state.employeeId);
  
  const selectedEmployeeId = String(storeEmployeeId ?? "").trim().toLowerCase();
  const normalizedItemId = String(itemEmployeeId ?? "").trim().toLowerCase();
  
  // Eğer store'da seçili employeeId yoksa, tüm satırlar düzenlenebilir
  if (!selectedEmployeeId) return true;
  
  // Eğer row'da employeeId yoksa, gösterme
  if (!normalizedItemId) return false;
  
  // İkisi de varsa, eşleştir
  return normalizedItemId === selectedEmployeeId;
};
