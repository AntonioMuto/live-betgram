const dotenv = require('dotenv');
const { Storage } = require('megajs');

dotenv.config();

const storage = new Storage({
    email: process.env.EMAIL_MEGA,
    password: process.env.PASSWORD_MEGA
});

async function connectToMega() {
    return new Promise((resolve, reject) => {
        storage.on('ready', () => {
            console.log('Logged in to MEGA');
            resolve();
        });

        storage.on('error', (err) => {
            console.error('Error connecting to MEGA:', err);
            reject(err);
        });
    });
}

connectToMega().catch(err => console.error('Error connecting to MEGA:', err));

const getMegaStorage = async () => {
    if(!storage){
        await connectToMega();
        return storage;
    }
    return storage;
};

module.exports = { getMegaStorage };
