
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided');

    let tokenSplit = token.split(' ');
    if (tokenSplit.length < 2) {
        if (!token) return res.status(401).send('Invalid token provided');
    }

    const accessToken = tokenSplit[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
        req.user = decoded;        
        next();
    } catch (ex) {
        return res.status(401).send('Invalid token provided');
    }
     
}