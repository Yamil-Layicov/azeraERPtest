import React from 'react';
import { Button } from "@/shared/ui";
import styles from './DepartmentActions.module.css';

interface DepartmentActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DepartmentActions: React.FC<DepartmentActionsProps> = ({ 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className={styles.container}>
      <Button 
        type="button" 
        variant="primary" 
        className={styles.actionButton}
        onClick={onAdd}
      >
        +
        Yeni
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className={styles.actionButton}
        onClick={onEdit}
      >
        Düzəliş
      </Button>
      
      <Button 
        type="button" 
        variant="secondary" 
        className={styles.actionButton}
        onClick={onDelete}
      >
        Sil
      </Button>
    </div>
  );
};

export default DepartmentActions;