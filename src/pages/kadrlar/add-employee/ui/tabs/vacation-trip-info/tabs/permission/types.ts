
export interface PermissionItem {
    id: string;
    employeeId: string | null;
    type: string;
    reason: string;
    /** Form / POST üçün lookup ilə uyğunlaşdırma */
    timeOffTypeCode: string;
    timeOffReasonCode: string;
    date: Date;
    startTime: string;
    endTime: string;
    approver: string;
    note: string;
}

export const PERMISSION_TYPES_CONST = {}; // Force module
