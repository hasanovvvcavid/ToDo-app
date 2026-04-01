import React from 'react';
import styles from './ToDoComp.module.css';

const ToDoComp = () => {
  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Today's Tasks</h2>
        <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className={styles.inputGroup}>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="Add a new task..." 
          readOnly
        />
        <button className={styles.addButton} type="button">Add</button>
      </div>

      <ul className={styles.todoList}>
        {/* Completed Task Example */}
        <li className={`${styles.todoItem} ${styles.completed}`}>
          <div className={styles.checkbox}></div>
          <span className={styles.todoText}>Morning workout</span>
          <div className={styles.actions}>
            <button className={`${styles.actionButton} ${styles.editButton}`} title="Edit" type="button">
              ✎
            </button>
            <button className={styles.actionButton} title="Delete" type="button">
              ✖
            </button>
          </div>
        </li>

        {/* Uncompleted Task Example 1 */}
        <li className={styles.todoItem}>
          <div className={styles.checkbox}></div>
          <span className={styles.todoText}>Create components in React project</span>
          <div className={styles.actions}>
            <button className={`${styles.actionButton} ${styles.editButton}`} title="Edit" type="button">
              ✎
            </button>
            <button className={styles.actionButton} title="Delete" type="button">
              ✖
            </button>
          </div>
        </li>

        {/* Uncompleted Task Example 2 */}
        <li className={styles.todoItem}>
          <div className={styles.checkbox}></div>
          <span className={styles.todoText}>Finish design with CSS Modules</span>
          <div className={styles.actions}>
            <button className={`${styles.actionButton} ${styles.editButton}`} title="Edit" type="button">
              ✎
            </button>
            <button className={styles.actionButton} title="Delete" type="button">
              ✖
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ToDoComp;