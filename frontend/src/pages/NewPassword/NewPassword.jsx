import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import NewPasswordForm from '../../components/NewPasswordForm/NewPasswordForm';
import styles from './NewPassword.module.css';

const NewPassword = () => {
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <NewPasswordForm />
      </div>
      <Footer />
    </>
  );
};

export default NewPassword;
