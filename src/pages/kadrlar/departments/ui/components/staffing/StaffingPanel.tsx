import React from "react";
import { Loading } from "@/shared/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./StaffingPanel.module.css";

interface StaffingPanelProps {
  nodeName: string;
  data: unknown;
  isLoading: boolean;
  onClose: () => void;
}

function extractResult(data: unknown): unknown {
  if (data && typeof data === "object" && "result" in data) {
    return (data as { result: unknown }).result;
  }
  return data;
}

function ObjectTable({ obj }: { obj: Record<string, unknown> }) {
  const entries = Object.entries(obj).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return <p className={styles.noData}>Məlumat yoxdur</p>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.dataTable}>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className={styles.keyCell}>{key}</td>
              <td className={styles.valueCell}>
                {typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArrayTable({ arr }: { arr: unknown[] }) {
  if (arr.length === 0) return <p className={styles.noData}>Məlumat yoxdur</p>;

  const first = arr[0];
  const isObject = first !== null && typeof first === "object";
  const keys = isObject ? Object.keys(first as Record<string, unknown>) : ["#", "Dəyər"];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k} className={styles.th}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arr.map((item, idx) => (
            <tr key={idx}>
              {isObject && item && typeof item === "object"
                ? keys.map((k) => (
                    <td key={k} className={styles.td}>
                      {(() => {
                        const v = (item as Record<string, unknown>)[k];
                        return typeof v === "object" && v !== null
                          ? JSON.stringify(v)
                          : String(v ?? "");
                      })()}
                    </td>
                  ))
                : (
                    <>
                      <td className={styles.td}>{idx + 1}</td>
                      <td className={styles.td}>{String(item)}</td>
                    </>
                  )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const StaffingPanel: React.FC<StaffingPanelProps> = ({
  nodeName,
  data,
  isLoading,
  onClose,
}) => {
  const result = extractResult(data);

  const renderContent = () => {
    if (Array.isArray(result)) {
      return <ArrayTable arr={result} />;
    }
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return <ObjectTable obj={result as Record<string, unknown>} />;
    }
    if (result !== null && result !== undefined) {
      return <p className={styles.noData}>{String(result)}</p>;
    }
    return <p className={styles.noData}>Məlumat yoxdur</p>;
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Kadr məlumatları — {nodeName}</h3>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          title="Bağla"
          aria-label="Bağla"
        >
          <XMarkIcon width={20} strokeWidth={2} />
        </button>
      </div>
      <div className={styles.body}>
        {isLoading ? (
          <div className={styles.loadingWrap}>
            <Loading />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};
