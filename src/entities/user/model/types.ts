export interface User {
  id: string;
  fullname: string;
  username: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  email?: string;
  phone?: string;
}
