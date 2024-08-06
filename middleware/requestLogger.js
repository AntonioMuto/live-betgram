const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/requests.log');

const requestLogger = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} ${req.method} ${req.url} ${req.ip}\n`;
    
    // Log to console
    // console.log(logEntry.trim());
    
    // Append log to file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Errore durante la registrazione della richiesta:', err);
        }
    });
    
    next();
};

module.exports = requestLogger;