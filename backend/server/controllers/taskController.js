const Task = require('../models/task');

const getAllTasks = async (req, res,next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err) 
 }
};

const createTask = async (req, res) => {
    const { description, status, dueDate, priority, assignedTo } = req.body;
  
    const task = new Task({
      description,
      status,
      dueDate,
      priority,
      assignedTo
    });
  
    try {
      const newTask = await task.save();
      res.status(200).json(newTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  const updateTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      // Update task properties
      task.description = req.body.description;
      task.status = req.body.status;
      task.dueDate = req.body.dueDate;
      task.priority = req.body.priority;
      task.assignedTo = req.body.assignedTo;
  
      const updatedTask = await task.save();
  
      return res.json(updatedTask);
    } catch (error) {
      console.log(error)

      return res.status(400).json({ msg: error.message });
    }
  };
  
  

const deleteTask = async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      await task.deleteOne({ _id: req.params.id });
      res.json({ message: 'Task deleted' });
    } catch (err) {
      next(err);
    }
  };
  

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};
