export interface SickLeaveItem {
    id: string;
    employeeId: string | null;
    seriesNumber: string;
    medicalInstitution: string;
    diagnosis: string;
    dateFrom: Date;
    dateTo: Date;
}
