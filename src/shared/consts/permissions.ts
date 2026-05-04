export const PERMISSIONS = {
    ADMIN_ALL: "*",
  
    EMPLOYEE: {
      VIEW: "Employee.View",
      CREATE: "Employee.Create",
      UPDATE: "Employee.Update",
      DELETE: "Employee.Delete",
      CHECK_PIN: "Employee.CheckPin",
      SPECIAL_NOTE: "Employee.SpecialNote",
      PRINT: "Employee.Print",
      TERMINATED: "Employee.Terminated",
    },

    EMPLOYMENT: {
      VIEW: "Employee.View",
      CREATE: "Employee.Create",
      UPDATE: "Employee.Update",
      DELETE: "Employee.Delete",
    },
  
    POSITION: {
      VIEW: "Position.View",
      CREATE: "Position.Create",
      UPDATE: "Position.Update",
      DELETE: "Position.Delete",
    },
  
    COMPANY: {
      VIEW: "Company.View",
      CREATE: "Company.Create",
      UPDATE: "Company.Update",
      DELETE: "Company.Delete",
    },  
  
    NODE: {
      VIEW: "Node.View",
      CREATE: "Node.Create",
      UPDATE: "Node.Update",
      DELETE: "Node.Delete",
      ACTIVATE: "Node.Activate",
      DEACTIVATE: "Node.Deactivate",
    },

    STAFFING: {
      VIEW: "Staffing.View",
      CREATE: "Staffing.Create",
      UPDATE: "Staffing.Update",
      DELETE: "Staffing.Delete",
    },

    LDAP: {
      VIEW: "Ldap.View",
      CHANGE_GROUP: "Ldap.ChangeGroup",
    },

    SECURITY: {
      VIEW: "Security.View",
      CREATE: "Security.Create",
      UPDATE: "Security.Update",
      DELETE: "Security.Delete",
      RESET_PWD: "Security.ResetPwd",
      CAN_IS_ACTIVE: "Security.CanIsActive",
      CHANGE_USER_ROLE: "Security.ChangeUserRole",
      CREATE_USER: "Security.CreateUser",
      CHECK_USERNAME: "Security.CheckUsername",
      CHANGE_ROLE_CLAIM: "Security.ChangeRoleClaim",
    },

    SETTING: {
      ACTIVE_DIRECTORY: "Setting.ActiveDirectory",
      REFERENCE_DATA: "Setting.ReferenceData",
      /** Qeyri-iş günləri */
      NON_WORKING_DAYS: "Setting.NonWorkingDays",
      /** Yeniliklər (tənzimləmələr bildirişləri) */
      NOTIFICATIONS: "Setting.Notifications",
    },
  } as const;
  
  export type PermissionString = string;
