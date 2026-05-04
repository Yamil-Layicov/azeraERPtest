import "./Loading.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";

export const Loading = function () {
  return (
    <div className="loading-wrapper">
      <ScaleLoader style={{ color: "#3C7167" }}></ScaleLoader>
    </div>
  );
};

export const ContentLoading = function () {
  return (
    <div className="content-loading-wrapper">
      <ScaleLoader style={{ color: "#3C7167" }}></ScaleLoader>
    </div>
  );
};

export const ButtonSpinner = function ({ color = "#ffffff" }: { color?: string }) {
  return (
    <ClipLoader
      color={color}
      loading={true}
      size={18}
      speedMultiplier={0.8}
      aria-label="Loading Spinner"
    />
  );
};
