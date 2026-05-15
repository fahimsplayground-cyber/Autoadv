const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../config/supabase');

// Step 1: Redirect user to Discord OAuth URL (Call this from Frontend)
router.get('/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    res.json({ url });
});

// Step 2: Callback handle (Discord sends the user back here)
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    try {
        // Exchange code for Access Token
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
        });

        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params);
        const { access_token } = tokenResponse.data;

        // Fetch User Info from Discord
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userData = userResponse.data;

        // Save or Update User in Supabase
        const { data, error } = await supabase
            .from('users')
            .upsert({ 
                id: userData.id, 
                username: userData.username, 
                avatar: userData.avatar 
            })
            .select();

        if (error) throw error;

        // Send user data back to frontend (In a real app, use JWT here)
        res.redirect(`http://localhost:3000/dashboard?user_id=${userData.id}`);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;