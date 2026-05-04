import type { Option } from '@/shared/types'

export type NonworkingDay = {
  id: number
  date: string
  year: number
  note: string
  type: string
}

export const mockData: NonworkingDay[] = [
  { id: 1, date: '6 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 2, date: '7 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 3, date: '13 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 4, date: '14 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 5, date: '20 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 6, date: '21 yan 2018', year: 2018, note: '', type: 'Weekend' },
  { id: 7, date: '27 yan 2018', year: 2018, note: '', type: 'Weekend' },
]

export const typeOptions: Option[] = [
  { id: 'weekend', label: 'Həftəsonu' },
  { id: 'holiday', label: 'Bayram' },
]
