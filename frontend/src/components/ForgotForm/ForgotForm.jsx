import React, { useState } from 'react';
import styles from './ForgotForm.module.css';

const ForgotForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // API request will be added here later
  };

  return (
    <div className={styles.formContainer}>
      <h2>Forgot your password?</h2>
      <p>Don't worry! Enter your email address and we will send you a reset link.</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>Send Link</button>
      </form>
    </div>
  );
};

export default ForgotForm;
