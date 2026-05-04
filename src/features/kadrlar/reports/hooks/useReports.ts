import { useMutation } from "@tanstack/react-query";
import { reportsService } from "../api/reportsService";
import type { ReportRequest,  } from "../model/types";

export const REPORTS_QUERY_KEYS = {
  GET_REPORT: "GET_REPORT",
} as const;

export const useGetReport = () => {
  return useMutation({
    mutationFn: (payload: ReportRequest) => reportsService.getReport(payload),
  });
};

export const useGetReportDetail = () => {
  return useMutation({
    mutationFn: (url: string) => reportsService.getReportDetail(url),
  });
};
