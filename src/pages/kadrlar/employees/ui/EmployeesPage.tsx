import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import styles from "./EmployeesPage.module.css";
import { Table } from "@/shared/ui/table";
import { Pagination } from "@/shared/ui/pagination";
import { operationOptions } from "@/shared/config/tableOptions";
import type { Option } from "@/shared/types";
import {
  EmployeesFilterPanel,
  type EmployeesFilterState,
} from "./components/filter-panel/EmployeesFilterPanel";
import {
  TableControls,
  TableActionGroup,
  PageHeader,
  TableToolbar,
  EmptyState,
  IconButton,
} from "@/shared/ui";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import Modal from "@/shared/ui/modal/base/Modal";
import { EmployeeCVPage } from "./components/cv-page/EmployeeCVPage";
import { Loading } from "@/shared/ui/loading";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTablePagination, useClickOutside, useExcelExport } from "@/shared/lib/hooks";
import { useEmployeeColumns } from "../model/useEmployeeColumns";
import { useEmployees, employeesService } from "@/features/kadrlar/employees";
import type { EmployeeEntry } from "@/features/kadrlar/employees";
import { useRootCompaniesLookup } from "@/features/kadrlar/departments";
import { ROUTES } from "@/app/routes/consts";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

const COLUMN_VISIBILITY_CONFIG: { accessor: string; label: string }[] = [
  { accessor: "name", label: "Ad" },
  { accessor: "surname", label: "Soyad" },
  { accessor: "patronymic", label: "Ata adı" },
  { accessor: "birthDate", label: "Doğum tarixi" },
  { accessor: "gender", label: "Cins" },
  { accessor: "pin", label: "FIN" },
  { accessor: "rootCompanyId", label: "Şirkət" },
  { accessor: "status", label: "Status" },
  { accessor: "createdAt", label: "Yaranma vaxtı" },
  { accessor: "isPrimary", label: "Rəsmiləşmə forması" },
  { accessor: "actions", label: "Əməliyyatlar" },
  { accessor: "referrerName", label: "Tovsiyye eden" },
  { accessor: "birthCountryCode", label: "Doğuldugu yer" },
  { accessor: "citizenshipCode", label: "Vətəndaşlıq" },
  { accessor: "maritalStatus", label: "Ailə vəziyyəti" },
  { accessor: "actualAddress", label: "Faktiki yaşayış ünvanı" },
  { accessor: "registrationAddress", label: "Qeydiyyat ünvanı" },
  { accessor: "contact", label: "Əlaqə məlumatları" },
  { accessor: "socialAccounts", label: "Sosial media hesabı" },
  { accessor: "languageSkills", label: "Dil bilikləri" },
  { accessor: "programSkills", label: "Proqram bilikləri" },
  { accessor: "externalAccount", label: "Proq. istifadəçi məlumatları" },
];

export interface EmployeeFilterParams {
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  birthDate?: Date | null;
  status?: Option | null;
  hireDate?: Date | null;
  department?: Option | null;
  company?: Option | null;
  
  fin?: string;
  gender?: Option | null;
  email?: string;
  employmentType?: Option | null;
  birthCountry?: Option | null;
  birthCity?: Option | string | null;
  citizenship?: Option | null;
  maritalStatus?: Option | null;
  phonePrefix?: Option | null;
  phoneNumber?: string;
  socialPlatform?: Option | null;
  socialAccount?: string;
  position?: Option | null;
  username?: string;
  fonetId?: string;
  referrer?: string;
  staffCategory?: Option | null;
  rootCompanyId?: string | null;
}

