const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('ru');

const config = require('../config');
const models = require('../models');

// routers
router.get('/', (req, res) => res.render('about'));




module.exports = router;