const express = require('express');
const TodoController = require('../controllers/todoController');

const router = express.Router();

// GET /api/todos - Get all todos
router.get('/todos', TodoController.getAllTodos);

// POST /api/todos - Create a new todo
router.post('/todos', TodoController.createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/todos/:id', TodoController.updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/todos/:id', TodoController.deleteTodo);

module.exports = router;