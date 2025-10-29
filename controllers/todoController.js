const TodoModel = require('../models/todoModel');

class TodoController {
  static getAllTodos(req, res) {
    const todos = TodoModel.getAllTodos();
    res.json(todos);
  }

  static createTodo(req, res) {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const newTodo = TodoModel.createTodo(text);
    res.status(201).json(newTodo);
  }

  static updateTodo(req, res) {
    const id = parseInt(req.params.id);
    const { text, completed } = req.body;
    
    // Validate text if provided
    if (text !== undefined) {
      const trimmedText = text.trim();
      if (trimmedText === '') {
        return res.status(400).json({ error: 'Todo text cannot be empty' });
      }
    }

    const updates = {};
    if (text !== undefined) {
      updates.text = text.trim();
    }
    if (completed !== undefined) {
      updates.completed = completed;
    }

    const updatedTodo = TodoModel.updateTodo(id, updates);
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  }

  static deleteTodo(req, res) {
    const id = parseInt(req.params.id);
    const deletedTodo = TodoModel.deleteTodo(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(deletedTodo);
  }
}

module.exports = TodoController;