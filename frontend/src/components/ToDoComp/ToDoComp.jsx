import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useTodoStore from '../../store/useTodoStore';
import styles from './ToDoComp.module.css';

const ToDoComp = () => {
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo, updateTodoTitle, loading } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await addTodo(newTodo, priority);
      setNewTodo('');
      setPriority('medium');
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

  const getFilteredAndSortedTodos = () => {
    let filtered = [...todos];

    // Filter
    if (filter === 'completed') {
      filtered = filtered.filter(t => t.isCompleted);
    } else if (filter === 'pending') {
      filtered = filtered.filter(t => !t.isCompleted);
    } else if (['low', 'medium', 'high'].includes(filter)) {
      filtered = filtered.filter(t => t.priority === filter);
    }

    // Sort
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const weightDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
        if (weightDiff !== 0) return weightDiff;
        return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort by newest
      }
      return 0;
    });

    return filtered;
  };

  const displayTodos = getFilteredAndSortedTodos();

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Today's Tasks</h2>
          <p className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Filter</label>
            <select className={styles.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Sort</label>
            <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      <form className={styles.formContainer} onSubmit={handleAdd}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Add a new task..." 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={loading}
            maxLength={20}
          />
          <button className={styles.addButton} type="submit" disabled={loading}>
            {loading ? '...' : 'Add'}
          </button>
        </div>
        
        <div className={styles.priorityContainer}>
          {['low', 'medium', 'high'].map((p) => (
            <div 
              key={p}
              className={`${styles.priorityOption} ${styles[p]} ${priority === p ? styles.selected : ''}`}
              onClick={() => setPriority(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </div>
          ))}
        </div>
      </form>

      <ul className={styles.todoList}>
        {displayTodos.map((todo, index) => (
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
                maxLength={20}
              />
            ) : (
              <div className={styles.todoContent}>
                <div className={styles.todoHeader}>
                  <span className={styles.todoText} onClick={() => handleToggle(todo._id, todo.isCompleted)}>
                    {todo.title}
                  </span>
                  <span className={`${styles.priorityBadge} ${styles[todo.priority]}`}>
                    {todo.priority}
                  </span>
                </div>
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