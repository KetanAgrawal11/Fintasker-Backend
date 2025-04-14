const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
    try {
        const { amount, description, type, date, category } = req.body;
        if (!amount || !description || !type || !date || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const transaction = new Transaction({
            user_id: req.userId,
            amount,
            description,
            type,
            date,
            category
        });
        await transaction.save();
        res.json({ message: 'Transaction added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.importTransactions = async (req, res) => {
    try {
        const { transactions } = req.body;
        const user_id = req.userId;
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ message: "No transactions to import." });
        }
        const formattedTransactions = transactions.map(txn => ({ ...txn, user_id }));
        console.log(formattedTransactions);
        await Transaction.insertMany(formattedTransactions);
        console.log("Transactions imported successfully.");
        res.status(201).json({ message: "Transactions imported successfully." });
    } catch (error) {
        console.error("InsertMany Error:", error);
        res.status(500).json({ message: "Server error during import." });
    }
};

exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ user_id: req.userId });
    res.json(transactions);
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.resetTransactions = async (req, res) => {
    try {
        await Transaction.deleteMany({ user_id: req.userId });
        res.json({ message: 'All transactions deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBalanceHistory = async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const transactions = await Transaction.find({
            user_id: req.userId,
            date: { $gte: oneMonthAgo }
        }).sort({ date: 1 });

        let balance = 0;
        const balanceHistory = transactions.map(txn => {
            balance += txn.type === 'income' ? txn.amount : -txn.amount;
            return { date: txn.date, balance };
        });

        res.json(balanceHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
