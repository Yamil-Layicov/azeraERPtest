import type { Option } from "@/shared/types";

export type EntryId = string;

export interface ContactEntry {
  id: EntryId;
  type: Option | null;
  value: string;
  isPrimary: boolean;
}

export interface SocialEntry {
  id: EntryId;
  type: Option | null;
  value: string;
}

export interface ExternalEntry {
  id: EntryId;
  type: Option | null;
  value: string;
}

