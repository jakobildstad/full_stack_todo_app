// Endre import-syntaksen til require siden du ikke har type: "module" i package.json
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todo_app'
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes
app.post('/api/tasks', (req, res) => {
    const { task, date, task_description } = req.body;
    const query = 'INSERT INTO tasks (task, task_date, task_description) VALUES (?, ?, ?)';
    
    db.query(query, [task, date, task_description], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Failed to create task' });
            return;
        }
        res.status(201).json({ message: 'Task created successfully', id: result.insertId });
    });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks ORDER BY task_date ASC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Failed to fetch tasks' });
            return;
        }
        res.json(results);
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const query = 'DELETE FROM tasks WHERE id = ?';
    
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Failed to delete task' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});