// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, editProfile } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/editProfile', authenticate, editProfile);

module.exports = router;
