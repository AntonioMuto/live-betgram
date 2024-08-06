const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
let dbName = null;

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        dbName = client.db('betgram');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

// Esegui la connessione in modo asincrono all'avvio dell'applicazione
connectToMongoDB().catch(err => console.error('Error connecting to MongoDB:', err));

// Funzione per ottenere il database
const getDb = async () => {
    if (!dbName) {
        await connectToMongoDB();
    }
    return dbName;
};

module.exports = { getDb };
