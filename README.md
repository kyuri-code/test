# ToDo App

A simple and elegant ToDo application built with Node.js, Express, and vanilla JavaScript.

## Features

- ✨ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✏️ Edit task text inline
- 🗑️ Delete tasks
- 🔍 Filter tasks (All, Pending, Completed)
- 📊 Task statistics
- 📱 Responsive design

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Storage**: In-memory (for MVP)

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Project Structure

```
├── server.js          # Single backend file with Express server
├── public/            # Frontend static files
│   ├── index.html     # Main HTML file
│   ├── styles.css     # CSS styling
│   └── script.js      # Frontend JavaScript
├── package.json       # Node.js dependencies and scripts
└── README.md         # This file
```

## Usage

1. **Adding a task**: Type in the input field and click "Add Task" or press Enter
2. **Completing a task**: Click the checkbox next to a task
3. **Editing a task**: Click on the task text and edit inline
4. **Deleting a task**: Click the delete button (🗑️)
5. **Filtering tasks**: Use the filter buttons to view All, Pending, or Completed tasks

## Development

This is an MVP (Minimum Viable Product) implementation with the following characteristics:

- Single backend file for simplicity
- In-memory storage (data resets on server restart)
- Clean and responsive UI
- RESTful API design
- Error handling and user feedback

## Repository Sync

This repository is configured to automatically sync its contents to the `kyuri-code/test2` repository. The sync process:

- Runs automatically on pushes to the main branch
- Can be triggered manually via GitHub Actions
- Copies all repository contents except the `.git` directory
- Maintains the target repository's git history

For more details, see [SYNC_CONFIG.md](SYNC_CONFIG.md).

### Manual Sync
You can also run the sync manually using the provided script:
```bash
./sync-to-test2.sh [GITHUB_TOKEN]
```

## Future Enhancements

- Database integration (SQLite, PostgreSQL, MongoDB)
- User authentication
- Task categories/tags
- Due dates and reminders
- Drag and drop reordering
- Dark mode theme