import { useState, useEffect } from "react";
import { useFormState, useFormValidation } from "@/shared/lib/hooks";
import type { Option } from "@/shared/types";
import type { FormData } from "@/shared/types";
import { getBackendErrorMessage } from "@/shared/api";
import {
  useCreateCashOperation,
  useGetCashPurposes,
  useGetRootCompanies,
  useGetCashBoxes,
  useGetCurrencies,
  useGetCounterparties,
  useCreateCashPurpose,
  useCreateCounterparty,
  useGetCashOperationById,
  useUpdateCashOperation,
  useRejectCashOperation,
  cashOperationsService,
} from "@/features/maliyye/cash-operations";
import type { AxiosError } from "axios";
import {
  CashOperationType,
  CurrencyType,
  type CreateCashOperationRequest,
  type UpdateCashOperationRequest,
} from "@/features/maliyye/cash-operations";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes/consts";
import { useUser } from "@/features/auth/hooks/useUser";

function transactionTypeToEnum(t: string): CashOperationType {
  if (t === "məxaric") return CashOperationType.EXPENSE;
  if (t === "kocurme") return CashOperationType.TRANSFER;
  return CashOperationType.INCOME;
}

function currencyToEnum(name: string | undefined): CurrencyType {
  const n = name?.toUpperCase();
  if (n === "USD") return CurrencyType.USD;
  if (n === "EUR") return CurrencyType.EUR;
  return CurrencyType.AZN;
}

