import { useRouteError, useNavigate } from "react-router-dom";
import "./RouteErrorBoundary.scss";
import { Button } from "../button";

const isChunkLoadError = (error: Error) => {
  return (
    error?.message?.includes("Failed to fetch dynamically imported module") ||
    error?.message?.includes("Importing a module script failed") ||
    error?.name === "ChunkLoadError"
  );
};

export const RouteErrorBoundary = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  const isOffline = !window.navigator.onLine;
  const isChunkError = isChunkLoadError(error);

  const title = isOffline || isChunkError
    ? "İnternet bağlantısı yoxdur"
    : "Xəta Baş Verdi";

  const message = isOffline || isChunkError
    ? "Səhifəni yükləmək üçün internet bağlantısı tələb olunur. Bağlantınızı yoxlayıb yenidən cəhd edin."
    : error?.message || "Səhifə yüklənərkən xəta baş verdi";

  return (
    <div className="route-error-wrapper">
      <div className="route-error-content">
        <h1 className="route-error-title">{title}</h1>
        <p className="route-error-message">{message}</p>

        <div className="route-error-actions">
          <Button type="button" variant="default" onClick={() => navigate(-1)}>
            Geri Qayıt
          </Button>
          <Button type="button" variant="primary" onClick={() => window.location.reload()}>
            Yenidən cəhd et
          </Button>
        </div>
      </div>

      {import.meta.env.DEV && !isChunkError && error?.stack && (
        <details className="route-error-details">
          <summary>Texniki detallar (Development)</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
};