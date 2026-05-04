import { useMemo, useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import styles from "./AddCashboxModal.module.css";
import { Button } from "@/shared/ui/button";
import { CustomSelect, MultiSelect } from "@/shared/ui/select";
import { Modal } from "@/shared/ui/modal/base";
import type { Option } from "@/shared/types";
import { getBackendErrorMessage } from "@/shared/api";
import {
  useGetRootCompanies,
  useGetCurrencies,
  useGetOperationTypes,
  useGetEmployees,
  useUpdateCashBox,
  cashOperationsService,
} from "@/features/maliyye/cash-operations";
import type { UpdateCashBoxRequest } from "@/features/maliyye/cash-operations";
import { useUser } from "@/features";

interface EditCashboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  cashboxId?: string;
}

interface Confirmer {
  id: string;
  name: Option | null;
  orderNumber: string;
  minAmount: string;
  maxAmount: string;
}

const defaultCurrencyOption: Option = { id: 1, fullName: "AZN", role: "" };

function EditCashboxModal({
  isOpen,
  onClose,
  onSubmit,
  cashboxId,
}: EditCashboxModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    company: null as Option | null,
    treasurer: null as Option | null,
    balance: "",
    currency: defaultCurrencyOption as Option | null,
    maxLimit: "",
    operations: [] as Option[],
  });

  const selectedCompanyId =
    formData.company?.id != null ? String(formData.company.id) : undefined;

  const {
    data: rootCompaniesData,
    refetch: refetchCompanies,
    isFetching: isFetchingCompanies,
  } = useGetRootCompanies({ enabled: false });
  const {
    data: currenciesData,
    refetch: refetchCurrencies,
    isFetching: isFetchingCurrencies,
  } = useGetCurrencies({ enabled: false });
  const {
    refetch: refetchOperationTypes,
    isFetching: isFetchingOperationTypes,
  } = useGetOperationTypes({ enabled: false });
  const {
    data: employeesData,
    refetch: refetchEmployees,
    isFetching: isFetchingEmployees,
  } = useGetEmployees(selectedCompanyId, { enabled: false });

  const { mutate: updateCashBox, isPending: isSaving } = useUpdateCashBox();
  const { data: userData } = useUser();
  const userNodeId = userData?.result?.user?.nodeId || null;
  const [isLoadingData, setIsLoadingData] = useState(false);

  const companyOptions: Option[] = useMemo(() => {
    if (rootCompaniesData?.isSuccess && rootCompaniesData.result) {
      return rootCompaniesData.result.map((c) => ({
        id: c.value,
        fullName: c.label,
        role: "",
      }));
    }
    return [];
  }, [rootCompaniesData]);

  const currencyOptions: Option[] = useMemo(() => {
    if (currenciesData?.isSuccess && currenciesData.result) {
      return currenciesData.result.map((c) => ({
        id: c.value,
        fullName: c.label,
        role: "",
      }));
    }
    return [defaultCurrencyOption];
  }, [currenciesData]);

  const OPERATION_TYPES_FALLBACK: Option[] = useMemo(
    () => [
      { id: "1", fullName: "Mədaxil", role: "" },
      { id: "2", fullName: "Məxaric", role: "" },
      { id: "3", fullName: "Transfer", role: "" },
    ],
    [],
  );

  const operationOptions: Option[] = OPERATION_TYPES_FALLBACK;
  const treasurerOptions: Option[] = useMemo(() => {
    const employees = employeesData?.result?.data;
    if (employeesData?.isSuccess && Array.isArray(employees)) {
      return employees.map((item: any) => ({
        id: item.value,
        fullName: item.label,
        role: "",
      }));
    }
    return [];
  }, [employeesData]);

  const handleLoadOptions = (
    type: "company" | "currency" | "operations" | "treasurer",
  ) => {
    switch (type) {
      case "company":
        if (!isFetchingCompanies) refetchCompanies();
        break;
      case "currency":
        if (!isFetchingCurrencies) refetchCurrencies();
        break;
      case "operations":
        if (!isFetchingOperationTypes) refetchOperationTypes();
        break;
      case "treasurer":
        if (selectedCompanyId && !isFetchingEmployees) refetchEmployees();
        break;
    }
  };

  const [confirmers, setConfirmers] = useState<Confirmer[]>([
    {
      id: `confirmer-${Date.now()}`,
      name: null,
      orderNumber: "",
      minAmount: "",
      maxAmount: "",
    },
  ]);

  const [openAccordions, setOpenAccordions] = useState({
    basic: true,
    confirmer: true,
  });

  useEffect(() => {
    if (isOpen && cashboxId) {
      setIsLoadingData(true);
      cashOperationsService
        .getCashBoxById(cashboxId)
        .then((response) => {
          if (response.isSuccess && response.result) {
            const data = response.result;

            setFormData({
              code: data.code || "",
              name: data.name || "",
              company: data.companyId
                ? {
                    id: data.companyId,
                    fullName: data.companyName || "Şirkət",
                    role: "",
                  }
                : null,
              treasurer: data.treasureId
                ? {
                    id: data.treasureId,
                    fullName: data.treasureName || "Xəzinədar",
                    role: "",
                  }
                : null,
              balance: data.balance?.toString() || "",
              currency: data.currencyType
                ? {
                    id: data.currencyType,
                    fullName:
                      data.currencyName ||
                      (data.currencyType === 1 ? "AZN" : "USD"),
                    role: "",
                  }
                : null,
              maxLimit: data.maxOperationLimit?.toString() || "",
              operations:
                data.allowedOperationTypes?.map((opId: number) => {
                  const op = OPERATION_TYPES_FALLBACK.find(
                    (o) => o.id === String(opId),
                  );
                  return (
                    op || {
                      id: String(opId),
                      fullName: `Operation ${opId}`,
                      role: "",
                    }
                  );
                }) || [],
            });

            if (data.approvers && data.approvers.length > 0) {
              setConfirmers(
                data.approvers.map((a) => ({
                  id: a.id,
                  name: a.nameId
                    ? {
                        id: a.nameId,
                        fullName: a.name || "Təsdiq edən",
                        role: "",
                      }
                    : null,
                  orderNumber: a.orderNumber.toString(),
                  minAmount: a.minAmount.toString(),
                  maxAmount: a.maxAmount.toString(),
                })),
              );
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching cashbox details:", err);
          toast.error("Məlumatı yükləmək mümkün olmadı.");
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else if (!isOpen) {
      handleClear();
    }
  }, [isOpen, cashboxId, OPERATION_TYPES_FALLBACK]);

  const handleInputChange = (
    field: string,
    value: string | Option | Option[] | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      code: "",
      name: "",
      company: null,
      treasurer: null,
      balance: "",
      currency: defaultCurrencyOption,
      maxLimit: "",
      operations: [],
    });
    setConfirmers([
      {
        id: `confirmer-${Date.now()}`,
        name: null,
        orderNumber: "",
        minAmount: "",
        maxAmount: "",
      },
    ]);
  };

  const handleAddConfirmer = () => {
    setConfirmers([
      ...confirmers,
      {
        id: `confirmer-${Date.now()}`,
        name: null,
        orderNumber: "",
        minAmount: "",
        maxAmount: "",
      },
    ]);
  };

  const handleRemoveConfirmer = (id: string) => {
    if (confirmers.length > 1) {
      setConfirmers(confirmers.filter((confirmer) => confirmer.id !== id));
    }
  };

  const handleConfirmerChange = (
    id: string,
    field: keyof Confirmer,
    value: string | Option | null,
  ) => {
    setConfirmers(
      confirmers.map((confirmer) =>
        confirmer.id === id ? { ...confirmer, [field]: value } : confirmer,
      ),
    );
  };

  const buildPayload = (): UpdateCashBoxRequest => {
    const companyId =
      formData.company?.id != null ? String(formData.company.id) : null;
    const treasureId =
      formData.treasurer?.id != null ? String(formData.treasurer.id) : null;
    const balance = Number(String(formData.balance).replace(",", ".")) || 0;
    const maxOperationLimit =
      Number(String(formData.maxLimit).replace(",", ".")) || 0;
    const currencyType = Number(formData.currency?.id) || 1;
    const allowedOperationTypesRaw = [
      ...new Set(
        formData.operations
          .map((o) => Number(String(o.id).trim()))
          .filter((n) => Number.isFinite(n)),
      ),
    ].sort((a, b) => a - b);
    const allowedOperationTypes =
      allowedOperationTypesRaw.length > 0 ? allowedOperationTypesRaw : [1];

    const approvers = confirmers.map((c) => ({
      id: c.id.startsWith("confirmer-") ? null : c.id, // Only send valid guid if it exists
      nameId: c.name?.id != null ? String(c.name.id) : null,
      orderNumber: Number(c.orderNumber) || 0,
      minAmount: Number(String(c.minAmount).replace(",", ".")) || 0,
      maxAmount: Number(String(c.maxAmount).replace(",", ".")) || 0,
    }));

    return {
      cashBoxId: cashboxId || "",
      name: formData.name.trim(),
      balance,
      currencyType,
      treasureId,
      companyId,
      maxOperationLimit,
      updatedId: userNodeId || "",
      allowedOperationTypes,
      approvers,
    };
  };

  const handleSubmit = () => {
    const payload = buildPayload();
    updateCashBox(payload, {
      onSuccess: () => {
        toast.success("Kassa məlumatları yeniləndi");
        handleClear();
        onClose();
        onSubmit?.();
      },
      onError: (err) => {
        const message = isAxiosError(err)
          ? getBackendErrorMessage(err)
          : (err as Error)?.message;
        toast.error(message || "Xəta baş verdi");
      },
    });
  };

  if (isLoadingData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Düzəliş et"
        size="lg"
        className={styles.customModalWidth}
      >
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Məlumatlar yüklənir...
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Düzəliş et"
      size="lg"
      className={styles.customModalWidth}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.accordionContainer}>
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={() =>
              setOpenAccordions((prev) => ({ ...prev, basic: !prev.basic }))
            }
          >
            <span>Əsas məlumatlar</span>
            <span
              className={`${styles.accordionIcon} ${openAccordions.basic ? styles.open : ""}`}
            >
              ▼
            </span>
          </button>
          {openAccordions.basic && (
            <div className={styles.accordionContent}>
              <div className={styles.formContainer}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="code">
                      Kodu
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={formData.code}
                      onChange={(e) =>
                        handleInputChange("code", e.target.value)
                      }
                      placeholder="Kodu daxil edin"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="name">
                      Adı
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Adı daxil edin"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Şirkət adı</label>
                    <CustomSelect
                      options={companyOptions}
                      value={formData.company}
                      onChange={(value) => handleInputChange("company", value)}
                      onMenuOpen={() => handleLoadOptions("company")}
                      defaultText="Şirkət seçin"
                      variant="form"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Xəzinədar</label>
                    <CustomSelect
                      options={treasurerOptions}
                      value={formData.treasurer}
                      onChange={(value) =>
                        handleInputChange("treasurer", value)
                      }
                      onMenuOpen={() => handleLoadOptions("treasurer")}
                      defaultText="Xəzinədar seçin"
                      variant="form"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="balance">
                      Balans
                    </label>
                    <input
                      type="text"
                      id="balance"
                      value={formData.balance}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^[0-9]*([.,][0-9]{0,2})?$/;
                        if (value === "" || regex.test(value)) {
                          handleInputChange("balance", value);
                        }
                      }}
                      placeholder="0.00"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Valyuta</label>
                    <CustomSelect
                      options={currencyOptions}
                      value={formData.currency}
                      onChange={(value) => handleInputChange("currency", value)}
                      onMenuOpen={() => handleLoadOptions("currency")}
                      defaultText=""
                      variant="form"
                      isClearable={false}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="maxLimit">
                      Maximum əməliyyat limiti
                    </label>
                    <input
                      type="text"
                      id="maxLimit"
                      value={formData.maxLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^[0-9]*([.,][0-9]{0,2})?$/;
                        if (value === "" || regex.test(value)) {
                          handleInputChange("maxLimit", value);
                        }
                      }}
                      placeholder="0.00"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Əməliyyatlar</label>
                    <MultiSelect
                      options={operationOptions}
                      value={formData.operations}
                      onChange={(selected) =>
                        handleInputChange("operations", selected)
                      }
                      onMenuOpen={() => handleLoadOptions("operations")}
                      defaultText="Əməliyyat seçin"
                      variant="form"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.accordionContainer}>
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={() =>
              setOpenAccordions((prev) => ({
                ...prev,
                confirmer: !prev.confirmer,
              }))
            }
          >
            <span>Təsdiq edən</span>
            <span
              className={`${styles.accordionIcon} ${openAccordions.confirmer ? styles.open : ""}`}
            >
              ▼
            </span>
          </button>
          {openAccordions.confirmer && (
            <div className={styles.accordionContent}>
              <div className={styles.formContainer}>
                {confirmers.map((confirmer) => (
                  <div key={confirmer.id} className={styles.confirmerItem}>
                    {confirmers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveConfirmer(confirmer.id)}
                        className={styles.deleteButton}
                        title="Sil"
                      >
                        <TrashIcon className={styles.icon} />
                      </button>
                    )}

                    <div className={styles.confirmerFormContent}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Adı</label>
                          <CustomSelect
                            options={treasurerOptions}
                            value={confirmer.name}
                            onChange={(value) =>
                              handleConfirmerChange(confirmer.id, "name", value)
                            }
                            onMenuOpen={() => handleLoadOptions("treasurer")}
                            defaultText="Adı seçin"
                            variant="form"
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label
                            className={styles.label}
                            htmlFor={`orderNumber-${confirmer.id}`}
                          >
                            Sıra nömrəsi
                          </label>
                          <input
                            type="number"
                            id={`orderNumber-${confirmer.id}`}
                            value={confirmer.orderNumber}
                            onChange={(e) =>
                              handleConfirmerChange(
                                confirmer.id,
                                "orderNumber",
                                e.target.value,
                              )
                            }
                            placeholder="Sıra nömrəsi daxil edin"
                            className={styles.input}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label
                            className={styles.label}
                            htmlFor={`minAmount-${confirmer.id}`}
                          >
                            Minimum Məbləğ
                          </label>
                          <input
                            type="text"
                            id={`minAmount-${confirmer.id}`}
                            value={confirmer.minAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^[0-9]*([.,][0-9]{0,2})?$/;
                              if (value === "" || regex.test(value)) {
                                handleConfirmerChange(
                                  confirmer.id,
                                  "minAmount",
                                  value,
                                );
                              }
                            }}
                            placeholder="0.00"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label
                            className={styles.label}
                            htmlFor={`maxAmount-${confirmer.id}`}
                          >
                            Maximum Məbləğ
                          </label>
                          <input
                            type="text"
                            id={`maxAmount-${confirmer.id}`}
                            value={confirmer.maxAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^[0-9]*([.,][0-9]{0,2})?$/;
                              if (value === "" || regex.test(value)) {
                                handleConfirmerChange(
                                  confirmer.id,
                                  "maxAmount",
                                  value,
                                );
                              }
                            }}
                            placeholder="0.00"
                            className={styles.input}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className={styles.confirmersFooter}>
                  <button
                    type="button"
                    onClick={handleAddConfirmer}
                    className={styles.addButton}
                    title="Əlavə et"
                  >
                    <PlusIcon className={styles.icon} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerButtons}>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? "Yüklənir..." : "Yadda saxla"}
            </Button>
            <Button
              type="button"
              variant="clear"
              onClick={handleClear}
              className={styles.clearButton}
            >
              Təmizlə
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EditCashboxModal;
