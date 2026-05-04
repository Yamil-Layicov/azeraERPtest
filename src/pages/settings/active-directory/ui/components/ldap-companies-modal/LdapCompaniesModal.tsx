import { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/modal/base";
import { Button } from "@/shared/ui/button";
import {
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import styles from "./LdapCompaniesModal.module.css";
import { IconButton } from "@/shared/ui";
import { RootCompaniesLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";

interface LdapCompaniesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCompanies?: Option[];
  onSave: (companies: Option[]) => void;
  isLoading?: boolean;
}

export const LdapCompaniesModal = ({
  isOpen,
  onClose,
  initialCompanies = [],
  onSave,
  isLoading = false,
}: LdapCompaniesModalProps) => {
  const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
  const [companies, setCompanies] = useState<Option[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCompanies(initialCompanies);
      setSelectedCompany(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAdd = () => {
    if (!selectedCompany) return;

    // Eğer zaten varsa ekleme
    if (companies.some((c) => String(c.id) === String(selectedCompany.id))) {
      setSelectedCompany(null);
      return;
    }

    const newCompanies = [...companies, selectedCompany];
    setCompanies(newCompanies);
    setSelectedCompany(null);
  };

  const handleDelete = (idToDelete: string | number) => {
    setCompanies(companies.filter((c) => String(c.id) !== String(idToDelete)));
  };

  const handleSave = () => {
    onSave(companies);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Şirkətlər"
      size="md"
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          {/* ADD SELECT (RootCompaniesLookupSelect) */}
          <div className={`${styles.inputWrapper} ${styles.selectWrapper}`}>
            <RootCompaniesLookupSelect
              value={selectedCompany}
              onChange={(val) => setSelectedCompany(val)}
              variant="form"
              defaultText="Yeni şirkət..."
            />
          </div>

          {/* ADD BUTTON */}
          <IconButton
            icon={PlusIcon}
            variant="default"
            onClick={handleAdd}
            className={styles.iconBtn}
            title="Əlavə et"
            disabled={!selectedCompany}
          />
        </div>

        {/* List Container */}
        <div className={styles.listContainer}>
          {companies.length === 0 ? (
            <div className={styles.emptyState}>
              Hələ heç bir şirkət əlavə edilməyib
            </div>
          ) : (
            companies.map((comp) => (
              <div key={comp.id} className={styles.listItem}>
                <span>{comp.fullName || comp.label || ""}</span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(comp.id)}
                  title="Sil"
                >
                  <TrashIcon width={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            className={styles.footerButton}
            disabled={isLoading}
          >
            {isLoading ? "Yüklənir..." : "Yadda saxla"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className={styles.footerButton}
          >
            Ləğv et
          </Button>
        </div>
      </div>
    </Modal>
  );
};
