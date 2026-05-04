import type { RefObject, ChangeEvent } from "react";

export interface AvatarUploaderProps {
  // Optional - will use context if not provided
  preview?: string | null;
  fileInputRef?: RefObject<HTMLInputElement | null>; 
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onClick?: () => void;
}

