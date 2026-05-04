import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCashOperation } from "../hooks";
import { CashOperationType, CurrencyType } from "./types";
import type { CreateCashOperationRequest } from "./types";
import { createCashOperationSchema } from "./schema";
import type { CreateCashOperationSchema } from "./schema";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { getBackendErrorMessage } from "@/shared/api";
import type { AxiosError } from "axios";

const emptyToNull = (v: string | undefined): string | null =>
  v == null || String(v).trim() === "" ? null : v;

function toRequest(data: CreateCashOperationSchema): CreateCashOperationRequest {
  return {
    createdDate: data.createdDate,
    rootCompanyId: emptyToNull(data.rootCompanyId),
    cashPurposeId: emptyToNull(data.cashPurposeId),
    counterPartyId: emptyToNull(data.counterPartyId),
    payerOrRecipientName: emptyToNull(data.payerOrRecipientName),
    fromCashBoxId: emptyToNull(data.fromCashBoxId),
    toCashBoxId: emptyToNull(data.toCashBoxId),
    amount: data.amount,
    currencyType: data.currencyType,
    exchangeRate: data.exchangeRate,
    cashOperationType: data.cashOperationType,
    creatorId: emptyToNull(data.creatorId),
    note: emptyToNull(data.note),
    attachmentIds: data.attachmentIds?.length ? data.attachmentIds : null,
  };
}

export const useAddKassaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CashOperationType>(CashOperationType.INCOME);

  const { mutate: createOperation, isPending } = useCreateCashOperation();

  const form = useForm<CreateCashOperationSchema>({
    resolver: zodResolver(createCashOperationSchema) as Resolver<CreateCashOperationSchema>,
    defaultValues: {
      createdDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      rootCompanyId: "",
      cashPurposeId: "",
      amount: 0,
      currencyType: CurrencyType.AZN,
      exchangeRate: 1,
      cashOperationType: CashOperationType.INCOME,
      attachmentIds: [],
      note: "",
    },
  });

  const handleTabChange = (type: CashOperationType) => {
    setActiveTab(type);
    form.setValue("cashOperationType", type);
    form.reset({
      ...form.getValues(),
      cashOperationType: type,
      fromCashBoxId: undefined,
      toCashBoxId: undefined,
      counterPartyId: undefined,
    });
  };

  const onSubmit = (data: CreateCashOperationSchema) => {
    createOperation(toRequest(data), {
      onSuccess: () => {
        navigate("/maliyye/kassa");
      },
      onError: (error: unknown) => {
        toast.error(getBackendErrorMessage(error as AxiosError));
      },
    });
  };

  return {
    activeTab,
    handleTabChange,
    form,
    handleSubmit: form.handleSubmit(onSubmit as (data: CreateCashOperationSchema) => void),
    isLoading: isPending,
  };
};
