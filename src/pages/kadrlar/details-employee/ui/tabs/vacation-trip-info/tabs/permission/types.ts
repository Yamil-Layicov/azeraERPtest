
export interface PermissionItem {
    id: string;
    type: string;
    reason: string;
    timeOffTypeCode: string;
    timeOffReasonCode: string;
    date: Date;
    startTime: string;
    endTime: string;
    approver: string;
    note: string;
}

export const PERMISSION_TYPES_CONST = {}; // Force module
