import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styles from "./LdapSearchModal.module.css";
import { Button, FormInput, Table } from "@/shared/ui";
import { Modal } from "@/shared/ui/modal/base";
import type { ColumnDef } from "@/shared/types";
import { usersService } from "@/features/security/users";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { getBackendErrorMessage } from "@/shared/api/httpClient";

export interface LdapUser {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface LdapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUser: LdapUser) => void;
}

const LdapSearchModal: React.FC<LdapSearchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [searchValues, setSearchValues] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null);
  const [searchResults, setSearchResults] = useState<LdapUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchValues({ fullName: "", email: "", username: "" });
      setSearchResults([]);
      setSelectedUserId(null);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchValues.fullName && !searchValues.email && !searchValues.username) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await usersService.getLdapUsers(
        searchValues.fullName || undefined,
        searchValues.username || undefined,
        searchValues.email || undefined
      );

      const result = (response as any)?.result || response;
      let users: LdapUser[] = [];

      if (Array.isArray(result)) {
        users = result.map((user: any, index: number) => ({
          id: user.id || index + 1,
          firstName: user.firstName || user.name || "",
          lastName: user.lastName || user.surname || "",
          email: user.email || "",
          username: user.username || "",
        }));
      } else if (result && typeof result === 'object') {
        const dataArray = result.data || result.users || [];
        users = dataArray.map((user: any, index: number) => ({
          id: user.id || index + 1,
          firstName: user.firstName || user.name || "",
          lastName: user.lastName || user.surname || "",
          email: user.email || "",
          username: user.username || "",
        }));
      }

      setSearchResults(users);
    } catch (error) {
        toast.error(
        getBackendErrorMessage(error as   AxiosError) ||
          "Şifrə yenilənərkən xəta baş verdi",
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedUserId) {
      const user = searchResults.find((u) => u.id === selectedUserId);
      if (user) {
        onConfirm(user);
        onClose();
      }
    }
  };

  const hasSearchValue = !!(searchValues.fullName || searchValues.email || searchValues.username);


  const columns: ColumnDef<LdapUser>[] = [
    { header: "Ad", accessor: "firstName", width: "150px" },
    { header: "Soyad", accessor: "lastName", width: "150px" },
    { header: "Email", accessor: "email", width: "200px" },
    { header: "Username", accessor: "username", width: "120px" },
    {
      header: "",
      accessor: "id",
      width: "80px",
      render: (item) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="button"
            variant={selectedUserId === item.id ? "primary" : "outline"}
            onClick={() => {
              setSelectedUserId((prevId) =>
                prevId === item.id ? null : item.id
              );
            }}
            className={styles.selectBtn}
          >
            {selectedUserId === item.id ? "Seçildi" : "Seç"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="LDAP-dan axtar"
      size="lg"
      className={styles.customModalWidth}
    >
      <div className={styles.modalContent}>
        <div className={styles.searchRow}>
          <FormInput
            label=""
            id="ldap-fullname"
            type="text"
            placeholder="Tam ad"
            value={searchValues.fullName}
            onChange={(val) =>
              setSearchValues((prev) => ({ ...prev, fullName: val }))
            }
          />
          <FormInput
            label=""
            id="ldap-email"
            type="text"
            placeholder="Email"
            value={searchValues.email}
            onChange={(val) =>
              setSearchValues((prev) => ({ ...prev, email: val }))
            }
          />
          <FormInput
            label=""
            id="ldap-username"
            type="text"
            placeholder="Username"
            value={searchValues.username}
            onChange={(val) =>
              setSearchValues((prev) => ({ ...prev, username: val }))
            }
          />

          <button
            className={styles.searchBtn}
            onClick={handleSearch}
            title="Axtar"
            disabled={isLoading || !hasSearchValue}
          >
            <MagnifyingGlassIcon className={styles.searchIcon} />
          </button>
        </div>

        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Yüklənir...</p>
            </div>
          ) : (
            <Table
              data={searchResults}
              columns={columns}
              selectedRowId={selectedUserId ?? undefined}
            />
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !selectedUserId}
          >
            Təsdiqlə
          </Button>
          <Button
            type="button"
            variant="clear"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Bağla
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LdapSearchModal;

