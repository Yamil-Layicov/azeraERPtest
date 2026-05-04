export interface Option {
  id: number | string;
  fullName?: string;
  label?: string;
  role?: string;
  disabled?: boolean; 
  isCounterParty?: boolean;
}

export type Theme = 'light' | 'dark';

export interface ValidationError {
  field: string;
  message: string;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
