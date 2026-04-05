import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '../../store/useAuthStore';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        toast.info('Google ilə giriş edilir...');
        // useGoogleLogin access_token qaytarır. Backend-i buna uyğunlaşdıracağıq.
        await googleLogin(tokenResponse.access_token);
        toast.success('Google ilə giriş uğurludur!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.message || 'Google ilə giriş uğursuz oldu');
      }
    },
    onError: () => {
      toast.error('Google ilə giriş xətası baş verdi');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Please sign in to continue</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email Address</label>
          <input 
            type="email" 
            className={styles.input} 
            placeholder="john.doe@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input 
            type="password" 
            className={styles.input} 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className={styles.divider}>OR</div>

      <button 
        type="button" 
        className={styles.googleBtn} 
        onClick={() => handleGoogleLogin()}
        disabled={loading}
      >
        <svg className={styles.googleIcon} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className={styles.footerText}>
        Don't have an account? <Link to="/register" className={styles.footerLink}>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
