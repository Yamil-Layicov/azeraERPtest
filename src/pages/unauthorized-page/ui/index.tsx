import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button"; // <-- Dəyişdirildi
import "./Unauthorized.scss";

export const Unauthorized = function () {
  const navigate = useNavigate();

  return (
    <section className="unauthorized-container">
      <div className="wrapper">
        <h3 className="status">403</h3>
        <p className="message">Bu səhifəni görmə səlahiyyətiniz yoxdur.</p>
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
