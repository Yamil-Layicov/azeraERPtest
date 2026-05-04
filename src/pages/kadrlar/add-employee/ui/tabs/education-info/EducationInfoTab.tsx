import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import type { Option } from "@/shared/types";
import {
  EducationInfoSection,
  type EducationInfoValue,
  type EducationInfoChange,
} from "./components/education-info";
import {
  EducationTable,
  type EducationTableItem,
} from "./components/education-table";
import {
  ScientificDegreeSection,
  type NewScientificDegreeState,
  type ScientificDegreeItem,
} from "./components/scientific-degree";
import {
  SkillsSection,
  type NewSkillState,
  type SkillItem,
} from "./components/skills";
import styles from "./EducationInfoTab.module.css";
import { useEducationInfo } from "@/features/kadrlar/create-worker/hooks/useEducationInfo";
import { useEnumItemsByCode } from "@/features/lookups/hooks";
import { useAddEmployeeStore } from "@/features/kadrlar/create-worker/model/useAddEmployeeStore";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/shared/ui";
import { useDeleteModal } from "./model/useDeleteModal";
import { useEducationActions } from "./hooks/useEducationActions";
import { useDegreeActions } from "./hooks/useDegreeActions";
import { useSkillActions } from "./hooks/useSkillActions";

export interface EducationInfoTabHandle {
  submit: () => void;
  isDirty: () => boolean;
}

interface ExtendedEducationItem extends EducationTableItem {
  isDeleted?: boolean;
}
interface ExtendedDegreeItem extends ScientificDegreeItem {
  isDeleted?: boolean;
}
interface ExtendedSkillItem extends SkillItem {
  isDeleted?: boolean;
  category?: string;
}

// Module-level sabit — her render'da yeniden oluşmaz
const EMPTY_FORM: EducationInfoValue = {
  educationLevel: null,
  institution: null,
  specialty: null,
  entryDate: null,
  graduationDate: null,
  diplomaSerialNumber: "",
};

