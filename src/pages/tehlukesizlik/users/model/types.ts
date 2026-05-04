import type { UserEntry } from "@/features/security/users";

export type User = UserEntry;

export interface SelectionItem {
     id: number;
     name: string;
     groupId?: string;
   }