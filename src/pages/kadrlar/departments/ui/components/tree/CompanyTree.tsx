import React, { useState, useCallback, memo, useMemo } from 'react';
import styles from './CompanyTree.module.css';
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  PlusIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import type { DepartmentNode } from '../../../model/types'; 
import { PiOfficeChair } from "react-icons/pi";
import { HiOutlineBuildingOffice2, HiOutlineBuildingOffice } from "react-icons/hi2"; 
import { useStaffingByOrganizationUnitId } from "@/features/kadrlar/departments";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { PERMISSIONS } from "@/shared/consts/permissions";

export interface StaffingItem {
  id: string;
  organizationUnitId: string;
  positionId: string;
  positionName: string;
  employeeName?: string;
  workloadRateCode?: string;
  staffCategoryCode?: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string | null;
}

interface TreeNodeProps {
  node: DepartmentNode & { isVacancy?: boolean }; 
  selectedId: string | null;
  onSelect: (node: DepartmentNode) => void;
  onEdit?: (node: DepartmentNode) => void; 
  onAddChild?: (node: DepartmentNode) => void;
  onViewStaffing?: (node: DepartmentNode) => void;
  onEditStaffing?: (item: StaffingItem) => void;
  defaultOpen?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = memo(({ 
  node, 
  selectedId,
  onSelect, 
  onEdit,
  onAddChild,
  onViewStaffing,
  onEditStaffing,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showVacancies, setShowVacancies] = useState(false); 

  // Hər bir node öz kadr məlumatını müstəqil şəkildə çəkir
  const { data: rawStaffingData, isLoading: isLoadingStaffing } = useStaffingByOrganizationUnitId(
    node.id,
    showVacancies && !node.isVacancy
  );

  const staffingData = useMemo(() => {
    if (!rawStaffingData || typeof rawStaffingData !== "object" || !("result" in rawStaffingData)) return null;
    const result = (rawStaffingData as { result: unknown }).result;
    return Array.isArray(result) ? (result as StaffingItem[]) : null;
  }, [rawStaffingData]);

  const isSelected = selectedId === node.id;

  const visibleChildren = useMemo(() => {
    return (node.children ?? []).filter(child => {
      const extChild = child as DepartmentNode & { isVacancy?: boolean };
      if (extChild.isVacancy) return showVacancies;
      return true;
    });
  }, [node.children, showVacancies]);

  const hasVisibleChildren = Boolean(visibleChildren.length);
  const showStaffingSection = showVacancies && !node.isVacancy;

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsOpen((prev) => !prev);
  }, []);

