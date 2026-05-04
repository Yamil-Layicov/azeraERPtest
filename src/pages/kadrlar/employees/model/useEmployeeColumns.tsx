import { useMemo, useCallback, useEffect, useState } from "react";
import styles from "../ui/EmployeesPage.module.css";
import { TableButton, TableRowActions } from "@/shared/ui";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";
import type { ColumnDef } from "@/shared/types";
import type { EmployeeEntry } from "@/features/kadrlar/employees";
import { ROUTES } from "@/app/routes/consts";
import { lookupsService } from "@/features/lookups";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlinePhoneIncoming,
  HiOutlineBriefcase,
} from "react-icons/hi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaLink,
} from "react-icons/fa";
import type { GetLookupsResponse } from "@/features/lookups/model/types";

interface UseEmployeeColumnsProps {
  onDelete: (item: any) => void;
  onPrint?: (item: any) => void;
  rootCompaniesOptions: any[];
  isPrinting?: boolean;
}

export const useEmployeeColumns = ({
  onDelete,
  onPrint,
  rootCompaniesOptions,
  isPrinting = false,
}: UseEmployeeColumnsProps) => {
  const [lookups, setLookups] = useState<GetLookupsResponse["result"]>();
  useEffect(() => {
    lookupsService.getLookups().then((data) => {
      setLookups(data.result);
    });
  }, []);
  const employmentTypes = lookups?.employmentTypes || [];
  const countries = lookups?.countries || [];
  const cities = lookups?.cities || [];
  const maritalStatuses = lookups?.maritalStatuses || [];
  const genders = lookups?.genders || [];
  const contactTypes = lookups?.contactTypes || [];
  const socialPlatforms = lookups?.socialPlatforms || [];
  const languageSkillsLookup = lookups?.languageSkills || [];
  const programSkillsLookup = lookups?.programSkills || [];
  const proficiencyLevelsLookup = lookups?.proficiencyLevels || [];
  const otherProgramsLookup = lookups?.otherPrograms || [];
 

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}.${month}.${year}`;
    }

    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getContactIcon = (type: any) => {
    switch (type) {
      case "Email":
        return <HiOutlineMail />;
      case "Mobile":
        return <HiOutlinePhone />;
      case "HomePhone":
        return <HiOutlineHome />;
      case "Extension":
        return <HiOutlinePhoneIncoming />;
      case "WorkPhone":
        return <HiOutlineBriefcase />;
      default:
        return <HiOutlinePhone />;
    }
  };
  const getSocialIcon = (type: string) => {
    switch (type) {
      case "Facebook":
        return <FaFacebook style={{ color: "#1877F2" }} />;
      case "Instagram":
        return <FaInstagram style={{ color: "#E4405F" }} />;
      case "LinkedIn":
        return <FaLinkedin style={{ color: "#0A66C2" }} />;
      case "TikTok":
        return <FaTiktok style={{ color: "#000000" }} />;
      case "Twitter":
        return <FaTwitter style={{ color: "#1DA1F2" }} />;
      case "YouTube":
        return <FaYoutube style={{ color: "#FF0000" }} />;
      default:
        return <FaLink style={{ color: "#64748b" }} />;
    }
  };
  const getCompanyName = useCallback(
    (rootCompanyId: string | null | undefined) => {
      if (!rootCompanyId) return "-";
      const company = rootCompaniesOptions.find(
        (opt) => String(opt.id) === String(rootCompanyId),
      );
      return company?.fullName || "-";
    },
    [rootCompaniesOptions],
  );
  

  const columns = useMemo<ColumnDef<EmployeeEntry>[]>(
    () => [
      {
        header: "Ad",
        accessor: "name",
        render: (item) => <span>{item.name || "-"}</span>,
      },
      {
        header: "Soyad",
        accessor: "surname",
        render: (item) => <span>{item.surname || "-"}</span>,
      },
      {
        header: "Ata adı",
        accessor: "patronymic",
        render: (item) => <span>{item.patronymic || "-"}</span>,
      },
      {
        header: "Doğum tarixi",
        accessor: "birthDate",
        render: (item) => (
          <span>{item.birthDate ? formatDate(item.birthDate) : "-"}</span>
        ),
      },
      {
        header: "Cins",
        accessor: "gender",
        render: (item) => {
          const gender = genders.find(
            (g: any) => g.value === item.gender,
          );
          return (
            <span>
              {gender?.label || item.gender || "-"}
            </span>
          );
        },
      },
      {
        header: "FIN",
        accessor: "pin",
        render: (item) => <span>{item.pin || "-"}</span>,
      },
      {
        header: "Şirkət",
        accessor: "rootCompanyId",
        render: (item) => <span>{getCompanyName(item.rootCompanyId)}</span>,
      },
      {
        header: "Status",
        accessor: "status",
        render: (item) => <span>{item.status || "-"}</span>,
      },
       {
        header: "Yaranma vaxtı",
        accessor: "createdAt",
        render: (item) => (
          <span>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleString("az-AZ", {
                  dateStyle: "short",
                  timeStyle: "short", 
                })
              : "-"}
          </span>
        ),
      },

      {
        header: "Rəsmiləşmə forması",
        accessor: "isPrimary",
        render: (item) => {
          const type = employmentTypes.find(
            (t: any) => t.value === item.employmentTypeCode,
          );
          return <span>{type?.label || item.employmentTypeCode || "-"}</span>;
        },
      },
      {
        header: "Tovsiyye eden ",
        accessor: "referrerName",
        render: (item) => (
          <span>
            {item.employees?.map((emp) => emp.referrerName).join(", ") || "-"}
          </span>
        ),
      },
      {
        header: "Doğuldugu yer",
        accessor: "birthCountryCode",
        render: (item) => {
          const country = countries.find(
            (c: any) => c.value === item.birthCountryCode,
          );
          const city = cities.find(
            (c: any) => String(c.value) === String(item.birthCityId),
          );

          const countryLabel = country?.label || item.birthCountryCode;
          const cityLabel = city?.label || item.foreignBirthCity;

          return (
            <span>
              {countryLabel ? (
                <>
                  {countryLabel}
                  {cityLabel ? `, ${cityLabel}` : ""}
                </>
              ) : (
                cityLabel || "-"
              )}
            </span>
          );
        },
      },
      {
        header: "Vətəndaşlıq",
        accessor: "citizenshipCode",
        render: (item) => {
          const country = countries.find(
            (c: any) => c.value === item.citizenshipCode,
          );
          return <span>{country?.label || item.citizenshipCode || "-"}</span>;
        },
      },
      {
        header: "Ailə vəziyyəti",
        accessor: "maritalStatus",
        render: (item) => {
          const maritalStatus = maritalStatuses.find(
            (m: any) => m.value === item.maritalStatus,
          );
          return (
            <span>
              {maritalStatus?.label || "-"}
            </span>
          );
        },
      },
      {
        header: "Faktiki  yaşayış ünvanı",
        accessor: "actualAddress",
        render: (item) => {
          const addr = item.address;
          if (!addr) return <span>-</span>;

          const city = cities.find(
            (c: any) => String(c.value) === String(addr.actualCityId),
          );

          const cityLabel = city?.label || "";
          const addressText = addr.actualAddress || "";

          const parts = [cityLabel, addressText].filter(Boolean);

          return <span>{parts.join(", ") || "-"}</span>;
        },
      },
      {
        header: "Qeydiyyat ünvanı",
        accessor: "registrationAddress",
        render: (item) => {
          const addr = item.address;
          if (!addr) return <span>-</span>;

          const country = countries.find(
            (c: any) => c.value === addr.registrationCountryCode,
          );

          let cityLabel = "";
          if (addr.registrationCountryCode === "AZE") {
            const city = cities.find(
              (c: any) => String(c.value) === String(addr.registrationCityId),
            );
            cityLabel = city?.label || "";
          } else {
            cityLabel = addr.registrationForeignCity || "";
          }

          const countryLabel = country?.label || addr.registrationCountryCode;
          const addressText = addr.registrationAddress || "";

          const parts = [countryLabel, cityLabel, addressText].filter(Boolean);

          return <span>{parts.join(", ") || "-"}</span>;
        },
      },
      {
        header: "Əlaqə məlumatları",
        accessor: "contact",
        render: (item) => (
          <div className={styles.contactList}>
            {item.contacts && item.contacts.length > 0 ? (
              item.contacts.map((contact) => {
                const typeLabel = contactTypes.find(
                  (t: any) => t.value === contact.type,
                )?.label;

                return (
                  <div
                    key={contact.id}
                    className={styles.contactChip}
                    data-type={contact.type}
                    title={typeLabel || contact.type}
                  >
                    <span className={styles.iconWrapper}>
                      {getContactIcon(contact.type)}
                    </span>
                    <span className={styles.contactText}>{contact.value}</span>
                    {contact.isCorporate && (
                      <span className={styles.corpIndicator}></span>
                    )}
                  </div>
                );
              })
            ) : (
              <span className={styles.emptyText}>-</span>
            )}
          </div>
        ),
      },
      {
        header: "Sosial Media",
        accessor: "socialAccounts",
        render: (item) => (
          <div className={styles.socialList}>
            {item.socialAccounts && item.socialAccounts?.length > 0 ? (
              item.socialAccounts.map((account) => {
                const platformLabel = socialPlatforms.find(
                  (p: any) => p.value === account.type,
                )?.label;

                return (
                  <a
                    key={account.id}
                    href={""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title={platformLabel || account.type}
                  >
                    <span className={styles.socialIconWrapper}>
                      {getSocialIcon(account.type)}
                    </span>
                    <span className={styles.socialName}>{account.value}</span>
                  </a>
                );
              })
            ) : (
              <span className={styles.emptyText}>-</span>
            )}
          </div>
        ),
      },
      {
        header: "Dil bilikləri",
        accessor: "languageSkills",
        render: (item) => {
          const skills = item.skills?.filter(
            (s: any) => s.skillCategoryCode === "LanguageSkill",
          );

          return (
            <div className={styles.skillList}>
              {skills && skills.length > 0 ? (
                skills.map((s: any) => {
                  const lookup = languageSkillsLookup.find(
                    (l: any) => l.value === s.skillCode,
                  );
                  const proficiency = proficiencyLevelsLookup.find(
                    (p: any) => p.value === s.proficiencyLevelCode,
                  );

                  return (
                    <div key={s.id} className={styles.skillChip}>
                      <span className={styles.skillName}>
                        {lookup?.label || s.skillCode}
                      </span>
                      <span
                        className={styles.proficiency}
                        data-level={s.proficiencyLevelCode}
                      >
                        {proficiency?.label || s.proficiencyLevelCode}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className={styles.emptyText}>-</span>
              )}
            </div>
          );
        },
      },
      {
        header: "Proqram bilikləri",
        accessor: "programSkills",
        render: (item) => {
          const skills = item.skills?.filter(
            (s: any) => s.skillCategoryCode === "ProgramSkill",
          );

          return (
            <div className={styles.skillList}>
              {skills && skills.length > 0 ? (
                skills.map((s: any) => {
                  const lookup = programSkillsLookup.find(
                    (l: any) => l.value === s.skillCode,
                  );
                  const proficiency = proficiencyLevelsLookup.find(
                    (p: any) => p.value === s.proficiencyLevelCode,
                  );

                  return (
                    <div key={s.id} className={styles.skillChip}>
                      <span className={styles.skillName}>
                        {lookup?.label || s.skillCode}
                      </span>
                      <span
                        className={styles.proficiency}
                        data-level={s.proficiencyLevelCode}
                      >
                        {proficiency?.label || s.proficiencyLevelCode}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className={styles.emptyText}>-</span>
              )}
            </div>  
          );
        },
      },
      {
        header: "Proq. istifadəçi məlumatları",
        accessor: "externalAccount",
        render: (item) => (
          <div className={styles.externalAccountList}>
            {item.externalAccounts && item.externalAccounts.length > 0 ? (
              item.externalAccounts.map((acc: any) => {
                const typeLabel = otherProgramsLookup.find(
                  (p: any) => p.value === acc.type,
                )?.label;

                return (
                  <div key={acc.id} className={styles.externalAccountChip}>
                    <span className={styles.externalAccountType}>
                      {typeLabel || acc.type}
                    </span>
                    <span className={styles.externalAccountValue} title={acc.value}>
                      {acc.value}
                    </span>
                  </div>
                );
              })
            ) : (
              <span className={styles.emptyText}>-</span>
            )}
          </div>
        ),
      },
     
      {
        header: "",
        accessor: "actions",
        sortable: false,
        render: (item) => (
          <TableRowActions>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.VIEW}>
              <TableButton
                variant="detail"
                onClick={() => {
                  const path = ROUTES.KADRLAR.DETAILS.LINK.replace(
                    ":id",
                    item.id,
                  );
                  const base = (import.meta.env.BASE_URL || "/").replace(
                    /\/$/,
                    "",
                  );
                  const fullUrl = `${window.location.origin}${base}${path}`;
                  window.open(fullUrl, "_blank", "noopener,noreferrer");
                }}
              />
            </PermissionGuard>

            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.PRINT}>
             <TableButton
              variant="print"
              disabled={isPrinting}
              onClick={() => {
                if (onPrint) {
                  onPrint(item);
                }
              }}
              title="Çap et"
              className={styles.printButton}
            />
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.EMPLOYEE.DELETE}>
              <TableButton variant="delete" onClick={() => onDelete(item)} />
            </PermissionGuard>
        
          </TableRowActions>
        ),
      },
    ],
    [
      onDelete,
      getCompanyName,
      employmentTypes,
      countries,
      cities,
      maritalStatuses,
      genders,
      contactTypes,
      socialPlatforms,
      languageSkillsLookup,
      programSkillsLookup,
      proficiencyLevelsLookup,
      otherProgramsLookup,
    ],
  );

  return columns;
};
