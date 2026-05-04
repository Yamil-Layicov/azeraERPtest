import {
  PageHeader,
  Table,
  TableRowActions,
  TableButton,
  Button,
  FormLabel,
  TableToolbar,
  Pagination,
  CustomSelect,
  TableControls,
  TableActionGroup,
  ModernDatePicker,
  Modal,
  FormTextarea,
} from '@/shared/ui'
import styles from './NonworkingDays.module.css'
import type { ColumnDef, Option } from '@/shared/types'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { operationOptions, rowCountOptions } from '@/shared/config/tableOptions'
import { useExcelExport } from '@/shared/lib/hooks'
import { getBackendErrorMessage, httpClient } from '@/shared/api'
import { ConfirmModal } from '@/shared/ui/modal/confirm'

type CreateNonWorkingDayPayload = {
  typeCode: string
  nonWorkingDay: string
  note: string
}

type UpdateNonWorkingDayPayload = {
  id: string
  typeCode: string
  nonWorkingDay: string
  note: string
}

type EnumItem = {
  id: number
  code: string
  displayName: string
  sortOrder: number
  isActive: boolean
}

type EnumItemsResponse = {
  result?: EnumItem[]
}

type GetNonWorkingDaysRequest = {
  pageSize: number
  pageIndex: number
  isDesc: false
  orderBy: null
  typeCode: string | null
  year: number | null
  nonWorkingDay: string | null
}

type GetNonWorkingDaysResponse = {
  result?:
    | unknown[]
    | {
        data?: unknown[]
        items?: unknown[]
        totalCount?: number
        count?: number
      }
}

type NonWorkingDayByIdResponse = {
  result?: {
    id?: string
    typeCode?: string
    date?: string
    nonWorkingDay?: string
    note?: string
  }
}

type TableNonWorkingDay = {
  id: string
  date: string
  year: number
  note: string
  type: string
  typeCode?: string
  rawNonWorkingDay?: string
}
type SearchFilters = {
  nonWorkingDay: string | null
  year: number | null
  typeCode: string | null
}

const getProxyUrl = (): string => {
  const proxyUrl = import.meta.env.VITE_PROXY_URL || import.meta.env.PROXY_URL || '/api/proxy'
  return proxyUrl.startsWith('/api') ? proxyUrl.replace('/api', '') : proxyUrl
}

