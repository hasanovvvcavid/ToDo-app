import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from './VerifyEmail.module.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axiosInstance.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message);
        // 3 saniyə sonra login səhifəsinə yönləndir
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification.');
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'verifying' && (
          <>
            <div className={styles.spinner}></div>
            <h2>Verifying Email...</h2>
            <p>Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Congratulations!</h2>
            <p>{message}</p>
            <p className={styles.redirectText}>You will be redirected to the login page in 3 seconds...</p>
            <Link to="/login" className={styles.link}>Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.errorIcon}>✕</div>
            <h2 className={styles.errorTitle}>Error!</h2>
            <p>{message}</p>
            <Link to="/register" className={styles.link}>Register Again</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
