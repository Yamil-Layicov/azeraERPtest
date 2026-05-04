// src/features/maliyye/cash-operations/model/schema.ts

import { z } from 'zod';
import { CashOperationType, CurrencyType } from './types';

export const createCashOperationSchema = z.object({
  createdDate: z.string().min(1, 'Tarix seçilməlidir'),
  rootCompanyId: z.string().uuid('Şirkət seçilməlidir'),
  cashPurposeId: z.string().uuid('Təyinat seçilməlidir'),
  // counterPartyId: Expense/Income durumuna göre opsiyonel olabilir, burada zorunlu varsayıyoruz
  counterPartyId: z.union([z.string().uuid(), z.literal('')]).optional(), 
  payerOrRecipientName: z.string().optional(),
  fromCashBoxId: z.union([z.string().uuid(), z.literal('')]).optional(),
  toCashBoxId: z.union([z.string().uuid(), z.literal('')]).optional(),
  amount: z.number().min(0.01, 'Məbləğ 0-dan böyük olmalıdır'),
  currencyType: z.nativeEnum(CurrencyType),
  exchangeRate: z.number().default(1),
  cashOperationType: z.nativeEnum(CashOperationType),
  creatorId: z.string().uuid().optional(), // Backend genellikle token'dan alır ama şemada varsa gönderilir
  note: z.string().optional(),
  attachmentIds: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.cashOperationType === CashOperationType.TRANSFER) {
    return !!data.fromCashBoxId && !!data.toCashBoxId;
  }
  return true;
}, {
  message: "Transfer əməliyyatı üçün hər iki kassa seçilməlidir",
  path: ["toCashBoxId"],
});

export type CreateCashOperationSchema = z.infer<typeof createCashOperationSchema>;