function idOrNull(v: string | number | undefined): string | number | null {
  if (v == null || String(v).trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && String(v).trim() === String(n) ? n : String(v);
}

function emptyToNull(v: string | number | undefined): string | null {
  return v == null || String(v).trim() === "" ? null : String(v);
}

function buildPayload(
  formData: FormData,
  id?: string,
  attachmentIds: string[] = [],
  creatorId: string | null = null,
): CreateCashOperationRequest | UpdateCashOperationRequest {
  const date = formData.selectedDate
    ? new Date(formData.selectedDate)
    : new Date();

  const createdDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS");

  const amount = Number(formData.amount) || 0;
  const exchangeRate = Number(formData.rate) || 1;
  const cashOperationType = transactionTypeToEnum(formData.transactionType);

  const fromCashBoxId =
    cashOperationType === CashOperationType.EXPENSE ||
    cashOperationType === CashOperationType.TRANSFER
      ? idOrNull(formData.source?.id)
      : null;
  const toCashBoxId =
    cashOperationType === CashOperationType.INCOME ||
    cashOperationType === CashOperationType.TRANSFER
      ? idOrNull(
          cashOperationType === CashOperationType.TRANSFER
            ? formData.destination?.id
            : formData.source?.id,
        )
      : null;

  const basePayload = {
    createdDate,
    rootCompanyId: idOrNull(formData.company?.id),
    cashPurposeId: idOrNull(formData.purpose?.id),
    counterPartyId: idOrNull(formData.counterparty?.id),
    payerOrRecipientName: emptyToNull(formData.personName),
    fromCashBoxId,
    toCashBoxId,
    amount,
    currencyType: currencyToEnum(formData.currency?.fullName),
    exchangeRate,
    cashOperationType,
    creatorId,
    note: emptyToNull(formData.notes),
    attachmentIds,
  };

  if (id) {
    return {
      ...basePayload,
      cashOperationId: id,
    } as UpdateCashOperationRequest;
  }
  return basePayload as CreateCashOperationRequest;
}

export const useAddKassaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { data: userData } = useUser();
  const userNodeId = userData?.result?.user?.nodeId || null;

  const {
    formData,
    fieldErrors,
    updateField,
    updateFields,
    clearForm,
    showSuccess,
    hideSuccess,
    showError,
    hideError,
    clearFieldErrors,
    clearFieldError,
  } = useFormState();

  const { validateForm } = useFormValidation();
  const { mutate: createOperation, isPending: isCreating } =
    useCreateCashOperation();
  const { mutate: updateOperation, isPending: isUpdating } =
    useUpdateCashOperation();
  const { mutate: rejectOperation, isPending: isRejecting } =
    useRejectCashOperation();
  const { data: existingData, isFetching: isFetchingExisting } =
    useGetCashOperationById(id, { enabled: isEditMode });

  const [isRejectConfirmModalOpen, setIsRejectConfirmModalOpen] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [creatorInfo, setCreatorInfo] = useState<{
    creatorName: string | null;
    createdDate: string | null;
  } | null>(null);

  useEffect(() => {
    if (isEditMode && existingData?.result) {
      const data = existingData.result;
      
      setCreatorInfo({
        creatorName: data.creatorName || null,
        createdDate: data.createdDate || null,
      });

      const transactionType =
        data.cashOperationType === 1
          ? "mədaxil"
          : data.cashOperationType === 2
            ? "məxaric"
            : "kocurme";

      const currencyMap: Record<number, string> = {
        1: "AZN",
        2: "USD",
        3: "EUR",
      };

      const currencyId =
        typeof data.currencyType === "string"
          ? currencyToEnum(data.currencyType)
          : data.currencyType;

      updateFields({
        transactionType,
        amount: String(data.amount || ""),
        notes: data.note || "",
        personName: data.payerOrRecipientName || "",
        selectedDate: data.createdDate
          ? new Date(data.createdDate)
          : new Date(),
        currency: currencyId
          ? {
              id: currencyId,
              fullName:
                currencyMap[currencyId as number] ||
                (typeof data.currencyType === "string"
                  ? data.currencyType
                  : ""),
              role: "",
            }
          : null,
        company: data.rootCompanyId
          ? {
              id: data.rootCompanyId,
              fullName: data.rootCompanyName || "",
              role: "",
            }
          : null,
        source: data.fromCashBoxId
          ? {
              id: data.fromCashBoxId,
              fullName: data.fromCashBoxName || "",
              role: "",
            }
          : data.toCashBoxId
            ? {
                id: data.toCashBoxId,
                fullName: data.toCashBoxName || "",
                role: "",
              }
            : null,
        destination:
          data.toCashBoxId && transactionType === "kocurme"
            ? {
                id: data.toCashBoxId,
                fullName: data.toCashBoxName || "",
                role: "",
              }
            : null,
        counterparty: data.counterPartyId
          ? {
              id: data.counterPartyId,
              fullName: data.counterPartyName || "",
              role: "",
            }
          : null,
        purpose: data.cashPurposeId
          ? {
              id: data.cashPurposeId,
              fullName: data.cashPurposeName || "",
              role: "",
            }
          : null,
        showErrorModal: false,
        showSuccessModal: false,
        rate: "1",
        document: null,
      });
    }
  }, [isEditMode, existingData, updateFields]);

  const { mutate: createPurposeAction } = useCreateCashPurpose();
  const { mutate: createCounterpartyAction } = useCreateCounterparty();
  const {
    data: purposesData,
    refetch: refetchPurposes,
    isFetching: isFetchingPurposes,
  } = useGetCashPurposes({ enabled: false });
  const {
    data: companiesData,
    refetch: refetchCompanies,
    isFetching: isFetchingCompanies,
  } = useGetRootCompanies({ enabled: false });
  const selectedCompanyId = formData.company?.id
    ? String(formData.company.id)
    : undefined;
  const {
    data: cashBoxesData,
    refetch: refetchCashBoxes,
    isFetching: isFetchingCashBoxes,
  } = useGetCashBoxes(selectedCompanyId, { enabled: !!selectedCompanyId });
  const {
    data: currenciesData,
    refetch: refetchCurrencies,
    isFetching: isFetchingCurrencies,
  } = useGetCurrencies({ enabled: false });
  const {
    data: counterpartiesData,
    refetch: refetchCounterparties,
    isFetching: isFetchingCounterparties,
  } = useGetCounterparties({ enabled: false });

  const handleLoadOptions = (
    type: "purpose" | "counterparty" | "source" | "company" | "currency",
  ) => {
    switch (type) {
      case "purpose":
        if (!isFetchingPurposes) refetchPurposes();
        break;
      case "counterparty":
        if (!isFetchingCounterparties) refetchCounterparties();
        break;
      case "source":
        if (!isFetchingCashBoxes) refetchCashBoxes();
        break;
      case "company":
        if (!isFetchingCompanies) refetchCompanies();
        break;
      case "currency":
        if (!isFetchingCurrencies) refetchCurrencies();
        break;
    }
  };

  const [counterpartyList, setCounterpartyList] = useState<Option[]>([]);
  const [purposeList, setPurposeList] = useState<Option[]>([]);
  const [businessList, setBusinessList] = useState<Option[]>([]);
  const [companyList, setCompanyList] = useState<Option[]>([]);
  const [sourceList, setSourceList] = useState<Option[]>([]);
  const [currencyList, setCurrencyList] = useState<Option[]>([]);

  useEffect(() => {
    if (companiesData) {
      if (companiesData.isSuccess && companiesData.result) {
        setCompanyList(
          companiesData.result.map((c) => ({
            id: c.value,
            fullName: c.label,
            role: "",
          })),
        );
      } else {
        setCompanyList([]);
      }
    }
  }, [companiesData]);

  useEffect(() => {
    if (cashBoxesData) {
      if (cashBoxesData.isSuccess && cashBoxesData.result) {
        setSourceList(
          cashBoxesData.result.map((c) => ({
            id: c.value,
            fullName: c.label,
            role: "",
          })),
        );
      } else {
        setSourceList([]);
      }
    } else {
      setSourceList([]);
    }
  }, [cashBoxesData]);

  useEffect(() => {
    if (currenciesData) {
      if (currenciesData.isSuccess && currenciesData.result) {
        setCurrencyList(
          currenciesData.result.map((c) => ({
            id: c.value,
            fullName: c.label,
            role: "",
          })),
        );

        if (!formData.currency && currenciesData.result.length > 0) {
          const firstCurrency = currenciesData.result[0];
          if (firstCurrency) {
            updateField("currency", {
              id: firstCurrency.value,
              fullName: firstCurrency.label,
              role: "",
            });
          }
        }
      } else {
        setCurrencyList([]);
      }
    }
  }, [currenciesData, formData.currency, updateField]);

  useEffect(() => {
    if (purposesData) {
      if (purposesData.isSuccess && purposesData.result) {
        setPurposeList(
          purposesData.result.map((p) => ({
            id: p.value,
            fullName: p.label,
            role: "",
            isCounterParty: (p as any).isCounterParty,
          })),
        );
      } else {
        setPurposeList([]);
      }
    }
  }, [purposesData]);

  useEffect(() => {
    if (counterpartiesData) {
      if (counterpartiesData.isSuccess && counterpartiesData.result) {
        setCounterpartyList(
          counterpartiesData.result.map((c) => ({
            id: c.value,
            fullName: c.label,
            role: "",
          })),
        );
      } else {
        setCounterpartyList([]);
      }
    }
  }, [counterpartiesData]);

  // --- MODAL STATE-LƏRİ ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAddTarget, setActiveAddTarget] = useState<
    "counterparty" | "purpose" | "business" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  // --- HANDLERS ---

  const handleOpenAddModal = (
    target: "counterparty" | "purpose" | "business",
  ) => {
    setActiveAddTarget(target);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setActiveAddTarget(null);
  };

  const handleSaveNewOption = (newValue: string) => {
    if (activeAddTarget === "counterparty") {
      createCounterpartyAction(
        { name: newValue, creatorId: userNodeId },
        {
          onSuccess: () => {
            toast.success("Əməliyyat uğurla başa çatdı");
            refetchCounterparties();
            handleCloseAddModal();
          },
          onError: (err: Error) => {
            const msg = getBackendErrorMessage(err as AxiosError);
            toast.error(msg);
          },
        },
      );
    } else if (activeAddTarget === "purpose") {
      createPurposeAction(
        { name: newValue, creatorId: userNodeId },
        {
          onSuccess: () => {
            toast.success("Əməliyyat uğurla başa çatdı");
            refetchPurposes();
            handleCloseAddModal();
          },
          onError: (err) => {
            const msg = getBackendErrorMessage(err as AxiosError);
            toast.error(msg);
          },
        },
      );
    } else if (activeAddTarget === "business") {
      const newOption: Option = {
        id: Date.now(),
        fullName: newValue,
        role: "",
      };
      setBusinessList((prev) => [...prev, newOption]);
      updateField("business", newOption);
      handleCloseAddModal();
    }
  };

  const handleClear = () => {
    clearForm();
    clearFieldErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      showError();
      return;
    }

    if (fileError) {
      return;
    }

    setIsUploading(true);
    let newAttachmentIds: string[] = [];

    if (formData.document && Array.isArray(formData.document) && formData.document.length > 0) {
      try {
        const uploadResponse = await cashOperationsService.uploadFile(
          formData.document as File[],
          "CashOperation"
        );
        if (uploadResponse.isSuccess && uploadResponse.result) {
          newAttachmentIds = uploadResponse.result.map((file: any) => file.attachId);
        } else {
          toast.error("Fayllar yüklənərkən xəta baş verdi");
          setIsUploading(false);
          return;
        }
      } catch (err) {
        if (import.meta.env.DEV) 
        toast.error(
          getBackendErrorMessage(err as AxiosError) ||
            "Fayllar yüklənərkən xəta baş verdi",
        );
        setIsUploading(false);
        return;
      }
    }

    const currentAttachmentIds = existingData?.result?.attachmentIds || [];
    const finalAttachmentIds = [...currentAttachmentIds, ...newAttachmentIds];
    
    const payload = buildPayload(formData, id, finalAttachmentIds, userNodeId);

    const handleSuccess = () => {
      setIsUploading(false);
      toast.success(
        `Əməliyyat uğurla ${isEditMode ? "yeniləndi" : "yaradıldı"}`,
      );
      if (isEditMode) {
        navigate(ROUTES.KASSA.ALL_LIST.LINK);
      } else {
        showSuccess();
        clearForm();
        clearFieldErrors();
      }
    };

    const handleError = (error: Error) => {
      setIsUploading(false);
      const msg = getBackendErrorMessage(error as AxiosError);
      setErrorMessage(msg);
      showError();
    };

    if (isEditMode) {
      updateOperation(payload as UpdateCashOperationRequest, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else {
      createOperation(payload as CreateCashOperationRequest, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  const handleFileChange = (files: File | File[] | null) => {
    setFileError(null);
    let selectedFiles: File[] = [];

    if (Array.isArray(files)) {
      selectedFiles = files;
    } else if (files) {
      selectedFiles = [files];
    } else {
      updateField("document", null);
      return;
    }

    updateField("document", selectedFiles);

    if (selectedFiles.length > 5) {
      setFileError("Maksimum 5 fayl yükləyə bilərsiniz");
      return;
    }

    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 50 * 1024 * 1024; // 50 MB

    if (totalSize > maxSize) {
      setFileError("Faylların ümumi həcmi 50MB-dan az olmalıdır");
      return;
    }
  };

  return {
    formData,
    fieldErrors,
    counterpartyList,
    purposeList,
    businessList,
    companyList,
    sourceList,
    currencyList,
    isAddModalOpen,
    activeAddTarget,
    updateField,
    clearFieldError: (field: string) => {
      // Form komponentlərində string key ilə çağırmaq üçün tipini genişləndiririk
      clearFieldError(field as any);
    },
    handleSubmit,
    handleClear,
    handleOpenAddModal,
    handleCloseAddModal,
    handleSaveNewOption,
    handleFileChange,
    handleLoadOptions,
    hideSuccess,
    hideError: () => {
      setErrorMessage("");
      hideError();
    },
    errorMessage,
    isPending: isCreating || isUpdating || isRejecting || isUploading,
    isEditMode,
    isFetchingExisting,
    creatorInfo,
    fileError,
    isRejectConfirmModalOpen,
    handleCancel: () => {
      if (isEditMode && id) {
        setIsRejectConfirmModalOpen(true);
      } else {
        navigate(ROUTES.KASSA.ALL_LIST.LINK);
      }
    },
    handleConfirmReject: () => {
      if (id) {
        rejectOperation(
          { cashOperationId: id },
          {
            onSuccess: () => {
              setIsRejectConfirmModalOpen(false);
              navigate(ROUTES.KASSA.ALL_LIST.LINK);
            },
            onError: (err: Error) => {
              setIsRejectConfirmModalOpen(false);
              const msg = getBackendErrorMessage(err as AxiosError);
              toast.error(msg);
            },
          },
        );
      }
    },
    hideConfirmModal: () => setIsRejectConfirmModalOpen(false),
  };
};
