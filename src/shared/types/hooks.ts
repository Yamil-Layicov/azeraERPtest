import type { Option } from './common';

export interface FormData {
  selectedDate: Date | null;
  transactionType: string;
  amount: string;
  rate: string;
  purpose: Option | null;
  personName: string;
  reference: string;
  notes: string;
  document: File[] | null;
  counterparty: Option | null;
  currency: Option | null;
  source: Option | null;
  destination: Option | null;
  business: Option | null;
  company: Option | null;
  showSuccessModal: boolean;
  showErrorModal: boolean;
}

export type { Option } from './common';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}