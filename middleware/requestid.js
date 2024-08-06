const { v4: uuidv4 } = require('uuid'); // Assicurati di installare il pacchetto uuid

const requestIdMiddleware = (req, res, next) => {
    req.requestId = uuidv4(); // Genera un ID unico
    next();
};

module.exports = requestIdMiddleware;
