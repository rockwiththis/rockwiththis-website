const express = require('express');
const router = express.Router();
const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');

router.use('/songs', songs);
router.use('/subgenres', subgenres);
router.use('/curators', curators);

module.exports = router;
