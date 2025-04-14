require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/ping', (req, res) => {
    res.send('pong');
});

const SELF_URL = process.env.SELF_URL || `http://localhost:${port}/ping`;

setInterval(() => {
    axios.get(SELF_URL)
        .then(() => console.log("Self-ping successful"))
        .catch(err => console.error("Self-ping failed:", err.message));
}, 2 * 60 * 1000);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


