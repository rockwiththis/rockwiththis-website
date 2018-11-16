const express = require('express');
const router = express.Router();

const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');

router.use('/api/songs', songs);
router.use('/api/subgenres', subgenres);
router.use('/api/curators', curators);

module.exports = router;
