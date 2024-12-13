const { env } = require('../constant/environment');

exports.verifyApiKey = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== env.API_KEY) {
            return res.status(401).json({ message: 'API not accessible without api key!' })
        }
        return next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};