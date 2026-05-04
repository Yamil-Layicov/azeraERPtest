export interface Warehouse {
  id: string;
  name: string;
  company: string;
  type: "Central" | "Distribution" | "Retail" | "ColdStorage";
  location: string;
  area: number; 
  capacity: number; 
  manager: string;
  status: "Active" | "Inactive";
  createdAt: string;
}
