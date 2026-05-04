import { useMemo } from "react";
import { useLookups } from "./useLookups"; 
import { useFormatDate } from "@/shared/hooks";
import {
  educationColumns,
  experienceColumns,
  disciplineColumns,
  rewardColumns,
  trainingColumns,
  contactColumns,
  socialColumns,
  privilegeColumns,
  relativeColumns,
  stateAwardColumns,
  languageColumns,
  itSkillsColumns,
  documentColumns,
  performanceColumns,
  organCodeColumns,
  externalAccountColumns,
} from "./models";

export const useEmployeeCVColumns = () => {
  const { formatDate } = useFormatDate();
  const {
    getCityLabel,
    getCountryLabel,
    getDocumentTypeLabel,
    getEducationInstitutionLabel,
    getSpecialtyLabel,
    getRewardTypeLabel,
    getDisciplinaryActionTypeLabel,
    getLegalBasisLabel,
    getRelationshipTypeLabel,
    getOrganLabel,
    getLanguageLabel,
    getProgramSkillLabel,
    getOtherProgramLabel,
    getProficiencyLevelLabel,
    getContactTypeLabel,
    getSocialPlatformLabel,
    getSocialStatusLabel,
    getEducationLevelLabel,
    getStateAwardTypeLabel,
  } = useLookups();

  const externalAccColumns = useMemo(() => {
    return externalAccountColumns.map((col: any) => {
      if (col.accessor === "type") {
        return {
          ...col,
          render: (item: any) => getOtherProgramLabel(item.type) || item.type,
        };
      }
      return col;
    });
  }, [getOtherProgramLabel]);

  const docColumns = useMemo(() => {
    return documentColumns.map((col: any) => {
      if (col.accessor === "type") {
        return {
          ...col,
          render: (item: any) => getDocumentTypeLabel(item.type),
        };
      }
      if (col.accessor === "issuedAt") {
        return {
          ...col,
          render: (item: any) => formatDate(item.issuedAt),
        };
      }
      if (col.accessor === "expireAt") {
        return {
          ...col,
          render: (item: any) => formatDate(item.expireAt),
        };
      }
      return col;
    });
  }, [getDocumentTypeLabel, formatDate]);

  const eduColumns = useMemo(() => {
    return educationColumns.map((col: any) => {
      if (col.accessor === "institutionNameCode") {
        return {
          ...col,
          render: (item: any) => getEducationInstitutionLabel(item.institutionNameCode),
        };
      }
      if (col.accessor === "specialtyCode") {
        return {
          ...col,
          render: (item: any) => getSpecialtyLabel(item.specialtyCode),
        };
      }
      if (col.accessor === "educationLevelCode") {
        return {
          ...col,
          render: (item: any) => getEducationLevelLabel(item.educationLevelCode),
        };
      }
      if (col.accessor === "startYear") {
        return {
          ...col,
          render: (item: any) => formatDate(item.startYear),
        };
      }
      if (col.accessor === "endYear") {
        return {
          ...col,
          render: (item: any) => formatDate(item.endYear),
        };
      }
      return col;
    });
  }, [getEducationInstitutionLabel, getSpecialtyLabel, getEducationLevelLabel, formatDate]);
  
  const eduLevelColumns = useMemo(() => {
    return educationColumns.map((col: any) => {
      if (col.accessor === "educationLevelCode") {
        return {
          ...col,
          render: (item: any) => getEducationLevelLabel(item.educationLevelCode),
        };
      }
      return col;
    });
  }, [getEducationLevelLabel]);

  const discipColumns = useMemo(() => {
    return disciplineColumns.map((col: any) => {
      if (col.accessor === "disciplinaryActionTypeCode") {
        return {
          ...col,
          render: (item: any) => getDisciplinaryActionTypeLabel(item.disciplinaryActionTypeCode),
        };
      }
      if (col.accessor === "issueDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.issueDate),
        };
      }
      return col;
    });
  }, [getDisciplinaryActionTypeLabel, formatDate]);

  const rewColumns = useMemo(() => {
    return rewardColumns.map((col: any) => {
      if (col.accessor === "rewardTypeCode") {
        return {
          ...col,
          render: (item: any) => getRewardTypeLabel(item.rewardTypeCode),
        };
      }
      if (col.accessor === "issueDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.issueDate),
        };
      }
      return col;
    });
  }, [getRewardTypeLabel, formatDate]);

  const stateAwardCols = useMemo(() => {
    return stateAwardColumns.map((col: any) => {
      if (col.accessor === "typeCode") {
        return {
          ...col,
          render: (item: any) => getStateAwardTypeLabel(item.typeCode),
        };
      }
      if (col.accessor === "documentDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.documentDate),
        };
      }
      return col;
    });
  }, [getStateAwardTypeLabel, formatDate]);

  const privColumns = useMemo(() => {
    return privilegeColumns.map((col: any) => {
      if (col.accessor === "legalBasisCode") {
        return {
          ...col,
          render: (item: any) => getLegalBasisLabel(item.legalBasisCode),
        };
      }
      return col;
    });
  }, [getLegalBasisLabel]);

  const relColumns = useMemo(() => {
    return relativeColumns.map((col: any) => {
      if (col.accessor === "relationshipTypeCode") {
        return {
          ...col,
          render: (item: any) => getRelationshipTypeLabel(item.relationshipTypeCode),
        };
      }

      if (col.accessor === "personRelative.birthPlace") {
        return {
          ...col,
          render: (item: any) => {
            const relative = item.personRelative;
            if (!relative) return "";
            if (relative.birthCountryCode === "AZE") {
              return `${getCountryLabel("AZE") || ""} ${getCityLabel(relative.birthCityId) || ""} ${relative.address || ""}`.trim();
            } else {
              return `${getCountryLabel(relative.birthCountryCode) || ""} ${relative.foreignBirthCity || ""}`.trim();
            }
          },
        };
      }

      if (col.accessor === "workPlace") {
        return {
          ...col,
          render: (item: any) => {
            const socialLabel = getSocialStatusLabel(item.socialStatusCode);
            const workPlace = item.workPlace || "";
            return [socialLabel, workPlace].filter(Boolean).join(" - ");
          },
        };
      }

      if (col.accessor === "personRelative.birthDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.personRelative?.birthDate),
        };
      }

      return col;
    });
  }, [getRelationshipTypeLabel, getCountryLabel, getCityLabel, getSocialStatusLabel, formatDate]);

  const experienceCols = useMemo(() => {
    return experienceColumns.map((col: any) => {
      if (col.accessor === "appointmentDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.appointmentDate),
        };
      }
      if (col.accessor === "terminationDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.terminationDate),
        };
      }
      return col;
    });
  }, [formatDate]);

  const trainingColsMapped = useMemo(() => {
    return trainingColumns.map((col: any) => {
      if (col.accessor === "startDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.startDate),
        };
      }
      if (col.accessor === "endDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.endDate),
        };
      }
      return col;
    });
  }, [formatDate]);

  const langColumns = useMemo(() => {
    return languageColumns.map((col: any) => {
      if (col.accessor === "skillCode") {
        return {
          ...col,
          render: (item: any) => getLanguageLabel(item.skillCode),
        };
      }
      if (col.accessor === "proficiencyLevelCode") {
        return {
          ...col,
          render: (item: any) => getProficiencyLevelLabel(item.proficiencyLevelCode),
        };
      }
      return col;
    });
  }, [getLanguageLabel, getProficiencyLevelLabel]);

  const skillColumns = useMemo(() => {
    return itSkillsColumns.map((col: any) => {
      if (col.accessor === "skillCode") {
        return {
          ...col,
          render: (item: any) => getProgramSkillLabel(item.skillCode),
        };
      }
      if (col.accessor === "proficiencyLevelCode") {
        return {
          ...col,
          render: (item: any) => getProficiencyLevelLabel(item.proficiencyLevelCode),
        };
      }
      return col;
    });
  }, [getProgramSkillLabel, getProficiencyLevelLabel]);

  const contactCols = useMemo(() => {
    return contactColumns.map((col: any) => {
      if (col.accessor === "type") {
        return {
          ...col,
          render: (item: any) => getContactTypeLabel(item.type),
        };
      }
      return col;
    });
  }, [getContactTypeLabel]);

  const socialCols = useMemo(() => {
    return socialColumns.map((col: any) => {
      if (col.accessor === "type") {
        return {
          ...col,
          render: (item: any) => getSocialPlatformLabel(item.type),
        };
      }
      return col;
    });
  }, [getSocialPlatformLabel]);

  const organCols = useMemo(() => {
    return organCodeColumns.map((col: any) => {
      if (col.accessor === "organCode") {
        return {
          ...col,
          render: (item: any) => getOrganLabel(item.organCode),
        };
      }
      if (col.accessor === "issueDate") {
        return {
          ...col,
          render: (item: any) => formatDate(item.issueDate),
        };
      }
      return col;
    });
  }, [getOrganLabel, formatDate]);

  return {
    docColumns,
    eduColumns,
    eduLevelColumns,
    discipColumns,
    rewColumns,
    stateAwardCols,
    privColumns,
    relColumns,
    langColumns,
    skillColumns,
    contactCols,
    socialCols,
    organCols,
    externalAccColumns,
    experienceColumns: experienceCols,
    trainingColumns: trainingColsMapped,
    performanceColumns,
  };
};