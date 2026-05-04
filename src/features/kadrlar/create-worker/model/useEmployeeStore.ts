import { create } from "zustand";

interface EmployeeStore {
  rootCompanyId: string | null;
  subCompanyId: string | null;
  setRootCompanyId: (id: string | null) => void;
  setSubCompanyId: (id: string | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  rootCompanyId: null,
  subCompanyId: null,
  setRootCompanyId: (id) => set({ rootCompanyId: id }),
  setSubCompanyId: (id) => set({ subCompanyId: id }),
}));