const PROXY_URL = getProxyUrl()
const NON_WORKING_DAY_ENUM_TYPE_CODE = 'NonWorkingDayTypes'

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateToDMY = (dateStr: string): string => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}.${parts[1]}.${parts[0]}`
}


const normalizeDateToYMD = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') {
    if (value.includes('T')) return value.split('T')[0] || ''
    return value.slice(0, 10)
  }
  const parsed = new Date(String(value))
  if (isNaN(parsed.getTime())) return ''
  return formatDateToYMD(parsed)
}

const NonworkingDays = () => {
  const { exportToExcel } = useExcelExport<TableNonWorkingDay>()
  const [selectedType, setSelectedType] = useState<Option | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [note, setNote] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [typeOptions, setTypeOptions] = useState<Option[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hasOpenedTypes, setHasOpenedTypes] = useState(false)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean
    id: string | null
  }>({ isOpen: false, id: null })

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowCount, setSelectedRowCount] = useState<Option | null>(rowCountOptions[0] || null)
  const [selectedOperation, setSelectedOperation] = useState<Option | null>(null)
  const [searchDate, setSearchDate] = useState<Date | null>(null)
  const [searchYearDate, setSearchYearDate] = useState<Date | null>(null)
  const [searchType, setSearchType] = useState<Option | null>(null)
  const [searchFormResetKey, setSearchFormResetKey] = useState(0)
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters>({
    nonWorkingDay: null,
    year: null,
    typeCode: null,
  })
  const pageSize = Number(selectedRowCount?.id) || 10

  const createNonWorkingDayMutation = useMutation<void, AxiosError, CreateNonWorkingDayPayload>({
    mutationFn: async (payload) => {
      await httpClient.post(`${PROXY_URL}/nonWorkingDay/create`, payload)
    },
    onSuccess: () => {
      toast.success('Ugurla yaradildi')
      handleCancel()
      refetchNonWorkingDays()
    },
    onError: (error) => {
      const errorData = error.response?.data as { errorMessage?: string } | undefined
      if (errorData?.errorMessage) {
        toast.error(errorData.errorMessage)
      } else {
        toast.error(getBackendErrorMessage(error))
      }
    },
  })

  const updateNonWorkingDayMutation = useMutation<void, AxiosError, UpdateNonWorkingDayPayload>({
    mutationFn: async (payload) => {
      await httpClient.post(`${PROXY_URL}/nonWorkingDay/update`, payload)
    },
    onSuccess: () => {
      toast.success('Ugurla yenilendi')
      handleCancel()
      refetchNonWorkingDays()
    },
    onError: (error) => {
      const errorData = error.response?.data as { errorMessage?: string } | undefined
      if (errorData?.errorMessage) {
        toast.error(errorData.errorMessage)
      } else {
        toast.error(getBackendErrorMessage(error))
      }
    },
  })

  const deleteNonWorkingDayMutation = useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await httpClient.get(`${PROXY_URL}/nonWorkingDay/delete/${id}`)
    },
    onSuccess: () => {
      toast.success('Ugurla silindi')
      setDeleteConfirmModal({ isOpen: false, id: null })
      refetchNonWorkingDays()
      if (isEditPanelOpen) {
        handleCancel()
      }
    },
    onError: (error) => {
      const errorData = error.response?.data as { errorMessage?: string } | undefined
      if (errorData?.errorMessage) {
        toast.error(errorData.errorMessage)
      } else {
        toast.error(getBackendErrorMessage(error))
      }
    },
  })

  const getNonWorkingDayByIdMutation = useMutation<NonWorkingDayByIdResponse, AxiosError, string>({
    mutationFn: async (id) => {
      const response = await httpClient.get<NonWorkingDayByIdResponse>(`${PROXY_URL}/nonWorkingDay/getById/${id}`)
      return response.data
    },
    onSuccess: (response) => {
      const item = response.result
      if (!item) return

      setEditingId(String(item.id ?? ''))
      const typeCode = String(item.typeCode ?? '')
      const foundType = typeOptions.find((opt) => String(opt.id).toLowerCase() === typeCode.toLowerCase())
      setSelectedType(foundType || null)
      setNote(String(item.note ?? ''))

      const rawDate = String(item.nonWorkingDay ?? item.date ?? '')
      const parsedDate = new Date(rawDate)
      setSelectedDate(isNaN(parsedDate.getTime()) ? null : parsedDate)
    },
    onError: (error) => {
      toast.error(getBackendErrorMessage(error))
    },
  })

  const { data: nonWorkingDaysResponse, refetch: refetchNonWorkingDays } = useQuery({
    queryKey: ['nonWorkingDays', currentPage, pageSize, appliedFilters.nonWorkingDay, appliedFilters.year, appliedFilters.typeCode],
    queryFn: async () => {
      const payload: GetNonWorkingDaysRequest = {
        pageSize: pageSize,
        pageIndex: currentPage - 1,
        isDesc: false,
        orderBy: null,
        typeCode: appliedFilters.typeCode,
        year: appliedFilters.year,
        nonWorkingDay: appliedFilters.nonWorkingDay,
      }
      const response = await httpClient.post<GetNonWorkingDaysResponse>(`${PROXY_URL}/nonWorkingDay/get`, payload)
      return response.data
    },
  })

  const { data: enumItemsResponse, isLoading: isEnumsLoading } = useQuery({
    queryKey: ['nonWorkingDayTypeEnums', NON_WORKING_DAY_ENUM_TYPE_CODE],
    queryFn: async () => {
      const response = await httpClient.get<EnumItemsResponse>(
        `${PROXY_URL}/metaDataEnum/getEnumItemsByEnumTypeCode/${NON_WORKING_DAY_ENUM_TYPE_CODE}`,
      )
      return response.data
    },
    enabled: hasOpenedTypes || !!editingId || !!nonWorkingDaysResponse?.result,
  })

  useEffect(() => {
    const items = enumItemsResponse?.result ?? []
    if (!items.length) return

    const options = items
      .filter((item) => item.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        id: item.code,
        label: item.displayName,
      }))

    setTypeOptions(options)
  }, [enumItemsResponse])

  const typeCodeToLabelMap = useMemo(() => {
    const map = new Map<string, string>()
    typeOptions.forEach((opt) => {
      const key = String(opt.id)
      const label = opt.label ?? ''
      map.set(key, label)
      map.set(key.toLowerCase(), label)
    })
    return map
  }, [typeOptions])

  const { data, totalCount } = useMemo(() => {
    const result = nonWorkingDaysResponse?.result
    const rowsRaw = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.items)
          ? result.items
          : []

    const mapped: TableNonWorkingDay[] = rowsRaw.map((item: any, index) => {
      const normalizedDate = normalizeDateToYMD(item?.nonWorkingDay ?? item?.date ?? item?.nonWorkingDate)
      const typeCode = String(item?.typeCode ?? item?.code ?? '')
      return {
        id: String(item?.id ?? index + 1),
        date: normalizedDate,
        year: Number(item?.year ?? (normalizedDate ? new Date(normalizedDate).getFullYear() : 0)),
        note: String(item?.note ?? ''),
        type: typeCodeToLabelMap.get(typeCode) || typeCodeToLabelMap.get(typeCode.toLowerCase()) || typeCode,
        typeCode: typeCode,
        rawNonWorkingDay: String(item?.nonWorkingDay ?? item?.date ?? ''),
      }
    })

    const countFromResult =
      typeof (result as any)?.totalCount === 'number'
        ? (result as any).totalCount
        : typeof (result as any)?.count === 'number'
          ? (result as any).count
          : mapped.length

    return { data: mapped, totalCount: countFromResult }
  }, [nonWorkingDaysResponse, typeCodeToLabelMap])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleRowCountChange = (value: Option | null) => {
    setSelectedRowCount(value)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    refetchNonWorkingDays()
  }

  const handleSearchClick = () => {
    setIsSearchModalOpen(true)
  }

  const handleSearchSubmit = () => {
    const normalizedDate = searchDate ? formatDateToYMD(searchDate) : null
    const selectedYear = searchYearDate ? searchYearDate.getFullYear() : null
    const selectedTypeCode = searchType?.id ? String(searchType.id) : null

    setAppliedFilters({
      nonWorkingDay: normalizedDate,
      year: selectedYear,
      typeCode: selectedTypeCode,
    })
    setCurrentPage(1)
    setIsSearchModalOpen(false)
  }

  const handleClearSearchForm = () => {
    setSearchDate(null)
    setSearchYearDate(null)
    setSearchType(null)
    setSearchFormResetKey((prev) => prev + 1)
  }

  const handleTypeSelectOpen = () => {
    setHasOpenedTypes(true)
  }

  const handleCreate = () => {
    setIsEdit(false)
    setEditingId(null)
    setSelectedType(null)
    setSelectedDate(null)
    setNote('')
    setIsFormModalOpen(true)
  }

  const handleOperationChange = (value: Option | null) => {
    setSelectedOperation(value)

    if (value?.id === 'export_excel') {
      exportToExcel({
        data: data,
        columns: columns
          .filter((col) => col.accessor !== 'actions')
          .map((col) => ({
            header: col.header,
            accessor: col.accessor as string,
            render: col.render,
          })),
        fileName: 'Qeyri_Is_Gunleri',
      })
    }
  }

  const handleEdit = useCallback((row: TableNonWorkingDay) => {
    setIsEdit(true)
    setIsEditPanelOpen(true)
    getNonWorkingDayByIdMutation.mutate(String(row.id))
    setIsFormModalOpen(false)
  }, [getNonWorkingDayByIdMutation])

  const handleCancel = () => {
    setIsEdit(false)
    setIsEditPanelOpen(false)
    setEditingId(null)
    setNote('')
    setSelectedType(null)
    setSelectedDate(null)
    setIsFormModalOpen(false)
  }

  const handleDelete = useCallback((row: TableNonWorkingDay) => {
    setDeleteConfirmModal({ isOpen: true, id: String(row.id) })
  }, [])

  const handleCancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, id: null })
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirmModal.id) return
    deleteNonWorkingDayMutation.mutate(deleteConfirmModal.id)
  }

  const handleCreateSubmit = () => {
    if (!selectedDate || !selectedType?.id) {
      toast.error('Tarix ve Tip mutleqdir')
      return
    }

    createNonWorkingDayMutation.mutate({
      typeCode: String(selectedType.id),
      nonWorkingDay: formatDateToYMD(selectedDate),
      note: note.trim(),
    })
  }

  const handleUpdateSubmit = () => {
    if (!editingId) {
      toast.error('ID tapilmadi')
      return
    }
    if (!selectedDate || !selectedType?.id) {
      toast.error('Tarix ve Tip mutleqdir')
      return
    }

    updateNonWorkingDayMutation.mutate({
      id: editingId,
      typeCode: String(selectedType.id),
      nonWorkingDay: formatDateToYMD(selectedDate),
      note: note.trim(),
    })
  }

  const columns = useMemo<ColumnDef<TableNonWorkingDay>[]>(
    () => [
      { 
        header: 'Tarix', 
        accessor: 'date', 
        width: '150px', 
        minWidth: '150px',
        render: (row) => formatDateToDMY(row.date)
      },
      { header: 'Növü', accessor: 'type', width: '130px', minWidth: '130px' },
      { header: 'Qeyd', accessor: 'note', width: '170px', minWidth: '170px' },
      {
        header: '',
        accessor: 'actions',
        width: '72px',
        minWidth: '72px',
        render: (row) => (
          <TableRowActions>
            <TableButton variant='edit' onClick={() => handleEdit(row)} />
            <TableButton variant='delete' onClick={() => handleDelete(row)} />
          </TableRowActions>
        ),
      },
    ],
    [handleEdit, handleDelete],
  )

  return (
    <div className={styles.container}>
      <PageHeader
        title='Qeyri is gunleri'
        children={
          <Button className={styles.addButton} variant='primary' onClick={handleCreate}>
            + Yeni
          </Button>
        }
      />

      <div className={styles.contentArea}>
        <div className={styles.leftColumn}>
          <TableToolbar>
            <TableControls selectedRowCount={selectedRowCount} onRowCountChange={handleRowCountChange} totalCount={totalCount} />

            <TableActionGroup
              onRefresh={handleRefresh}
              onSearch={handleSearchClick}
              onOperationChange={handleOperationChange}
              operationOptions={operationOptions}
              selectedOperation={selectedOperation}
            />
          </TableToolbar>

          <Table data={data} columns={columns} fixedLayout />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
        <div className={styles.divider} />
        <div className={styles.rightColumn}>
          {isEditPanelOpen ? (
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Redakte et</h3>
                <button type='button' className={styles.closeButton} onClick={handleCancel} aria-label='Bagla'>
                  <XMarkIcon width={20} />
                </button>
              </div>
              <div className={styles.formBody}>
                <ModernDatePicker id='date' label='Tarix' value={selectedDate} onChange={setSelectedDate} placeholder='dd.mm.yyyy' />

                <div className={styles.fieldGroup}>
                  <FormLabel label='Növü' />
                  <CustomSelect
                    id='type'
                    options={typeOptions}
                    value={selectedType}
                    onChange={setSelectedType}
                    onMenuOpen={handleTypeSelectOpen}
                    isLoading={isEnumsLoading}
                    defaultText='--Sec--'
                    variant='form'
                  />
                </div>

                <FormTextarea id='note' label='Qeyd' value={note} onChange={setNote} placeholder='Qeyd daxil edin' />
              </div>
              <div className={styles.formActions}>
                <Button variant='primary' onClick={handleUpdateSubmit} disabled={updateNonWorkingDayMutation.isPending}>
                  {updateNonWorkingDayMutation.isPending ? 'Yuklenir...' : 'Yadda saxla'}
                </Button>
                <Button variant='secondary' onClick={handleCancel}>
                  Imtina et
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyPanel} />
          )}
        </div>
      </div>

      <Modal isOpen={isFormModalOpen} onClose={handleCancel} title={isEdit ? 'Redakte et' : 'Yeni əlave et'} size='md'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <ModernDatePicker id='date' label='Tarix' value={selectedDate} onChange={setSelectedDate} placeholder='dd.mm.yyyy' />

          <div className={styles.fieldGroup}>
            <FormLabel label='Növü' />
            <CustomSelect
              id='type'
              options={typeOptions}
              value={selectedType}
              onChange={setSelectedType}
              onMenuOpen={handleTypeSelectOpen}
              isLoading={isEnumsLoading}
              defaultText='--Sec--'
              variant='form'
            />
          </div>

          <FormTextarea id='note' label='Qeyd' value={note} onChange={setNote} placeholder='Qeyd daxil edin' />

          <div className={styles.formActions}>
            <Button variant='primary' onClick={handleCreateSubmit} disabled={createNonWorkingDayMutation.isPending}>
              {createNonWorkingDayMutation.isPending ? 'Yoxlanılır...' : isEdit ? 'Yadda saxla' : 'Əlavə et'}
            </Button>
            <Button variant='secondary' onClick={handleCancel}>
              İmtina et
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} title='Ətraflı axtarış' size='md'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
          <ModernDatePicker
            key={`search-date-${searchFormResetKey}`}
            label='Tarix'
            value={searchDate}
            onChange={setSearchDate}
            placeholder='dd.mm.yyyy'
          />

          <ModernDatePicker
            key={`search-year-${searchFormResetKey}`}
            label='İl'
            value={searchYearDate}
            onChange={setSearchYearDate}
            mode='year'
            placeholder='yyyy'
          />

          <div className={styles.fieldGroup}>
            <FormLabel label='Növü' />
            <CustomSelect
              id='search-type'
              options={typeOptions}
              value={searchType}
              onChange={setSearchType}
              onMenuOpen={handleTypeSelectOpen}
              isLoading={isEnumsLoading}
              defaultText='--Sec--'
              variant='form'
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant='secondary' onClick={handleClearSearchForm}>
              Təmizlə
            </Button>
            <Button variant='primary' onClick={handleSearchSubmit}>Axtar</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Qeyri is gununu sil'
        message='Bu qeyri is gununu silmek istediyinize eminsiniz? Bu emeliyyat geri alina bilmez.'
        confirmText='Sil'
        cancelText='Legv et'
        isLoading={deleteNonWorkingDayMutation.isPending}
      />
    </div>
  )
}

export default NonworkingDays
