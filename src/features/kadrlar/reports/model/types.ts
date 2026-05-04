export interface ReportRequest {
  rootCompanyId?: string | null;
  subCompanyId?: string | null;
  employeeStatus?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  reportType: string;
}

export interface ReportColumn {
  key: string;
  value: string;
}

export interface ReportRow {
  columns: ReportColumn[];
}

export interface ReportResult {
  rows: ReportRow[];
}

export interface ReportResponse {
  version: string;
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  result: ReportResult;
}
