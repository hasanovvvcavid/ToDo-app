import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ForgotForm from '../../components/ForgotForm/ForgotForm';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <ForgotForm />
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
