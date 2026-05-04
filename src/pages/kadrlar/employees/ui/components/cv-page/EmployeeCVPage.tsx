 import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { employeesService } from "@/features/kadrlar/employees/api/employeesService";
import Table from "@/shared/ui/table/Table";
import styles from "./EmployeeCV.module.css";
import { useLookups } from "@/pages/kadrlar/employees/ui/components/cv-page/models/useLookups";
import { useEmployeeCVColumns } from "./models/useEmployeeCVColumns";
import { useFormatDate } from "@/shared/hooks";
import toast from "react-hot-toast";
import { getBackendErrorMessage } from "@/shared/api/httpClient";
import type { AxiosError } from "axios";

export const EmployeeCVPage: React.FC<{ id?: string; onLoaded?: () => void }> = ({
  id: propId,
  onLoaded,
}) => {
  const { id: urlId } = useParams<{ id: string }>();
  const columns = useEmployeeCVColumns();
  const { formatDate } = useFormatDate();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isPhotoDone, setIsPhotoDone] = useState(false);

  useEffect(() => {
    if (isDataLoaded && isPhotoDone) {
      onLoaded?.();
    }
  }, [isDataLoaded, isPhotoDone, onLoaded]);

  const formatExperience = (exp: any) => {
    if (!exp) return "0 gün";
    const { year = 0, month = 0, day = 0 } = exp;
    const parts = [];
    if (year > 0) parts.push(`${year} il`);
    if (month > 0) parts.push(`${month} ay`);
    if (day > 0) parts.push(`${day} gün`);
    if (parts.length === 0) return "0 gün";
    return parts.join(" ");
  };

  const {
    getCityLabel,
    getCountryLabel,
    getMaritalStatusLabel,
    getMilitaryStatusLabel,
    getMilitaryRankLabel,
  } = useLookups();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const id = propId || urlId;
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setIsDataLoaded(false);
      employeesService
        .print(id)
        .then((response) => {
          const employeeData = response?.result || response;
          setData(employeeData);
          setIsDataLoaded(true);
        })
        .catch((err) => {
          console.log("Error fetching employee print data:", err);
          setIsDataLoaded(true); 
          toast.error(getBackendErrorMessage(err as AxiosError) || "Məlumat yüklənərkən xəta baş verdi");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    const photoId = data?.photoId;

    if (!photoId) {
      setPhotoUrl(null);
      setIsPhotoDone(true);
      return;
    }

    setIsPhotoLoading(true);
    setIsPhotoDone(false);

    const loadPhoto = async () => {
      try {
        const response = await fetch(
          `/api/proxy/identity/file/download/${photoId}`,
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        } else {
          setPhotoUrl(null);
        }
      } catch (error) {
        toast.error(getBackendErrorMessage(error as AxiosError) || "Şəkil yüklənərkən xəta baş verdi");
        setPhotoUrl(null);
      } finally {
        setIsPhotoLoading(false);
        setIsPhotoDone(true);
      }
    };

    loadPhoto();

    return () => {
      if (photoUrl && photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [data?.photoId]);

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          minHeight: "400px",
          minWidth: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Yüklənir...
      </div>
    );
  }

  if (!data && id) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          minHeight: "400px",
          display: "flex",
          minWidth: "500px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Məlumat yoxdur.
      </div>
    );
  }

  return (
    <div id="employee-cv-content" className={styles.cvContainer} ref={printRef}>
      <div className={styles.printTitle}>KADRLAR UÇOTUNUN ŞƏXSİ VƏRƏQƏSİ</div>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          {isPhotoLoading ? (
            <div className={styles.avatarPlaceholder}>Yüklənir...</div>
          ) : photoUrl ? (
            <img src={photoUrl} alt="Avatar" className={styles.avatar} />
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}images/user/notFound.jpg`}
              alt="Avatar"
              className={styles.avatar}
            />
          )}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.employeeMainInfo}>
            {data?.fullname} - {data?.rootCompanyName}
            {data?.rootCompanyName !== data?.organizationUnitName &&
              ` , ${data?.organizationUnitName}`}
            - {data?.positionName}
          </div>

          <div className={styles.infoContainerV3}>
            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Vətəndaşlığı:</span>
                <span className={styles.value}>
                  {getCountryLabel(data?.citizenshipCode)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Doğulduğu yer:</span>
               <span className={`${styles.value} ${styles.BirthPlaceValue}`}>
                  {getCountryLabel(data?.birthCountryCode)}
                  {data?.birthCountryCode === "AZE" && data?.birthCityId && (
                    <>, {getCityLabel(data?.birthCityId)}</>
                  )}
                  {data?.birthCountryCode !== "AZE" &&
                    data?.foreignBirthCity && <>, {data?.foreignBirthCity}</>}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Korporativ mail:</span>
                <span className={`${styles.value} ${styles.BirthPlaceValue}`}>{data?.corporateMail}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tövsiyyə edən:</span>
                <span className={styles.value}>{data?.referrerName}</span>
              </div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Doğulduğu tarix:</span>
                <span className={`${styles.value} ${styles.birthValue}`}>
                  {formatDate(data?.birthDate)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Ailə vəziyyəti:</span>
                <span className={styles.value}>
                  {getMaritalStatusLabel(data?.maritalStatus)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>FİN:</span>
                <span className={styles.value}>{data?.pin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Əmək haqqı</h2>
        <div className={styles.salaryInfo}>
          <div className={styles.salaryItem}>
            <strong>Qross əmək haqqı:</strong> {data?.salaryCalc?.grossSalary} ₼
          </div>
          <div className={styles.salaryItem}>
            <strong>Kassadan əmək haqqı:</strong> {data?.salaryCalc?.cashSalary}{" "}
            ₼
          </div>
          <div className={styles.salaryItem}>
            <strong>Net əmək haqqı:</strong> {data?.salaryCalc?.netSalary} ₼
          </div>
        </div>
      </div>

      {data?.educations?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Təhsil barədə məlumatlar</h2>
          <Table
            hideSortIcons
            fixedLayout={true}
            className={`${styles.cvTable} ${styles.educationTable}`}
            data={data.educations}
            columns={columns.eduColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}

      {data?.workExperiences?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Əmək fəaliyyəti barədə məlumat
          </h2>
          <div className={styles.experienceInfo}>
            <div className={styles.experienceItem}>
              <strong>Ümumi iş stajı:</strong> <br />
              {formatExperience(
                data?.workExperienceSummaryResponse?.totalExperienceYears,
              )}
            </div>
            <div className={styles.experienceItem}>
              <strong>Holdingdə/BV-də iş stajı:</strong> <br />
              {formatExperience(
                data?.workExperienceSummaryResponse?.holdingExperienceYears,
              )}
            </div>
            <div className={styles.experienceItem}>
              <strong>Son iş yerində iş stajı:</strong> <br />
              {formatExperience(
                data?.workExperienceSummaryResponse?.lastJobExperienceYears,
              )}
            </div>
            <div className={styles.experienceItem}>
              <strong>Tibbi staj:</strong> <br />
              {formatExperience(
                data?.workExperienceSummaryResponse?.medicalExperienceYears,
              )}
            </div>
          </div>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.workExperiences}
            columns={columns.experienceColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}

      {data?.relatives?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Yaxın qohumlar barədə məlumatlar
          </h2>
          <div
            style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}
          >
            Ata, ana, qardaş, bacı, arvad (ər), uşaqlar
          </div>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.relatives}
            columns={columns.relColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}
      {data?.skills?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Biliklər və bacarıqlar</h2>
          {data?.skills?.some(
            (s: any) => s.skillCategoryCode === "LanguageSkill",
          ) && (
            <>
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Dil bilikləri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.skills.filter(
                  (s: any) => s.skillCategoryCode === "LanguageSkill",
                )}
                columns={columns.langColumns as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}
          {data?.skills?.some(
            (s: any) => s.skillCategoryCode === "ProgramSkill",
          ) && (
            <>
              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                İT bilikləri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.skills.filter(
                  (s: any) => s.skillCategoryCode === "ProgramSkill",
                )}
                columns={columns.skillColumns as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}
        </div>
      )}
      {(data?.performances?.length > 0 ||
        data?.personStateAwards?.length > 0 ||
        data?.personnelActions?.some(
          (a: any) =>
            a.personnelActionTypeCode === "Disciplinary" ||
            a.personnelActionTypeCode === "Reward",
        )) && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Performans məlumatları</h2>

          {/* Performans göstəricilərinin nəticələri */}
          {data?.performances?.length > 0 && (
            <>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Performans göstəricilərinin nəticələri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.performances}
                columns={columns.performanceColumns as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}

          {/* Dövlət təltifləri */}
          {data?.personStateAwards?.length > 0 && (
            <>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Dövlət təltifləri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.personStateAwards}
                columns={columns.stateAwardCols as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}

          {/* İntizam tənbehləri */}
          {data?.personnelActions?.some(
            (a: any) => a.personnelActionTypeCode === "Disciplinary",
          ) && (
            <>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                İntizam tənbehləri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.personnelActions.filter(
                  (a: any) => a.personnelActionTypeCode === "Disciplinary",
                )}
                columns={columns.discipColumns as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}

          {/* Həvəsləndirmə tədbirləri */}
          {data?.personnelActions?.some(
            (a: any) => a.personnelActionTypeCode === "Reward",
          ) && (
            <>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Həvəsləndirmə tədbirləri
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.personnelActions.filter(
                  (a: any) => a.personnelActionTypeCode === "Reward",
                )}
                columns={columns.rewColumns as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}
        </div>
      )}

      {data?.trainings?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>İştirak etdiyi təlimlər</h2>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.trainings}
            columns={columns.trainingColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}
      {data?.externalAccounts?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Proqram istifadəçi məlumatları
          </h2>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.externalAccounts}
            columns={columns.externalAccColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}
      {data?.personPrivileges?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>İmtiyazlar</h2>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.personPrivileges}
            columns={columns.privColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}
      {(data?.militaryService?.militaryStatusCode ||
        data?.militaryService?.militaryRankCode ||
        data?.personSpecialRanks?.length > 0) && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Hərbi xidmət məlumatları / Xüsusi rütbə və ya dövlət qulluğunda
            ixtisas dərəcəsi
          </h2>
          {(data?.militaryService?.militaryStatusCode ||
            data?.militaryService?.militaryRankCode) && (
            <div className={styles.section}>
              <div className={styles.militaryInfoContainer}>
                <div
                  className={styles.militaryInfo + " " + styles.militaryInfoV2}
                >
                  <p className={styles.militaryInfoLabel}>Xidmət məlumatı:</p>
                  <div>
                    {getMilitaryStatusLabel(
                      data?.militaryService?.militaryStatusCode,
                    )}
                  </div>
                </div>
                <div className={styles.militaryInfo}>
                  <p className={styles.militaryInfoLabel}>Rütbə:</p>
                  <div>
                    {getMilitaryRankLabel(
                      data?.militaryService?.militaryRankCode,
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {data?.personSpecialRanks?.length > 0 && (
            <Table
              hideSortIcons
              className={styles.cvTable}
              data={data.personSpecialRanks}
              columns={columns.organCols as any}
              getRowClassName={() => styles.redRow}
            />
          )}
        </div>
      )}

      {(data?.contacts?.length > 0 || data?.socialAccounts?.length > 0) && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Əlaqə və ünvan məlumatları</h2>
          {data?.contacts?.length > 0 && (
            <>
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Əlaqə məlumatlar
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.contacts}
                columns={columns.contactCols as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}

          {data?.socialAccounts?.length > 0 && (
            <>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Sosial şəbəkələr üzrə məlumatlar
              </div>
              <Table
                hideSortIcons
                className={styles.cvTable}
                data={data.socialAccounts}
                columns={columns.socialCols as any}
                getRowClassName={() => styles.redRow}
              />
            </>
          )}
        </div>
      )}

      {data?.address &&
        (data?.address?.actualAddress ||
          data?.address?.registrationAddress) && (
          <div className={styles.section}>
            <div className={styles.gridInfoV2}>
              <div className={`${styles.infoItem} ${styles.infoItemV3}`}>
                <span className={styles.label}>Qeydiyyat ünvanı:</span>
                <span className={styles.value}>
                  {data.address.isRegistrationSameAsActual ? (
                    <>
                      {getCityLabel(data.address.actualCityId)},{" "}
                      {data.address.actualAddress}
                    </>
                  ) : data.address.registrationCountryCode === "AZE" ? (
                    <>
                      {getCountryLabel(data.address.registrationCountryCode)},{" "}
                      {getCityLabel(data.address.registrationCityId)},{" "}
                      {data.address.registrationAddress}
                    </>
                  ) : (
                    <>
                      {getCountryLabel(data.address.registrationCountryCode)},{" "}
                      {data.address.registrationAddress}
                    </>
                  )}
                </span>
              </div>

              <div className={`${styles.infoItem} ${styles.infoItemV3}`}>
                <span className={styles.label}>Yaşayış ünvanı:</span>
                <span className={styles.value}>
                  {getCityLabel(data.address.actualCityId)},{" "}
                  {data.address.actualAddress}
                </span>
              </div>
            </div>
          </div>
        )}

      {data?.documents?.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sənəd məlumatları</h2>
          <Table
            hideSortIcons
            className={styles.cvTable}
            data={data.documents}
            columns={columns.docColumns as any}
            getRowClassName={() => styles.redRow}
          />
        </div>
      )}
    </div>
  );
};
