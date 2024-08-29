const liveService = require('../services/liveService');


exports.liveResults = async (req, res, next) => {
    try {
        const live = await liveService.getLiveMatchesSaved();
        res.json(live);
    } catch (error) {
        next(error);
    }
};

exports.liveMatch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const live = await liveService.getLiveMatch(id);
        res.json(live);
    } catch (error) {
        next(error);
    }
};

exports.uploadLive = async (req, res, next) => {
    try {
        const live = await liveService.uploadLiveMatches();
        res.json(live);
    } catch (error) {
        next(error);
    }
};


exports.clearLiveMatch = async (req, res, next) => {
    try {
        const live = await liveService.clearLiveMatch();
        res.json(live);
    } catch (error) {
        next(error);
    }
};