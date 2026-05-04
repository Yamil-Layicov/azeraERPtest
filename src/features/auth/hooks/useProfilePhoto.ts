import { useQuery } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { useEffect, useState } from "react";

export const useProfilePhoto = (photoId?: string | null) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["photo", photoId],
    queryFn: ({ signal }) => authService.downloadFile(photoId!, signal),
    enabled: !!photoId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    if (data instanceof Blob) {
      const url = URL.createObjectURL(data);
      setPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoUrl(null);
    }
  }, [data]);

  return {
    photoUrl,
    isLoading,
    error,
  };
};
