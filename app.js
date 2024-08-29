const express = require('express');
const dotenv = require('dotenv');
const compressResponse = require('./middleware/compressResponse');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const responseLogger = require('./middleware/responseLogger'); // Importa il middleware
const auth = require('./middleware/auth');
const requestId = require('./middleware/requestid'); // Importa il middleware per generare un ID unico
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const responsesLogFilePath = path.join(__dirname, 'logs/responses.log');
const errorsLogFilePath = path.join(__dirname, 'logs/errors.log');

dotenv.config();

const app = express();
const port = process.env.PORT;

// Use built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use custom middleware
app.use(requestId);

// Use response logger middleware (deve essere subito dopo le rotte)
app.use(responseLogger);

//app.use(requestLogger); per delle request log, ma non sono utili (per ora)

//app.use(compressResponse);  // Use the custom compression middleware


// Routes
const liveRoutes = require('./routes/liveRoutes');

// Controllers
const liveController = require('./controllers/liveController');
const { default: axios } = require('axios');

// Apply authentication middleware to protected routes
app.use('/api/live', auth, liveRoutes);


// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

cron.schedule('0 2 */3 * *', () => {
    clearLogs(responsesLogFilePath);
    clearLogs(errorsLogFilePath);
}, {
    timezone: "Europe/Rome"
});

cron.schedule('*/20 * * * * *', async () => {
    await liveController.uploadLive();
}, {
    timezone: "Europe/Rome"
});

cron.schedule('0 0 4 * * *', async () => {
    await liveController.clearLiveMatch();
}, {
    timezone: "Europe/Rome"
});


const clearLogs = (filePath) => {
    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error(`Errore durante la pulizia del file di log ${filePath}:`, err);
        } else {
            console.log(`File di log ${filePath} ripulito con successo.`);
        }
    });
};