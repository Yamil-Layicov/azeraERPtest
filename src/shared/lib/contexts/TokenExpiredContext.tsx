import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { TokenExpiredModal } from "@/shared/ui/modal/token-expired";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { resetTokenExpiredState, setTokenExpiredHandler } from "@/shared/api/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_KEYS } from "@/features/auth/hooks/useUser";
import { useLocation } from "react-router-dom";

interface TokenExpiredContextType {
  showModal: () => void;
  hideModal: () => void;
  isModalOpen: boolean;
}

const TokenExpiredContext = createContext<TokenExpiredContextType | undefined>(undefined);

export const useTokenExpired = () => {
  const context = useContext(TokenExpiredContext);
  if (!context) {
    throw new Error("useTokenExpired must be used within TokenExpiredProvider");
  }
  return context;
};

export const TokenExpiredHandler = () => {
  const { showModal } = useTokenExpired();

  useEffect(() => {
    setTokenExpiredHandler(showModal);
  }, [showModal]);

  return null;
};

interface TokenExpiredProviderProps {
  children: React.ReactNode;
}

export const TokenExpiredProvider: React.FC<TokenExpiredProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  // Her sayfa değişiminde kilidi açıyoruz
  useEffect(() => {
    setIsModalOpen(false);
    resetTokenExpiredState();
  }, [pathname]);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
    queryClient.cancelQueries({ queryKey: AUTH_KEYS.ME });
  }, [queryClient]);

  useEffect(() => {
    if (isModalOpen) {
      queryClient.cancelQueries({ queryKey: AUTH_KEYS.ME });
    }
  }, [isModalOpen, queryClient]);

  const hideModal = useCallback(() => {
    setIsModalOpen(false);
    // Kilidi (has401Error) sıfırlamıyoruz, sadece modalın kapandığını işaretliyoruz
    tokenExpiredStore.getState().markModalClosed();
  }, []);

  const handleLogout = useCallback(() => {
    setIsModalOpen(false);
    resetTokenExpiredState();
    logout();
  }, [logout]);

  return (
    <TokenExpiredContext.Provider value={{ showModal, hideModal, isModalOpen }}>
      {children}
      <TokenExpiredModal
        isOpen={isModalOpen}
        onClose={hideModal}
        onLogout={handleLogout}
      />
    </TokenExpiredContext.Provider>
  );
};

// Bu satırı da store'a erişmek için ekliyoruz
import { tokenExpiredStore } from "@/shared/lib/store/tokenExpiredStore";
