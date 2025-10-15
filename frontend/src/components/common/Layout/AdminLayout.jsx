import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../admin/components/Sidebar/Sidebar';
import TopBar from '../../../admin/components/TopBar/TopBar';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <TopBar />
      
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