export const EducationInfoTab = forwardRef<EducationInfoTabHandle>((_, ref) => {
  const { currentStep, nextStep } = useAddEmployeeStore();
  const { data: apiData } = useEducationInfo();
  // const queryClient = useQueryClient();

  const { options: levelOptions } = useEnumItemsByCode("EducationLevels", true);
  const { options: institutionOptions } = useEnumItemsByCode(
    "EducationInstitutionName",
    true,
  );
  const { options: specialtyOptions } = useEnumItemsByCode("Specialties", true);
  const { options: degreeOptions } = useEnumItemsByCode(
    "AcademicDegrees",
    true,
  );
  const { options: proficiencyOptions } = useEnumItemsByCode(
    "ProficiencyLevels",
    true,
  );
  const { options: languageSkillOptions } = useEnumItemsByCode(
    "LanguageSkills",
    true,
  );
  const { options: programSkillOptions } = useEnumItemsByCode(
    "ProgramSkills",
    true,
  );
  // const { options: skillCategories } = useEnumItemsByCode(
  //   "SkillCategories",
  //   true,
  // );

  // --- STATES ---
  const [formData, setFormData] = useState<EducationInfoValue>({
    educationLevel: null,
    institution: null,
    specialty: null,
    entryDate: null,
    graduationDate: null,
    diplomaSerialNumber: "",
  });

  const [addedEducations, setAddedEducations] = useState<
    ExtendedEducationItem[]
  >([]);
  const [originalEducations, setOriginalEducations] = useState<
    ExtendedEducationItem[]
  >([]);
  const [editingEduId, setEditingEduId] = useState<string | number | null>(
    null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eduDeleteModal = useDeleteModal<string | number>();
  const degreeDeleteModal = useDeleteModal<string | number>();
  const skillDeleteModal = useDeleteModal<string>();

  const [newDegree, setNewDegree] = useState<NewScientificDegreeState>({
    degree: null,
    awardedDate: null,
    diplomaSerialNumber: "",
  });
  const [addedDegrees, setAddedDegrees] = useState<ExtendedDegreeItem[]>([]);
  const [originalDegrees, setOriginalDegrees] = useState<ExtendedDegreeItem[]>(
    [],
  );

  const [newLanguage, setNewLanguage] = useState<NewSkillState>({
    skill: null,
    level: "",
  });
  const [addedLanguages, setAddedLanguages] = useState<ExtendedSkillItem[]>([]);
  const [originalLanguages, setOriginalLanguages] = useState<
    ExtendedSkillItem[]
  >([]);

  const [newTechnical, setNewTechnical] = useState<NewSkillState>({
    skill: null,
    level: "",
  });
  const [addedTechnical, setAddedTechnical] = useState<ExtendedSkillItem[]>([]);
  const [originalTechnical, setOriginalTechnical] = useState<
    ExtendedSkillItem[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  const personId = useAddEmployeeStore((state) => state.personId);

  // --- FORM RESET ---
  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditingEduId(null);
  }, []);

  useEffect(() => {
    resetForm();
    setNewDegree({ degree: null, awardedDate: null, diplomaSerialNumber: "" });
    setNewLanguage({ skill: null, level: "" });
    setNewTechnical({ skill: null, level: "" });
  }, [personId, resetForm]);

  // --- MEMOIZED VALUES ---
  const visibleEducations = useMemo(
    () => addedEducations.filter((e) => !e.isDeleted),
    [addedEducations],
  );
  const visibleDegrees = useMemo(
    () => addedDegrees.filter((d) => !d.isDeleted),
    [addedDegrees],
  );
  const visibleLanguages = useMemo(
    () => addedLanguages.filter((l) => !l.isDeleted),
    [addedLanguages],
  );
  const visibleTechnical = useMemo(
    () => addedTechnical.filter((t) => !t.isDeleted),
    [addedTechnical],
  );

  // --- MAPPING API DATA ---
  useEffect(() => {
    if (currentStep !== 3) return;
    if (apiData?.isSuccess && apiData.result) {
      const res = apiData.result;
      const resolveOption = (id: string, options: Option[]): Option => {
        const found = options.find((o) => o.id === id);
        return { id, fullName: found ? found.fullName : "" };
      };

      const mappedEducations: ExtendedEducationItem[] = (
        res.educationList || []
      ).map((item: any) => ({
        id: item.id || item.Id || "",
        educationLevel: resolveOption(item.educationLevelCode, levelOptions),
        institution:
          item.institutionName || item.institutionNameCode
            ? resolveOption(
                item.institutionName || item.institutionNameCode,
                institutionOptions,
              )
            : null,
        specialty: resolveOption(item.specialtyCode, specialtyOptions),
        entryDate: item.startYear
          ? new Date(Number(item.startYear), 0, 1)
          : null,
        graduationDate: item.endYear
          ? new Date(Number(item.endYear), 0, 1)
          : null,
        diplomaSerialNumber: item.documentNumber || "",
      }));
      setAddedEducations(mappedEducations);
      setOriginalEducations(
        mappedEducations.map((item: ExtendedEducationItem) => ({ ...item })),
      );

      const mappedDegrees: ExtendedDegreeItem[] = (
        res.academicDegreeList || []
      ).map((item: any) => ({
        id: item.id || item.Id || "",
        degree: resolveOption(item.degreeCode, degreeOptions),
        awardedDate: item.issueDate ? new Date(item.issueDate) : null,
        diplomaSerialNumber: item.documentNumber || item.diplomaNumber || "",
      }));
      setAddedDegrees(mappedDegrees);
      setOriginalDegrees(
        mappedDegrees.map((item: ExtendedDegreeItem) => ({ ...item })),
      );

      const mappedSkills: ExtendedSkillItem[] = (res.skillList || []).map(
        (item: any) => {
          const isLang = item.skillCategoryCode === "LanguageSkill";
          const skillOpts = isLang ? languageSkillOptions : programSkillOptions;
          return {
            id: String(item.id ?? item.Id ?? "").trim(),
            skill: resolveOption(item.skillCode, skillOpts),
            level: item.proficiencyLevelCode || "",
            levelName: resolveOption(
              item.proficiencyLevelCode,
              proficiencyOptions,
            ).fullName,
            category: item.skillCategoryCode,
          };
        },
      );
      const langSkills = mappedSkills.filter(
        (s: ExtendedSkillItem) => s.category === "LanguageSkill",
      );
      const techSkills = mappedSkills.filter(
        (s: ExtendedSkillItem) => s.category === "ProgramSkill",
      );
      setAddedLanguages(langSkills);
      setAddedTechnical(techSkills);
      setOriginalLanguages(
        langSkills.map((item: ExtendedSkillItem) => ({ ...item })),
      );
      setOriginalTechnical(
        techSkills.map((item: ExtendedSkillItem) => ({ ...item })),
      );
      setHasChanges(false);
    }
  }, [
    apiData,
    currentStep,
    levelOptions,
    institutionOptions,
    specialtyOptions,
    degreeOptions,
    proficiencyOptions,
    languageSkillOptions,
    programSkillOptions,
  ]);

  // --- ACTIONS ---
  const { handleAddOrUpdateEducation, confirmRemoveEducation } =
    useEducationActions({
      formData,
      editingEduId,
      resetForm,
      setErrors,
      setHasChanges,
    });

  const { handleAddScientificDegree, confirmRemoveScientificDegree } =
    useDegreeActions({
      newDegree,
      setNewDegree,
      setHasChanges,
    });

  const { handleAddSkill, handleRemoveSkill, confirmRemoveSkill } =
    useSkillActions({
      newLanguage,
      newTechnical,
      setNewLanguage,
      setNewTechnical,
      setAddedLanguages,
      setAddedTechnical,
      setHasChanges,
    });

  // SILME ISLEMI
  const handleRemoveEducation = (id: string | number) => {
    if (typeof id === "number") {
      setAddedEducations((prev) => prev.filter((x) => x.id !== id));
      return;
    }
    eduDeleteModal.open(id);
  };

  const handleRemoveScientificDegree = (id: string | number) => {
    if (typeof id === "number") {
      setAddedDegrees((prev) => prev.filter((x) => x.id !== id));
      return;
    }
    degreeDeleteModal.open(id);
  };

  useImperativeHandle(ref, () => ({
    isDirty: () => {
      const eduChanged =
        JSON.stringify(addedEducations) !== JSON.stringify(originalEducations);
      const degChanged =
        JSON.stringify(addedDegrees) !== JSON.stringify(originalDegrees);
      const skillsChanged =
        JSON.stringify(addedLanguages) !== JSON.stringify(originalLanguages) ||
        JSON.stringify(addedTechnical) !== JSON.stringify(originalTechnical);
      return hasChanges || eduChanged || degChanged || skillsChanged;
    },
    submit: async () => {
      if (visibleEducations.length === 0) {
        toast.error("Ən azı bir təhsil məlumatı əlavə edilməlidir");
        return;
      }
      const { setStepCompleted } = useAddEmployeeStore.getState();
      setStepCompleted(2);
      nextStep();
    },
  }));

  const handleFieldChange = (change: EducationInfoChange) => {
    const { field, val } = change;
    setFormData((prev) => ({ ...prev, [field]: val }) as EducationInfoValue);
    if (val) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <EducationInfoSection
        value={formData}
        errors={errors}
        onEducationLevelChange={(val) => {
          setFormData((prev) => ({ ...prev, educationLevel: val }));
          if (val) setErrors((prev) => ({ ...prev, educationLevel: "" }));
        }}
        onChange={handleFieldChange}
        onAddClick={handleAddOrUpdateEducation}
        onClear={resetForm}
        isEditing={editingEduId !== null}
      />

      <EducationTable
        items={visibleEducations}
        onRemove={handleRemoveEducation}
        onEdit={(item) => {
          setFormData({
            educationLevel: item.educationLevel,
            institution: item.institution,
            specialty: item.specialty,
            entryDate: item.entryDate,
            graduationDate: item.graduationDate,
            diplomaSerialNumber: item.diplomaSerialNumber,
          });
          setEditingEduId(item.id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <ScientificDegreeSection
        degreeOptions={[]}
        newDegree={newDegree}
        addedDegrees={visibleDegrees}
        onNewDegreeChange={(field, value) =>
          setNewDegree(
            (prev) => ({ ...prev, [field]: value }) as NewScientificDegreeState,
          )
        }
        onAddDegree={handleAddScientificDegree}
        onRemoveDegree={handleRemoveScientificDegree}
        onListDegreeChange={(id, field, value) => {
          setAddedDegrees((prev) =>
            prev.map((x) =>
              x.id === id
                ? ({ ...x, [field]: value } as ExtendedDegreeItem)
                : x,
            ),
          );
          setHasChanges(true);
        }}
        disableListedDegrees={true}
      />

      <SkillsSection
        languageOptions={[]}
        technicalOptions={[]}
        newLanguage={newLanguage}
        addedLanguages={visibleLanguages}
        onNewLanguageChange={(field, value) =>
          setNewLanguage((prev) =>
            field === "skill"
              ? ({
                  ...prev,
                  skill: value as Option | null,
                  level: "",
                } as NewSkillState)
              : ({ ...prev, level: value as string } as NewSkillState),
          )
        }
        onAddLanguage={() => handleAddSkill("LanguageSkill")}
        onRemoveLanguage={(id) => {
          const idStr = handleRemoveSkill(id);
          if (idStr) skillDeleteModal.open(idStr);
        }}
        onListLanguageChange={(id, field, value) => {
          setAddedLanguages((prev) =>
            prev.map((x) =>
              x.id === id ? ({ ...x, [field]: value } as ExtendedSkillItem) : x,
            ),
          );
          setHasChanges(true);
        }}
        newTechnical={newTechnical}
        addedTechnical={visibleTechnical}
        onNewTechnicalChange={(field, value) =>
          setNewTechnical((prev) =>
            field === "skill"
              ? ({
                  ...prev,
                  skill: value as Option | null,
                  level: "",
                } as NewSkillState)
              : ({ ...prev, level: value as string } as NewSkillState),
          )
        }
        onAddTechnical={() => handleAddSkill("ProgramSkill")}
        onRemoveTechnical={(id) => {
          const idStr = handleRemoveSkill(id);
          if (idStr) skillDeleteModal.open(idStr);
        }}
        onListTechnicalChange={(id, field, value) => {
          setAddedTechnical((prev) =>
            prev.map((x) =>
              x.id === id ? ({ ...x, [field]: value } as ExtendedSkillItem) : x,
            ),
          );
          setHasChanges(true);
        }}
        disableListedLanguages={true}
        disableListedTechnical={true}
      />

      <ConfirmModal
        isOpen={eduDeleteModal.isOpen}
        onClose={eduDeleteModal.close}
        onConfirm={() =>
          confirmRemoveEducation(
            eduDeleteModal.idToDelete,
            eduDeleteModal.close,
          )
        }
        title="Silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />

      <ConfirmModal
        isOpen={degreeDeleteModal.isOpen}
        onClose={degreeDeleteModal.close}
        onConfirm={() =>
          confirmRemoveScientificDegree(
            degreeDeleteModal.idToDelete,
            degreeDeleteModal.close,
          )
        }
        title="Silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />

      <ConfirmModal
        isOpen={skillDeleteModal.isOpen}
        onClose={skillDeleteModal.close}
        onConfirm={() =>
          confirmRemoveSkill(
            skillDeleteModal.idToDelete,
            skillDeleteModal.close,
          )
        }
        title="Silmək istədiyinizə əminsiniz?"
        description="Bu məlumatı sildikdə geri qaytara bilməyəcəksiniz."
        confirmText="Sil"
        cancelText="Ləğv et"
        variant="danger"
      />
    </div>
  );
});

EducationInfoTab.displayName = "EducationInfoTab";
