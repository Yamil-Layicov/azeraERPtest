import { useMemo } from 'react';

export const useFormatDate = () => {
  const formatDate = useMemo(() => {
    return (dateString: string | null | undefined): string => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      } catch {
        return "-";
      }
    };
  }, []);

  const formatDateTime = useMemo(() => {
    return (dateString: string | null | undefined): string => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      } catch {
        return "-";
      }
    };
  }, []);

  const formatTime = useMemo(() => {
    return (dateString: string | null | undefined): string => {
      if (!dateString) return "-";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      } catch {
        return "-";
      }
    };
  }, []);

  return {
    formatDate,
    formatDateTime,
    formatTime,
  };
};

