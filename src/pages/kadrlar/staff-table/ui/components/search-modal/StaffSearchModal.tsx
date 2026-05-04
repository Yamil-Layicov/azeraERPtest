import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./StaffSearchModal.module.css";
import { Modal } from "@/shared/ui/modal/base";
import { Button } from "@/shared/ui/button";
import FormInput from "@/shared/ui/input/FormInput";
import { CustomSelect } from "@/shared/ui"; 
import type { Option } from "@/shared/types";
import { useEnumItemsByCode } from "@/features/lookups";
import { usePositionsLookupPaged } from "@/features/kadrlar/departments";
import { useDebounce } from "@/shared/hooks";

export interface StaffSearchFilters {
  employee: string;
  departmentId?: string | number;
  positionId?: string | number;
  isMain?: string | number;
  isActive?: string | number;
  isLeader?: string | number;
  staffCategoriesCode?: string | number;
}

interface StaffSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: StaffSearchFilters) => void;
  companiesOptions?: Option[];
  positionsOptions?: Option[];
}

const activeOptions: Option[] = [
  { id: "1", fullName: "Aktiv", role: "" },
  { id: "0", fullName: "Qeyri-aktiv", role: "" },
];

const mainTypeOptions: Option[] = [
  { id: "main", fullName: "Əsas", role: "" },
  { id: "substitute", fullName: "Əvəzləyici", role: "" },
];


