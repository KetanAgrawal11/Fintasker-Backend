
// controllers/taskController.js
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const task = new Task({ userId: req.userId, title, description, dueDate, status });
        await task.save();
        res.json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, dueDate, status } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, description, dueDate, status },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
