  import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import styles from "./CreateModal.module.css";
import type { CreateModalProps } from "./type";
import {
  Modal,
  Button,
  Table,
  TableToolbar,
  TableControls,
  FormInput,
  FormTextarea,
  CustomSelect,
  Pagination,
} from "@/shared/ui";
import ConfirmModal from "@/shared/ui/modal/confirm/ConfirmModal";
import { rowCountOptions } from "@/shared/config/tableOptions";
import type { ColumnDef, Option } from "@/shared/types";
import { CiSearch } from "react-icons/ci";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { useUserCreationStatuses } from "@/features/lookups/hooks";
import LdapSearchModal from "@/pages/kadrlar/employee-shared/ui/ldap-search-modal/LdapSearchModal";
import type { LdapUser } from "@/pages/kadrlar/employee-shared/ui/ldap-search-modal/LdapSearchModal";
import { usersService } from "@/features/security/users";
import type { UserCreationRequestItem } from "@/features/security/users/model";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";

const CreateModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  onSuccess,
}: CreateModalProps) => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [isLdapSelected, setIsLdapSelected] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Option | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [data, setData] = useState<UserCreationRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] ?? null,
  );
  const pageSize = Number(selectedRowCount?.id) || 10;
  const [searchFullname, setSearchFullname] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

