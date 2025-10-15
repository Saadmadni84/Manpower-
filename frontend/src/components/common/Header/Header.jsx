import React from 'react';
import SmartNavigation from '../../ui/SmartNavigation/SmartNavigation';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <SmartNavigation />
    </header>
  );
};

export default Header;

