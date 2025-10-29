// ToDo App Frontend JavaScript

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.loadTodos();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-btn');
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.totalCount = document.getElementById('total-count');
        this.completedCount = document.getElementById('completed-count');
        this.pendingCount = document.getElementById('pending-count');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Input validation
        this.todoInput.addEventListener('input', () => {
            this.addBtn.disabled = this.todoInput.value.trim() === '';
        });
    }

    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                throw new Error('Failed to load todos');
            }
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError('Failed to load todos. Please refresh the page.');
        }
    }

    async addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        this.addBtn.disabled = true;
        this.addBtn.textContent = 'Adding...';

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const newTodo = await response.json();
            this.todos.push(newTodo);
            this.todoInput.value = '';
            this.renderTodos();
            this.updateStats();
            
            // Add animation class to new todo
            setTimeout(() => {
                const newTodoElement = this.todoList.querySelector(`[data-id="${newTodo.id}"]`);
                if (newTodoElement) {
                    newTodoElement.classList.add('new');
                }
            }, 10);

        } catch (error) {
            console.error('Error adding todo:', error);
            this.showError('Failed to add todo. Please try again.');
        } finally {
            this.addBtn.disabled = false;
            this.addBtn.textContent = 'Add Task';
        }
    }

    async updateTodo(id, updates) {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
                this.renderTodos();
                this.updateStats();
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            this.todos = this.todos.filter(todo => todo.id !== id);
            this.renderTodos();
            this.updateStats();
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError('Failed to delete todo. Please try again.');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.style.display = 'none';
            this.emptyState.style.display = 'block';
            
            if (this.todos.length === 0) {
                this.emptyState.innerHTML = '<p>No tasks found. Use the form above to add new tasks.</p>';
            } else {
                this.emptyState.innerHTML = `<p>No ${this.currentFilter} tasks found.</p>`;
            }
            return;
        }

        this.todoList.style.display = 'block';
        this.emptyState.style.display = 'none';

        this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
        
        // Attach event listeners to new elements
        this.attachTodoEventListeners();
    }

    createTodoElement(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <input 
                    type="text" 
                    class="todo-text" 
                    value="${this.escapeHtml(todo.text)}"
                    data-id="${todo.id}"
                >
                <div class="todo-actions">
                    <button 
                        class="delete-btn" 
                        data-id="${todo.id}"
                        title="Delete task"
                    >
                        Delete
                    </button>
                </div>
            </li>
        `;
    }

    attachTodoEventListeners() {
        // Attach event listeners to checkboxes
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.updateTodo(id, { completed: e.target.checked });
            });
        });

        // Attach event listeners to text inputs
        document.querySelectorAll('.todo-text').forEach(textInput => {
            textInput.addEventListener('blur', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.updateTodo(id, { text: e.target.value });
            });
            
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.target.blur();
                }
            });
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteTodo(id);
            });
        });
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        this.totalCount.textContent = `Total: ${total}`;
        this.completedCount.textContent = `Completed: ${completed}`;
        this.pendingCount.textContent = `Pending: ${pending}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        // Simple error display - in a real app, you might use a more sophisticated notification system
        alert(message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});