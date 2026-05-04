export interface StatCardData {
  label: string;
  value: string | number;
}

export interface ProgramItem {
  id: string;
  name: string;
  description?: string;
  features?: string[];
  image?: string;
}

export interface DomainInfo {
  name: string;
  expiryDate: string;
  daysRemaining: number;
  paymentAmount: string;
  lastPaymentDate: string;
  status: 'ok' | 'expired' | 'warning';
}

export interface BusinessUnit {
  id: string;
  name: string;
  mail?: string;
  web?: string;
  myBusiness?: string;
  isActive: boolean;
  programs: ProgramItem[];
  domain?: string;
  domainInfo?: DomainInfo;
  company?: string;
}

export const statsData: StatCardData[] = [
  { label: 'Biznes', value: 37 },
  { label: 'Proqram', value: 53 },
  { label: 'Domen', value: 31 },
  { label: 'Bildiriş', value: '20 gün' },
];

export const navigationTabs = [
  { id: 'programs', label: 'Proqramlar', icon: 'programs' },
  { id: 'business-units', label: 'Biznes vahidləri', icon: 'business' },
];

export const mockBusinessUnits: BusinessUnit[] = [
  {
    id: '1',
    name: 'Agro Bitki Klinikası',
    company: 'Agro Bitki Klinikası',
    domain: 'www.abk.az',
    domainInfo: {
      name: 'www.abk.az',
      expiryDate: '2026-05-25',
      daysRemaining: 73,
      paymentAmount: '20.00 AZN',
      lastPaymentDate: '2025-04-25',
      status: 'ok'
    },
    mail: 'info@abk.az',
    web: 'https://www.abk.az',
    isActive: true,
    programs: [
      { id: 'p1', name: 'Proqram 1' }
    ]
  },
  {
    id: '2',
    name: 'Agroland',
    company: 'Agroland',
    domain: 'www.agroland.az',
    domainInfo: {
      name: 'www.agroland.az',
      expiryDate: '2026-02-09',
      daysRemaining: -32,
      paymentAmount: '20.00 AZN',
      lastPaymentDate: '2025-02-09',
      status: 'expired'
    },
    mail: 'info@agroland.az',
    web: 'https://www.agroland.az',
    isActive: true,
    programs: [
      { 
        id: 'p2', 
        name: '1C (Bux 2.1)',
        description: '1C — müəssisələr üçün maliyyə, mühasibat, anbar, istehsal və kadr idarəçiliyini avtomatlaşdırmaq üçün nəzərdə tutulmuş ERP tipli proqram platformasıdır. Müxtəlif sahələr üzrə biznes proseslərini mərkəzləşdirilmiş şəkildə idarə etməyə imkan verir.',
        features: [
          'Maliyyə və mühasibat uçotunun aparılması',
          'Vergi hesabatlarının hazırlanması',
          'Anbar və stok idarəetməsi',
          'Satış və alış əməliyyatlarının uçotu',
          'Maaş və kadr idarəçiliyi',
          'İstehsal planlaşdırılması və xərclərin uçotu',
          'Müştəri və təchizatçı məlumat bazasının aparılması',
          'Analitik hesabatlar və biznes göstəricilərinin təhlili'
        ],
        image: 'https://via.placeholder.com/300x150?text=1C+ERP+Screenshot'
      },
      { id: 'p3', name: 'Hogendoorn - iSii' },
      { id: 'p4', name: 'İnta' },
      { id: 'p5', name: 'Netafim' },
      { id: 'p6', name: 'YETİS' }
    ]
  },
  {
    id: '3',
    name: 'Agrolid MMC',
    company: 'Agrolid MMC',
    domain: 'www.agrolid.az',
    isActive: true,
    programs: []
  },
  {
    id: '4',
    name: 'Azemal',
    company: 'Azemal',
    domain: 'www.azemal.az',
    domainInfo: {
      name: 'www.azemal.az',
      expiryDate: '2026-08-05',
      daysRemaining: 145,
      paymentAmount: '20.00 AZN',
      lastPaymentDate: '2025-08-05',
      status: 'ok'
    },
    mail: 'info@azemal.az',
    web: 'https://www.azemal.az',
    isActive: true,
    programs: [
      { id: 'p7', name: 'Proqram 1' }
    ]
  },
  {
    id: '5',
    name: 'Azera Holding',
    mail: 'info@azeraholding.az',
    web: 'azeraholding.az',
    myBusiness: 'https://share.google/aVwCEZNWxAhPLNBe8',
    isActive: true,
    programs: [
      { id: 'p8', name: 'Proqram 1' },
      { id: 'p9', name: 'Proqram 2' },
      { id: 'p10', name: 'Proqram 3' }
    ]
  },
  {
    id: '6',
    name: 'Azerelektroterm',
    isActive: true,
    programs: [
      { id: 'p11', name: 'Proqram 1' }
    ]
  },
  {
    id: '7',
    name: 'Azərbaycan Məişət Malları',
    isActive: true,
    programs: [
      { id: 'p12', name: 'Proqram 1' }
    ]
  }
];
