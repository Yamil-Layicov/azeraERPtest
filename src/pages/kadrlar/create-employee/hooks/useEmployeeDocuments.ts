import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import type { NewDocumentState, EmployeeDocument } from "../../employee-shared/model/types";
import { seriesSchema } from "../../employee-shared/model/contacts-documents-schema";

export const useEmployeeDocuments = () => {
  const [newDocument, setNewDocument] = useState<NewDocumentState>({
    type: null,
    series: "",
    number: "",
    issueDate: null,
    expiryDate: null,
  });
  const [addedDocuments, setAddedDocuments] = useState<EmployeeDocument[]>([]);

  const handleNewDocumentChange = useCallback((field: keyof NewDocumentState, value: any) => {
    setNewDocument((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddDocument = useCallback(() => {
    if (!newDocument.type || !newDocument.number.trim()) return;

    const r = seriesSchema.safeParse(newDocument.series ?? "");
    if (!r.success) {
      toast.error(r.error.issues[0]?.message ?? "Seriya yalnız hərflərdən ibarət ola bilər; rəqəm və ya simvol yazıla bilməz");
      return;
    }

    setAddedDocuments((prev) => [
      {
        ...newDocument,
        id: Date.now(),
        series: newDocument.series.trim() ? newDocument.series.trim() : "",
      },
      ...prev,
    ]);
    setNewDocument({
      type: null,
      series: "",
      number: "",
      issueDate: null,
      expiryDate: null,
    });
  }, [newDocument]);

  const handleRemoveDocument = useCallback((id: number) => {
    setAddedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const handleListDocumentChange = useCallback((id: number, field: keyof EmployeeDocument, value: any) => {
    setAddedDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  }, []);

  const resetDocuments = useCallback(() => {
    setNewDocument({
      type: null,
      series: "",
      number: "",
      issueDate: null,
      expiryDate: null,
    });
    setAddedDocuments([]);
  }, []);

  return {
    newDocument,
    addedDocuments,
    setAddedDocuments,
    handleNewDocumentChange,
    handleAddDocument,
    handleRemoveDocument,
    handleListDocumentChange,
    resetDocuments,
  };
};

