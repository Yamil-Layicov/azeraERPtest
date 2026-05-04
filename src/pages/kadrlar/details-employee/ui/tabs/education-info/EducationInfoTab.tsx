import { useState } from "react";
import type { Option } from "@/shared/types";
import { EducationInfoSection, type EducationInfoValue } from "./components/education-info";
import { EducationTable, type EducationTableItem } from "./components/education-table";
import {
  ScientificDegreeSection,
  type NewScientificDegreeState,
  type ScientificDegreeItem,
} from "./components/scientific-degree";
import { SkillsSection, type NewSkillState, type SkillItem, type SkillLevel } from "./components/skills";
import styles from "./EducationInfoTab.module.css";

const EDUCATION_LEVEL_OPTIONS: Option[] = [
  { id: "orta", fullName: "Orta təhsil", role: "" },
  { id: "bakalavr", fullName: "Bakalavr", role: "" },
  { id: "magistr", fullName: "Magistratura", role: "" },
  { id: "doktor", fullName: "Doktorantura", role: "" },
];

const INSTITUTION_OPTIONS: Option[] = [
  { id: "inst-1", fullName: "Azərbaycan Dövlət Universiteti", role: "" },
  { id: "inst-2", fullName: "Azərbaycan Tibb Universiteti", role: "" },
  { id: "inst-3", fullName: "ADA Universiteti", role: "" },
];

const SCIENTIFIC_DEGREE_OPTIONS: Option[] = [
  { id: "phd", fullName: "Fəlsəfə doktoru (PhD)", role: "" },
  { id: "drsc", fullName: "Elmlər doktoru", role: "" },
  { id: "assoc-prof", fullName: "Dosent", role: "" },
  { id: "prof", fullName: "Professor", role: "" },
];

const LANGUAGE_OPTIONS: Option[] = [
  { id: "az", fullName: "Azərbaycan dili", role: "" },
  { id: "ru", fullName: "Rus dili", role: "" },
  { id: "en", fullName: "İngilis dili", role: "" },
  { id: "tr", fullName: "Türk dili", role: "" },
];

const TECHNICAL_SKILL_OPTIONS: Option[] = [
  { id: "ms-office", fullName: "MS Office", role: "" },
  { id: "excel", fullName: "Microsoft Excel", role: "" },
  { id: "word", fullName: "Microsoft Word", role: "" },
  { id: "powerpoint", fullName: "Microsoft PowerPoint", role: "" },
];

