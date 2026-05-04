import { forwardRef } from "react";
import { MilitaryForm } from "./components/military-form/MilitaryForm";
import type { MilitaryFormHandle } from "./components/military-form/MilitaryForm";

export const MilitaryInfoTab = forwardRef<MilitaryFormHandle>((_, ref) => {
  return (
    <div>
      <MilitaryForm ref={ref} />
    </div>
  );
});

MilitaryInfoTab.displayName = "MilitaryInfoTab";
