import { CheckIcon } from "@heroicons/react/24/solid";

export function renderCheckStatus(value: boolean | undefined) {
  return value ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CheckIcon width={20} style={{ color: "#16a34a" }} />
    </div>
  ) : (
    <div style={{ textAlign: "center", color: "var(--text-muted)" }}>-</div>
  );
}
