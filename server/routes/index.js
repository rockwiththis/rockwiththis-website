const express = require('express');
const router = express.Router();
const songs = require('./songs');
const subgenres = require('./subgenres');
const singleSong = require('./singleSong');

router.use('/songs', songs);
router.use('/songs/:id', singleSong);
router.use('/subgenres', subgenres);

module.exports = router;
