import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          ToDo App
        </div>
        
        <div className={styles.links}>
          <span className={styles.linkItem}>Terms & Conditions</span>
          <span className={styles.linkItem}>Privacy Policy</span>
          <span className={styles.linkItem}>Help</span>
        </div>
      </div>
      
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
