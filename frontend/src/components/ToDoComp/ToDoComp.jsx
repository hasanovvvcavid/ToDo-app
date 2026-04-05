import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useTodoStore from '../../store/useTodoStore';
import styles from './ToDoComp.module.css';

const ToDoComp = () => {
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo, updateTodoTitle, loading } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await addTodo(newTodo);
      setNewTodo('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add todo';
      toast.error(errorMsg);
    }
  };

  const handleToggle = (id, completed) => {
    toggleTodo(id, !completed);
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditValue(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return setEditingId(null);
    await updateTodoTitle(id, editValue);
    setEditingId(null);
  };

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Today's Tasks</h2>
        <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <form className={styles.inputGroup} onSubmit={handleAdd}>
        <input 
          type="text" 
          className={styles.input} 
          placeholder="Add a new task..." 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={loading}
        />
        <button className={styles.addButton} type="submit" disabled={loading}>
          {loading ? '...' : 'Add'}
        </button>
      </form>

      <ul className={styles.todoList}>
        {todos.map((todo, index) => (
          <li 
            key={todo._id} 
            className={`${styles.todoItem} ${todo.isCompleted ? styles.completed : ''}`}
          >
            <span className={styles.todoNumber}>{index + 1}.</span>
            <div 
              className={styles.checkbox} 
              onClick={() => handleToggle(todo._id, todo.isCompleted)}
            ></div>
            
            {editingId === todo._id ? (
              <input 
                className={styles.editInput}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(todo._id)}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                autoFocus
              />
            ) : (
              <div className={styles.todoContent}>
                <span className={styles.todoText} onClick={() => handleToggle(todo._id, todo.isCompleted)}>
                  {todo.title}
                </span>
                <span className={styles.todoTime}>
                  {new Date(todo.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            
            <div className={styles.actions}>
              <button 
                className={`${styles.actionButton} ${styles.editButton}`} 
                onClick={() => startEditing(todo)}
                title="Edit"
              >
                ✎
              </button>
              <button 
                className={styles.actionButton} 
                onClick={() => deleteTodo(todo._id)}
                title="Delete"
              >
                ✖
              </button>
            </div>
          </li>
        ))}
        {!loading && todos.length === 0 && (
          <p className={styles.emptyState}>No tasks yet. Start by adding one!</p>
        )}
      </ul>
    </div>
  );
};

export default ToDoComp;