const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.Authtoken;
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usertype = decoded.usertype; 
        req.userEmail = decoded.email; 
        // req.userId = decoded.userId; // If needed
        next();
    } catch (error) {
        console.log('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyToken;
