const express = require('express');
const router = express.Router();

const liveController = require('../controllers/liveController');

router.get('/retrieve', liveController.liveResults);
router.get('/retrieveMatch/:id', liveController.liveMatch);

module.exports = router;
