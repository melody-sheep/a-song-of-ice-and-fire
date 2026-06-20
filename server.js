const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static('public'));

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '🐺 Winter is coming to your game!',
        status: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🏰 Westeros Rising - Game Server');
    console.log('========================================');
    console.log(`📍 Open in browser: http://localhost:${PORT}`);
    console.log(`🐺 Winter is coming...`);
    console.log('========================================');
});