const StaffSearchModal = ({ isOpen, onClose, onSearch, companiesOptions = [] }: StaffSearchModalProps) => {
  const [employee, setEmployee] = useState("");
  
  const [department, setDepartment] = useState<Option | null>(null);
  const [position, setPosition] = useState<Option | null>(null);
  const [isMain, setIsMain] = useState<Option | null>(null);
  const [isActive, setIsActive] = useState<Option | null>(null);
  const [isLeader, setIsLeader] = useState<Option | null>(null);
  const [staffCategory, setStaffCategory] = useState<Option | null>(null);

  const { options: staffCategoryOptions = [] } = useEnumItemsByCode(
    "StaffCategories",
    isOpen,
  );

  const [positionsPageIndex, setPositionsPageIndex] = useState(0);
  const [positionSearchQuery, setPositionSearchQuery] = useState("");
  const debouncedPositionSearchQuery = useDebounce(positionSearchQuery, 400);
  const [positionOptions, setPositionOptions] = useState<Option[]>([]);
  const [positionsTotalCount, setPositionsTotalCount] = useState(0);
  const [isPositionsSelectOpened, setIsPositionsSelectOpened] = useState(false);

  const {
    data: positionsPageData,
    isLoading: isLoadingPositionsPage,
    isFetching: isFetchingPositionsPage,
  } = usePositionsLookupPaged(
    positionsPageIndex,
    debouncedPositionSearchQuery || undefined,
    isOpen && isPositionsSelectOpened,
  );

  useEffect(() => {
    if (!isOpen) return;
    setPositionsPageIndex(0);
    setPositionOptions([]);
    setPositionsTotalCount(0);
    setPositionSearchQuery("");
    setIsPositionsSelectOpened(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isPositionsSelectOpened) return;
    setPositionsPageIndex(0);
    setPositionOptions([]);
  }, [debouncedPositionSearchQuery, isOpen, isPositionsSelectOpened]);

  useEffect(() => {
    if (!positionsPageData) return;

    setPositionsTotalCount(positionsPageData.totalCount);
    setPositionOptions((prev) => {
      if (positionsPageData.pageIndex === 0) {
        return positionsPageData.options;
      }

      const existingIds = new Set(prev.map((opt) => String(opt.id)));
      const appended = positionsPageData.options.filter(
        (opt) => !existingIds.has(String(opt.id)),
      );
      return [...prev, ...appended];
    });
  }, [positionsPageData]);

  const hasNextPositions = useMemo(
    () => positionOptions.length < positionsTotalCount,
    [positionOptions.length, positionsTotalCount],
  );

  const handlePositionSearch = useCallback((query: string) => {
    setPositionSearchQuery(query.trim());
  }, []);

  const handlePositionsMenuOpen = useCallback(() => {
    setIsPositionsSelectOpened(true);
    if (positionOptions.length === 0) {
      setPositionsPageIndex(0);
      setPositionsTotalCount(0);
    }
  }, []);

  const handlePositionScroll = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight + 10 &&
        hasNextPositions &&
        !isFetchingPositionsPage &&
        !isLoadingPositionsPage
      ) {
        setPositionsPageIndex((prev) => prev + 1);
      }
    },
    [hasNextPositions, isFetchingPositionsPage, isLoadingPositionsPage],
  );

  const handleSearchClick = () => {
    const filters: StaffSearchFilters = {
      employee,
      departmentId: department?.id,
      positionId: position?.id,
      isMain: isMain?.id,
      isActive: isActive?.id,
      isLeader: isLeader?.id,
      staffCategoriesCode: staffCategory?.id,
    };
    onSearch(filters);
    onClose();
  };

  const handleClear = () => {
    setEmployee("");  
    setDepartment(null);
    setPosition(null);
    setIsMain(null);
    setIsActive(null);
    setIsLeader(null);
    setStaffCategory(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ətraflı Axtarış"
      size="md"
      className={styles.customModalWidth}
    >
      <div className={styles.formContainer}>
        <div className={styles.grid}>
          {/* FormInput-un öz labeli CSS-də qlobal olaraq bold edilib */}
          <FormInput
            type="text" 
            id="search-employee"
            label="İşçi (A.S)"
            placeholder="Daxil edin"
            value={employee}
            onChange={setEmployee}
          />

          <div className="flex flex-col">
            <label className={styles.customLabel}>Departament / Şöbə / Bölmə</label>
            <CustomSelect
              options={companiesOptions}
              value={department}
              onChange={setDepartment}
              defaultText="Seçin..."
              isClearable={true}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Axtar..."
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.customLabel}>Vəzifə</label>
            <CustomSelect
              options={positionOptions}
              value={position}
              onChange={setPosition}
              defaultText="Seçin..."
              isClearable={true}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Axtar..."
              onSearch={handlePositionSearch}
              onScroll={handlePositionScroll}
              onMenuOpen={handlePositionsMenuOpen}
              isLoading={isLoadingPositionsPage || isFetchingPositionsPage}
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.customLabel}>Əsas</label>
            <CustomSelect
              options={mainTypeOptions}
              value={isMain}
              onChange={setIsMain}
              defaultText="Seçin..."
              isClearable={true}
              variant="form"
            />
          </div>

          <div className="flex flex-col">
            <label className={styles.customLabel}>Aktivlik</label>
            <CustomSelect
              options={activeOptions}
              value={isActive}
              onChange={setIsActive}
              defaultText="Seçin..."
              isClearable={true}
              variant="form"
            />
          </div>
          
           <div className="flex flex-col">
            <label className={styles.customLabel}>Heyət</label>
            <CustomSelect
              options={staffCategoryOptions}
              value={staffCategory}
              onChange={setStaffCategory}
              defaultText="Seçin..."
              isClearable={true}
              variant="form"
              isSearchable={true}
              searchPlaceholder="Axtar..."
            />
          </div>
        </div>

        <div className={styles.footer}>
          {/* Button sayı 2-yə endirildi və styles.smallBtn əlavə olundu */}
          <Button 
            variant="primary" 
            onClick={handleSearchClick} 
            type="button"
            className={styles.smallBtn}
          >
            Axtar
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClear} 
            type="button"
            className={styles.smallBtn}
          >
            Təmizlə
          </Button>
     
        </div>
      </div>
    </Modal>
  );
};

export default StaffSearchModal;
