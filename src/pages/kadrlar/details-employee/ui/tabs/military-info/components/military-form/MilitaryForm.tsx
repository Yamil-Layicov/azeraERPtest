import React, { useState } from "react";
import { FormInput, ModernDatePicker} from "@/shared/ui";
import { EnumLookupSelect, SpecialRanksLookupSelect } from "@/features/lookups";
import type { Option } from "@/shared/types";
import styles from "./MilitaryForm.module.css";

export interface MilitaryFormState {
  ticketNumber: string;
  issueDate: Date | null;
  rank: Option | null;
  specialRank: Option | null;
  serviceInfo: Option | null;
}

const INITIAL_STATE: MilitaryFormState = {
  ticketNumber: "",
  issueDate: null,
  rank: null,
  specialRank: null,
  serviceInfo: null,
};

export interface MilitaryFormProps {
  onAdd?: (item: MilitaryFormState) => void;
}

export interface MilitaryFormHandle {
  validateAndGet: () => MilitaryFormState | null;
}

export const MilitaryForm = React.forwardRef<MilitaryFormHandle, MilitaryFormProps>((_, ref) => {
  const [formState, setFormState] = useState<MilitaryFormState>(INITIAL_STATE);

  React.useImperativeHandle(ref, () => ({
    validateAndGet: () => {
      const { ticketNumber, issueDate, rank, specialRank, serviceInfo } = formState;
      if (
        !ticketNumber.trim() ||
        !issueDate ||
        !rank ||
        !specialRank ||
        !serviceInfo
      ) {
        // Validation error handling could be added here (e.g. toast)
        return null;
      }
      return formState;
    }
  }));

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <FormInput
          id="military-ticket-number"
          type="text"
          label="Hərbi biletin seriyası və nömrəsi"
          placeholder="Daxil edin"
          value={formState.ticketNumber}
          onChange={(val) =>
            setFormState({ ...formState, ticketNumber: val })
          }
        />

        <ModernDatePicker
          id="military-issue-date"
          label="Verilmə tarixi"
          value={formState.issueDate}
          onChange={(date: Date | null) =>
            setFormState({ ...formState, issueDate: date })
          }
          placeholder="dd.mm.yyyy"
        />

        <div className={styles.field}>
          <label className={styles.label} htmlFor="military-rank">
            Hərbi rütbəsi
          </label>
          <EnumLookupSelect
            id="military-rank"
            code="MilitaryRanks"
            defaultText="Seçin..."
            value={formState.rank}
            onChange={(val) => setFormState({ ...formState, rank: val })}
          />
        </div>

        {/* Row 2 */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="military-special-rank">
            Xüsusi rütbə
          </label>
          <SpecialRanksLookupSelect
            id="military-special-rank"
            value={formState.specialRank}
            onChange={(val) => setFormState({ ...formState, specialRank: val })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="military-service-info">
            Hərbi xidməti barədə məlumat
          </label>
          <EnumLookupSelect
            id="military-service-info"
            code="MilitaryStatuses"
            defaultText="Seçin..."
            value={formState.serviceInfo}
            onChange={(val) => setFormState({ ...formState, serviceInfo: val })}
          />
        </div>
      </div>

     
    </div>
  );
});