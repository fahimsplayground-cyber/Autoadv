const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { encrypt } = require('../utils/encryption');
const axios = require('axios');

// Route: Add a new Discord token
router.post('/add', async (req, res) => {
    const { user_id, token, account_name } = req.body;

    if (!token || !user_id) return res.status(400).json({ error: 'Token and User ID required' });

    try {
        // 1. Validate the token with Discord first to see if it's real
        const validate = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: token }
        });

        const discordUsername = validate.data.username;

        // 2. Encrypt the token before saving
        const encryptedToken = encrypt(token);

        // 3. Save to Supabase
        const { data, error } = await supabase
            .from('discord_accounts')
            .insert({
                user_id,
                account_token: encryptedToken,
                account_name: account_name || discordUsername,
                status: 'live'
            });

        if (error) throw error;

        res.json({ message: 'Account added successfully', username: discordUsername });

    } catch (err) {
        console.error("Token validation failed:", err.message);
        res.status(401).json({ error: 'Invalid Discord Token' });
    }
});

// Route: Get all accounts for a specific user
router.get('/list/:user_id', async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('discord_accounts')
        .select('id, account_name, status')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;