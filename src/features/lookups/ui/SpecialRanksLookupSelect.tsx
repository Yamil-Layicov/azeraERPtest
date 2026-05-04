import { useState } from "react";
import { GroupedCustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { useSpecialRanks } from "../hooks/useSpecialRanks";

export interface SpecialRanksLookupSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  organCode?: string;
  /** When true, only calls specialRanks API after organCode is set (avoids GET /specialRanks without organ when backend returns 500). */
  onlyFetchWithOrganCode?: boolean;
  id?: string;
  defaultText?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  disabled?: boolean;
}

/**
 * Special ranks select with grouped options and lazy load.
 */
export const SpecialRanksLookupSelect: React.FC<SpecialRanksLookupSelectProps> = ({
  value,
  onChange,
  organCode,
  onlyFetchWithOrganCode = false,
  id = "special-ranks-select",
  defaultText = "Seçin",
  variant = "form",
  isSearchable = true,
  disabled = false,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const canLoad = hasOpened || !!value;
  const shouldFetch =
    canLoad && (!onlyFetchWithOrganCode || (!!organCode && organCode.trim() !== ""));
  const { groupedOptions, isLoading, refetch } = useSpecialRanks(shouldFetch, organCode);

  const handleOpen = () => {
    if (!hasOpened) setHasOpened(true);
    if (shouldFetch) void refetch();
  };

  return (
    <GroupedCustomSelect
      id={id}
      options={groupedOptions}
      value={value}
      onChange={onChange}
      defaultText={defaultText}
      variant={variant}
      isSearchable={isSearchable}
      searchPlaceholder="Axtar..."
      disabled={disabled || isLoading}
      onOpen={handleOpen}
    />
  );
};
