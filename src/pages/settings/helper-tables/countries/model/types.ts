export interface Country {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  nativeName: string;
  phoneCode: string;
  currencyCode: string;
  isActive: boolean;
  isSystem?: boolean;
}
