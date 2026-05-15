const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
    const user_id = req.headers['x-user-id'];

    if (!user_id) {
        return res.status(401).json({ error: "Unauthorized. Please login." });
    }

    // Check if user exists in our DB
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user_id)
        .single();

    if (error || !data) {
        return res.status(401).json({ error: "User session invalid." });
    }

    req.user = data;
    next();
};

module.exports = protect;