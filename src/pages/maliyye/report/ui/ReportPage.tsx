import { useState, useEffect, useCallback } from "react";
import Modal from "@/shared/ui/modal/base/Modal";
import toast from "react-hot-toast";
import {
  PieChart,
  BarChart,
  CustomSelect,
  DateRangePicker,
  Table,
  ViewToggle,
  PageHeader,
  IconButton,
  OperationsButton,
} from "@/shared/ui";
import { BAR_COLORS_BUSINESS, BAR_COLORS_SOURCE } from "../model/consts";
import { operationOptions } from "@/shared/config";
import type { Option } from "@/shared/types";
import styles from "./ReportPage.module.css";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { cashOperationsService } from "@/features/maliyye/cash-operations/api/cashOperationsService";
import type {
  CashBoxDailyReportItem,
  DashboardGraphsResponse,
} from "@/features/maliyye/cash-operations/model/types";
import type { ReportTableData } from "../model/types";
import { PIE_CHART_TYPE_DATA, PIE_CHART_PURPOSE_DATA } from "../model/consts";
import { useReportColumns } from "../model/useReportColumns";
import { useTableSort } from "@/shared/hooks";
import { useExcelExport } from "@/shared/lib/hooks/useExcelExport";

function formatReportDate(isoDate: string): string {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

type SelectOptionResponse = {
  value: string;
  label: string;
  disabled: boolean;
};

function mapApiOptionToSelect(c: SelectOptionResponse) {
  return {
    id: c.value,
    fullName: c.label,
    role: "",
    disabled: c.disabled,
  };
}

function mapDailyReportToTableData(
  item: CashBoxDailyReportItem,
): ReportTableData {
  return {
    id: item.id,
    company: item.rootCompanyName || "—",
    source: item.cashBoxName || "—",
    date: formatReportDate(item.createdDate),
    startBalance: item.previousBalance,
    income: item.income,
    expense: item.expense,
    endBalance: item.closingBalance,
  };
}

const REPORT_PAGE_SIZE = 100;

export default function ReportPage() {
  const [selectedSource, setSelectedSource] = useState<Option | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );
  const [tableData, setTableData] = useState<ReportTableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<Option[]>([]);
  const [sourceOptions, setSourceOptions] = useState<Option[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  } | null>(null);
  const [detailData, setDetailData] = useState<null | {
    id: string;
    cashBoxId: string;
    previousBalance: number;
    income: number;
    expense: number;
    closingBalance: number;
    createdDate: string;
  }>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);

  const [dashboardData, setDashboardData] = useState<
    DashboardGraphsResponse["result"] | null
  >(null);
  const [chartLoading, setChartLoading] = useState(false);

  const { sortColumn, sortDirection, handleSort, orderBy, isDesc } =
    useTableSort({ initialColumn: "createdDate", initialDirection: "desc" });

  const { exportToExcel } = useExcelExport<ReportTableData>();

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await cashOperationsService.getRootCompanies();
      if (response.isSuccess) {
        setCompanyOptions(response.result.map(mapApiOptionToSelect));
      }
    } catch {
      setCompanyOptions([]);
    }
  }, []);

  const fetchCashBoxes = useCallback(async () => {
    if (!selectedCompany?.id) {
      setSourceOptions([]);
      return;
    }
    try {
      const response = await cashOperationsService.getCashBoxes(
        String(selectedCompany.id),
      );
      if (response.isSuccess) {
        setSourceOptions(response.result.map(mapApiOptionToSelect));
      } else {
        setSourceOptions([]);
      }
    } catch {
      setSourceOptions([]);
    }
  }, [selectedCompany?.id]);

  useEffect(() => {
    if (!selectedCompany) {
      setSourceOptions([]);
    } else {
      fetchCashBoxes();
    }
  }, [selectedCompany, fetchCashBoxes]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const payload: {
        pageSize: number;
        pageIndex: number;
        isDesc: boolean;
        orderBy: string;
        companyId?: string;
        cashBoxId?: string;
        startDate?: string;
        endDate?: string;
      } = {
        pageSize: REPORT_PAGE_SIZE,
        pageIndex: 0,
        isDesc: isDesc ?? true,
        orderBy: orderBy ?? "createdDate",
      };

      if (selectedCompany?.id) {
        payload.companyId = String(selectedCompany.id);
      }
      if (selectedSource?.id) {
        payload.cashBoxId = String(selectedSource.id);
      }
      if (selectedDateRange?.startDate) {
        payload.startDate = selectedDateRange.startDate.toISOString();
      }
      if (selectedDateRange?.endDate) {
        payload.endDate = selectedDateRange.endDate.toISOString();
      }

      const response =
        await cashOperationsService.getCashBoxDailyReportAll(payload);

      const items = Array.isArray(response.result)
        ? response.result
        : response.result?.data;

      if (response.isSuccess && items) {
        setTableData(items.map(mapDailyReportToTableData));
      } else {
        setTableData([]);
      }
    } catch {
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCompany, selectedSource, selectedDateRange, isDesc, orderBy]);

  const fetchDashboardData = useCallback(async () => {
    setChartLoading(true);
    try {
      const payload: {
        companyId: string | null;
        cashBoxId: string | null;
        startDate?: string;
        endDate?: string;
      } = {
        companyId: selectedCompany ? String(selectedCompany.id) : null,
        cashBoxId: selectedSource ? String(selectedSource.id) : null,
      };

      if (selectedDateRange?.startDate) {
        payload.startDate = selectedDateRange.startDate.toISOString();
      }
      if (selectedDateRange?.endDate) {
        payload.endDate = selectedDateRange.endDate.toISOString();
      }

      const response = await cashOperationsService.getDashboardGraphs(payload);
      if (response.isSuccess && response.result) {
        setDashboardData(response.result);
      } else {
        setDashboardData(null);
      }
    } catch {
      setDashboardData(null);
    } finally {
      setChartLoading(false);
    }
  }, [selectedCompany, selectedSource, selectedDateRange]);

  useEffect(() => {
    if (viewMode === "table" && tableData.length > 0) {
      if (
        selectedCompany &&
        selectedDateRange?.startDate &&
        selectedDateRange?.endDate
      ) {
        fetchReportData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesc, orderBy]);

  const handleDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const resp = await cashOperationsService.getCashBoxDailyReportById(id);
      if (resp.isSuccess) {
        setDetailData(resp.result);
        setIsModalOpen(true);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOperationChange = (value: Option | null) => {
    if (value?.id === "export_excel") {
      if (tableData.length === 0) {
        toast.error("İxrac etmək üçün məlumat yoxdur");
        setSelectedOperation(null);
        return;
      }
      exportToExcel({
        data: tableData,
        columns: [
          { header: "Şirkət", accessor: "company" },
          { header: "Mənbə", accessor: "source" },
          { header: "Tarix", accessor: "date" },
          { header: "Başlanğıc Balans", accessor: "startBalance" },
          { header: "Gəlir", accessor: "income" },
          { header: "Xərc", accessor: "expense" },
          { header: "Son Balans", accessor: "endBalance" },
        ],
        fileName: "kassa-hesabat",
        sheetName: "Hesabat",
      });
      setSelectedOperation(null);
      return;
    }
    setSelectedOperation(value);
  };

  const tableColumns = useReportColumns({
    onDetail: handleDetail,
  });

  return (
    <div className={styles.container}>
      <PageHeader title="Hesabat" className={styles.headerRow}>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </PageHeader>

      <div className={styles.filtersWrapper}>
        <div className={styles.companyWrapper}>
          <CustomSelect
            id="report-company"
            options={companyOptions}
            value={selectedCompany}
            onChange={(val) => {
              setSelectedCompany(val);
              if (
                hasSearchError &&
                val &&
                selectedDateRange?.startDate &&
                selectedDateRange?.endDate
              ) {
                setHasSearchError(false);
              }
            }}
            error={hasSearchError && !selectedCompany ? " " : undefined}
            onMenuOpen={fetchCompanies}
            defaultText="Şirkət seçin"
            variant="form"
            icon={BuildingOfficeIcon}
            isSearchable={true}
            searchPlaceholder="Şirkət axtar..."
            ariaLabel="Şirkət seçin"
          />
        </div>

        <div className={styles.sourceWrapper}>
          <CustomSelect
            id="report-source"
            options={sourceOptions}
            value={selectedSource}
            onChange={setSelectedSource}
            onMenuOpen={fetchCashBoxes}
            defaultText="Mənbə seçin"
            variant="form"
            icon={BanknotesIcon}
            isSearchable={true}
            searchPlaceholder="Mənbə axtar..."
            ariaLabel="Mənbə seçin"
          />
        </div>

        <div className={styles.datePickerWrapper}>
          <DateRangePicker
            onChange={(val) => {
              setSelectedDateRange(val);
              if (
                hasSearchError &&
                val?.startDate &&
                val?.endDate &&
                selectedCompany
              ) {
                setHasSearchError(false);
              }
            }}
            error={
              hasSearchError &&
              (!selectedDateRange?.startDate || !selectedDateRange?.endDate)
            }
          />
        </div>

        <div className={styles.buttonGroup}>
          <IconButton
            icon={MagnifyingGlassIcon}
            onClick={() => {
              if (
                !selectedCompany ||
                !selectedDateRange?.startDate ||
                !selectedDateRange?.endDate
              ) {
                setHasSearchError(true);
                return;
              }
              setHasSearchError(false);

              if (viewMode === "table") fetchReportData();
              if (viewMode === "chart") fetchDashboardData();
            }}
            variant="default"
            className={styles.searchButtonCustom}
          />

          <OperationsButton
            options={operationOptions}
            value={selectedOperation}
            onChange={handleOperationChange}
            className={styles.searchButtonCustom}
          />
        </div>
      </div>

      {viewMode === "chart" ? (
        <>
          {chartLoading && (
            <div className={styles.tableLoading} style={{ marginTop: "2rem" }}>
              Qrafiklər yüklənir...
            </div>
          )}
          <div
            className={styles.chartSection}
            style={{
              opacity: chartLoading ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <div className={styles.chartWrapper}>
              {dashboardData &&
              dashboardData.operationTypeAmounts?.length > 0 ? (
                <PieChart
                  series={dashboardData.operationTypeAmounts.map(
                    (o) => o.amount,
                  )}
                  labels={dashboardData.operationTypeAmounts.map((o) =>
                    o.operationType === 1 ? "Mədaxil" : "Məxaric",
                  )}
                  colors={PIE_CHART_TYPE_DATA.colors}
                  title="Əməliyyatın növü"
                  totalAmount={
                    dashboardData.totalIncome + dashboardData.totalExpense
                  }
                />
              ) : (
                <div className={styles.emptyChartPlaceholder}>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "inherit",
                    }}
                  >
                    Əməliyyatın növü
                  </div>
                  <div style={{ margin: "auto" }}>Məlumat tapılmadı</div>
                </div>
              )}
            </div>
            <div className={styles.chartDivider}></div>
            <div className={styles.chartWrapper}>
              {dashboardData &&
              dashboardData.cashPurposeExpenses?.length > 0 ? (
                <PieChart
                  series={dashboardData.cashPurposeExpenses.map(
                    (o) => o.amount,
                  )}
                  labels={dashboardData.cashPurposeExpenses.map(
                    (o) => o.cashPurposeName,
                  )}
                  colors={dashboardData.cashPurposeExpenses.map(
                    (_, i) =>
                      PIE_CHART_PURPOSE_DATA.colors[
                        i % PIE_CHART_PURPOSE_DATA.colors.length
                      ] as string,
                  )}
                  title="Təyinatın növü"
                  totalAmount={dashboardData.totalExpense}
                />
              ) : (
                <div className={styles.emptyChartPlaceholder}>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "inherit",
                    }}
                  >
                    Təyinatın növü
                  </div>
                  <div style={{ margin: "auto" }}>Məlumat tapılmadı</div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartWrapper}>
              {dashboardData && dashboardData.counterPartyExpenses?.length ? (
                <div className={styles.barChartContainer}>
                  <div className={styles.barChartContent}>
                    <BarChart
                      series={[
                        {
                          name: "Məbləğ",
                          data: dashboardData.counterPartyExpenses.map(
                            (c) => c.amount || 0,
                          ),
                        },
                      ]}
                      categories={dashboardData.counterPartyExpenses.map(
                        (c) => c.counterPartyName,
                      )}
                      colors={BAR_COLORS_BUSINESS}
                      title="Biznes"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.emptyChartPlaceholder}>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "inherit",
                    }}
                  >
                    Kontragent
                  </div>
                  <div style={{ margin: "auto" }}>Məlumat tapılmadı</div>
                </div>
              )}
            </div>
            <div className={styles.chartDivider}></div>
            <div className={styles.chartWrapper}>
              {dashboardData && dashboardData.cashBoxes?.length > 0 ? (
                <div className={styles.barChartContainer}>
                  <div className={styles.barChartContent}>
                    <BarChart
                      series={[
                        {
                          name: "Əməliyyat sayı / Məbləğ",
                          data: dashboardData.cashBoxes.map(
                            (c) => c.balance || c.operationCount || 0,
                          ),
                        },
                      ]}
                      categories={dashboardData.cashBoxes.map((c) => c.name)}
                      colors={BAR_COLORS_SOURCE}
                      title="Mənbə"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.emptyChartPlaceholder}>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "inherit",
                    }}
                  >
                    Mənbə
                  </div>
                  <div style={{ margin: "auto" }}>Məlumat tapılmadı</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.tableSection}>
          {loading ? (
            <div className={styles.tableLoading}>Yüklənir...</div>
          ) : (
            <Table
              data={tableData}
              columns={tableColumns}
              onSort={handleSort}
              sortColumn={sortColumn ?? undefined}
              sortDirection={sortDirection}
            />
          )}
        </div>
      )}


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gündəlik Hesabat Detalı"
        size="md"
      >
        {detailLoading ? (
          <div className={styles.tableLoading}>Yüklənir...</div>
        ) : detailData ? (
          <div className={styles.modalContent}>
            <div className={styles.detailHeader}>
              <div className={styles.detailTitle}>
                <span className={styles.detailLabel}>Tarix:</span>
                <span className={styles.detailValue}>
                  {new Date(detailData.createdDate).toLocaleDateString("az-AZ")}
                </span>
              </div>
            </div>

            <div className={styles.financialGrid}>
              <div className={`${styles.financeCard} ${styles.neutralCard}`}>
                <span className={styles.cardLabel}>Əvvəlki Balans</span>
                <span className={styles.cardValue}>
                  {detailData.previousBalance.toLocaleString()} ₼
                </span>
              </div>
              <div className={`${styles.financeCard} ${styles.successCard}`}>
                <span className={styles.cardLabel}>Gəlir</span>
                <span className={`${styles.cardValue} ${styles.successText}`}>
                  +{detailData.income.toLocaleString()} ₼
                </span>
              </div>
              <div className={`${styles.financeCard} ${styles.dangerCard}`}>
                <span className={styles.cardLabel}>Xərc</span>
                <span className={`${styles.cardValue} ${styles.dangerText}`}>
                  -{detailData.expense.toLocaleString()} ₼
                </span>
              </div>
              <div className={`${styles.financeCard} ${styles.primaryCard}`}>
                <span className={styles.cardLabel}>Bağlanış Balansı</span>
                <span className={`${styles.cardValue} ${styles.primaryText}`}>
                  {detailData.closingBalance.toLocaleString()} ₼
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>Data not found.</div>
        )}
      </Modal>
    </div>
  );
}
