const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true }, // 'income' or 'expense'
    date: { type: Date, default: Date.now, required: true },
    category: { type: String, required: true },
}, { timestamps: true }); // Enables createdAt and updatedAt

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;