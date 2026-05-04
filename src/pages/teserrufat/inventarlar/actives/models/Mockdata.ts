export interface HistoryEntry {
  id: string;
  date: string;
  operation: string;
  performedBy: string;
  fromPerson?: string;
  toPerson?: string;
  company?: string;
  department?: string;
  location?: string;
  status: string;
  note?: string;
}

export interface InventoryItem {
  id: string;
  inventoryNo: string;
  qrToken: string;
  imageCount: number;
  activeName: string;
  activeDescription: string;
  serialNumber: string;
  company: string;
  department: string;
  location: string;
  responsiblePerson: string;
  responsibleFin: string;
  category: string;
  subCategory: string;
  status: "Aktiv" | "Deaktiv";
  deliveryDate: string | null;
  imageUrl?: string;
  imageUrls?: string[];
  history?: HistoryEntry[];
  type?: string;
}

export const activeInventoriesMockData: InventoryItem[] = [
  {
    id: "1",
    inventoryNo: "INV-2026-E0F2BF7C",
    qrToken: "768329ba...",
    imageCount: 3,
    activeName: "wewetwetwet",
    activeDescription: "wetwetwet wetwet",
    serialNumber: "wetwetw",
    company: "Azera Holding",
    department: "İnformasiya Texnologiyaları Departamenti",
    location: "2-ci mərtəbə",
    responsiblePerson: "İsmayılov Taleh Gülbala",
    responsibleFin: "5VSHQG6",
    category: "Digər (ümumi)",
    subCategory: "Akvarium",
    status: "Aktiv",
    deliveryDate: "2026-02-03",
    type: "Akvarium",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwvE9ANhGeIQbgtcd6DnhwHKewr3EZv7hctGPvX5AOAu3YQmNwk45-eZw&s",
    imageUrls: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwvE9ANhGeIQbgtcd6DnhwHKewr3EZv7hctGPvX5AOAu3YQmNwk45-eZw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_6_6Z6_6Z6_6Z6_6Z6_6Z6_6Z6_6Z6_6Z6&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7_7Z7_7Z7_7Z7_7Z7_7Z7_7Z7_7Z7_7Z&s",
    ],
    history: [
      {
        id: "h1",
        date: "2026-02-03 10:00",
        operation: "İlkin inventarlaşdırma",
        performedBy: "İcra edən: Super Admin",
        fromPerson: "—",
        toPerson: "İsmayılov Taleh Gülbala",
        company: "Azera Holding",
        department: "İnformasiya Texnologiyaları Departamenti",
        location: "2-ci mərtəbə otaq 31",
        status: "Aktiv",
        note: "İlkin paket daxilində qeydiyyata alınıb.",
      },
      {
        id: "h2",
        date: "2026-01-15 14:30",
        operation: "Status Dəyişdirilməsi",
        performedBy: "Sistem",
        status: "Deaktiv",
        note: "Təmir üçün geri alınıb.",
      },
    ],
  },
  {
    id: "2",
    inventoryNo: "INV-2026-F179BE7B",
    qrToken: "1300dd82...",
    imageCount: 0,
    activeName: "Stol",
    activeDescription: "",
    serialNumber: "",
    company: "Azera Holding",
    department: "İnformasiya Texnologiyaları Departamenti",
    location: "2-ci mərtəbə ",
    responsiblePerson: "Əsgərzadə Rəşid Rövşən",
    responsibleFin: "73P7M57",
    category: "Mebel",
    subCategory: "İş masası",
    status: "Aktiv",
    deliveryDate: "2026-02-01",
    type: "Stol",
  },
  {
    id: "3",
    inventoryNo: "INV-2026-8A0BB54C",
    qrToken: "e694e064...",
    imageCount: 0,
    activeName: "Müşahidə kamerası",
    activeDescription: "",
    serialNumber: "",
    company: "Azera Holding",
    department: "Komendant",
    location: "-",
    responsiblePerson: "İsmayılov Sənan Nəsimi",
    responsibleFin: "29F28SA",
    category: "Təhlükəsizlik",
    subCategory: "CCTV kamerasalma",
    status: "Aktiv",
    deliveryDate: null,
    type: "Neqliyyat",
  },
  {
    id: "4",
    inventoryNo: "INV-2026-A57A68FD",
    qrToken: "28155d0b...",
    imageCount: 0,
    activeName: "Şəkil",
    activeDescription: "",
    serialNumber: "",
    company: "Azera Holding",
    department: "Komendant",
    location: "-",
    responsiblePerson: "İsmayılov Sənan Nəsimi",
    responsibleFin: "29F28SA",
    category: "Digər (ümumi)",
    subCategory: "Portret, Şəkil",
    status: "Aktiv",
    deliveryDate: null,
    type: "Portret, Şəkil",
  },
];