const handleCellClick = (e: React.MouseEvent<HTMLDivElement>, orgUnit: string | undefined) => {
  e.stopPropagation(); 
  
  if (!orgUnit) return;

  const rect = e.currentTarget.getBoundingClientRect();
  
  if (selectedOrgUnit === orgUnit) {
    setSelectedOrgUnit(null);
    setTooltipPos(null);
  } else {
   
    setTooltipPos({
      top: rect.bottom + 10,
      left: rect.left + rect.width / 2,
    });
    setSelectedOrgUnit(orgUnit);
  }
};

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (tooltipRef.current && tooltipRef.current.contains(event.target as Node)) {
      return;
    }

    setSelectedOrgUnit(null);
    setTooltipPos(null);
  };

  document.addEventListener('click', handleClickOutside, { capture: true });
  
  return () => {
    document.removeEventListener('click', handleClickOutside, { capture: true });
  };
}, []);
  const handleRowCountChange = (option: Option | null) => {
    setSelectedRowCount(option);
    setPageIndex(0);
  };

  const [hasOpenedUserStatuses, setHasOpenedUserStatuses] = useState(false);
  const { options: userStatusOptions, isLoading: isUserStatusesLoading } =
    useUserCreationStatuses(
      isCreateModalOpen || hasOpenedUserStatuses || !!selectedFilter,
    );

  const fetchRequests = useCallback(async (searchVal?: string) => {
    setIsLoading(true);
    try {
      const response = await usersService.getUserCreationRequests({
        pageIndex,
        pageSize,
        requestStatus: selectedFilter?.id ? String(selectedFilter.id) : null,
        fullname: searchVal !== undefined ? searchVal : (searchFullname || null),
        isDesc: true,
      });
      if (response.isSuccess && response.result) {
        setData(response.result.data);
        setTotalCount(response.result.totalCount);
      }
    } catch (error) {
      toast.error(getBackendErrorMessage(error as AxiosError) || "Sorğular yüklənərkən xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  }, [pageIndex, pageSize, selectedFilter, searchFullname]);

  useEffect(() => {
    if (isCreateModalOpen && activeTab === 1) {
      fetchRequests();
    }
  }, [isCreateModalOpen, activeTab, pageIndex, pageSize, selectedFilter, searchFullname]);

  const selectedPerson = data.find((item) => item.id === selectedRowId);

  const handleSearch = () => {
    setPageIndex(0);
    setSearchFullname(searchInputValue);
  };

  const columns: ColumnDef<UserCreationRequestItem>[] = [
    {
      header: "Sorğunun tarixi",
      accessor: "requestDate",
      render: (item) => {
        return item.requestDate
          ? new Date(item.requestDate).toLocaleString("az-AZ", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "-";
      },
    },
    { header: "Tam adı", accessor: "fullname" },
    {
      header: "Departament/Şöbə/Bölmə",
      accessor: "organizationUnit",
      render: (item) => (
        <div 
          className={styles.organizationUnitCellWrapper}
         onClick={(e) => handleCellClick(e, item.organizationUnit ?? undefined)}
        >
          <div className={styles.organizationUnitCell}>
            {item.organizationUnit || "-"}
          </div>
          {item.organizationUnit && selectedOrgUnit === item.organizationUnit && tooltipPos && (
            <div 
              ref={tooltipRef}
              className={styles.orgUnitTooltip}
              style={{
                top: `${tooltipPos.top}px`,
                left: `${tooltipPos.left}px`,
                transform: 'translateX(-50%)',
                opacity: 1,
                visibility: 'visible',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.organizationUnit}
            </div>
          )}
        </div>
      ),
      maxWidth: "200px",
    },
    {
      header: "Sorğunun statusu",
      accessor: "requestStatus",
      render: (item) => {
        const status = userStatusOptions.find(
          (opt) => String(opt.id) === String(item.requestStatus),
        );
        return status?.fullName || item.requestStatus;
      },
    },
    {
      header: "",
      accessor: "id",
      render: (item) => (
        <Button
          variant="outline"
          className={styles.selectBtn}
          onClick={() => setSelectedRowId(item.id)}
        >
          Seç
        </Button>
      ),
    },
  ];

  const handleConfirmTab1 = () => {
    if (selectedRowId) {
      setActiveTab(2);
      setIsChecked(false);
      setIsUsernameValid(null);
    }
  };

  const handleCancel = () => {
      setIsCreateModalOpen(false);

  };

  const handleConfirmCancel = () => {
    setIsCreateModalOpen(false);
    setSelectedRowId(null);
    setUsername("");
    setActiveTab(1);
    setIsChecked(false);
    setIsUsernameValid(null);
    setIsLdapSelected(false);
    setUsernameError(null);
    setSelectedFilter(null);
    setHasOpenedUserStatuses(false);
    setIsConfirmModalOpen(false);
    setPageIndex(0);
    setData([]);
    setSearchFullname("");
    onSuccess();
  };

  const handleLdapConfirm = (selectedUser: LdapUser) => {
    setUsername(selectedUser.username);
    setIsChecked(false);
    setIsUsernameValid(null);
    setIsLdapSelected(true);
    setUsernameError(null);
    setIsLdapModalOpen(false);
  };

  const handleCheckUsername = async () => {
    if (!username.trim()) return;

    setIsValidating(true);
    setUsernameError(null);
    try {
      const response = await usersService.checkUsername(
        isLdapSelected,
        username,
      );

      const isSuccess = response === true || response?.isSuccess === true;
      setIsUsernameValid(isSuccess);
      setIsChecked(true);

      if (!isSuccess && response?.errorMessage) {
        setUsernameError(response.errorMessage);
      }
    } catch (error: unknown) {
      setIsUsernameValid(false);
      setIsChecked(true);
      const axiosError = error as AxiosError;
      const errorMessage = getBackendErrorMessage(axiosError);
      setUsernameError(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateUser = async () => {
    if (
      !selectedRowId ||
      !selectedPerson?.personId ||
      !username.trim() ||
      !isUsernameValid
    ) {
      toast.error("Zəhmət olmasa istifadəçi adını yoxlayın");
      return;
    }

    setIsCreating(true);
    try {
      const response = await usersService.createUser(
        selectedPerson.personId,
        username,
        isLdapSelected,
      );

      if (response === true || response?.isSuccess === true) {
        toast.success("İstifadəçi uğurla yaradıldı");
        setIsCreateModalOpen(false);
        handleConfirmCancel();
        onSuccess();
      } else {
        toast.error(response?.errorMessage || "Xəta baş verdi");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = getBackendErrorMessage(axiosError);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedRowId || !rejectReason.trim()) {
      toast.error("Zəhmət olmasa imtina səbəbini qeyd edin");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await usersService.rejectUserCreationRequest({
        id: selectedRowId,
        rejectReason: rejectReason.trim(),
      });

      if (response === true || response?.isSuccess === true) {
        toast.success("Sorğu imtina edildi");
        setIsRejectModalOpen(false);
        setRejectReason("");
        handleConfirmCancel();
        onSuccess();
      } else {
        toast.error(response?.errorMessage || "Xəta baş verdi");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = getBackendErrorMessage(axiosError);
      toast.error(errorMessage);
    } finally {
      setIsRejecting(false);
    }
  };

  const renderTitle = () => (
    <div className={styles.modalHeaderTitle}>
      {activeTab === 2 && (
        <button
          className={styles.backBtn}
          onClick={() => {
            setActiveTab(1);
            setIsChecked(false);
          }}
        >
          <ChevronLeftIcon className={styles.backIcon} />
          <span className={styles.backText}>Geri</span>
        </button>
      )}
      <span>Yeni İstifadəçi</span>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCancel}
        title={renderTitle()}
        size={activeTab === 1 ? "xl" : "md"}
      >
        <div
          className={`${styles.modalLayout} ${activeTab === 1 ? styles.tab1Layout : styles.tab2Layout}`}
        >
          <div className={styles.mainContent}>
            {activeTab === 1 ? (
              <>
                <div className={styles.filterContainer}>
                   <div className={styles.filterControls}>
                 <TableToolbar className={styles.tableToolbar}>
                  <TableControls
                    selectedRowCount={selectedRowCount}
                    onRowCountChange={handleRowCountChange}
                    totalCount={totalCount}
                    className={styles.tableControls}
                  />
                </TableToolbar>
             </div>
                  <div className={styles.filterSection}>
                  <div className={styles.filterSelectWrapper}>
                    <CustomSelect
                      options={userStatusOptions}
                      value={selectedFilter}
                      onChange={(v) => setSelectedFilter(v)}
                      defaultText={
                        isUserStatusesLoading ? "Yüklənir..." : "Sorgu seçin"
                      }
                      className={styles.filterSelect}
                      onOpen={() => setHasOpenedUserStatuses(true)}
                    />
                  </div>

                  <FormInput
                    type="text"
                    id="searchFullname"
                    label=""
                    placeholder="Tam adı daxil edin"
                    value={searchInputValue}
                    onChange={(val) => {
                      setSearchInputValue(val);
                    }}
                    className={styles.usernameInputV2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />

                  <Button
                    variant="default"
                    className={styles.searchBtn}
                    onClick={handleSearch}
                  >
                    <CiSearch size={22} />
                  </Button>
                </div>

            
                </div>

                <div className={styles.tableContainer}>
                  {isLoading ? (
                    <div className={styles.loadingContainer}>
                      <p>Yüklənir...</p>
                    </div>
                  ) : (
                    <Table
                      data={data}
                      columns={columns}
                      selectedRowId={selectedRowId}
                      rowIdKey="id"
                    />
                  )}
                </div>

                  <div className={styles.paginationWrapper}>
                    <Pagination
                      currentPage={pageIndex + 1}
                      totalPages={Math.ceil(totalCount / pageSize)}
                      onPageChange={(page) => setPageIndex(page - 1)}
                    />
                  </div>

                <div className={styles.footerActions}>
                  <Button
                    variant="primary"
                    onClick={handleConfirmTab1}
                    disabled={!selectedRowId}
                    className={styles.confirmBtn}
                  >
                    Davam et
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.tab2Wrapper}>
                <div className={styles.personInfoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Tarix:</span>
                    <span className={styles.infoValue}>
                      {selectedPerson?.requestDate
                        ? new Date(selectedPerson.requestDate).toLocaleString(
                            "az-AZ",
                            {
                              dateStyle: "short", 
                              timeStyle: "short", 
                            },
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Tam adı:</span>
                    <span className={styles.infoValue}>
                      {selectedPerson?.fullname || "-"}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span className={styles.infoValue}>
                      {userStatusOptions.find(
                        (opt) =>
                          String(opt.id) ===
                          String(selectedPerson?.requestStatus),
                      )?.fullName ||
                        selectedPerson?.requestStatus ||
                        "-"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Struktur vahidi:</span>
                    <span className={styles.infoValue}>
                      {selectedPerson?.organizationUnit || "-"}
                    </span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                    <span className={styles.infoLabel}>Qeyd:</span>
                    <span className={styles.infoValue}>
                      {selectedPerson?.note || "-"}
                    </span>
                  </div>
                  {selectedPerson?.requestStatus === "Rejected" &&
                    selectedPerson?.rejectReason && (
                      <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                        <span className={styles.infoLabel}>İmtina səbəbi:</span>
                        <span className={styles.infoValue}>
                          {selectedPerson.rejectReason}
                        </span>
                      </div>
                    )}
                </div>

                {selectedPerson?.requestStatus === "Pending" && (
                  <div className={styles.tab2Content}>
                    <div className={styles.inputWithAction}>
                      <div className={styles.inputGroup}>
                        <FormInput
                          type="text"
                          id="username"
                          label="İstifadəçi adı"
                          placeholder="İstifadəçi adını daxil edin"
                          value={username}
                          onChange={(val) => {
                            setUsername(val);
                            setIsChecked(false);
                            setIsUsernameValid(null);
                            setIsLdapSelected(false);
                            setUsernameError(null);
                          }}
                          className={styles.usernameInput}
                          icon={<CiSearch size={20} />}
                        />
                      </div>
                      <Button
                        variant="primary"
                        onClick={handleCheckUsername}
                        className={styles.saveBtn}
                        disabled={isValidating || !username.trim()}
                      >
                        <span id="confirmCheckboxLabel">
                          {isValidating ? "Yüklənir..." : "Yoxla"}
                        </span>
                      </Button>

                      {isChecked && (
                        <div className={styles.checkWrapper}>
                          {!isUsernameValid ? (
                            <MdCancel className={styles.errorIcon} />
                          ) : (
                            <IoIosCheckmarkCircle
                              className={styles.checkIcon}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className={styles.errorWrapper}>
                      {usernameError && (
                        <div className={styles.errorMessage}>
                          {usernameError}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setIsLdapModalOpen(true)}
                      className={styles.ldapBtn}
                    >
                      LDAP
                    </Button>

                    <div className={styles.tab2Footer}>
                      <Button
                        variant="default"
                        className={styles.cancelBtn}
                        onClick={() => setIsRejectModalOpen(true)}
                      >
                        İmtina et
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleCreateUser}
                        className={styles.saveBtnV2}
                        disabled={isCreating || !isUsernameValid}
                      >
                        {isCreating ? "Yaradılır..." : "Təsdiq et"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="İmtina et"
        message="Əməliyyatdan imtina etmək istədiyinizə əminsiniz?"
        confirmText="Bəli"
        cancelText="Xeyr"
        variant="danger"
      />

      <LdapSearchModal
        isOpen={isLdapModalOpen}
        onClose={() => setIsLdapModalOpen(false)}
        onConfirm={handleLdapConfirm}
      />

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="İmtina et"
        size="md"
      >
        <div className={styles.modalBody}>
          <FormTextarea
            id="rejectReason"
            label="İmtina səbəbi"
            placeholder="Səbəbi daxil edin..."
            value={rejectReason}
            onChange={(val) => setRejectReason(val)}
            required
            rows={5}
          />
        </div>
        <div className={styles.modalFooter}>
          <Button
            variant="secondary"
            onClick={() => setIsRejectModalOpen(false)}
            className={styles.footerBtn}
          >
            Ləğv et
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmReject}
            className={styles.footerBtn}
            disabled={isRejecting || !rejectReason.trim()}
          >
            {isRejecting ? "Göndərilir..." : "Təsdiq et"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateModal;
