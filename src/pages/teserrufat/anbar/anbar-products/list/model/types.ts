export type StockStatus = "inStock" | "lowStock" | "outOfStock" | "overstocked";

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  warehouse: string;
  location: string; 
  lotSerial?: string;
  
  onHand: number;      // Total physical
  allocated: number;   // Reserved
  available: number;   // onHand - allocated
  
  minLevel: number;
  maxLevel: number;
  safetyStock: number;
  
  unit: string;
  expiryDate?: string;
  lastMovementDate: string;
  status: StockStatus;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: "in" | "out" | "transfer";
  qty: number;
  fromLocation?: string;
  toLocation?: string;
  timestamp: string;
  performedBy: string;
  referenceDoc?: string;
}
