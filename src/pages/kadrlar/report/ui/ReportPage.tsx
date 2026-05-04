import { useState } from "react";
import { PageHeader } from "@/shared/ui";
import { ReportForm, type ReportFormState } from "./components/report-form";
import { ReportTable } from "./components/report-table";
import { useGetReport, type ReportResponse } from "@/features/kadrlar/reports";
import { formatDateToYMD } from "@/shared/lib/utils/dateUtils";

export function PersonnelReportPage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [formState, setFormState] = useState<ReportFormState>({
    businessUnit: null,
    department: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    reportType: null,
  });

  const getReportMutation = useGetReport();

  const initialFormState: ReportFormState = {
    businessUnit: null,
    department: null,
    status: null,
    dateFrom: null,
    dateTo: null,
    reportType: null,
  };

  const handleClear = () => {
    setFormState(initialFormState);
    setHasSearched(false);
    setReportData(null);
  };

  const handleSubmit = async () => {
    if (!formState.reportType) return;

    setHasSearched(true);
    
    try {
      const response = await getReportMutation.mutateAsync({
        rootCompanyId: formState.businessUnit?.id ? String(formState.businessUnit.id) : null,
        subCompanyId: formState.department?.id ? String(formState.department.id) : null,
        employeeStatus: formState.status?.id ? String(formState.status.id) : null,
        startDate: formatDateToYMD(formState.dateFrom),
        endDate: formatDateToYMD(formState.dateTo),
        reportType: String(formState.reportType.id),
      });
      
      setReportData(response);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div>
      <PageHeader title="Hesabat" />
      <ReportForm
        value={formState}
        onChange={setFormState}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />
      <ReportTable
        hasSearched={hasSearched}
        isLoading={getReportMutation.isPending}
        reportData={reportData}
        onRefresh={handleSubmit}
      />
    </div>
  );
}


