const express = require('express');
const router = express.Router();

const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');
const admin = require('./admin');

router.use('/songs', songs);
router.use('/subgenres', subgenres);
router.use('/curators', curators);

// router.use('/admin', admin);

module.exports = router;
