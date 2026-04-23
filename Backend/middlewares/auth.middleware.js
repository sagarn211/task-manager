const userModel = require('../models/user.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');

function getBearerToken(req) {
    const header = req.headers.authorization;
    if (!header) return null;
    const [scheme, value] = header.split(' ');
    if (scheme !== 'Bearer' || !value) return null;
    return value;
}

module.exports.authUser = async (req, res, next) => {
    const cookieToken = req.cookies?.token;
    const headerToken = getBearerToken(req);
    const token = cookieToken || headerToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id || decoded.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }

        req.user = user;
        req.authTokenSource = cookieToken ? 'cookie' : 'header';
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
};

module.exports.authAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
}
