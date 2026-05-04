export interface CreateModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  onSuccess: () => void;
}