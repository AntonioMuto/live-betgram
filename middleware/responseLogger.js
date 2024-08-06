const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/responses.log');

const responseLogger = (req, res, next) => {
    // Intercetta la funzione res.send per registrare la risposta
    const originalSend = res.send.bind(res);

    res.send = (body) => {
        if (res.statusCode !== 200) {
            const logEntry = `[${req.requestId}] - ${new Date().toISOString()}\n${req.method} ${req.url} ${req.ip} - Status: ${res.statusCode} - Response: ${body}\n\n`;

            // Log to console
            // console.error(logEntry.trim());

            // Append log to file
            fs.appendFile(logFilePath, logEntry, (err) => {
                if (err) {
                    console.error('Errore durante la registrazione della risposta:', err);
                }
            });
        }

        // Richiama la funzione send originale
        return originalSend(body);
    };

    next();
};

module.exports = responseLogger;
