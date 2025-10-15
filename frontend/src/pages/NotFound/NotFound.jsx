import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/common/Layout/MainLayout';
import Button from '../../components/ui/Button/Button';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <MainLayout>
      <div className={styles.notFound}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1 style={{ fontSize: '6rem', margin: '0 0 20px 0', color: '#3498db' }}>404</h1>
          <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0', color: '#2c3e50' }}>
            Page Not Found
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', margin: '0 0 40px 0' }}>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="primary" size="large">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;