const getDb = require('../config/database').getDb;
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const Luxon = require('luxon');
const axios = require('axios');
const API_URL = process.env.API_URL;
const INFO = process.env.INFO;

const arrayLeagues = [55, 86, 47, 53, 54, 87, 57, 61]
var totalRefresh = 0;

var liveMatches = [];
var matchesDetails = new Map();

const uploadLiveMatches = async () => {
    try {
        totalRefresh += 1;
        const formattedDate = getFormattedDate();
        const response = await axios.get(`${API_URL}matches?date=${formattedDate}&timezone=Europe%2FRome&${INFO}`);
        liveMatches = response.data.leagues;
        // liveMatches = response.data.leagues.filter(league => arrayLeagues.includes(league.id));

        // Usare Promise.all per gestire le richieste asincrone
        await Promise.all(
            liveMatches.map(async league => {
                await Promise.all(
                    league.matches.map(async match => {
                        if (totalRefresh <= 75) {
                            if (match.status && match.status.ongoing === true) {
                                try {
                                    const matchDetailsResponse = await axios.get(`${API_URL}matchDetails?matchId=${match.id}&${INFO}`);
                                    matchesDetails.set(match.id, matchDetailsResponse.data);
                                } catch (error) {
                                    console.error(`Errore nel recupero dei dettagli per match ID ${match.id}:`, error.message);
                                    // Non lanciare errori qui per non fermare l'esecuzione
                                }
                            }
                        } else {
                            try {
                                const matchDetailsResponse = await axios.get(`${API_URL}matchDetails?matchId=${match.id}&${INFO}`);
                                matchesDetails.set(match.id, matchDetailsResponse.data);
                            } catch (error) {
                                console.error(`Errore nel recupero dei dettagli per match ID ${match.id}:`, error.message);
                                // Non lanciare errori qui per non fermare l'esecuzione
                            }
                        }
                    })
                );
            })
        );
        if (totalRefresh > 75) {
            totalRefresh = 0
        }

        return liveMatches;
    } catch (error) {
        console.error('Errore nella funzione uploadLiveMatches:', error.message);
        // Non lanciare errori qui per non fermare l'esecuzione
        return [];
    }
};

const getLiveMatchesSaved = async (matchId) => {
    try {
        return liveMatches;
    } catch (error) {
        console.error('Errore nella funzione getLiveMatchesSaved:', error.message);
        return [];  // Assicurati di restituire un valore di fallback
    }
};

const getFormattedDate = () => {
    const now = Luxon.DateTime.now().setZone('Europe/Rome');
    const formattedDate = now.toFormat('yyyyMMdd');
    return formattedDate;
};

const debugMatchesDetails = () => {
    [...matchesDetails.entries()].forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
    });
};

const getLiveMatch = async (matchId) => {
    try {
        return matchesDetails.get(Number(matchId));
    } catch (error) {
        console.error('Errore nella funzione getLiveMatch:', error.message);
        return null;  // Assicurati di restituire un valore di fallback
    }
};
const clearLiveMatch = async () => {
    try {
        totalRefresh = 0;
        matchesDetails.clear();
    } catch (error) {
        console.error('Errore nella funzione getLiveMatch:', error.message);
        return null;  // Assicurati di restituire un valore di fallback
    }
};

module.exports = {
    getLiveMatchesSaved,
    uploadLiveMatches,
    getLiveMatch,
    clearLiveMatch
};
