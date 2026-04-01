import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>✓</span> ToDo App
      </Link>
      
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={`${styles.navItem} ${location.pathname === '/' ? styles.active : ''}`}>Home</Link>
        </li>
        <li>
          <Link to="/" className={styles.navItem}>About</Link>
        </li>
        <li>
          <Link to="/" className={styles.navItem}>Contact</Link>
        </li>
      </ul>

      <div className={styles.actions}>
        <Link to="/login" className={styles.loginBtn}>Login</Link>
        <Link to="/register" className={styles.registerBtn}>Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
