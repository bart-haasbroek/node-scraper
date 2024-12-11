const whitelist = ['/api/products', '/signup'];

const authMiddleware = (req, res, next) => {
    if (whitelist.includes(req.path)) {
        return next(); // Sla de middleware over voor openbare routes
    }

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Permission denied' });
    }

    require('dotenv').config();
    const appSecret = process.env.JWT_SECRET;

    if (token !== appSecret) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
    return next();
};

module.exports = authMiddleware;