  const handleMainClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node); 
    if (visibleChildren.length) setIsOpen((prev) => !prev);
  }, [node, onSelect, visibleChildren.length]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
    onEdit?.(node);
  }, [node, onSelect, onEdit]);

  const handleAddClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild?.(node);
  }, [node, onAddChild]);

  const handleToggleVacancies = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVacancies((prev) => {
      const next = !prev;
      // Əgər göz açılırsa və node bağlıdırsa, onu da aç
      if (next && !isOpen) setIsOpen(true);
      
      // Sağ paneldə seçili node-u göstərmək üçün (isteğe bağlı)
      if (next) onViewStaffing?.(node);
      
      return next;
    });
  }, [isOpen, node, onViewStaffing]);

  const hasContentToExpand = hasVisibleChildren || showStaffingSection;

  return (
    <div className={styles.treeItem}>
      <div 
        className={`${styles.itemHeader} ${isSelected ? styles.selected : ''}`} 
        onClick={handleMainClick} 
      >
        {/* SOL TƏRƏF */}
        <div className={styles.leftSection}>
          {!node.isVacancy && (
             <span 
               className={`${styles.toggleBtn} ${!hasContentToExpand ? styles.toggleBtnPlaceholder : ''}`}
               onClick={hasContentToExpand ? handleToggle : undefined}
             >
                {isOpen ? <ChevronDownIcon width={16} strokeWidth={2.5} /> : <ChevronRightIcon width={16} strokeWidth={2.5} />}
             </span>
          )}

          {/* HOLDİNG / SİRKƏT İKONU */}
          {!node.isVacancy && node.type === 'Holding' && (
            <span className={styles.vacancyIconWrap}>
              <HiOutlineBuildingOffice2 size={20} />
            </span>
          )}
          {!node.isVacancy && node.type === 'Company' && (
            <span className={styles.vacancyIconWrap}>
              <HiOutlineBuildingOffice size={20} />
            </span>
          )}
          
          {/* VAKANSİYA ÜÇÜN İKON */}
          {node.isVacancy && (
            <span className={styles.vacancyIconWrap}>
              <PiOfficeChair  size={20} /> 
            </span>
          )}
          
          <span 
            className={styles.label}
            style={{ 
               color: node.isVacancy ? '#000000' : '#327a9d',
               fontWeight: '500'
            }}
          >
            {node.isVacancy ? node.name : (node.shortName || node.name)}
          </span>
        </div>

        {/* SAĞ TƏRƏF: Action Düymələri */}
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {!node.isVacancy && (
              <>
                <PermissionGuard permission={PERMISSIONS.STAFFING.VIEW}>
                  {showVacancies ? (
                    <EyeIcon 
                      className={styles.actionIcon} 
                      width={18} 
                      title="Gizlət" 
                      onClick={handleToggleVacancies} 
                    />
                  ) : (
                    <EyeSlashIcon 
                      className={styles.actionIcon} 
                      width={18} 
                      title="Göstər" 
                      onClick={handleToggleVacancies} 
                    />
                  )}
                </PermissionGuard>
                
                <PlusIcon className={styles.actionIcon} width={18} title="Alt qurum əlavə et" onClick={handleAddClick} />
              </>
            )}
            
            <PencilSquareIcon className={styles.actionIcon} width={18} title="Düzəliş et" onClick={handleEditClick} />
        </div>
      </div>

      {(hasVisibleChildren || showStaffingSection) && (
        <div className={`${styles.collapsibleWrapper} ${isOpen ? styles.open : ''}`}>
          <div className={styles.overflowHidden}>
            <div className={styles.childrenContainer}>
              {showStaffingSection && (isLoadingStaffing || (staffingData && staffingData.length > 0)) && (
                <div className={styles.staffingSection}>
                  {isLoadingStaffing ? (
                    <div className={styles.staffingLoading}>Yüklənir...</div>
                  ) : (
                    staffingData?.map((item) => (
                      <div key={item.id} className={styles.staffingRow}>
                        <span className={styles.staffingIcon}>
                          <PiOfficeChair size={20} />
                        </span>
                        <span className={styles.staffingPosition}>
                          {item.positionName}
                          {item.employeeName ? ` - ${item.employeeName}` : ""}
                        </span>
                        <PencilSquareIcon
                          className={styles.actionIcon}
                          width={18}
                          title="Düzəliş et"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditStaffing?.(item);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
              {visibleChildren.map((child) => (
                <TreeNode 
                  key={child.id} 
                  node={child} 
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onAddChild={onAddChild}
                  onViewStaffing={onViewStaffing}
                  onEditStaffing={onEditStaffing}
                  selectedId={selectedId}
                  defaultOpen={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
TreeNode.displayName = 'TreeNode';

interface CompanyTreeProps {
  data: DepartmentNode[];
  selectedId: string | null; 
  onSelect: (node: DepartmentNode) => void;
  onEdit?: (node: DepartmentNode) => void; 
  onAddChild?: (node: DepartmentNode) => void;
  onViewStaffing?: (node: DepartmentNode) => void;
  onEditStaffing?: (item: StaffingItem) => void;
}

const CompanyTree: React.FC<CompanyTreeProps> = ({ 
  data, selectedId, onSelect, onEdit, onAddChild, onViewStaffing, onEditStaffing
}) => {
  return (
    <div className={styles.treeContainer}>
      {data.map((node) => (
        <TreeNode 
          key={node.id} 
          node={node} 
          onSelect={onSelect} 
          onEdit={onEdit}
          onAddChild={onAddChild}
          onViewStaffing={onViewStaffing}
          onEditStaffing={onEditStaffing}
          selectedId={selectedId} 
          defaultOpen={true}
        />
      ))}
    </div>
  );
};

export default CompanyTree;