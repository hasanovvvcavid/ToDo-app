import React from 'react'
import ToDoComp from '../../components/ToDoComp/ToDoComp'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.homePage}>
        <Navbar />
        <main className={styles.mainContent}>
          <ToDoComp />
        </main>
        <Footer />
    </div>
  )
}

export default Home