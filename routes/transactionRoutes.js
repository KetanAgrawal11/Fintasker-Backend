// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const {
    addTransaction,
    importTransactions,
    getTransactions,
    deleteTransaction,
    resetTransactions,
    getBalanceHistory
} = require('../controllers/transactionController');

router.post('/import', authenticate, importTransactions);
router.post('/new', authenticate, addTransaction);
router.post('/', authenticate, getTransactions);
router.delete('/:id', authenticate, deleteTransaction);
router.delete('/reset', authenticate, resetTransactions);
router.post('/balance-history', authenticate, getBalanceHistory);

module.exports = router;
