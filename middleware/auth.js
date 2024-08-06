const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        if(token === process.env.SPECIAL_TOKEN){
            next();
        } else{
            res.status(400).json({ message: 'Invalid token.' });
        }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        // next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
