const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'inprogress', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;