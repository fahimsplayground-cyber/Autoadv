const axios = require('axios');

/**
 * Sends a message to a Discord channel
 * Handles Dynamic Slowmode via 429 Retry-After header
 */
async function sendMessage(token, channelId, content) {
    try {
        const response = await axios.post(
            `https://discord.com/api/v9/channels/${channelId}/messages`,
            { content: content },
            { headers: { Authorization: token } }
        );
        
        return { success: true, data: response.data };

    } catch (error) {
        if (error.response && error.response.status === 429) {
            // This is the Dynamic Slowmode logic
            const retryAfter = error.response.data.retry_after;
            console.log(`Rate limited! Need to wait ${retryAfter} seconds.`);
            return { success: false, retryAfter: retryAfter, rateLimited: true };
        }
        
        return { success: false, error: error.message };
    }
}

/**
 * Deletes a message by ID (Purge System)
 */
async function deleteMessage(token, channelId, messageId) {
    try {
        await axios.delete(
            `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
            { headers: { Authorization: token } }
        );
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { sendMessage, deleteMessage };