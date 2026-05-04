import { useState } from "react";

export function useDeleteModal<T = string | number>() {
  const [isOpen, setIsOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<T | null>(null);

  const open = (id: T) => {
    setIdToDelete(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setIdToDelete(null);
  };

  return { isOpen, idToDelete, open, close };
}