export const EducationInfoTab = () => {
  const [formData, setFormData] = useState<EducationInfoValue>({
    educationLevel: null,
    institution: null,
    specialty: "",
    entryDate: null,
    graduationDate: null,
    diplomaSerialNumber: "",
  });

  const [addedEducations, setAddedEducations] = useState<EducationTableItem[]>([]);

  const emptyEducationForm: EducationInfoValue = {
    educationLevel: null,
    institution: null,
    specialty: "",
    entryDate: null,
    graduationDate: null,
    diplomaSerialNumber: "",
  };

  const handleAddEducation = () => {
    const id = Date.now();
    setAddedEducations((prev) => [
      ...prev,
      {
        id,
        educationLevel: formData.educationLevel,
        institution: formData.institution,
        specialty: formData.specialty,
        entryDate: formData.entryDate,
        graduationDate: formData.graduationDate,
        diplomaSerialNumber: formData.diplomaSerialNumber,
      },
    ]);
    setFormData(emptyEducationForm);
  };

  const [newDegree, setNewDegree] = useState<NewScientificDegreeState>({
    degree: null,
    awardedDate: null,
    diplomaSerialNumber: "",
  });
  const [addedDegrees, setAddedDegrees] = useState<ScientificDegreeItem[]>([]);

  const [newLanguage, setNewLanguage] = useState<NewSkillState>({ skill: null, level: "" });
  const [addedLanguages, setAddedLanguages] = useState<SkillItem[]>([]);

  const [newTechnical, setNewTechnical] = useState<NewSkillState>({ skill: null, level: "" });
  const [addedTechnical, setAddedTechnical] = useState<SkillItem[]>([]);

  const handleAddDegree = () => {
    if (!newDegree.degree || !newDegree.diplomaSerialNumber.trim()) return;
    const nextId = Date.now();
    setAddedDegrees((prev) => [
      ...prev,
      {
        id: nextId,
        degree: newDegree.degree,
        awardedDate: newDegree.awardedDate,
        diplomaSerialNumber: newDegree.diplomaSerialNumber,
      },
    ]);
    setNewDegree({ degree: null, awardedDate: null, diplomaSerialNumber: "" });
  };

  const handleAddLanguage = () => {
    if (!newLanguage.skill || !newLanguage.level) return;
    const nextId = Date.now();
    setAddedLanguages((prev) => [...prev, { id: nextId, skill: newLanguage.skill, level: newLanguage.level as SkillLevel }]);
    setNewLanguage({ skill: null, level: "" });
  };

  const handleAddTechnical = () => {
    if (!newTechnical.skill || !newTechnical.level) return;
    const nextId = Date.now();
    setAddedTechnical((prev) => [...prev, { id: nextId, skill: newTechnical.skill, level: newTechnical.level as SkillLevel }]);
    setNewTechnical({ skill: null, level: "" });
  };

  return (
    <div className={styles.container}>
      <EducationInfoSection
        value={formData}
        educationLevelOptions={EDUCATION_LEVEL_OPTIONS}
        institutionOptions={INSTITUTION_OPTIONS}
        onEducationLevelChange={(val) => setFormData((prev) => ({ ...prev, educationLevel: val }))}
        onChange={(field, val) =>
          setFormData((prev) => ({ ...prev, [field]: val }))
        }
        onAddClick={handleAddEducation}
        onClear={() => setFormData(emptyEducationForm)}
      />

      <EducationTable
        items={addedEducations}
        onRemove={(id) => setAddedEducations((prev) => prev.filter((x) => x.id !== id))}
      />

      <ScientificDegreeSection
        degreeOptions={SCIENTIFIC_DEGREE_OPTIONS}
        newDegree={newDegree}
        addedDegrees={addedDegrees}
        onNewDegreeChange={(field, value) =>
          setNewDegree((prev) => ({ ...prev, [field]: value } as NewScientificDegreeState))
        }
        onAddDegree={handleAddDegree}
        onRemoveDegree={(id) => setAddedDegrees((prev) => prev.filter((x) => x.id !== id))}
        onListDegreeChange={(id, field, value) =>
          setAddedDegrees((prev) =>
            prev.map((x) => (x.id === id ? ({ ...x, [field]: value } as ScientificDegreeItem) : x))
          )
        }
        disableListedDegrees={true}
      />

      <SkillsSection
        languageOptions={LANGUAGE_OPTIONS}
        technicalOptions={TECHNICAL_SKILL_OPTIONS}
        newLanguage={newLanguage}
        addedLanguages={addedLanguages}
        onNewLanguageChange={(field, value) =>
          setNewLanguage((prev) =>
            field === "skill" ? ({ ...prev, skill: value as Option | null, level: "" } as NewSkillState) : ({ ...prev, level: value as SkillLevel } as NewSkillState)
          )
        }
        onAddLanguage={handleAddLanguage}
        onRemoveLanguage={(id) => setAddedLanguages((prev) => prev.filter((x) => x.id !== id))}
        onListLanguageChange={(id, field, value) =>
          setAddedLanguages((prev) =>
            prev.map((x) => (x.id === id ? ({ ...x, [field]: value } as SkillItem) : x))
          )
        }
        newTechnical={newTechnical}
        addedTechnical={addedTechnical}
        onNewTechnicalChange={(field, value) =>
          setNewTechnical((prev) =>
            field === "skill" ? ({ ...prev, skill: value as Option | null, level: "" } as NewSkillState) : ({ ...prev, level: value as SkillLevel } as NewSkillState)
          )
        }
        onAddTechnical={handleAddTechnical}
        onRemoveTechnical={(id) => setAddedTechnical((prev) => prev.filter((x) => x.id !== id))}
        onListTechnicalChange={(id, field, value) =>
          setAddedTechnical((prev) =>
            prev.map((x) => (x.id === id ? ({ ...x, [field]: value } as SkillItem) : x))
          )
        }
        disableListedLanguages={true}
        disableListedTechnical={true}
      />
    </div>
  );
};

