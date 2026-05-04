export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    fatherName: string;
    birthDate: string;
    gender: "Kişi" | "Qadın";
    fin: string;
    relatedSystem?: string;
  }