import React, { useState, useCallback, memo } from 'react';
import styles from './NomenclatureTree.module.css';
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  PlusIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
  import { HiMenu } from "react-icons/hi";
import { SiCountingworkspro } from "react-icons/si";

export interface NomenclatureNode {
  id: string;
  name: string;
  nodeType: 'category' | 'product';
  isActive?: boolean;
  children?: NomenclatureNode[];
  // Product specific fields
  barcode?: string;
  printName?: string;
  article?: string;
  unit?: string;
  type?: string;
  vatRate?: number;
}

interface TreeNodeProps {
  node: NomenclatureNode; 
  selectedId: string | null;
  onSelect: (node: NomenclatureNode) => void;
  onEdit?: (node: NomenclatureNode) => void; 
  onAddChild?: (node: NomenclatureNode) => void;
  onToggleActive?: (node: NomenclatureNode) => void;
  defaultOpen?: boolean;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = memo(({ 
  node, 
  selectedId,
  onSelect, 
  onEdit,
  onAddChild,
  onToggleActive,
  defaultOpen = true,
  level = 0
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isSelected = selectedId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen((prev) => !prev);
  }, []);

  const handleMainClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node); 
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    }
  }, [node, onSelect, hasChildren]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(node);
  }, [node, onEdit]);

  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild?.(node);
  }, [node, onAddChild]);

  const handleToggleActiveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleActive?.(node);
  }, [node, onToggleActive]);

  return (
    <div className={styles.treeItem}>
      <div 
        className={`${styles.itemHeader} ${isSelected ? styles.selected : ''}`}
        onClick={handleMainClick}
      >
        <div className={styles.leftSection}>
          {hasChildren ? (
            <button className={styles.toggleBtn} onClick={handleToggle}>
              {isOpen ? (
                <ChevronDownIcon className={styles.chevronIcon} />
              ) : (
                <ChevronRightIcon className={styles.chevronIcon} />
              )}
            </button>
          ) : (
            <div className={styles.toggleBtnPlaceholder} />
          )}
          
          <div className={styles.iconWrap}>
            {node.nodeType === 'product' ? (
              <SiCountingworkspro  className={styles.productIcon} />

              // <HiOutlineCube  />
            ) : (
              <HiMenu className={styles.buildingIcon} />
            )}
          </div>
          
          <span className={styles.label}>{node.name}</span>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.actionIcon} 
            onClick={handleToggleActiveClick}
            title={node.isActive ? "Deaktiv et" : "Aktiv et"}
          >
            {node.isActive ? (
              <EyeIcon className={styles.icon} />
            ) : (
              <EyeSlashIcon className={styles.icon} />
            )}
          </button>
          <button 
            className={styles.actionIcon} 
            onClick={handleAddClick}
            title="Əlavə et"
          >
            <PlusIcon className={styles.icon} />
          </button>
          <button 
            className={styles.actionIcon} 
            onClick={handleEditClick}
            title="Düzəliş et"
          >
            <PencilSquareIcon className={styles.icon} />
          </button>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className={styles.childrenContainer}>
          {node.children?.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onToggleActive={onToggleActive}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});

interface NomenclatureTreeProps {
  data: NomenclatureNode[];
  selectedId: string | null;
  onSelect: (node: NomenclatureNode) => void;
  onEdit?: (node: NomenclatureNode) => void;
  onAddChild?: (node: NomenclatureNode) => void;
  onToggleActive?: (node: NomenclatureNode) => void;
}

export const NomenclatureTree: React.FC<NomenclatureTreeProps> = ({ 
  data, 
  selectedId, 
  onSelect,
  onEdit,
  onAddChild,
  onToggleActive
}) => {
  return (
    <div className={styles.treeContainer}>
      {data.map((node) => (
        <TreeNode 
          key={node.id} 
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};
