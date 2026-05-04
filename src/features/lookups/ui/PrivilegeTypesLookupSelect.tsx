import { useState } from "react";
import { CustomSelect } from "@/shared/ui";
import type { Option } from "@/shared/types";
import { usePrivilegeTypes } from "../hooks/usePrivilegeTypes";

export interface PrivilegeTypesLookupSelectProps {
  value: Option | null;
  onChange: (value: Option | null) => void;
  id?: string;
  defaultText?: string;
  variant?: "default" | "navbar" | "form" | "compact";
  isSearchable?: boolean;
  disabled?: boolean;
}


export const PrivilegeTypesLookupSelect: React.FC<PrivilegeTypesLookupSelectProps> = ({
  value,
  onChange,
  id = "privilege-types-select",
  defaultText = "Seçin",
  variant = "form",
  isSearchable = true,
  disabled = false,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  const { options, isLoading, refetch } = usePrivilegeTypes(hasOpened || !!value);

  const handleOpen = () => {
    if (!hasOpened) setHasOpened(true);
    refetch();
  };

  return (
    <CustomSelect
      id={id}
      options={options}
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
