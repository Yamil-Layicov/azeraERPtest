export const educationColumns = [
  { header: "Təhsil müəssisəsinin adı", accessor: "institutionNameCode" },
  { header: "Təhsil növü", accessor: "educationLevelCode" },
  { header: "Daxil olduğu il", accessor: "startYear", maxWidth: "80px", width: "80px", minWidth: "80px" },
  { header: "Bitirdiyi il", accessor: "endYear", maxWidth: "80px", width: "80px", minWidth: "80px" },
  { header: "İxtisası", accessor: "specialtyCode" },
];

export const documentColumns = [
  {
    header: "Seriya və ya nömrə",
    accessor: "number",
    render: (item: any) => `${item.series || ""} ${item.number || ""}`.trim(),
  },
  {
    header: "Sənəd növü",
    accessor: "type",
  },
  {
    header: "Verilmə tarixi",
    accessor: "issuedAt",
    maxWidth: "80px",
    width: "80px",
  },
  {
    header: "Bitmə tarixi",
    accessor: "expireAt",
    maxWidth: "80px",
    width: "80px",
  },
];

export const performanceColumns = [
  { header: "İl", accessor: "year" },
  { header: "Bonus məbləği", accessor: "annualBonus" },
];

export const experienceColumns = [
  { header: "İş yeri", accessor: "workPlace", maxWidth: "180px" },
  { header: "Vəzifə", accessor: "positionName", maxWidth: "180px",minWidth: "160px" },
  {
    header: "Daxil olduğu tarix",
    accessor: "appointmentDate",
    maxWidth: "80px",
    width: "80px",
  },
  { header: "Çıxdığı tarix", accessor: "terminationDate", maxWidth: "80px" ,width: "80px" },
  {
    header: "İşdən çıxma səbəbi",
    accessor: "terminationNote",
    maxWidth: "250px",
    render: (item: any) => item.terminationNote || "-",
  },
];

export const disciplineColumns = [
  {
    header: "İntizam tənbehi və ya xəbərdarlıq",
    accessor: "disciplinaryActionTypeCode",
    maxWidth: "180px",
    width: "180px",
  },
  { header: "Əmrin tarixi", accessor: "issueDate", maxWidth: "80px", width: "80px" },
  { header: "Əmr nömrəsi", accessor: "orderNumber", maxWidth: "150px", width: "150px" },
  { header: "Səbəbi", accessor: "reason" },
];

export const rewardColumns = [
  { header: "Həvəsləndirmə tədbiri", accessor: "rewardTypeCode", maxWidth: "180px", width: "180px" },
  { header: "Əmrin tarixi", accessor: "issueDate", maxWidth: "80px", width: "80px" },
  { header: "Əmr nömrəsi", accessor: "orderNumber", maxWidth: "150px", width: "150px" },
  { header: "Səbəbi", accessor: "reason" },
];

export const stateAwardColumns = [
  { header: "Növü", accessor: "typeCode", maxWidth: "180px", width: "180px" },
  { header: "Adı", accessor: "stateAward" },
  { header: "Sənəd nömrəsi", accessor: "documentNumber", maxWidth: "150px", width: "150px" },
  { header: "Sənəd tarixi", accessor: "documentDate", maxWidth: "100px", width: "100px" },
];

export const trainingColumns = [
  { header: "Təlimin adı", accessor: "courseName",},
  { header: "Başlama vaxtı", accessor: "startDate",  maxWidth: "80px" ,width: "80px" },
  { header: "Bitmə vaxtı", accessor: "endDate",  maxWidth: "80px" ,width: "80px" },
];

export const contactColumns = [
  { header: "Əlaqə növü", accessor: "type" },
  { header: "Dəyər", accessor: "value" },
];

export const socialColumns = [
  { header: "Sosial hesablar", accessor: "type" },
  { header: "Link və ya İstifadəçi adı", accessor: "value" },
];

export const privilegeColumns = [
  { header: "İmtiyaz", accessor: "privilege" },
  { header: "Hüquqi əsas", accessor: "legalBasisCode" },
];

export const relativeColumns = [
  {
    header: "Qohum",
    accessor: "relationshipTypeCode",
    maxWidth: "50px",
  },
  {
    header: "S.A.A",
    accessor: "personRelative", 
    maxWidth: "100px",
    minWidth: "100px",
    width: "100px",
    render: (item: any) =>
      `${item.personRelative?.surname || ""} ${item.personRelative?.name || ""} ${item.personRelative?.patronymic || ""}`,
  },
  {
    header: "Təvəllüd",
    accessor: "personRelative.birthDate",
    maxWidth: "80px",
    width: "80px",
    render: (item: any) => item.personRelative?.birthDate || "",
  },
  {
    header: "Doğulduğu yer",
    accessor: "personRelative.birthPlace",
    maxWidth: "80px",
  },
  {
    header: "İş yeri və vəzifəsi",
    accessor: "workPlace",
    render: (item: any) => {
      const social = item.socialStatusCode || "";
      const work = item.workPlace || "";

      return [social, work].filter(Boolean).join(" - ");
    },
    maxWidth: "100px",
  },
  { header: "Qeydiyyat ünvanı", accessor: "address", maxWidth: "100px" },
];

export const languageColumns = [
  { header: "Dil", accessor: "skillCode" },
  { header: "Səviyyə", accessor: "proficiencyLevelCode" },
];

export const itSkillsColumns = [
  { header: "Proqramlar", accessor: "skillCode" },
  { header: "Səviyyə", accessor: "proficiencyLevelCode" },
];

export const militaryAndAddressColumns = [
  { header: "Məlumat növü", accessor: "label" },
  { header: "Təfərrüat", accessor: "value" },
];

export const militaryAndAddressData = [
  {
    label: "Hərbi xidmət",
    value: `Yararlı, rütbəsi "Gizir"`,
  },
  { label: "Qeydiyyat ünvanı", value: "Nəsimi rayonu C.Səlimov küçəsi 3 H/H" },
  {
    label: "Yaşayış ünvanı",
    value: "Nərimanov rayonu Nəsib bəy Yusifbəyli küçəsi 77, M16, m3",
  },
];
export const externalAccountColumns = [
  { header: "Adı", accessor: "type" },
  { header: "İstifadəçi adı", accessor: "value" },
];

export const organCodeColumns = [
  { header: "Xüsusi rütbə", accessor: "specialRank" },
  { header: "Organ", accessor: "organCode" },
  { header: "Verilme tarixi", accessor: "issueDate", maxWidth: "150px" ,width: "150px" },
];
