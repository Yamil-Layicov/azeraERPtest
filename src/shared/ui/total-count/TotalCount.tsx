import React from 'react';
import styles from './TotalCount.module.css';

interface TotalCountProps {
  count: number;
  label?: string; 
  className?: string;
}

const TotalCount: React.FC<TotalCountProps> = ({
  count,
  label = "Ümumi sayı",
  className = ''
}) => {
  return (
    <span className={`${styles.totalCount} ${className}`}>
      {label} : <strong>{count}</strong>
    </span>
  );
};

export default TotalCount;