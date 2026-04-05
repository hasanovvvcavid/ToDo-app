import React from 'react'
import ToDoComp from '../../components/ToDoComp/ToDoComp'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import useAuthStore from '../../store/useAuthStore';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className={styles.dashboardPage}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.welcomeSection}>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>What are you planning to accomplish today?</p>
          </div>
          <ToDoComp />
        </main>
        <Footer />
    </div>
  );
};

export default Dashboard
