import Todo from '../models/Todo.js';
import User from '../models/User.js';

// @desc    Get all todos
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req, res) => {
  const { title, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a title' });
  }

  if (title.length > 20) {
    return res.status(400).json({ message: 'Title cannot exceed 20 characters' });
  }

  try {
    // Count user's todos
    const todoCount = await Todo.countDocuments({ user: req.user._id });

    if (todoCount >= 25) {
      return res.status(400).json({ 
        message: 'You have reached the limit of 25 tasks. Please delete one to add a new task.' 
      });
    }

    const todo = await Todo.create({
      user: req.user._id,
      title,
      priority: priority || 'medium',
      isCompleted: false
    });

    // İstifadəçinin todos siyahısına bu ID-ni əlavə edək
    await User.findByIdAndUpdate(req.user._id, {
      $push: { todos: todo._id }
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if user owns the todo
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if user owns the todo
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await todo.deleteOne();
    
    // İstifadəçinin todos siyahısından bu ID-ni silək
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { todos: req.params.id }
    });

    res.json({ message: 'Todo removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
