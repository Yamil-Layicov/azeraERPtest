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

export interface LdapDirectory {
  id: string;
  name: string;
  domain: string;
  host: string;
  port: number;
  useSsl: boolean;
  useTls: boolean;
  baseDn: string;
  username: string;
  password: string;
  searchFilter: string;
  timeout: number;
  isActive: boolean;
  companies?: {
    companyId: string;
    companyName: string;
    searchBaseDn?: string;
  }[];
  companyResponses?: any[];
  companyIds?: string[];
}

export type GetLdapDirectoriesResponse = {
  result?: LdapDirectory[] | {
    data: LdapDirectory[];
    totalCount?: number;
  };
};
