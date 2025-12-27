require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  });

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [1, 'Item name cannot be empty'],
  },
  itemDescription: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Todo Model
const Todo = mongoose.model('Todo', todoSchema);

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'To-Do API is running' });
});

// Submit To-Do Item Route
app.post('/submittodoitem', async (req, res) => {
  try {
    const { itemName, itemDescription } = req.body;

    // Validation
    if (!itemName || typeof itemName !== 'string' || !itemName.trim()) {
      return res.status(400).json({
        message: 'Item name is required and must be a non-empty string',
      });
    }

    // Create new todo
    const newTodo = new Todo({
      itemName: itemName.trim(),
      itemDescription: itemDescription || '',
    });

    // Save to database
    const savedTodo = await newTodo.save();

    res.status(201).json({
      message: 'To-Do item created successfully',
      todo: savedTodo,
    });
  } catch (error) {
    console.error('Error creating to-do item:', error);
    res.status(500).json({
      message: 'Failed to create to-do item',
      error: error.message,
    });
  }
});

// Get all To-Do Items
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({
      message: 'All to-do items retrieved',
      todos: todos,
    });
  } catch (error) {
    console.error('Error fetching to-do items:', error);
    res.status(500).json({
      message: 'Failed to fetch to-do items',
      error: error.message,
    });
  }
});

// Get To-Do Item by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'To-Do item not found' });
    }
    res.json({
      message: 'To-Do item retrieved',
      todo: todo,
    });
  } catch (error) {
    console.error('Error fetching to-do item:', error);
    res.status(500).json({
      message: 'Failed to fetch to-do item',
      error: error.message,
    });
  }
});

// Delete To-Do Item
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'To-Do item not found' });
    }
    res.json({
      message: 'To-Do item deleted successfully',
      todo: todo,
    });
  } catch (error) {
    console.error('Error deleting to-do item:', error);
    res.status(500).json({
      message: 'Failed to delete to-do item',
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
