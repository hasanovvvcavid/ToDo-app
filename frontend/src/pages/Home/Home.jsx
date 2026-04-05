import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Home.module.css";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Manage Your Tasks with <span>Ease</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Stay organized, focused, and productive. Our simple yet powerful
            ToDo application helps you get things done efficiently.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/register" className={styles.primaryBtn}>
              Get Started Free
            </Link>
            <Link to="/login" className={styles.secondaryBtn}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