export default function EmployeesPage() {
  // Axtarış düyməsinə basılıb-basılmadığını yoxlayır
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedOperation, setSelectedOperation] = useState<Option | null>(
    null,
  );
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [cvModal, setCvModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [isDesc, setIsDesc] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<EmployeeFilterParams | null>(
    null,
  );
  const [isColumnPanelOpen, setIsColumnPanelOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        COLUMN_VISIBILITY_CONFIG.map((c) => [
          c.accessor,
          c.accessor !== "createdAt" &&
            c.accessor !== "isPrimary" &&
            c.accessor !== "referrerName" &&
            c.accessor !== "actualAddress" &&
            c.accessor !== "registrationAddress" &&
            c.accessor !== "birthCountryCode" &&
            c.accessor !== "maritalStatus" &&
            c.accessor !== "contact" &&
            c.accessor !== "socialAccounts" &&
            c.accessor !== "languageSkills" &&
            c.accessor !== "programSkills" &&
            c.accessor !== "externalAccount" &&
            c.accessor !== "citizenshipCode"&&
            c.accessor !== "status",
        ]),
      ),
  );
  const columnPanelRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    columnPanelRef,
    useCallback(() => setIsColumnPanelOpen(false), []),
    isColumnPanelOpen,
  );

  const [, setHasOpenedCompanies] = useState(false);
  const { data: rootCompaniesOptions = [], isLoading: isLoadingCompanies } =
    useRootCompaniesLookup(true);
  const [isRootCompaniesLoaded, setIsRootCompaniesLoaded] = useState(false);

  useEffect(() => {
    if (!isLoadingCompanies && rootCompaniesOptions.length === 1) {
      const singleCompany = rootCompaniesOptions[0];
      if (
        singleCompany &&
        (!selectedCompany || selectedCompany.id !== singleCompany.id)
      ) {
        setSelectedCompany(singleCompany);
      }
    }
  }, [isLoadingCompanies, rootCompaniesOptions.length, selectedCompany?.id]);

  useEffect(() => {
    if (!isLoadingCompanies && rootCompaniesOptions.length >= 0) {
      const timer = setTimeout(() => {
        setIsRootCompaniesLoaded(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isLoadingCompanies, rootCompaniesOptions.length, selectedCompany]);

  const {
    currentPage,
    selectedRowCount,
    handlePageChange,
    handleRowCountChange,
  } = useTablePagination([]);

  const pageSize = Number(selectedRowCount?.id) || 10;

  const formatDateForAPI = (date: Date | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const shouldFetchEmployees = isRootCompaniesLoaded && hasSearched;

  const {
    data: employeesData,
    isLoading,
    isFetching,
    refetch,
  } = useEmployees(
    {
      pageSize,
      pageIndex: currentPage - 1,
      isDesc,
      orderBy,
      rootCompanyId:
        searchParams?.rootCompanyId ||
        (selectedCompany?.id ? String(selectedCompany.id) : null),
      subCompanyId: searchParams?.department?.id
        ? String(searchParams.department.id)
        : null,
      employeeStatus: searchParams?.status?.id
        ? String(searchParams.status.id)
        : null,
      appointmentDate: formatDateForAPI(searchParams?.hireDate || null),
      name: searchParams?.firstName?.trim() || null,
      surname: searchParams?.lastName?.trim() || null,
      fullname:
        searchParams?.firstName && searchParams?.lastName
          ? `${searchParams.firstName} ${searchParams.lastName}`.trim()
          : null,
      patronymic: searchParams?.fatherName?.trim() || null,
      gender: searchParams?.gender?.id ? String(searchParams.gender.id) : null,
      birthDate: formatDateForAPI(searchParams?.birthDate || null),
      pin: searchParams?.fin?.trim() || null,
      corporateEmail: searchParams?.email?.trim() || null,
      employmentTypeCode: searchParams?.employmentType?.id
        ? String(searchParams.employmentType.id)
        : null,
      birthCountryCode: searchParams?.birthCountry?.id
        ? String(searchParams.birthCountry.id)
        : null,
      birthCityId:
        searchParams?.birthCountry?.id === "AZE" &&
        searchParams?.birthCity &&
        typeof searchParams.birthCity !== "string"
          ? Number(searchParams.birthCity.id)
          : null,
      foreignBirthCity:
        searchParams?.birthCountry?.id !== "AZE" &&
        typeof searchParams?.birthCity === "string"
          ? searchParams.birthCity
          : null,
      citizenshipCode: searchParams?.citizenship?.id
        ? String(searchParams.citizenship.id)
        : null,
      maritalStatus: searchParams?.maritalStatus?.id
        ? String(searchParams.maritalStatus.id)
        : null,
      contactType: searchParams?.phonePrefix?.id
        ? String(searchParams.phonePrefix.id)
        : null,
      phoneNumber: searchParams?.phoneNumber?.trim() || null,
      socialAccountType: searchParams?.socialPlatform?.id
        ? String(searchParams.socialPlatform.id)
        : null,
      socialAccount: searchParams?.socialAccount?.trim() || null,
      positionId: searchParams?.position?.id
        ? String(searchParams.position.id)
        : null,
      username: searchParams?.username?.trim() || null,
      fonetId: searchParams?.fonetId?.trim() || null,
      referrerName: searchParams?.referrer?.trim() || null,
      staffCategoryCode: searchParams?.staffCategory?.id
        ? String(searchParams.staffCategory.id)
        : null,
      includeAddress:
        !!visibleColumns["actualAddress"] ||
        !!visibleColumns["registrationAddress"],
      includeContact: !!visibleColumns["contact"],
      includeSocialAccount: !!visibleColumns["socialAccounts"],
      includeSkill:
        !!visibleColumns["languageSkills"] || !!visibleColumns["programSkills"],
      includeExternalAccount: !!visibleColumns["externalAccount"],
    },
    shouldFetchEmployees,
  );

  const paginatedData = employeesData?.result?.data || [];
  const totalCount = employeesData?.result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleRefresh = useCallback(() => {
    if (hasSearched) {
      refetch();
    }
  }, [hasSearched, refetch]);

  const handleClearSearch = () => {
    setHasSearched(false);
    setSearchParams(null); 
  };

  const handleSearch = (filters: EmployeesFilterState) => {
    setHasSearched(true);
    setSearchParams({
      ...filters,
      rootCompanyId: filters.company ? String(filters.company.id) : null,
    });
    handlePageChange(1);

    if (hasSearched) {
      refetch();
    }
  };

  const { exportToExcel } = useExcelExport<EmployeeEntry>();

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value);
    if (value?.id === "export_excel") {
      exportToExcel({
        data: paginatedData,
        columns,
        fileName: "isciler",
        sheetName: "İşçilər",
        lookupData: { rootCompaniesOptions }
      });
      setSelectedOperation(null);
    }
  };

  const handleSort = (accessor: string, direction: "asc" | "desc") => {
    setOrderBy(accessor);
    setIsDesc(direction === "desc");
    handlePageChange(1);
  };

  const handleDeleteClick = (item: EmployeeEntry) => {
    setDeleteConfirmModal({ isOpen: true, id: item.id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, id: null });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmModal.id) {
      setIsDeleting(true);
      try {
        await employeesService.delete(deleteConfirmModal.id);
        setDeleteConfirmModal({ isOpen: false, id: null });
        toast.success("Uğurla silindi");
        refetch();
      } catch (error) {
        const errorMessage = (error as AxiosError)?.response?.data
          ? ((error as AxiosError).response?.data as { errorMessage?: string })
              ?.errorMessage || "Xəta baş verdi"
          : "Xəta baş verdi";
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const [, setIsCVLoaded] = useState(false);
  const cvLoadResolverRef = useRef<(() => void) | null>(null);

  const handleCVLoaded = useCallback(() => {
    setIsCVLoaded(true);
    if (cvLoadResolverRef.current) {
      cvLoadResolverRef.current();
      cvLoadResolverRef.current = null;
    }
  }, []);

  const handlePrintClick = async (item: EmployeeEntry) => {
    if (isPrinting) return;

    setIsPrinting(true);
    setIsCVLoaded(false);
    setCvModal({ isOpen: false, id: item.id });

    const toastId = toast.loading("Məlumatlar yüklənir...");
    const startTime = Date.now();

    await new Promise<void>((resolve) => {
      cvLoadResolverRef.current = resolve;
      setTimeout(resolve, 1000);
    });

    handlePrint(toastId, startTime);
  };

  const handlePrint = async (
    existingToastId?: string,
    providedStartTime?: number,
  ) => {
    const element = document.getElementById("employee-cv-content");
    if (!element) {
      toast.error("Çap ediləcək məzmun tapılmadı");
      setIsPrinting(false);
      return;
    }

    const toastId = existingToastId || toast.loading("");
    setIsPrinting(true);
    const startTime = providedStartTime || Date.now();

    try {
        element.classList.add("pdf-mode");
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 16)));
        
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = 210;
        const pdfHeight = 297;
        const marginTop = 20;
        const marginBottom = 19;
        const marginLeft = 25;
        const marginRight = 8;
        const contentWidth = pdfWidth - marginLeft - marginRight;
        const pageHeightLimit = pdfHeight - marginTop - marginBottom;

        const targetWidthPx = 794;
        const originalWidth = element.style.width;
        element.style.width = `${targetWidthPx}px`;
        
        const pxToMmScale = contentWidth / targetWidthPx;
        const pageHeightLimitPx = pageHeightLimit / pxToMmScale;

        const spacers: HTMLDivElement[] = [];
        const breakableElements = Array.from(element.querySelectorAll('.section, tr')) as HTMLElement[];

        const containerRect = element.getBoundingClientRect();
        const elementPositions = breakableElements
          .map(el => {
            if (el.offsetHeight === 0) return null;
            const rect = el.getBoundingClientRect();
            return {
              el,
              top: rect.top - containerRect.top,
              bottom: rect.bottom - containerRect.top
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        let cumulativeSpacerHeight = 0;
        const spacersToInsert: { el: HTMLElement, height: number }[] = [];

        elementPositions.forEach((pos) => {
          const relativeTop = pos.top + cumulativeSpacerHeight;
          const relativeBottom = pos.bottom + cumulativeSpacerHeight;
          
          const pageIndex = Math.floor(relativeTop / pageHeightLimitPx);
          const pageEndPx = (pageIndex + 1) * pageHeightLimitPx;
          
          if (relativeTop < pageEndPx - 2 && relativeBottom > pageEndPx) {
            const gapNeeded = pageEndPx - relativeTop;
            spacersToInsert.push({ el: pos.el, height: gapNeeded });
            cumulativeSpacerHeight += gapNeeded;
          }
        });

        spacersToInsert.forEach(s => {
          const spacer = document.createElement('div');
          spacer.style.height = `${s.height}px`;
          spacer.style.width = '100%';
          spacer.style.background = 'white';
          spacer.className = 'temp-pdf-spacer';
          s.el.parentNode?.insertBefore(spacer, s.el);
          spacers.push(spacer);
        });

        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 16)));

        const canvas = await html2canvas(element, {
          scale: 1.5, 
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: targetWidthPx,
          imageTimeout: 0,
        });

        spacers.forEach(s => s.remove());
        element.style.width = originalWidth;
        element.classList.remove("pdf-mode");

        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const imgProps = pdf.getImageProperties(imgData);
        const imgContentHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        let heightLeft = imgContentHeight;
        let yOffset = marginTop;
        let pageNumber = 1;

        while (heightLeft > 0) {
          if (pageNumber > 1) {
            pdf.addPage();
          }

          pdf.addImage(imgData, "JPEG", marginLeft, yOffset, contentWidth, imgContentHeight, undefined, "FAST");
          
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pdfWidth, marginTop, "F");
          pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, "F");
          pdf.rect(0, 0, marginLeft, pdfHeight, "F");
          pdf.rect(pdfWidth - marginRight, 0, marginRight, pdfHeight, "F");

          yOffset -= pageHeightLimit;
          heightLeft -= pageHeightLimit;
          pageNumber++;
        }

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        
        toast.success("PDF uğurla hazırlandı", { id: toastId });
      } catch (e) {
        toast.error(
                getBackendErrorMessage(e as AxiosError) ||
                  "Şifrə yenilənərkən xəta baş verdi",
              );
        toast.error("PDF hazırlanarkən xəta baş verdi", { id: toastId });
        element.classList.remove("pdf-mode");
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        
        setTimeout(() => {
          setIsPrinting(false);
        }, remainingTime);
      }
    };

  const allColumns = useEmployeeColumns({
    onDelete: handleDeleteClick,
    onPrint: handlePrintClick,
    rootCompaniesOptions: rootCompaniesOptions,
    isPrinting: isPrinting,
  });

  const columns = useMemo(
    () => allColumns.filter((col) => visibleColumns[col.accessor] !== false),
    [allColumns, visibleColumns],
  );

  const toggleColumnVisibility = useCallback((accessor: string) => {
    setVisibleColumns((prev) => ({ ...prev, [accessor]: !prev[accessor] }));
  }, []);

  return (
    <div className={styles.container}>
      <PageHeader title="Axtarış"></PageHeader>

      <EmployeesFilterPanel
        onSearch={handleSearch}
        onClear={handleClearSearch}
        rootCompaniesOptions={rootCompaniesOptions}
        onOpenCompany={() => setHasOpenedCompanies(true)}
        isCompaniesLoading={isLoadingCompanies}
      />

      {!hasSearched ? (
        <EmptyState description="Axtarış etmək üçün yuxarıdakı xanaları doldurun və «Axtar» düyməsinə klik edin." />
      ) : (
        <>
          {(isFetching || isLoading) && <Loading />}

          <TableToolbar>
            <TableControls
              selectedRowCount={selectedRowCount}
              onRowCountChange={handleRowCountChange}
              totalCount={totalCount}
            />

            <div className={styles.rightControls}>
              <div className={styles.tableActionGroupWrap} ref={columnPanelRef}>
                <div className={styles.columnPanelTrigger}>
                  <IconButton
                    icon={Squares2X2Icon}
                    onClick={() => setIsColumnPanelOpen((o) => !o)}
                    title="Sütunlar"
                    variant="default"
                  />
                  {isColumnPanelOpen && (
                    <div className={styles.columnPanel}>
                      <div className={styles.columnPanelTitle}>
                        Sütunları göstər
                      </div>
                      <div className={styles.columnPanelContent}>
                        {COLUMN_VISIBILITY_CONFIG.map(({ accessor, label }) => (
                          <label
                            key={accessor}
                            className={styles.columnPanelItem}
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns[accessor] !== false}
                              onChange={() => toggleColumnVisibility(accessor)}
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <TableActionGroup
                  onRefresh={handleRefresh}
                  onOperationChange={handleOperationChange}
                  operationOptions={operationOptions}
                  selectedOperation={selectedOperation}
                />
              </div>
            </div>
          </TableToolbar>

          <Table
            data={paginatedData}
            columns={columns}
            onSort={handleSort}
            sortColumn={orderBy}
            sortDirection={isDesc ? "desc" : "asc"}
            onRowClick={(row) => setSelectedRowId(row.id)}
            onRowDoubleClick={(row) => {
              const path = ROUTES.KADRLAR.DETAILS.LINK.replace(":id", row.id);
              const base = (import.meta.env.BASE_URL || "/").replace(
                /\/$/,
                "",
              );
              const fullUrl = `${window.location.origin}${base}${path}`;
              window.open(fullUrl, "_blank", "noopener,noreferrer");
            }}
            selectedRowId={selectedRowId}
          />

          <TableToolbar>
            <TableControls
              selectedRowCount={selectedRowCount}
              onRowCountChange={handleRowCountChange}
              totalCount={totalCount}
            />
          </TableToolbar>

          <div className={styles.pagination}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
        </>
      )}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="İşçini sil"
        message="Bu işçini silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={isDeleting}
      />

      {/* Hidden container for background PDF generation */}
      <div className={styles.hiddenPrintContainer}>
        {cvModal.id && <EmployeeCVPage id={cvModal.id} onLoaded={handleCVLoaded} />}
      </div>

      <Modal
        isOpen={cvModal.isOpen}
        onClose={() => setCvModal({ isOpen: false, id: null })}
        title="KADRLAR UÇOTUNUN ŞƏXSİ VƏRƏQƏSİ"
        size="xl"
        titleAlign="center"
        titleSize="large"
        className={styles.EmployeeCVModal}
      >
        <EmployeeCVPage id={cvModal.id || undefined} />
      </Modal>

   
    </div>
  );
}
