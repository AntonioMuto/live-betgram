const getDb = require('../config/database').getDb;
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const Luxon = require('luxon');
const axios = require('axios');
const API_URL = process.env.API_URL;
const INFO = process.env.INFO;

const arrayLeagues = [55,86,47,53,54,87,57,61]

var liveMatches = [];

var matchesDetails = new Map();

const uploadLiveMatches = async () => {
    try {
        const formattedDate = getFormattedDate();
        const response = await axios.get(`${API_URL}matches?date=${formattedDate}&timezone=Europe%2FRome&${INFO}`);
        console.log(`${API_URL}matches?date=${formattedDate}&timezone=Europe%2FRome&${INFO}`)
        liveMatches = response.data.leagues;
        liveMatches.forEach(league => {
            league.matches.forEach(async match => {
                const response = await axios.get(`${API_URL}matchDetails?matchId=${match.id}&${INFO}`);
                matchesDetails.set(match.id, response.data);
            })
        })
        return liveMatches
    } catch (error) {
        throw new Error(error);
    }
};

const getLiveMatchesSaved = async (matchId) => {
    try {
        return liveMatches
    } catch (error) {
        throw new Error(error);
    }
};

const getFormattedDate = () => {
    const now = Luxon.DateTime.now().setZone('Europe/Rome');
    const formattedDate = now.toFormat('yyyyMMdd');
    console.log(formattedDate);
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
        console.error('Error:', error);
        throw new Error(error);
    }
};

module.exports = {
    getLiveMatchesSaved,
    uploadLiveMatches,
    getLiveMatch
};