
export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  isActive: boolean;
  type: 'info' | 'warning' | 'success';
  views: number;
  startDate?: string;
  endDate?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Yeni Kassa Modulu',
    description: '<p>Artıq kassa əməliyyatlarını yeni modul vasitəsilə <strong>daha sürətli</strong> idarə edə bilərsiniz.</p>',
    date: '01.04.2026',
    isActive: true,
    type: 'success',
    views: 124
  },
  {
    id: 2,
    title: 'Sistem Yenilənməsi',
    description: '<p>Bu həftəsonu sistemdə <u>profilaktik işlər</u> aparılacaq.</p>',
    date: '02.04.2026',
    isActive: true,
    type: 'warning',
    views: 89
  },
  {
    id: 3,
    title: 'Yeni Hesabatlar',
    description: '<p>Maliyyə hesabatları bölməsinə yeni filtrlər əlavə edilib:</p><ul><li>Tarix filtri</li><li>Status filtri</li></ul>',
    date: '03.04.2026',
    isActive: false,
    type: 'info',
    views: 56
  },
  {
    id: 4,
    title: 'Təhlükəsizlik Yeniləməsi',
    description: 'İstifadəçi şifrələrinin təhlükəsizliyi artırılıb.',
    date: '04.04.2026',
    isActive: true,
    type: 'info',
    views: 210
  },
  {
    id: 5,
    title: 'Yeni Dizayn',
    description: 'İnterfeys dizaynında bəzi dəyişikliklər edilib.',
    date: '05.04.2026',
    isActive: true,
    type: 'success',
    views: 145
  },
];
