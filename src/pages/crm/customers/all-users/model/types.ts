export interface CRMUser {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  role: string;
  lastLogin: string;
  status: "active" | "inactive";
}
