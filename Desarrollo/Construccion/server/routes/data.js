// filepath: c:\Users\RENZO\Documents\GitHub\STGRHPBI\Desarrollo\Construccion\Server\routes\data.js
const express = require('express');
const router = express.Router();
const { getData } = require('../controllers/dataController');

router.get('/data', getData);

module.exports = router;


