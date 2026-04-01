import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from '../Home/Home.module.css'; 

const Login = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.mainContent}>
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;