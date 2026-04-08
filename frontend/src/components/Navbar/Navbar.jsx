import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/useAuthStore';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
  };

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
          <Link to="/#features" className={styles.navItem}>Features</Link>
        </li>
        <li>
          <button onClick={toggleTheme} className={styles.themeToggle} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </li>
      </ul>

      <div className={styles.actions}>
        {user ? (
          <>
            <Link to="/dashboard" className={styles.navItem}>Dashboard</Link>
            <button onClick={handleLogout} className={styles.loginBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
            <Link to="/register" className={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
