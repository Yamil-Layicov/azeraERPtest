import React from 'react';
import styles from './TableActionGroup.module.css';
import { OperationsButton } from './index';
import { IconButton } from '@/shared/ui';
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Option } from '@/shared/types';

interface TableActionGroupProps {
  onRefresh?: () => void;
  onSearch?: () => void;
  onOperationChange?: (value: Option) => void;
  operationOptions?: Option[];
  selectedOperation?: Option | null;
  children?: React.ReactNode;
  className?: string;
  searchLeftSlot?: React.ReactNode;
  isSearchLeftSlotOpen?: boolean;
  disabled?: boolean;
}

const TableActionGroup: React.FC<TableActionGroupProps> = ({
  onRefresh,
  onSearch,
  onOperationChange,
  operationOptions,
  selectedOperation,
  children,
  className = '',
  searchLeftSlot,
  isSearchLeftSlotOpen, 
  disabled = false
}) => {
  return (
    <div className={`${styles.group} ${className}`}>
      {onRefresh && (
        <IconButton 
          icon={ArrowPathIcon} 
          onClick={onRefresh} 
          title="Yenilə" 
          variant="default"
          disabled={disabled}
        />
      )}
      
      {searchLeftSlot && (
        <div className={`${styles.searchSlot} ${isSearchLeftSlotOpen ? styles.searchSlotOpen : styles.searchSlotClosed}`}>
          {searchLeftSlot}
        </div>
      )}
      
      {onSearch && (
        <IconButton 
          icon={MagnifyingGlassIcon} 
          onClick={onSearch} 
          title="Axtar" 
          variant="default"
          disabled={disabled}
        />
      )}
      
      {onOperationChange && operationOptions && (
        <OperationsButton 
          options={operationOptions}
          value={selectedOperation}
          onChange={onOperationChange}
        />
      )}

      {children}
    </div>
  );
};

export default TableActionGroup;