import { useState, useMemo, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PageHeader, Button, Loading } from "@/shared/ui"; 
import CustomSelect from "@/shared/ui/select/CustomSelect";
import styles from "./DepartmentsPage.module.css";
import CompanyTree from "./components/tree/CompanyTree";
import DepartmentForm from "./components/form/DepartmentForm";
import SelectionModal from "./components/modal/SelectionModal";
import { Modal } from "@/shared/ui/modal/base";
import { ConfirmModal } from "@/shared/ui/modal/confirm";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { useDebounce } from "@/shared/hooks";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";

import { 
  useDepartments, 
  useGetDepartmentById,
  useGetStaffingById,
  useSetStaffingActive,
  useUpdateStaffing,
  useDeleteStaffing,
  useCreateDepartment, 
  useCreateStaffing,
  useUpdateDepartment, 
  useDeleteDepartment,
  DEPARTMENTS_QUERY_KEYS,
  type DepartmentEntry,
  type CreateDepartmentRequest,
} from "@/features/kadrlar/departments";
import type { DepartmentNode } from "../model/types";
import type { FormValues } from "./components/form/types";
import type { VacancyFormPayload } from "./components/vacancy/VacancyForm";
import type { Option } from "@/shared/types";
import { useLookups } from "@/features/lookups";
import { mapEnumItemsToOptions } from "@/features/lookups/lib/mapEnumItemsToOptions";
import { usePositions, useWorkloadRates } from "@/features/lookups/hooks";

export type ExtendedDepartmentNode = DepartmentNode & {
  isVacancy?: boolean;
  vacancyDetails?: {
    staff: Option | null;
    workSchedule: Option | null;
  };
};

type TreeInputItem = DepartmentEntry & {
  isVacancy?: boolean;
  vacancyDetails?: {
    staff: Option | null;
    workSchedule: Option | null;
  };
};

