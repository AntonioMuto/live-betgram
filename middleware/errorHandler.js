const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/errors.log');

// Crea la directory se non esiste
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const errorHandler = (err, req, res, next) => {
    // Crea una stringa per il log dell'errore
    const logEntry = `[${req.requestId}] - ${new Date().toISOString()}\nError: ${err.message}\nStack: ${err.stack}\n\n`;

    // Log to console
    // console.error(logEntry.trim());

    // Append log to file
    fs.appendFile(logFilePath, logEntry, (fileErr) => {
        if (fileErr) {
            console.error('Errore durante la registrazione dell\'errore:', fileErr);
        }
    });

    // Risposta al client
    res.status(err.status || 500).json({
        request: req.requestId,
        status: 'error',
        message: err.message,
    });
};

module.exports = errorHandler;
