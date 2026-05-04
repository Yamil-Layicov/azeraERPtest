import type { Option } from "@/shared/types";
import type { EnumLookupItem } from "../model/types";

/** Map backend enum items (value/label/disabled) to Option format for selects */
export const mapEnumItemsToOptions = (items: EnumLookupItem[] | null | undefined): Option[] => {
  if (!items || !Array.isArray(items)) return [];

  return items
    .filter((item) => item && (item.value != null || item.label != null || item.name != null || item.fullName != null || item.id != null))
    .map((item) => ({
      id: item.value ?? item.id ?? item.code ?? String(Math.random()),
      fullName: item.label ?? item.name ?? item.displayName ?? item.fullName ?? "",
      role: String(item.role ?? ""),
      disabled: !!item.disabled, // Burası artık API'den gelen disabled bilgisini UI'a taşıyor
      legalBasisCode: (item as any).legalBasisCode,
    }));
};
