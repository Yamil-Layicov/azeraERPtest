import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Modal,
  Button,
  Table,
  TableToolbar,
  TableControls,
  FormInput,
  Pagination,
} from "@/shared/ui";
import { CiSearch } from "react-icons/ci";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import styles from "./NewUserModal.module.css";
import type { ColumnDef, Option } from "@/shared/types";
import { usersService } from "@/features/security/users";
import type { EmployeeItem } from "@/features/security/users/model";
import { rowCountOptions } from "@/shared/config/tableOptions";
import LdapSearchModal from "@/pages/kadrlar/employee-shared/ui/ldap-search-modal/LdapSearchModal";
import type { LdapUser } from "@/pages/kadrlar/employee-shared/ui/ldap-search-modal/LdapSearchModal";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";
import { useRootCompaniesLookup } from "@/features/kadrlar/departments";
import { logger } from "@/shared/lib/hooks/logger";

const NewUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [isLdapSelected, setIsLdapSelected] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isLdapModalOpen, setIsLdapModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchFullname, setSearchFullname] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(
    rowCountOptions[0] ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EmployeeItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = Number(selectedRowCount?.id) || 10;
  const selectedEmployee = data.find((item) => item.id === selectedRowId);
  const { data: rootCompaniesOptions = [] } = useRootCompaniesLookup(true);

  const getCompanyName = useCallback(
    (rootCompanyId: string | null | undefined) => {
      if (!rootCompanyId) return "-";
      const company = rootCompaniesOptions.find(
        (opt) => String(opt.id) === String(rootCompanyId),
      );
      return company?.fullName || rootCompanyId;
    },
    [rootCompaniesOptions],
  );

  const fetchEmployees = useCallback(
    async (searchVal?: string) => {
      setIsLoading(true);
      try {
        const response = await usersService.getEmployees({
          pageIndex,
          pageSize,
          value: searchVal !== undefined ? searchVal : (searchFullname || null),
        });
        if (response.isSuccess && response.result) {
          setData(response.result.data);
          setTotalCount(response.result.totalCount);
        }
      } catch (error) {
        logger.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageIndex, pageSize, searchFullname],
  );

  useEffect(() => {
    if (isOpen && activeTab === 1) {
      fetchEmployees();
    }
  }, [isOpen, activeTab, pageIndex, pageSize, searchFullname]);

  const handleSearch = () => {
    setPageIndex(0);
    setSearchFullname(searchInputValue);
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
      !selectedEmployee?.person.id ||
      !username.trim() ||
      !isUsernameValid
    ) {
      toast.error("Zəhmət olmasa istifadəçi adını yoxlayın");
      return;
    }

    setIsCreating(true);
    try {
      const response = await usersService.createUser(
        selectedEmployee.person.id,
        username,
        isLdapSelected,
      );

      if (response === true || response?.isSuccess === true) {
        toast.success("İstifadəçi uğurla yaradıldı");
        handleCancel();
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

  const handleLdapConfirm = (selectedUser: LdapUser) => {
    setUsername(selectedUser.username);
    setIsChecked(false);
    setIsUsernameValid(null);
    setIsLdapSelected(true);
    setUsernameError(null);
    setIsLdapModalOpen(false);
  };

  const handleCancel = () => {
    onClose();
    setSelectedRowId(null);
    setUsername("");
    setActiveTab(1);
    setIsChecked(false);
    setIsUsernameValid(null);
    setIsLdapSelected(false);
    setUsernameError(null);
    setPageIndex(0);
    setSearchFullname("");
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

  const columns: ColumnDef<EmployeeItem>[] = [
    {
      header: "Tam adı",
      accessor: "person",
      render: (item) =>
        `${item.person.name} ${item.person.surname} ${item.person.patronymic || ""}`,
    },
    {
      header: "Şirkət",
      accessor: "rootCompanyId",
      render: (item) => getCompanyName(item.rootCompanyId),
    },
    { header: "Status", accessor: "status" },
    {
      header: "",
      accessor: "id",
      render: (item) => (
        <Button
          variant="outline"
          onClick={() => setSelectedRowId(item.id)}
          className={styles.selectBtn}
        >
          {selectedRowId === item.id ? "Seçildi" : "Seç"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleCancel} 
        title={renderTitle()} 
        size={activeTab === 1 ? "xl" : "md"}
      >
        <div className={`${styles.modalLayout} ${activeTab === 1 ? styles.tab1Layout : styles.tab2Layout}`}>
          <div className={styles.mainContent}>
            {activeTab === 1 ? (
              <>
              <div className={styles.filterContainer}>
               <div>
                   <TableToolbar>
                  <TableControls
                    selectedRowCount={selectedRowCount}
                    onRowCountChange={(opt) => {
                      setSelectedRowCount(opt);
                      setPageIndex(0);
                    }}
                    totalCount={totalCount}
                  />
                </TableToolbar>
               </div>
                
                 <div className={styles.filterSection}>
                

                  <FormInput
                    type="text"
                    id="searchFullname"
                    label=""
                    placeholder="Tam adı daxil edin"
                    value={searchInputValue}
                    onChange={(val) => setSearchInputValue(val)}
                    onClear={() => {
                      setSearchInputValue("");
                      setSearchFullname("");
                      setPageIndex(0);
                      fetchEmployees("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className={styles.usernameInputV2}
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
                    totalPages={Math.ceil(totalCount / pageSize) || 1}
                    onPageChange={(page) => setPageIndex(page - 1)}
                  />
                </div>

                <div className={styles.footerActions}>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab(2)}
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
                    <span className={styles.infoLabel}>Tam adı:</span>
                    <span className={styles.infoValue}>
                      {selectedEmployee ? `${selectedEmployee.person.name} ${selectedEmployee.person.surname} ${selectedEmployee.person.patronymic || ""}` : "-"}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span className={styles.infoValue}>
                      {selectedEmployee?.status || "-"}
                    </span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                    <span className={styles.infoLabel}>Şirkət:</span>
                    <span className={styles.infoValue}>
                      {selectedEmployee ? getCompanyName(selectedEmployee.rootCompanyId) : "-"}
                    </span>
                  </div>
                </div>

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
                      <span>
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
                      variant="primary"
                      onClick={handleCreateUser}
                      className={styles.saveBtnV2}
                      disabled={isCreating || !isUsernameValid}
                    >
                      {isCreating ? "Yaradılır..." : "Təsdiq et"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <LdapSearchModal
        isOpen={isLdapModalOpen}
        onClose={() => setIsLdapModalOpen(false)}
        onConfirm={handleLdapConfirm}
      />
    </>
  );
};

export default NewUserModal;
