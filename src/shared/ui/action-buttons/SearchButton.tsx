import React from 'react';
import styles from './ActionButtons.module.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.actionButton} onClick={onClick} title="Axtar">
      <MagnifyingGlassIcon className={styles.icon} />
    </button>
  );
};

export default SearchButton;