const buildTree = (items: TreeInputItem[]): ExtendedDepartmentNode[] => {
  const itemMap = new Map<string, ExtendedDepartmentNode>();
  const rootItems: ExtendedDepartmentNode[] = [];

  items.forEach((item) => {
    itemMap.set(item.id, {
      id: item.id,
      name: item.name,
      legalName: item.legalName,
      type: item.organizationType,
      activity: item.activity,
      isActive: item.isActive,
      voen: item.voen,
      parentDepartmentId: item.parentDepartmentId,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt,
      createdBy: item.createdBy,
      website: item.webSite ?? item.website,
      fax: item.fax,
      phone: item.phone,
      isVacancy: item.isVacancy, 
      vacancyDetails: item.vacancyDetails, 
      children: [],
    });
  });

  items.forEach((item) => {
    const node = itemMap.get(item.id)!;
    
    if (item.parentDepartmentId && itemMap.has(item.parentDepartmentId)) {
      const parent = itemMap.get(item.parentDepartmentId)!;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    } else {
      rootItems.push(node);
    }
  });

  const sortNodes = (a: ExtendedDepartmentNode, b: ExtendedDepartmentNode) => {
    if (a.isVacancy && !b.isVacancy) return -1;
    if (!a.isVacancy && b.isVacancy) return 1;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  };
  itemMap.forEach((node) => {
    if (node.children && node.children.length > 0) {
      node.children.sort(sortNodes);
    }
  });
  rootItems.sort(sortNodes);
  return rootItems;
};

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [selectedNode, setSelectedNode] = useState<DepartmentNode | null>(null);
  const [editingStaffingId, setEditingStaffingId] = useState<string | null>(null);
  const [parentForNew, setParentForNew] = useState<DepartmentNode | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [createFormResetKey, setCreateFormResetKey] = useState(0); // Formu sıfırlamaq üçün key
  const [mockVacancies, setMockVacancies] = useState<TreeInputItem[]>([]);
  const [staffingPositionOption, setStaffingPositionOption] = useState<Option | null>(null);
  const [staffingWorkloadOption, setStaffingWorkloadOption] = useState<Option | null>(null);
  const [staffingStaffCategoryOption, setStaffingStaffCategoryOption] = useState<Option | null>(null);
  const [positionSearch, setPositionSearch] = useState("");
  const debouncedPositionSearch = useDebounce(positionSearch, 500);
  
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });
  const [staffingDeleteConfirmModal, setStaffingDeleteConfirmModal] = useState<{ isOpen: boolean; id: string | null; orgUnitId: string | null }>({
    isOpen: false,
    id: null,
    orgUnitId: null
  });

  // --- LOOKUPS ---
  const { data: lookupsData } = useLookups();
  const { data: workloadRatesData } = useWorkloadRates();

  // --- 2. DATA FETCHING ---
  const { data, isLoading, isError } = useDepartments({
    pageSize: 100,
    pageIndex: 0,
    isDesc: false,
    orderBy: null,
    name: null,
    isActive: null,
  });

  const createMutation = useCreateDepartment();
  const createStaffingMutation = useCreateStaffing();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();
  const setStaffingActiveMutation = useSetStaffingActive();
  const deleteStaffingMutation = useDeleteStaffing();
  const updateStaffingMutation = useUpdateStaffing();

  // Yalnız ID seçilibsə, Form açıqdırsa və silinmə prosesi getmirsə detalları çək
  const { data: selectedDepartmentData, isLoading: isLoadingSelected } = useGetDepartmentById(
    selectedNode?.id || null,
    !!selectedNode && isFormOpen && !deleteMutation.isPending
  );

  // Kadr endpoint-i artıq sağ panel üçün də istifadə olunur
  const { data: staffingDetail, isLoading: isLoadingStaffingDetail } = useGetStaffingById(
    editingStaffingId,
    !!editingStaffingId
  );

  const {
    options: positionOptions,
    isLoading: isPositionsLoading,
    fetchNextPage: fetchNextPositions,
    hasNextPage: hasNextPositions,
    isFetchingNextPage: isFetchingNextPositions,
  } = usePositions(debouncedPositionSearch, !!editingStaffingId);
  const workloadOptions = useMemo(() => {
    return mapEnumItemsToOptions(workloadRatesData?.result);
  }, [workloadRatesData]);
  
  const staffCategoryOptions = useMemo(() => {
    return mapEnumItemsToOptions(lookupsData?.result?.staffCategories);
  }, [lookupsData]);

  const lastLoadedStaffingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!editingStaffingId) {
      setPositionSearch("");
      return;
    }
    setPositionSearch("");
  }, [editingStaffingId]);

  const staffingPositionOptions = useMemo(() => {
    const list = [...positionOptions];

    if (
      staffingDetail?.positionId &&
      staffingDetail?.positionName &&
      !list.some((opt) => String(opt.id) === String(staffingDetail.positionId))
    ) {
      list.unshift({
        id: staffingDetail.positionId,
        fullName: staffingDetail.positionName,
        role: "",
      });
    }

    return list;
  }, [positionOptions, staffingDetail?.positionId, staffingDetail?.positionName]);

  // Ştat detayları yüklendiğinde state'leri sadece BİR KEZ ilklendir
  useEffect(() => {
    // Eğer yeni bir ID yüklendiyse veya daha önce yüklenmediyse ilklendir
    if (staffingDetail && lastLoadedStaffingIdRef.current !== staffingDetail.id) {
      if (workloadOptions.length > 0 && staffCategoryOptions.length > 0) {
        const posMatched =
          staffingPositionOptions.find((opt) => String(opt.id) === String(staffingDetail.positionId)) ??
          (staffingDetail.positionId && staffingDetail.positionName
            ? { id: staffingDetail.positionId, fullName: staffingDetail.positionName, role: "" }
            : null);
        const workloadMatched = workloadOptions.find(opt => String(opt.id) === String(staffingDetail.workloadRateCode)) ?? null;
        const categoryMatched = staffCategoryOptions.find(opt => String(opt.id) === String(staffingDetail.staffCategoryCode)) ?? null;
        
        setStaffingPositionOption(posMatched);
        setStaffingWorkloadOption(workloadMatched);
        setStaffingStaffCategoryOption(categoryMatched);
        
        // Bu ID için ilklendirme yapıldığını işaretle
        lastLoadedStaffingIdRef.current = staffingDetail.id;
      }
    }
    
    // Eğer seçim temizlendiyse ref'i sıfırla
    if (!editingStaffingId) {
      lastLoadedStaffingIdRef.current = null;
    }
  }, [staffingDetail, editingStaffingId, staffingPositionOptions, workloadOptions, staffCategoryOptions]);

  const treeData = useMemo(() => {
    const items = data?.result ? [...data.result] : [];
    const combinedItems = [...items, ...mockVacancies] as TreeInputItem[];
    
    return buildTree(combinedItems);
  }, [data, mockVacancies]);

  // --- 3. HANDLERS ---

  const handleCreateNewClick = () => {
    setSelectedNode(null);
    setParentForNew(null);
    setIsFormOpen(false); // Close existing form if any
    setIsSelectionModalOpen(true);
  };

  const handleAddChild = (node: DepartmentNode) => {
    setSelectedNode(null);
    setParentForNew(node);
    setIsFormOpen(false); // Close existing form if any
    setIsSelectionModalOpen(true);
  };

  const handleEditNode = (node: DepartmentNode) => {
    setSelectedNode(node);
    setEditingStaffingId(null);
    setIsSelectionModalOpen(false);
    setIsFormOpen(true);
  };

  const handleViewStaffing = (node: DepartmentNode) => {
    setSelectedNode(node);
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEYS.staffing(node.id) });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedNode(null);
    setEditingStaffingId(null);
    setStaffingPositionOption(null);
    setStaffingWorkloadOption(null);
    setStaffingStaffCategoryOption(null);
    setParentForNew(null);
  };

  const handleEditStaffingItem = (item: { id: string }) => {
    setEditingStaffingId(item.id);
    setIsFormOpen(false);
    setSelectedNode(null);
  };

  const handleCloseSelectionModal = () => {
    setIsSelectionModalOpen(false);
    setParentForNew(null);
  };

  const handleSaveVacancy = (payload: VacancyFormPayload) => {
    const { organizationUnitId, positionId, workloadRateCode, staffCategoryCode } = payload;
    if (!organizationUnitId?.trim() || !positionId?.trim() || !workloadRateCode?.trim() || !staffCategoryCode?.trim()) {
      toast.error("Bütün məcburi sahələri doldurun");
      return;
    }

    createStaffingMutation.mutate(
      { organizationUnitId, positionId, workloadRateCode, staffCategoryCode, positionCount: payload.sayi === "" ? undefined : Number(payload.sayi) },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            toast.success("Vakansiya uğurla əlavə edildi!");
            handleCloseSelectionModal();
          } else if (response.errorMessage) {
            toast.error(response.errorMessage);
          }
        },
        onError: () => {},
      }
    );
  };

  const handleDeleteNode = (node: DepartmentNode) => {
    const extendedNode = node as ExtendedDepartmentNode;
    
    if (extendedNode.isVacancy) {
      setMockVacancies(prev => prev.filter(v => v.id !== node.id));
      toast.success("Vakansiya silindi");
      
      if (selectedNode?.id === node.id) {
        handleCloseForm();
      }
      return;
    }
    handleDelete(node.id);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmModal({ isOpen: true, id });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, id: null });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.id) {
      deleteMutation.mutate(deleteConfirmModal.id, {
        onSuccess: () => {
          if (selectedNode?.id === deleteConfirmModal.id) {
            handleCloseForm();
          }
          setDeleteConfirmModal({ isOpen: false, id: null });
          toast.success("Uğurla silindi");
        },
        onError: () => {},
      });
    }
  };

  const handleConfirmDeleteStaffing = () => {
    if (staffingDeleteConfirmModal.id && staffingDeleteConfirmModal.orgUnitId) {
      deleteStaffingMutation.mutate({
        id: staffingDeleteConfirmModal.id,
        organizationUnitId: staffingDeleteConfirmModal.orgUnitId
      }, {
        onSuccess: () => {
          setStaffingDeleteConfirmModal({ isOpen: false, id: null, orgUnitId: null });
          handleCloseForm();
          toast.success("Ştat uğurla silindi");
        },
        onError: () => {},
      });
    }
  };

  const handleSave = (formData: FormValues) => {
    const optStr = (s: string) => (s?.trim()?.length ? s.trim() : null);
    
    const activity = optStr(formData.note ?? "");
    const voen = optStr(formData.voen ?? "");
    const sortOrderValue = formData.sortOrder === "" ? 0 : Number(formData.sortOrder);
    
    const parentDepartmentId = formData.parent?.id ? String(formData.parent.id) : null;
    const type = formData.type?.id ? String(formData.type.id) : "";

    if (selectedNode) {
        updateMutation.mutate({
            id: selectedNode.id,
            name: formData.fullName.trim(),
            legalName: optStr(formData.legalName ?? ""),
            activity,
            voen,
            workScheduleCode: formData.workSchedule?.id ? String(formData.workSchedule.id) : null,
            webSite: optStr(formData.website ?? ""),

            fax: optStr(formData.fax ?? ""),
            phone: optStr(formData.phone ?? ""),
            sortOrder: sortOrderValue,
            isActive: formData.isActive,
        }, {
            onSuccess: (response) => {
                if (response.isSuccess) {
                    toast.success("Məlumat yeniləndi");
                    handleCloseForm(); 
                } else if (response.errorMessage) {
                    toast.error(response.errorMessage);
                }
            },
            onError: () => {},
        });
    } 
    else {
        const createPayload: CreateDepartmentRequest = {
            name: formData.fullName.trim(),
            legalName: optStr(formData.legalName ?? ""),
            organizationType: type,
            activity,
            voen,
            workScheduleCode: formData.workSchedule?.id ? String(formData.workSchedule.id) : null,
            webSite: optStr(formData.website ?? ""),

            fax: optStr(formData.fax ?? ""),
            phone: optStr(formData.phone ?? ""),
            sortOrder: sortOrderValue,
            parentDepartmentId: parentDepartmentId ?? null,
        };

        createMutation.mutate(createPayload, {
            onSuccess: (response) => {
                if (response.isSuccess) {
                    toast.success("Yeni struktur yaradıldı");
                    // Modal bağlanmır (istəyinizə uyğun olaraq)
                    setCreateFormResetKey(prev => prev + 1); // Bu, formanı resetləyəcək (key dəyişdiyi üçün)
                } else if (response.errorMessage) {
                    toast.error(response.errorMessage);
                }
            },
            onError: () => {},
        });
    }
  };

  // --- 4. PREPARE FORM CONTENT ---
  const formInitialData = useMemo(() => {
    if (!selectedNode) return null;

    if (selectedDepartmentData) {
        return {
          id: selectedDepartmentData.id,
          name: selectedDepartmentData.name,
          legalName: selectedDepartmentData.legalName,
          type: selectedDepartmentData.organizationType,
          activity: selectedDepartmentData.activity,
          isActive: selectedDepartmentData.isActive,
          voen: selectedDepartmentData.voen,
          workScheduleCode: selectedDepartmentData.workScheduleCode,
          parentDepartmentId: selectedDepartmentData.parentDepartmentId,
          sortOrder: selectedDepartmentData.sortOrder,
          createdAt: selectedDepartmentData.createdAt,
          createdBy: selectedDepartmentData.createdBy,
          website: selectedDepartmentData.webSite ?? selectedDepartmentData.website,
          fax: selectedDepartmentData.fax,
          phone: selectedDepartmentData.phone,

        };
    }
    
    return selectedNode;
  }, [selectedNode, selectedDepartmentData]);

  const isCreateMode = !selectedNode;
  const shouldShowModal = isCreateMode || isMobile;

  const isVacancySelected = (selectedNode as ExtendedDepartmentNode)?.isVacancy;
  const isEditingStaffing = !!editingStaffingId;

  const modalTitle = selectedNode 
    ? (isVacancySelected ? "Vakant məlumatları" : "Redaktə et") 
    : "Yeni Struktur Əlavə Et"; 
    
  const panelTitle = isVacancySelected ? "Vakant məlumatları" : "Struktur Məlumatları";
  const shouldShowPanel = !isCreateMode && !isMobile; 

  const defaultParentOption = useMemo(() => parentForNew
    ? { id: parentForNew.id, fullName: parentForNew.name, role: "" }
    : null, [parentForNew]);

  const formContent = (
    <DepartmentForm 
      key={selectedNode ? `edit-${selectedNode.id}` : 'create-new-structure'} 
      title={shouldShowPanel ? panelTitle : ""} 
      initialData={formInitialData} 
      defaultParent={defaultParentOption}
      onSave={handleSave}
      onCancel={handleCloseForm}
      onDelete={selectedNode ? () => handleDeleteNode(selectedNode) : undefined}
      onClose={handleCloseForm}
      isEditMode={!!selectedNode}
      isLoading={isLoadingSelected || updateMutation.isPending || deleteMutation.isPending || createMutation.isPending}
      cancelButtonText={shouldShowModal ? "Bağla" : "İmtina et"}
      fullWidth={shouldShowModal}
      savePermission={PERMISSIONS.COMPANY.CREATE}
      deletePermission={PERMISSIONS.COMPANY.DELETE}
    />
  );
  
  const shouldShowStaffingPanel = isEditingStaffing && !isMobile;

  const staffingInitialDataForForm: DepartmentNode | null = staffingDetail
    ? {
        id: staffingDetail.id,
        name: "",
        type: staffingDetail.organizationUnitId,
        isActive: staffingDetail.isActive ?? true,
        sortOrder: 0,
        parentDepartmentId: staffingDetail.organizationUnitId,
        parentDepartmentName: staffingDetail.organizationUnit || staffingDetail.organizationUnitId,
        sayi: staffingDetail.positionCount,
        createdAt: staffingDetail.createdAt,
        createdBy: staffingDetail.createdBy,
      }
    : null;

  const staffingParentOption = staffingDetail
    ? {
        id: staffingDetail.organizationUnitId,
        fullName: staffingDetail.organizationUnit || staffingDetail.organizationUnitId,
        role: "",
      }
    : null;

  const staffingFormContent = shouldShowStaffingPanel ? (
    <DepartmentForm
      key={editingStaffingId ? `staffing-${editingStaffingId}` : "staffing-empty"}
      title="Ştat Məlumatları"
      initialData={staffingInitialDataForForm}
      defaultParent={staffingParentOption}
      onSave={(formData) => {
        if (staffingDetail && staffingPositionOption && staffingWorkloadOption && staffingStaffCategoryOption) {
          updateStaffingMutation.mutate({
            id: staffingDetail.id,
            organizationUnitId: staffingDetail.organizationUnitId,
            positionId: String(staffingPositionOption.id),
            workloadRateCode: String(staffingWorkloadOption.id),
            staffCategoryCode: String(staffingStaffCategoryOption.id),
            positionCount: formData.sayi === "" ? undefined : Number(formData.sayi)
          }, {
            onSuccess: () => {
              toast.success("Ştat məlumatları yeniləndi");
              handleCloseForm();
            },
            onError: () => {},
          });
        } else {
          toast.error("Bütün məcburi sahələri doldurun");
        }
      }}
      onCancel={handleCloseForm}
      onDelete={(id) => {
        if (staffingDetail) {
          setStaffingDeleteConfirmModal({
            isOpen: true,
            id: id || staffingDetail.id,
            orgUnitId: staffingDetail.organizationUnitId
          });
        }
      }}
      onClose={handleCloseForm}
      isEditMode={true}
      isLoading={isLoadingStaffingDetail || updateStaffingMutation.isPending}
      cancelButtonText="İmtina et"
      fullWidth={false}
      savePermission={PERMISSIONS.STAFFING.CREATE}
      deletePermission={PERMISSIONS.STAFFING.DELETE}
      hideSortOrder={true}
      hideActive={true}
      hideType={true}
      hideName={true}
      fieldsAfterType={
        <div>
          <label
            htmlFor="staffing-position"
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              marginBottom: "4px",
              display: "block",
            }}
          >
            Vəzifə <span style={{ color: "red" }}>*</span>
          </label>
          <CustomSelect
            id="staffing-position"
            options={staffingPositionOptions}
            defaultText={isPositionsLoading ? "Yüklənir..." : "Seçin"}
            value={staffingPositionOption}
            onChange={(option) => {
              setStaffingPositionOption(option as Option | null);
            }}
            variant="form"
            isSearchable
            isClearable
            onSearch={(q) => setPositionSearch(q)}
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (
                scrollHeight - scrollTop <= clientHeight + 10 &&
                hasNextPositions &&
                !isFetchingNextPositions
              ) {
                fetchNextPositions();
              }
            }}
            isLoading={isFetchingNextPositions || isPositionsLoading}
          />
        </div>
      }
      fieldsAfterName={
        <>
          <div>
            <label
              htmlFor="staffing-workload"
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "4px",
                display: "block",
              }}
            >
              İş rejimi <span style={{ color: "red" }}>*</span>
            </label>
            <CustomSelect
              id="staffing-workload"
              options={workloadOptions}
              defaultText="Seçin"
              value={staffingWorkloadOption}
              onChange={(option) => {
                setStaffingWorkloadOption(option as Option | null);
              }}
              variant="form"
              isSearchable
              isClearable
            />
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <label
              htmlFor="staffing-staff-category"
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                marginBottom: "4px",
                display: "block",
              }}
            >
              Heyyət <span style={{ color: "red" }}>*</span>
            </label>
            <CustomSelect
              id="staffing-staff-category"
              options={staffCategoryOptions}
              defaultText="Seçin"
              value={staffingStaffCategoryOption}
              onChange={(option) => {
                setStaffingStaffCategoryOption(option as Option | null);
              }}
              variant="form"
              isSearchable
              isClearable
            />
          </div>
        </>
      }
      renderActiveControl={
        <PermissionGuard permission={PERMISSIONS.STAFFING.UPDATE}>
          <Button
            type="button"
            variant={staffingDetail?.isActive ? "secondary" : "primary"}
            className={styles.formBtn}
            onClick={() => {
              if (staffingDetail) {
                  setStaffingActiveMutation.mutate({
                      id: staffingDetail.id,
                      organizationUnitId: staffingDetail.organizationUnitId,
                      isActive: !staffingDetail.isActive
                  }, {
                      onSuccess: () => toast.success(staffingDetail.isActive ? "Kadr deaktiv edildi" : "Kadr aktiv edildi")
                  });
              }
            }}
            disabled={setStaffingActiveMutation.isPending}
          >
            {staffingDetail?.isActive ? "Deaktiv et" : "Aktiv et"}
          </Button>
        </PermissionGuard>
      }
    />
  ) : null;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Xəta baş verdi</div>;
  }

  return (
    <div className={styles.container}>
      <PageHeader title="Struktur">
        <Button
          className={styles.addButton}
          type="button"
          variant="primary"
          onClick={handleCreateNewClick}
        >
          + Yeni
        </Button>
      </PageHeader>
      
      <div className={styles.contentWrapper}>
        
        {/* LEFT COLUMN - TREE */}
        <div className={styles.leftColumn}>
          <CompanyTree 
            data={treeData} 
            selectedId={selectedNode ? selectedNode.id : null}
            onSelect={setSelectedNode}
            onEdit={handleEditNode} 
            onAddChild={handleAddChild}
            onViewStaffing={handleViewStaffing}
            onEditStaffing={handleEditStaffingItem}
          />
        </div>

        {/* RIGHT COLUMN - DESKTOP ONLY */}
        {!isMobile && (
          <>
             <div className={styles.divider}></div>
             <div className={styles.rightColumn}>
               {staffingFormContent ? (
                 staffingFormContent
               ) : shouldShowPanel && isFormOpen ? (
                 formContent
               ) : (
                 <div className={styles.emptyState}>
                   <p>Əməliyyat aparmaq üçün <br/>sol tərəfdən seçim edin</p>
                 </div>
               )}
             </div>
          </>
        )}
      </div>

      {shouldShowModal && (
        <Modal 
          isOpen={isFormOpen} 
          onClose={handleCloseForm}
          title={modalTitle}
          size="md"
        >
          {formContent}
        </Modal>
      )}

      <SelectionModal
        isOpen={isSelectionModalOpen}
        onClose={handleCloseSelectionModal}
        parentNode={parentForNew}
        onSaveStructure={handleSave}
        onSaveVacancy={handleSaveVacancy}
        isLoading={createMutation.isPending || createStaffingMutation.isPending}
        resetKey={createFormResetKey} 
      />

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Şirkəti sil"
        message="Bu şirkəti silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={staffingDeleteConfirmModal.isOpen}
        onClose={() => setStaffingDeleteConfirmModal({ isOpen: false, id: null, orgUnitId: null })}
        onConfirm={handleConfirmDeleteStaffing}
        title="Ştatı sil"
        message="Bu ştat məlumatını silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        confirmText="Sil"
        cancelText="Ləğv et"
        isLoading={deleteStaffingMutation.isPending}
      />
    </div>
  );
}
