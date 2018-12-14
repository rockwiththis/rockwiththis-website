const express = require('express');
const router = express.Router();

const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');
const s3 = require('./s3');
//const admin = require('./admin');

router.use('/songs', songs);
router.use('/subgenres', subgenres);
router.use('/curators', curators);
router.use('/s3', s3);

// router.use('/admin', admin);

module.exports = router;
