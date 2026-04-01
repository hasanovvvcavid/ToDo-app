import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from '../Home/Home.module.css';

const Register = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.mainContent}>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
