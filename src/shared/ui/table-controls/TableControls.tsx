import React from 'react';
import styles from './TableControls.module.css';
import { CustomSelect } from '@/shared/ui/select';
import { TotalCount } from '@/shared/ui';
import { rowCountOptions } from '@/shared/config/tableOptions';
import type { Option } from '@/shared/types';

interface TableControlsProps {
  selectedRowCount: Option | null;
  onRowCountChange: (value: Option | null) => void;
  totalCount: number;
  totalCountLabel?: string;
  className?: string;
  selectClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}

const TableControls: React.FC<TableControlsProps> = ({
  selectedRowCount,
  onRowCountChange,
  totalCount,
  totalCountLabel,
  className = '',
  selectClassName = '',
  wrapperClassName = '',
  disabled = false,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.selectWrapper} ${wrapperClassName}`}>
        <CustomSelect
          options={rowCountOptions}
          value={selectedRowCount}
          onChange={onRowCountChange}
          defaultText="Sətir"
          variant="form"
          isClearable={false}
          disabled={disabled}
          className={selectClassName}
        />
      </div>
      <TotalCount count={totalCount} label={totalCountLabel} />
    </div>
  );
};

export default TableControls;