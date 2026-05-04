import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button"; // <-- Dəyişdirildi
import "./NotFound.scss";

export const NotFound = function () {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <section className="not-found-container">
      <div className="wrapper">
        <h3 className="status">404</h3>
        <p className="pathname">
          Axtardığınız səhifə tapılmadı: <code>{location.pathname}</code>
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          Geri qayıt
        </Button>
      </div>
    </section>
  );
};
