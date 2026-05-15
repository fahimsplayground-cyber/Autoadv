const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { decrypt } = require('../utils/encryption');
const { sendMessage, deleteMessage } = require('../utils/discordHandler');

// Store active intervals in memory so we can stop them
const activeCampaigns = {};

router.post('/start', async (req, res) => {
    const { account_id, channel_id, message, interval_minutes, purge_after_minutes } = req.body;

    if (activeCampaigns[account_id]) {
        return res.status(400).json({ error: "Campaign already running for this account." });
    }

    try {
        // 1. Get the encrypted token from Supabase
        const { data: account, error } = await supabase
            .from('discord_accounts')
            .select('account_token')
            .eq('id', account_id)
            .single();

        if (error || !account) throw new Error("Account not found");

        const plainToken = decrypt(account.account_token);
        const intervalMs = interval_minutes * 60000;

        // 2. Define the execution logic
        const runCycle = async () => {
            console.log(`[Campaign] Sending message for account ${account_id}`);
            
            const result = await sendMessage(plainToken, channel_id, message);

            // Dynamic Slowmode Logic
            if (result.rateLimited) {
                console.log(`[Dynamic] Delaying next cycle by ${result.retryAfter}s`);
                stopCampaign(account_id);
                // Restart after the extra delay
                setTimeout(() => startLogic(), result.retryAfter * 1000);
                return;
            }

            // Purge Logic
            if (result.success && purge_after_minutes > 0) {
                const msgId = result.data.id;
                setTimeout(async () => {
                    await deleteMessage(plainToken, channel_id, msgId);
                    console.log(`[Purge] Deleted message ${msgId}`);
                }, purge_after_minutes * 60000);
            }
        };

        // 3. Start the loop
        const startLogic = () => {
            runCycle(); // Run immediately first
            activeCampaigns[account_id] = setInterval(runCycle, intervalMs);
        };

        startLogic();
        res.json({ message: "Campaign started successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route: Stop a campaign
router.post('/stop', (req, res) => {
    const { account_id } = req.body;
    stopCampaign(account_id);
    res.json({ message: "Campaign stopped." });
});

function stopCampaign(id) {
    if (activeCampaigns[id]) {
        clearInterval(activeCampaigns[id]);
        delete activeCampaigns[id];
    }
}

module.exports = router;