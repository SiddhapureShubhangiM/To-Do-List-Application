const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks
router.get('/tasks', taskController.getAllTasks);

// Create a new task
router.post('/task', taskController.createTask);

// Update a task by ID
router.put('/task/:id', taskController.updateTask);

// Delete a task by ID
router.delete('/task/:id', taskController.deleteTask);

module.exports = router;
