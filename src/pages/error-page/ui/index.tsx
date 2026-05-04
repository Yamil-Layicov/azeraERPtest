import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import "./ErrorMessage.scss";

interface ErrorPageProps {
  error?: Error;
  onRetry: () => void;
}

const isChunkLoadError = (error?: Error) =>
  error?.message?.includes("Failed to fetch dynamically imported module") ||
  error?.message?.includes("Importing a module script failed") ||
  error?.message?.includes("Unable to preload CSS") ||
  error?.name === "ChunkLoadError";

export const ErrorPage: FC<ErrorPageProps> = ({ error}) => {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;
  const isOfflineError = isChunkLoadError(error);

  const title = isOfflineError
    ? "İnternet bağlantısı yoxdur"
    : "Üzr istəyirik. Xəta ilə qarşılaşdıq.";

  const message = isOfflineError
    ? "Səhifəni yükləmək üçün internet bağlantısı tələb olunur. Bağlantınızı yoxlayıb yenidən cəhd edin."
    : error?.message || "Bilinməyən xəta.";

  return (
    <div className='error-wrapper'>
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-subtitle">{isOfflineError ? message : `Xəta: ${message}`}</p>
        
        <div className="error-extra">
          <Button type="button" variant="default" onClick={() => navigate(-1)}>
            Geri qayıt
          </Button>
          <Button type="button" variant="primary" onClick={() => window.location.reload()}>
            Yenidən cəhd et
          </Button>
        </div>
      </div>
      
      {isDevelopment && !isOfflineError && error?.stack && (
        <div className='desc'>
          <details>
            <summary>Xəta təfərrüatları üçün klikləyin (Development)</summary>
            {error.stack.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </details>
        </div>
      )}
    </div>
  );
};