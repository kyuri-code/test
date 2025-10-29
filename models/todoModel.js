// In-memory storage for todos (MVP - no database needed)
let todos = [
  { id: 1, text: 'Sample todo item', completed: false, createdAt: new Date() },
  { id: 2, text: 'Another sample todo', completed: true, createdAt: new Date() }
];
let nextId = 3;

class TodoModel {
  static getAllTodos() {
    return todos;
  }

  static createTodo(text) {
    const newTodo = {
      id: nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    todos.push(newTodo);
    return newTodo;
  }

  static findTodoById(id) {
    return todos.find(todo => todo.id === id);
  }

  static findTodoIndexById(id) {
    return todos.findIndex(todo => todo.id === id);
  }

  static updateTodo(id, updates) {
    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      return null;
    }

    // Update fields if provided
    if (updates.text !== undefined) {
      todos[todoIndex].text = updates.text;
    }
    
    if (updates.completed !== undefined) {
      todos[todoIndex].completed = updates.completed;
    }

    todos[todoIndex].updatedAt = new Date();
    return todos[todoIndex];
  }

  static deleteTodo(id) {
    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      return null;
    }
    return todos.splice(todoIndex, 1)[0];
  }
}

module.exports = TodoModel;