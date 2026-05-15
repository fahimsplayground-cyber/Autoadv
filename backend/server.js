require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send('Discord Auto-System Backend Running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const campaignRoutes = require('./routes/campaign');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/campaign', campaignRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server blasting off on port ${PORT}`);
});