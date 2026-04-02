import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NoPage.module.css';

const NoPage = () => {
  return (
    <div className={styles.noPageContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>The page you are looking for might have been removed or its URL changed.</p>
        <Link to="/" className={styles.homeBtn}>Back to Home</Link>
      </div>
    </div>
  );
};

export default NoPage;
